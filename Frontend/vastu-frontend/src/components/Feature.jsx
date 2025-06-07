import React from "react";
import { Camera, Book, Sparkles } from "lucide-react"; // Adjust import as needed

const Feature = () => (
  <div>
    {/* Feature highlights */}
    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
        <div className="w-12 h-12 bg-orange-200 bg-opacity-40 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <Camera className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Smart Color Detection</h3>
        <p className="text-gray-600">AI-powered camera identifies colors and their Vastu significance instantly</p>
      </div>
      
      <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
        <div className="w-12 h-12 bg-yellow-200 bg-opacity-40 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <Book className="w-6 h-6 text-amber-700" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Ancient Wisdom</h3>
        <p className="text-gray-600">Comprehensive library of traditional Vastu principles and guidelines</p>
      </div>
      
      <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
        <div className="w-12 h-12 bg-emerald-200 bg-opacity-40 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Personalized Guidance</h3>
        <p className="text-gray-600">Tailored recommendations for creating harmony in your space</p>
      </div>
    </div>
  </div>
);

export default Feature;