import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AIColorDetection from "./components/AIColorDetection";
import './App.css';
import VastuGuidelines from "./components/VastuGuideLines";
import ColorGuideVastu from "./components/ColorGuideVastu";
import FoodWrapperAnalyzer from "./components/FoodWrapperAnalyzer";

function App() {
  return (
    <>
      <Header />
      
      <div id="home">
        <Hero />
      </div>
      <div id="AIColorDetection">
        <AIColorDetection/>
      </div>
      <div id="VastuGuideLines">
        <VastuGuidelines />
      </div>
      <div id="FoodWrapperAnalyzer">
        <FoodWrapperAnalyzer />
      </div>
      <div id="ColorGuideVastu">
        <ColorGuideVastu/>
      </div>
      
    </>
  );
}

export default App;