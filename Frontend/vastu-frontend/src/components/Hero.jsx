import { Camera, Sparkles, Home, Book } from 'lucide-react';

const Hero = () => {
  const handleColorScan = () => {
    const element = document.getElementById('AIColorDetection');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleVastuRules = () => {
    const element = document.getElementById('VastuGuideLines');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 opacity-30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-emerald-200 opacity-30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-yellow-200 opacity-30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-80 rounded-full border border-orange-200 mb-6">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm md:text-lg font-medium text-gray-700">AI-Powered Vastu Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-6">
              Harmonious Living with{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Vastu
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Discover the ancient wisdom of Vastu Shastra enhanced by modern AI.
              Scan colors, learn sacred principles, and create harmony in your living spaces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={handleColorScan}
              className="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto text-base sm:text-lg md:text-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 focus:ring-blue-500"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Color Scan
            </button>
            <button 
              onClick={handleVastuRules}
              className="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto text-base sm:text-lg md:text-xl border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl transition-all duration-200 bg-transparent focus:ring-blue-500"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Vastu Rules
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-orange-200 bg-opacity-40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Camera className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">Smart Color Detection</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                AI-powered camera identifies colors and their Vastu significance instantly
              </p>
            </div>

            <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-200 bg-opacity-40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Book className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">Ancient Wisdom</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Comprehensive library of traditional Vastu principles and guidelines
              </p>
            </div>

            <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-200 bg-opacity-40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">Personalized Guidance</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Tailored recommendations for creating harmony in your space
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;