import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Info, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const AIColorDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');
  const [colorAnalysis, setColorAnalysis] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000';

  const handleImageUpload = async (file) => {
    if (!file) return;

    console.log('Starting upload for file:', file.name);
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/upload`);
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        setSelectedImage(result.filename);
        setImageData(result.image_data);
        setColorAnalysis(null);
        setShowAnalysis(false);
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        alert(`Upload failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Upload failed: ${error.message}. Make sure the backend is running on ${API_BASE_URL}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageClick = async (event) => {
    if (!selectedImage || !selectedRoom || !selectedDirection) {
      alert('Please select both room type and direction before clicking on the image.');
      return;
    }

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculateing  actual image coordinates for pixel capture to detect color
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;
    const actualX = Math.round(x * scaleX);
    const actualY = Math.round(y * scaleY);

    setClickPosition({ x: actualX, y: actualY, displayX: x, displayY: y });
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/detect_color`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedImage,
          x: actualX,
          y: actualY,
          direction: selectedDirection,
          room_type: selectedRoom,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setColorAnalysis(result);
        setShowAnalysis(true);
      } else {
        const error = await response.json();
        alert(`Analysis failed: ${error.error}`);
      }
    } catch (error) {
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setImageData(null);
    setColorAnalysis(null);
    setClickPosition(null);
    setShowAnalysis(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRecommendationIcon = (text) => {
    if (text.includes('✅') || text.includes('🌟')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (text.includes('⚠️') || text.includes('🔄')) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  
  const handleObjectDetection = async () => {
    if (!selectedImage || !selectedRoom || !selectedDirection) {
      alert('Please select both room type and direction before running object detection.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze_image_with_objects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedImage,
          direction: selectedDirection,
          room_type: selectedRoom,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setColorAnalysis(result); 
        setShowAnalysis(true);
      } else {
        const error = await response.json();
        alert(`Object detection failed: ${error.error}`);
      }
    } catch (error) {
      alert(`Object detection failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            AI Color Detection
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
            Use our advanced AI to detect colors in your space and discover their Vastu significance
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Camera Section */}
          <div className="order-2 lg:order-1">
            {/* Image Display Area */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-4 text-center mb-6 relative overflow-hidden">
              {selectedImage ? (
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={imageData}
                    alt="Uploaded"
                    className="max-w-full max-h-96 mx-auto cursor-crosshair rounded-lg shadow-lg"
                    onClick={handleImageClick}
                  />
                  {clickPosition && (
                    <div
                      className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full transform -translate-x-2 -translate-y-2 pointer-events-none shadow-lg"
                      style={{
                        left: clickPosition.displayX,
                        top: clickPosition.displayY,
                      }}
                    />
                  )}
                  <button
                    onClick={resetImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {!selectedRoom || !selectedDirection ? (
                    <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium">
                      Select room & direction first
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                      Click anywhere to detect color
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="bg-white px-4 py-2 rounded-lg">
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-700">Analyzing...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16">
                  <Camera className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400 mb-4 mx-auto" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                    {isUploading ? 'Uploading...' : 'Ready to scan colors'}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-500">
                    {isUploading ? 'Please wait...' : 'Upload an image to start detection'}
                  </p>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selection Options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
             
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Select Room *
                </label>
                <select 
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-orange-200 rounded-xl bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <option value="">Choose room type</option>
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="dining-room">Dining Room</option>
                  <option value="study-room">Study Room</option>
                  <option value="office">Office</option>
                  <option value="entrance">Entrance</option>
                  <option value="balcony">Balcony</option>
                  <option value="garden">Garden</option>
                </select>
              </div>

            
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                 Wall Direction *
                </label>
                <select 
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-orange-200 rounded-xl bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <option value="">Select direction</option>
                  <option value="north">North</option>
                  <option value="northeast">Northeast</option>
                  <option value="east">East</option>
                  <option value="southeast">Southeast</option>
                  <option value="south">South</option>
                  <option value="southwest">Southwest</option>
                  <option value="west">West</option>
                  <option value="northwest">Northwest</option>
                  <option value="center">Center</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </button>
              <button
                onClick={handleObjectDetection}
                disabled={!selectedImage || isUploading || isAnalyzing}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5 mr-2" />
                Detect Objects
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Side  */}
          <div className="order-1 lg:order-2">
            {showAnalysis && colorAnalysis && colorAnalysis.detected_objects ? (
              // Object Detection Results
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-orange-100 shadow-lg">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">Object Detection & Vastu Analysis</h3>
                {colorAnalysis.boxed_image && (
                  <div className="mb-6 text-center">
                    <img
                      src={colorAnalysis.boxed_image}
                      alt="Detected Objects with Boxes"
                      className="inline-block max-w-full max-h-96 rounded-lg border-2 border-green-400 shadow-md"
                      style={{ background: '#f8fafc' }}
                    />
                  </div>
                )}
                {colorAnalysis.detected_objects.length === 0 ? (
                  <p className="text-center text-gray-600">No objects detected in the image.</p>
                ) : (
                  <div className="space-y-6">
                    {colorAnalysis.detected_objects
                      .filter(obj => !(obj.object_vastu_guideline && obj.object_vastu_guideline.startsWith('No specific Vastu guideline')))
                      .reduce((acc, obj) => {
                        
                        if (!acc.some(o => o.object === obj.object)) {
                          acc.push(obj);
                        }
                        return acc;
                      }, [])
                      .map((obj, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-lg text-gray-800 mr-2">{obj.object}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>Object Vastu Guideline:</strong> {obj.object_vastu_guideline || 'N/A'}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="w-full mt-6 px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Color Detection
                </button>
              </div>
            ) : showAnalysis && colorAnalysis && colorAnalysis.color ? (
              
              // Color Analysis Results
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-orange-100 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                       style={{ backgroundColor: colorAnalysis.color.hex }}>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {colorAnalysis.color.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    RGB: ({colorAnalysis.color.rgb.r}, {colorAnalysis.color.rgb.g}, {colorAnalysis.color.rgb.b}) | 
                    HEX: {colorAnalysis.color.hex}
                  </p>
                </div>

                {/* Vastu Analysis */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Vastu Analysis</h4>
                  
                  {/* Direction Suitability */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {getRecommendationIcon(colorAnalysis.vastu_analysis.direction_suitability)}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Direction Compatibility</h5>
                        <p className="text-sm text-gray-600">{colorAnalysis.vastu_analysis.direction_suitability}</p>
                      </div>
                    </div>
                  </div>

                  {/* Room Suitability */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {getRecommendationIcon(colorAnalysis.vastu_analysis.room_suitability)}
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Room Compatibility</h5>
                        <p className="text-sm text-gray-600">{colorAnalysis.vastu_analysis.room_suitability}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overall Recommendation */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start space-x-3">
                      {getRecommendationIcon(colorAnalysis.vastu_analysis.overall_recommendation)}
                      <div>
                        <h5 className="font-medium text-orange-800 mb-1">Overall Recommendation</h5>
                        <p className="text-sm text-orange-700">{colorAnalysis.vastu_analysis.overall_recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  {Array.isArray(colorAnalysis.vastu_analysis.tips) && colorAnalysis.vastu_analysis.tips.length > 0 ? (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-2">💡 Vastu Tips</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {colorAnalysis.vastu_analysis.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-2">💡 Vastu Tips</h5>
                      <p className="text-sm text-blue-700">No specific tips available for this selection.</p>
                    </div>
                  )}

                  {/* Direction Color Info Table */}
                  {colorAnalysis.vastu_analysis.direction_color_info && (
                    <div className="bg-green-50 rounded-lg p-4 mt-4 border border-green-200">
                      <h5 className="font-medium text-green-800 mb-2">📍 Direction Color & Element Details</h5>
                      <table className="w-full text-sm text-left mb-2">
                        <tbody>
                          <tr>
                            <td className="font-semibold pr-2 text-green-900">Element:</td>
                            <td className="text-green-700">{colorAnalysis.vastu_analysis.direction_color_info.element || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-2 text-green-900">Ideal Colors:</td>
                            <td className="text-green-700 flex flex-wrap gap-1">
                              {Array.isArray(colorAnalysis.vastu_analysis.direction_color_info.ideal_colors) && colorAnalysis.vastu_analysis.direction_color_info.ideal_colors.length > 0
                                ? colorAnalysis.vastu_analysis.direction_color_info.ideal_colors.map((col, i) => (
                                    <span key={i} className="inline-block px-2 py-0.5 rounded-full bg-green-200 text-green-900 mr-1 mb-1 border border-green-300 text-xs">{col}</span>
                                  ))
                                : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-2 text-green-900">Taboos:</td>
                            <td className="text-green-700">{Array.isArray(colorAnalysis.vastu_analysis.direction_color_info.taboos) && colorAnalysis.vastu_analysis.direction_color_info.taboos.length > 0
                              ? colorAnalysis.vastu_analysis.direction_color_info.taboos.join(', ')
                              : 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-2 text-green-900">Recommendations:</td>
                            <td className="text-green-700">{Array.isArray(colorAnalysis.vastu_analysis.direction_color_info.recommendations) && colorAnalysis.vastu_analysis.direction_color_info.recommendations.length > 0
                              ? colorAnalysis.vastu_analysis.direction_color_info.recommendations.join(', ')
                              : 'N/A'}</td>
                          </tr>
                        </tbody>
                      </table>
                      {colorAnalysis.vastu_analysis.direction_color_info.match ? (
                        <div className="text-green-700 font-semibold flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" />This color matches the ideal colors for this direction!</div>
                      ) : (
                        <div className="text-yellow-700 font-semibold flex items-center"><AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />This color does not match the ideal colors for this direction.</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowAnalysis(false)}
                  className="w-full mt-6 px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Color Detection
                </button>
              </div>
            ) : null}
          </div>
        </div>



        {/* Bottom Features */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="text-center p-6 bg-white bg-opacity-60 rounded-xl border border-orange-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-base sm:text-lg mb-2">Real-time Detection</h4>
            <p className="text-sm sm:text-base text-gray-600">Instant color recognition using advanced AI technology</p>
          </div>

          <div className="text-center p-6 bg-white bg-opacity-60 rounded-xl border border-orange-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-base sm:text-lg mb-2">Vastu Guidance</h4>
            <p className="text-sm sm:text-base text-gray-600">Ancient wisdom meets modern technology for better living</p>
          </div>

          <div className="text-center p-6 bg-white bg-opacity-60 rounded-xl border border-orange-100 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-base sm:text-lg mb-2">Easy Upload</h4>
            <p className="text-sm sm:text-base text-gray-600">Upload existing photos for instant color analysis</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIColorDetection;