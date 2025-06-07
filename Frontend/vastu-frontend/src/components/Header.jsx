import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPalette,
  faBalanceScale,
  faBookOpen,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="p-4 shadow-md text-2xl">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">Harmonious Living</div>
        <button
          className="lg:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
        <nav className="hidden lg:flex gap-8">
          <a href="#home"><FontAwesomeIcon icon={faHome} className="px-2" />Home</a>
          <a href="#color-scan"><FontAwesomeIcon icon={faPalette} className="px-2" />Color Scan</a>
          <a href="#vastu-rules"><FontAwesomeIcon icon={faBalanceScale} className="px-2" />Vastu Rules</a>
          <a href="#color-guide"><FontAwesomeIcon icon={faBookOpen} className="px-2" />Color Guide</a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="flex flex-col items-start gap-4 mt-4 lg:hidden text-xl">
          <a href="#home" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faHome} className="px-2" />Home
          </a>
          <a href="#color-scan" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faPalette} className="px-2" />Color Scan
          </a>
          <a href="#vastu-rules" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faBalanceScale} className="px-2" />Vastu Rules
          </a>
          <a href="#color-guide" onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faBookOpen} className="px-2" />Color Guide
          
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
