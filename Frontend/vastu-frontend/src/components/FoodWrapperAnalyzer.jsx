import React, { useState } from "react";
import Tesseract from "tesseract.js";

// Constants
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/food/ingredients';
const API_RATE_LIMIT_MS = 1100;

// Nutrition thresholds for scoring
const NUTRITION_THRESHOLDS = {
  HEALTHY: { fiber: 3, protein: 10, vitaminC: 10, calcium: 100 },
  UNHEALTHY: { sodium: 400, sugar: 10, saturatedFat: 5 }
};

// Ingredient keywords for fallback
const INGREDIENT_KEYWORDS = {
  healthy: [
    "organic", "fresh", "ghee", "fruits", "vegetable", "whole grain", "honey",
    "jaggery", "turmeric", "cumin", "coriander", "rock salt", "sesame", "almond",
    "coconut", "olive oil", "cold pressed", "herbs", "spices", "lentil", "dal",
    "vanilla", "cocoa", "cocoa liquor", "cocoa butter", "milk", "yogurt", "cheese",
    "quinoa", "oats", "brown rice", "flax seed", "chia seed", "avocado"
  ],
  unhealthy: [
    "artificial flavor", "hydrogenated", "msg", "monosodium glutamate", "preservative",
    "color", "emulsifier", "refined", "corn syrup", "high fructose", "margarine",
    "stabilizer", "thickener", "synthetic", "soy lecithin", "lecithin", "palm oil",
    "sodium benzoate", "potassium sorbate", "bht", "bha", "tbhq", "carrageenan",
    "xanthan gum", "modified starch", "maltodextrin", "dextrose", "fructose"
  ]
};

// E-number database
const E_NUMBERS = {
  "e100": { name: "Curcumin", healthScore: 1, description: "Natural yellow colorant from turmeric" },
  "e101": { name: "Riboflavin", healthScore: 1, description: "Vitamin B2, essential nutrient" },
  "e102": { name: "Tartrazine", healthScore: -1, description: "May cause hyperactivity in children" },
  "e110": { name: "Sunset Yellow", healthScore: -1, description: "May cause allergic reactions" },
  "e211": { name: "Sodium Benzoate", healthScore: -1, description: "May form benzene when combined with vitamin C" },
  "e621": { name: "MSG", healthScore: -1, description: "May cause headaches in sensitive individuals" },
  "e322": { name: "Lecithin", healthScore: 0, description: "Generally safe emulsifier" },
  "e440": { name: "Pectin", healthScore: 1, description: "Natural fiber from fruits" }
};

// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeIngredient = (ingredient) => 
  ingredient.toLowerCase().replace(/[^a-z0-9\s]/g, "");

const getHealthScore = (ingredient) => {
  const normalized = normalizeIngredient(ingredient);
  
  // Check E-numbers first
  const eNumber = normalized.match(/e\d{3,4}/)?.[0];
  if (eNumber && E_NUMBERS[eNumber]) {
    const data = E_NUMBERS[eNumber];
    return {
      score: data.healthScore,
      category: "Food Additive",
      description: `${data.name} - ${data.description}`
    };
  }
  
  // Check keyword lists
  if (INGREDIENT_KEYWORDS.healthy.some(kw => normalized.includes(kw))) {
    return {
      score: 1,
      category: "Natural Ingredient",
      description: "Contains beneficial ingredients"
    };
  }
  
  if (INGREDIENT_KEYWORDS.unhealthy.some(kw => normalized.includes(kw))) {
    return {
      score: -1,
      category: "Processed Ingredient",
      description: "Contains processed or artificial ingredients"
    };
  }
  
  return {
    score: 0,
    category: "Common Ingredient",
    description: "Common ingredient, moderate consumption advised"
  };
};

const getScoreLabel = (score) => {
  if (score > 0) return "✅ Healthy";
  if (score < 0) return "⚠ Unhealthy";
  return "➖ Neutral";
};

const calculateNutritionScore = (nutrients) => {
  const { HEALTHY, UNHEALTHY } = NUTRITION_THRESHOLDS;
  const get = (name) => nutrients.find(n => n.name === name)?.amount || 0;
  
  const fiber = get('Fiber');
  const protein = get('Protein');
  const vitaminC = get('Vitamin C');
  const calcium = get('Calcium');
  const sodium = get('Sodium');
  const sugar = get('Sugar');
  const saturatedFat = get('Saturated Fat');
  
  if (fiber > HEALTHY.fiber || protein > HEALTHY.protein || 
      vitaminC > HEALTHY.vitaminC || calcium > HEALTHY.calcium) {
    return { score: 1, category: "Nutritious" };
  }
  
  if (sodium > UNHEALTHY.sodium || sugar > UNHEALTHY.sugar || 
      saturatedFat > UNHEALTHY.saturatedFat) {
    return { score: -1, category: "High in Sodium/Sugar/Sat Fat" };
  }
  
  return { score: 0, category: "Moderate" };
};

const extractIngredients = (text) => {
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const ingLine = lines.find(l => l.toLowerCase().includes("ingredient"));
  const ingText = ingLine || text;
  
  const ingredients = ingText
    .replace(/ingredients?:/i, "")
    .toLowerCase()
    .split(/[,;|\n]/)
    .map(i => i.replace(/[^a-z0-9\s]/g, "").trim())
    .filter(i => i.length > 1 && isNaN(i));
  
  return [...new Set(ingredients)];
};

const analyzeWithAPI = async (ingredients) => {
  const results = [];
  
  for (const ingredient of ingredients) {
    try {
      const searchResponse = await fetch(
        `${SPOONACULAR_BASE_URL}/search?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(ingredient)}&number=1`
      );
      
      if (!searchResponse.ok) throw new Error(`HTTP error! status: ${searchResponse.status}`);
      
      const searchData = await searchResponse.json();
      
      if (searchData.results?.[0]) {
        const ingredientId = searchData.results[0].id;
        const detailResponse = await fetch(
          `${SPOONACULAR_BASE_URL}/${ingredientId}/information?apiKey=${SPOONACULAR_API_KEY}&amount=100&unit=grams`
        );
        
        if (!detailResponse.ok) throw new Error(`HTTP error! status: ${detailResponse.status}`);
        
        const detailData = await detailResponse.json();
        const nutrients = detailData.nutrition?.nutrients || [];
        const nutritionScore = calculateNutritionScore(nutrients);
        
        results.push({
          name: ingredient,
          label: getScoreLabel(nutritionScore.score),
          score: nutritionScore.score,
          category: nutritionScore.category,
          description: `${detailData.name || ingredient} - ${detailData.nutrition?.calories || 0} cal/100g`,
          spoonacularData: {
            calories: detailData.nutrition?.calories || 0,
            fiber: nutrients.find(n => n.name === 'Fiber')?.amount || 0,
            protein: nutrients.find(n => n.name === 'Protein')?.amount || 0,
            sodium: nutrients.find(n => n.name === 'Sodium')?.amount || 0,
            sugar: nutrients.find(n => n.name === 'Sugar')?.amount || 0,
            saturatedFat: nutrients.find(n => n.name === 'Saturated Fat')?.amount || 0
          }
        });
      } else {
        // Fallback to keyword matching
        const keywordResult = getHealthScore(ingredient);
        results.push({
          name: ingredient,
          label: getScoreLabel(keywordResult.score),
          ...keywordResult,
          spoonacularData: null
        });
      }
      
      await sleep(API_RATE_LIMIT_MS);
    } catch (error) {
      console.error(`Error analyzing ingredient ${ingredient}:`, error);
      const keywordResult = getHealthScore(ingredient);
      results.push({
        name: ingredient,
        label: getScoreLabel(keywordResult.score),
        ...keywordResult,
        spoonacularData: null
      });
    }
  }
  
  return results;
};

const calculateOverallScore = (analyzedIngredients) => {
  const counts = { healthy: 0, unhealthy: 0, neutral: 0 };
  const categoryBreakdown = {};
  
  analyzedIngredients.forEach(ing => {
    if (ing.score === 1) counts.healthy++;
    else if (ing.score === -1) counts.unhealthy++;
    else counts.neutral++;
    
    const category = ing.category || "Unknown";
    categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
  });
  
  const total = counts.healthy + counts.unhealthy + counts.neutral;
  const healthyPercent = total > 0 ? Math.round((counts.healthy / total) * 100) : 0;
  
  let rating, recommendation;
  if (healthyPercent >= 70) {
    rating = "Excellent";
    recommendation = "Great choice! This product contains mostly natural and beneficial ingredients.";
  } else if (healthyPercent >= 50) {
    rating = "Good";
    recommendation = "Good option with a healthy balance of ingredients.";
  } else if (healthyPercent >= 30) {
    rating = "Average";
    recommendation = "Moderate consumption recommended. Contains some processed ingredients.";
  } else {
    rating = "Poor";
    recommendation = "Consider alternatives. High in processed and artificial ingredients.";
  }
  
  return {
    ...counts,
    healthyPercent,
    unhealthyPercent: Math.round((counts.unhealthy / total) * 100),
    rating,
    recommendation,
    categoryBreakdown
  };
};

// Components
const SummaryCard = ({ title, value, subtitle, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-lg shadow-md`}>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm font-medium">{title}</div>
    <div className="text-xs opacity-75">{subtitle}</div>
  </div>
);

const IngredientRow = ({ ingredient }) => (
  <tr className="border-b hover:bg-orange-50 transition-colors">
    <td className="py-3 px-4 font-medium">{ingredient.name}</td>
    <td className="py-3 px-4">{ingredient.label}</td>
    <td className="py-3 px-4 text-sm text-gray-600">{ingredient.category}</td>
    <td className="py-3 px-4 text-sm text-gray-600">
      {ingredient.spoonacularData ? (
        <div className="space-y-1">
          <div>Cal: {ingredient.spoonacularData.calories}/100g</div>
          <div>Fiber: {ingredient.spoonacularData.fiber}g</div>
          <div>Protein: {ingredient.spoonacularData.protein}g</div>
          {ingredient.spoonacularData.sodium > 0 && (
            <div className="text-orange-600">Sodium: {ingredient.spoonacularData.sodium}mg</div>
          )}
          {ingredient.spoonacularData.sugar > 0 && (
            <div className="text-red-600">Sugar: {ingredient.spoonacularData.sugar}g</div>
          )}
        </div>
      ) : (
        <span className="text-gray-400">No API data</span>
      )}
    </td>
    <td className="py-3 px-4 text-sm text-gray-600">{ingredient.description}</td>
  </tr>
);

const FoodWrapperAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setIngredients([]);
    setScore(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    setIngredients([]);
    setScore(null);

    try {
      const { data: { text } } = await Tesseract.recognize(image, "eng");
      const extractedIngredients = extractIngredients(text);
      
      if (extractedIngredients.length === 0) {
        throw new Error("No ingredients found in the image. Please try a clearer image.");
      }
      
      const analyzedIngredients = await analyzeWithAPI(extractedIngredients);
      const overallScore = calculateOverallScore(analyzedIngredients);
      
      setIngredients(analyzedIngredients);
      setScore(overallScore);
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error.message || "Failed to analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-2xl mt-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-orange-600 bg-white rounded-xl py-4 shadow-lg">
        🥗 Smart Food Wrapper Analyzer
      </h2>
      
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1 text-lg p-2 border-2 border-orange-200 rounded-lg"
          />
          
          <button
            onClick={handleAnalyze}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            disabled={!image || loading}
          >
            {loading ? "🔍 Analyzing..." : " Analyze Ingredients"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {image && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-700 ">Uploaded Image</h3>
          <img
            src={URL.createObjectURL(image)}
            alt="Food package"
            className="max-h-80 mx-auto rounded-lg shadow-lg border-2 border-orange-100"
          />
        </div>
      )}

      {score && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-gray-700">📊 Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              title="Healthy Ingredients"
              value={score.healthy}
              subtitle={`${score.healthyPercent}%`}
              bgColor="bg-gradient-to-r from-green-100 to-green-200 text-green-700"
            />
            <SummaryCard
              title="Unhealthy Ingredients"
              value={score.unhealthy}
              subtitle={`${score.unhealthyPercent}%`}
              bgColor="bg-gradient-to-r from-red-100 to-red-200 text-red-700"
            />
            <SummaryCard
              title="Neutral Ingredients"
              value={score.neutral}
              subtitle="Common ingredients"
              bgColor="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xl font-bold">Overall Rating:</span>
              <span className={`text-2xl font-bold ${
                score.rating === "Excellent" ? "text-green-700" :
                score.rating === "Good" ? "text-green-500" :
                score.rating === "Average" ? "text-yellow-600" : "text-red-600"
              }`}>
                {score.rating}
              </span>
            </div>
            <p className="text-gray-700 italic">{score.recommendation}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-orange-100 to-red-100">
                  <th className="py-3 px-4 text-left font-semibold">Ingredient</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">Category</th>
                  <th className="py-3 px-4 text-left font-semibold">Nutrition Data</th>
                  <th className="py-3 px-4 text-left font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing, idx) => (
                  <IngredientRow key={idx} ingredient={ing} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📈 Category Breakdown:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(score.categoryBreakdown).map(([category, count]) => (
                <span key={category} className="bg-white px-3 py-1 rounded-full text-sm border">
                  {category}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodWrapperAnalyzer;