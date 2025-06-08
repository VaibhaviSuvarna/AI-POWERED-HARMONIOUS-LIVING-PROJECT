import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AIColorDetection from "./components/AIColorDetection";
import './App.css';
import VastuGuidelines from "./components/VastuGuideLines";

function App() {
  return (
    <>
      <Header />
      
     
      <div id="home">
        <Hero />
      </div>
      
      
      <div id="AIColorDetection">
        <AIColorDetection />
      </div>
      
      
      <div id="VastuGuideLines">
        <VastuGuidelines />
      </div>
    </>
  );
}

export default App;