import React, { useState } from 'react';


const colorGuideData = {
  red: {
    name: 'Red',
    hex: '#ef4444',
    vastu: {
      element: 'Fire',
      directions: ['South', 'Southeast'],
      rooms: ['Kitchen', 'Dining Room', 'Living Room'],
      benefits: ['Enhances energy and passion', 'Stimulates appetite', 'Promotes courage and strength'],
      cautions: ['Avoid in bedrooms - can cause restlessness', 'Too much red can increase aggression', 'Not suitable for study rooms'],
      tips: ['Use as accent color rather than dominant', 'Pair with neutral colors for balance', 'Great for kitchen backsplash or dining area']
    },
    soulTraits: {
      positiveSoul: ['Passion', 'Strength (when balanced)'],
      positiveMaterial: ['Energy', 'Motivation'],
      negativeSoul: ['Lust', 'Anger', 'Domination'],
      negativeMaterial: ['Possessiveness', 'Decay (if too intense)']
    }
  },
  orange: {
    name: 'Orange',
    hex: '#f97316',
    vastu: {
      element: 'Fire',
      directions: ['South', 'Southeast', 'Southwest'],
      rooms: ['Living Room', 'Dining Room', 'Kitchen'],
      benefits: ['Promotes enthusiasm and creativity', 'Enhances social interaction', 'Brings warmth and joy'],
      cautions: ['Can be overwhelming in large doses', 'May cause restlessness if overused'],
      tips: ['Perfect for accent walls', 'Use in social spaces', 'Combine with earth tones for grounding']
    },
    soulTraits: {
      positiveSoul: ['Enthusiasm', 'Sacrifice', 'Love'],
      positiveMaterial: ['Warmth', 'Positive Drive'],
      negativeSoul: ['Sensual Temptation', 'Aggression'],
      negativeMaterial: ['Overstimulation', 'Instability']
    }
  },
  yellow: {
    name: 'Yellow',
    hex: '#eab308',
    vastu: {
      element: 'Earth',
      directions: ['Northeast', 'North', 'East'],
      rooms: ['Study Room', 'Kitchen', 'Living Room', "Children's Room"],
      benefits: ['Enhances mental clarity and concentration', 'Brings positivity and happiness', 'Stimulates intellect'],
      cautions: ['Bright yellow can cause eye strain', 'May increase anxiety if too intense'],
      tips: ['Ideal for study areas and workspaces', 'Use soft yellow for bedrooms', 'Great for kitchen cabinets']
    },
    soulTraits: {
      positiveSoul: ['Joy', 'Wisdom', 'Openness'],
      positiveMaterial: ['Tangibility', 'Positive Attraction', 'Brightness'],
      negativeSoul: ['Ego inflation', 'Overconfidence'],
      negativeMaterial: ['Degradation by overuse (burnout)']
    }
  },
  green: {
    name: 'Green',
    hex: '#22c55e',
    vastu: {
      element: 'Wood/Nature',
      directions: ['East', 'Southeast', 'North'],
      rooms: ['Bedroom', 'Living Room', 'Study Room', 'Balcony'],
      benefits: ['Promotes healing and growth', 'Brings peace and harmony', 'Enhances prosperity'],
      cautions: ['Dark green can make spaces feel heavy', 'Avoid in bathrooms according to traditional Vastu'],
      tips: ['Perfect for bedrooms and relaxation areas', 'Use plants to bring natural green', 'Light green is universally harmonious']
    },
    soulTraits: {
      positiveSoul: ['Growth', 'Compassion', 'Healing'],
      positiveMaterial: ['Regeneration', 'Recycling', 'Fertility'],
      negativeSoul: ['Envy', 'Greed'],
      negativeMaterial: ['Overgrowth', 'Hoarding']
    }
  },
  blue: {
    name: 'Blue',
    hex: '#3b82f6',
    vastu: {
      element: 'Water',
      directions: ['North', 'Northeast'],
      rooms: ['Bedroom', 'Study Room', 'Bathroom', 'Office'],
      benefits: ['Promotes calmness and peace', 'Enhances focus and concentration', 'Brings cooling energy'],
      cautions: ['Too much blue can cause depression', 'Cold blues may reduce warmth in relationships'],
      tips: ['Excellent for bedrooms and study areas', 'Use lighter shades for better energy flow', 'Combine with warm accents']
    },
    soulTraits: {
      positiveSoul: ['Calmness', 'Trust', 'Depth', 'Devotion'],
      positiveMaterial: ['Protection', 'Cooling', 'Stability'],
      negativeSoul: ['Detachment (can lead to aloofness)'],
      negativeMaterial: ['Coldness', 'Isolation']
    }
  },
  white: {
    name: 'White',
    hex: '#ffffff',
    vastu: {
      element: 'Space',
      directions: ['North', 'Northeast', 'West'],
      rooms: ['Living Room', 'Bathroom', 'Pooja Room', 'Bedroom'],
      benefits: ['Symbolizes purity and peace', 'Enhances clarity and calmness', 'Reflects light and makes spaces look bigger'],
      cautions: ['Too much white can feel cold or sterile', 'May show dirt easily'],
      tips: ['Great for ceilings and trims', 'Pair with warm accents for balance', 'Ideal for meditation spaces']
    },
    soulTraits: {
      positiveSoul: ['Peace', 'Purity', 'Unity', 'Truth'],
      positiveMaterial: ['Longevity', 'Clean Utility'],
      negativeSoul: ['Spiritual Pride (if excessive)'],
      negativeMaterial: ['Emptiness', 'Sterility (lack of creation)']
    }
  },
  pink: {
    name: 'Pink',
    hex: '#f472b6',
    vastu: {
      element: 'Fire',
      directions: ['South', 'Southwest'],
      rooms: ['Bedroom', 'Living Room', 'Children’s Room'],
      benefits: ['Promotes love and harmony', 'Brings warmth and comfort', 'Soothes emotions'],
      cautions: ['Too much pink can feel overly sweet', 'Not ideal for workspaces'],
      tips: ['Best for bedrooms and children’s rooms', 'Pair with white or grey for elegance', 'Use as an accent for a soft touch']
    },
    soulTraits: {
      positiveSoul: ['Affection', 'Empathy', 'Harmony'],
      positiveMaterial: ['Soft utility', 'Beauty', 'Care'],
      negativeSoul: ['Over-sentimentality'],
      negativeMaterial: ['Fragility', 'Superficiality']
    }
  },
  brown: {
    name: 'Brown',
    hex: '#a52a2a',
    vastu: {
      element: 'Earth',
      directions: ['Southwest', 'West'],
      rooms: ['Living Room', 'Bedroom', 'Study Room'],
      benefits: ['Brings stability and grounding', 'Adds warmth and comfort', 'Connects to nature'],
      cautions: ['Too much brown can feel heavy', 'Avoid in small, dark rooms'],
      tips: ['Use for furniture and flooring', 'Pair with lighter colors for balance', 'Great for accent walls']
    },
    soulTraits: {
      positiveSoul: ['Responsibility', 'Grounding'],
      positiveMaterial: ['Stability', 'Utility', 'Longevity'],
      negativeSoul: ['Rigidity', 'Conservatism'],
      negativeMaterial: ['Dullness', 'Resistance to change']
    }
  },
  grey: {
    name: 'Grey',
    hex: '#808080',
    vastu: {
      element: 'Metal',
      directions: ['West', 'Northwest'],
      rooms: ['Living Room', 'Office', 'Bedroom'],
      benefits: ['Symbolizes balance and neutrality', 'Modern and sophisticated look', 'Pairs well with many colors'],
      cautions: ['Too much grey can feel dull or uninspiring', 'May reduce warmth in a space'],
      tips: ['Use as a base with colorful accents', 'Ideal for offices and modern spaces', 'Combine with wood for warmth']
    },
    soulTraits: {
      positiveSoul: ['Maturity', 'Balance (neutrality)'],
      positiveMaterial: ['Shielding', 'Practicality'],
      negativeSoul: ['Confusion', 'Lack of clarity'],
      negativeMaterial: ['Indecisiveness', 'Decay (if dominant)']
    }
  },
  black: {
    name: 'Black',
    hex: '#000000',
    vastu: {
      element: 'Water',
      directions: ['North', 'West'],
      rooms: ['Living Room', 'Office'],
      benefits: ['Adds depth and elegance', 'Can be grounding and protective'],
      cautions: ['Too much black can feel oppressive', 'Absorbs light and can make spaces look smaller', 'Avoid in pooja room and children’s room'],
      tips: ['Use as an accent color', 'Pair with white or metallics for contrast', 'Ideal for modern decor']
    },
    soulTraits: {
      positiveSoul: ['Depth', 'Introspection (if used wisely)'],
      positiveMaterial: ['Power of absorption', 'Recycling'],
      negativeSoul: ['Pride', 'Control', 'Secretiveness'],
      negativeMaterial: ['Absorption of negativity', 'Isolation']
    }
  }
};

const ColorGuideVastu = () => {
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <div className="min-h-screen w-full px-0 py-0 bg-gradient-to-br from-orange-100 via-white to-yellow-100">
      <div className="max-w-4xl mx-auto py-8 px-2">
        <h2 className="text-3xl font-bold text-Black-600 mb-4 text-center tracking-tight drop-shadow">Color Guide</h2>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {Object.entries(colorGuideData).map(([key, color]) => (
            <button
              key={key}
              className={`w-10 h-10 rounded-full border-2 ${selectedColor && selectedColor.name === color.name ? 'border-orange-200' : 'border-white'} shadow cursor-pointer hover:scale-110 transition-transform`}
              style={{ background: color.hex }}
              title={color.name}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        {selectedColor && (
          <div className="flex flex-col md:flex-row gap-8 mt-4">
            {/* Vastu Color Info Left */}
            <div className="flex-1 min-w-0 bg-white/80 border border-orange-100 rounded-2xl shadow p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full border-2 border-gray-200" style={{ background: selectedColor.hex }} />
                <h3 className="text-xl font-bold text-black-600">{selectedColor.name}</h3>
              </div>
              <div className="mb-1"><span className="font-semibold text-gray-700">Element:</span> {selectedColor.vastu.element}</div>
              <div className="mb-1"><span className="font-semibold text-gray-700">Best Directions:</span> {selectedColor.vastu.directions.join(', ')}</div>
              <div className="mb-1"><span className="font-semibold text-gray-700">Best Rooms:</span> {selectedColor.vastu.rooms.join(', ')}</div>
              <div className="mb-1"><span className="font-semibold text-gray-700">Benefits:</span>
                <ul className="list-disc ml-6 text-green-700">
                  {selectedColor.vastu.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
              <div className="mb-1"><span className="font-semibold text-gray-700">Cautions:</span>
                <ul className="list-disc ml-6 text-yellow-700">
                  {selectedColor.vastu.cautions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="mb-4"><span className="font-semibold text-gray-700">Tips:</span>
                <ul className="list-disc ml-6 text-blue-700">
                  {selectedColor.vastu.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
            {/* Soul & Material Traits Right */}
            {selectedColor.soulTraits && (
              <div className="flex-1 min-w-0 mt-0 p-4 rounded-2xl bg-white/80 border border-orange-100 shadow h-fit">
                <h4 className="text-xl font-bold text-black-600 mb-2 text-center">Soul & Material Traits</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="font-semibold text-green-700 mb-1">Positive Soul Traits</div>
                    <ul className="list-disc ml-6 text-green-800">
                      {selectedColor.soulTraits.positiveSoul.map((trait, i) => <li key={i}>{trait}</li>)}
                    </ul>
                    <div className="font-semibold text-green-700 mt-3 mb-1">Positive Materialism Traits</div>
                    <ul className="list-disc ml-6 text-green-800">
                      {selectedColor.soulTraits.positiveMaterial.map((trait, i) => <li key={i}>{trait}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-red-700 mb-1">Negative Soul Traits</div>
                    <ul className="list-disc ml-6 text-red-800">
                      {selectedColor.soulTraits.negativeSoul.map((trait, i) => <li key={i}>{trait}</li>)}
                    </ul>
                    <div className="font-semibold text-red-700 mt-3 mb-1">Negative Materialism Traits</div>
                    <ul className="list-disc ml-6 text-red-800">
                      {selectedColor.soulTraits.negativeMaterial.map((trait, i) => <li key={i}>{trait}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorGuideVastu;
