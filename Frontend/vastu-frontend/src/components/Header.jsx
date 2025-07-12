import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPalette,
  faBalanceScale,
  faBookOpen,
  faBars,
  faTimes,
  faUtensils
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);


  const handleNavigation = (targetId) => {
    if (targetId === 'home') {
     
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
     
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    // Close mobile menu after navigation
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
       
        <div className="text-2xl font-bold text-black-400">
          AI-Powered Harmonious Living
        </div>

     
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => handleNavigation('AIColorDetection')}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faPalette} />
            <span>Color Scan</span>
          </button>
          
          <button
            onClick={() => handleNavigation('VastuGuideLines')}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faBalanceScale} />
            <span>Vastu Rules</span>
          </button>
          
          <button
            onClick={() => handleNavigation('ColorGuideVastu')}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faBookOpen} />
            <span>Color Guide</span>
          </button>

          <button
            onClick={() => handleNavigation('FoodWrapperAnalyzer')}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faUtensils} />
            <span>Food Wrapper</span>
          </button>
        </nav>

        {/* Mobile Menu Toggle Section*/}
        <button
          className="md:hidden text-gray-700 hover:text-orange-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

    
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => handleNavigation('AIColorDetection')}
              className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
            >
              <FontAwesomeIcon icon={faPalette} />
              <span>Color Scan</span>
            </button>
            
            <button
              onClick={() => handleNavigation('VastuGuideLines')}
              className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
            >
              <FontAwesomeIcon icon={faBalanceScale} />
              <span>Vastu Rules</span>
            </button>
            
            <button
              onClick={() => handleNavigation('ColorGuideVastu')}
              className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
            >
              <FontAwesomeIcon icon={faBookOpen} />
              <span>Color Guide</span>
            </button>

            <button
              onClick={() => handleNavigation('FoodWrapperAnalyzer')}
              className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 py-2"
            >
              <FontAwesomeIcon icon={faUtensils} />
              <span>Food Wrapper Analyzer</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;