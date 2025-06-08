import React, { useState } from 'react';
import { Compass, Home, Flame, Droplets, Mountain, Wind, Sun, Moon, Star, Utensils, Bed, Car, TreePine, Flower } from 'lucide-react';

const VastuGuidelines = () => {
  const [activeSection, setActiveSection] = useState('directions');

  const directionsData = [
    {
      id: 'north',
      title: 'North Direction',
      element: 'Water',
      ruler: 'Lord Kubera (God of Wealth)',
      description: 'brings wealth, prosperity, and opportunities',
      color: 'from-blue-400 to-blue-600',
      icon: <Droplets className="w-6 h-6" />,
      recommendations: [
        'Keep this area clean and clutter-free',
        'Place water features like aquariums or fountains',
        'Use colors like white, cream, light blue, or green',
        'Ideal for cash locker or safe',
        'Place mirrors on north wall',
        'Avoid red or orange colors',
        'Keep heavy furniture away from this direction',
        'Ensure proper lighting in this area'
      ]
    },
    {
      id: 'northeast',
      title: 'North-East Direction (Ishaan)',
      element: 'Water + Air',
      ruler: 'Lord Shiva',
      description: 'the most auspicious direction for spirituality and knowledge',
      color: 'from-cyan-400 to-blue-500',
      icon: <Star className="w-6 h-6" />,
      recommendations: [
        'Keep this corner absolutely clean and sacred',
        'Ideal for prayer room or meditation space',
        'Place water elements like small fountain',
        'Use white, light blue, or yellow colors',
        'Avoid toilets, kitchen, or storage',
        'Keep this area well-lit and ventilated',
        'Place crystals or religious symbols',
        'Avoid heavy furniture or clutter'
      ]
    },
    {
      id: 'east',
      title: 'East Direction',
      element: 'Air',
      ruler: 'Lord Indra (King of Gods)',
      description: 'represents new beginnings, growth, and social status',
      color: 'from-yellow-400 to-orange-500',
      icon: <Sun className="w-6 h-6" />,
      recommendations: [
        'Ensure plenty of natural light and ventilation',
        'Best direction for main entrance',
        'Use green, light blue, or white colors',
        'Ideal for living room or study room',
        'Place plants or fresh flowers',
        'Avoid dark or heavy colors',
        'Keep windows clean and unobstructed',
        'Place family photos on east wall'
      ]
    },
    {
      id: 'southeast',
      title: 'South-East Direction (Agneya)',
      element: 'Fire',
      ruler: 'Lord Agni (Fire God)',
      description: 'governs energy, passion, and digestive fire',
      color: 'from-red-400 to-orange-600',
      icon: <Flame className="w-6 h-6" />,
      recommendations: [
        'Perfect location for kitchen',
        'Place electrical appliances here',
        'Use red, orange, pink, or coral colors',
        'Avoid blue or black colors',
        'Keep fire elements like candles',
        'Ensure proper ventilation',
        'Place generator or electrical panel',
        'Avoid water elements in this corner'
      ]
    },
    {
      id: 'south',
      title: 'South Direction',
      element: 'Earth + Fire',
      ruler: 'Lord Yama (God of Death/Dharma)',
      description: 'governs fame, recognition, and longevity',
      color: 'from-red-500 to-pink-600',
      icon: <Mountain className="w-6 h-6" />,
      recommendations: [
        'Place heavy furniture in this direction',
        'Use warm colors like red, orange, pink, or coral',
        'Ideal for master bedroom',
        'Keep this area well-lit',
        'Place certificates or awards on south wall',
        'Avoid main entrance in pure south',
        'Use thick curtains on south windows',
        'Place storage or wardrobe here'
      ]
    },
    {
      id: 'southwest',
      title: 'South-West Direction (Nairitya)',
      element: 'Earth',
      ruler: 'Lord Nirrti (Demon of Destruction)',
      description: 'provides stability, strength, and relationship harmony',
      color: 'from-yellow-800 to-amber-700',
      icon: <Mountain className="w-6 h-6" />,
      recommendations: [
        'Highest and heaviest part of the house',
        'Perfect for master bedroom',
        'Use earthy colors like brown, beige, or yellow',
        'Place heavy furniture and storage',
        'Avoid toilets or water features',
        'Keep this area closed and private',
        'Use thick walls in this direction',
        'Place relationship enhancing items'
      ]
    },
    {
      id: 'west',
      title: 'West Direction',
      element: 'Earth + Air',
      ruler: 'Lord Varuna (God of Water/Rain)',
      description: 'brings stability, support, and material gains',
      color: 'from-amber-400 to-yellow-600',
      icon: <Moon className="w-6 h-6" />,
      recommendations: [
        'Ideal for dining room or children\'s room',
        'Use white, yellow, beige, or light colors',
        'Place storage areas in this direction',
        'Good for study room for children',
        'Avoid too much water element',
        'Keep moderate lighting',
        'Place children\'s belongings here',
        'Use metallic elements moderately'
      ]
    },
    {
      id: 'northwest',
      title: 'North-West Direction (Vayavya)',
      element: 'Air',
      ruler: 'Lord Vayu (Wind God)',
      description: 'governs movement, relationships, and social connections',
      color: 'from-gray-400 to-blue-400',
      icon: <Wind className="w-6 h-6" />,
      recommendations: [
        'Perfect for guest room or daughter\'s room',
        'Use white, cream, or light blue colors',
        'Ideal for car parking',
        'Place moving objects like fans',
        'Good for storing vehicles',
        'Ensure proper air circulation',
        'Avoid heavy storage',
        'Place communication devices'
      ]
    }
  ];

  const roomsData = [
    {
      id: 'living',
      title: 'Living Room',
      subtitle: 'Social Harmony',
      description: 'The heart of family interaction and social gatherings',
      color: 'from-orange-400 to-amber-500',
      icon: <Home className="w-6 h-6" />,
      recommendations: [
        'Best location: North, East, or North-East',
        'Face east or north while sitting',
        'Place heavy furniture in south or west',
        'Use warm, welcoming colors like cream, light yellow',
        'Ensure good lighting and ventilation',
        'Avoid clutter and broken items',
        'Place family photos on east or north wall',
        'Keep electronic items in south-east corner',
        'Use plants for positive energy',
        'Avoid mirrors reflecting the main door'
      ]
    },
    {
      id: 'master-bedroom',
      title: 'Master Bedroom',
      subtitle: 'Rest & Relationships',
      description: 'Sacred space for rest, intimacy, and rejuvenation',
      color: 'from-pink-400 to-rose-500',
      icon: <Bed className="w-6 h-6" />,
      recommendations: [
        'Best location: South-West corner',
        'Head should be towards south or east while sleeping',
        'Bed should not face mirrors directly',
        'Use soothing colors like light pink, blue, or green',
        'Keep electronic devices away from bed',
        'Ensure proper ventilation',
        'Place wardrobe in south or west',
        'Avoid beam directly above the bed',
        'Use pair of items for relationship harmony',
        'Keep fresh flowers (avoid dried flowers)'
      ]
    },
    {
      id: 'children-bedroom',
      title: 'Children\'s Bedroom',
      subtitle: 'Growth & Learning',
      description: 'Space for children\'s development and study',
      color: 'from-green-400 to-blue-400',
      icon: <Star className="w-6 h-6" />,
      recommendations: [
        'Best location: West, North-West, or North',
        'Study table should face east or north',
        'Use bright, cheerful colors',
        'Keep the room well-lit and airy',
        'Place educational materials in north-east',
        'Avoid dark colors or scary pictures',
        'Keep toys organized in west direction',
        'Ensure good ventilation for concentration',
        'Place inspirational quotes or images',
        'Avoid clutter under the bed'
      ]
    },
    {
      id: 'kitchen',
      title: 'Kitchen',
      subtitle: 'Nourishment',
      description: 'Sacred space for food preparation and family nourishment',
      color: 'from-red-400 to-orange-500',
      icon: <Utensils className="w-6 h-6" />,
      recommendations: [
        'Best location: South-East corner',
        'Cook facing east direction',
        'Keep kitchen clean and organized',
        'Use bright colors like yellow, orange, or red',
        'Ensure proper ventilation and lighting',
        'Place gas stove in south-east',
        'Keep refrigerator in south-west',
        'Avoid kitchen in north-east',
        'Use granite or marble platforms',
        'Keep water source away from fire elements'
      ]
    },
    {
      id: 'dining-room',
      title: 'Dining Room',
      subtitle: 'Family Unity',
      description: 'Space for family meals and bonding',
      color: 'from-amber-400 to-orange-400',
      icon: <Utensils className="w-6 h-6" />,
      recommendations: [
        'Best location: West, North, or East',
        'Face east while eating',
        'Use warm colors like cream, light yellow',
        'Keep dining table in center of room',
        'Ensure proper lighting',
        'Place water jug in north-east of table',
        'Avoid mirrors reflecting dining table',
        'Keep fresh fruits on display',
        'Use square or rectangular table',
        'Maintain cleanliness and hygiene'
      ]
    },
    {
      id: 'bathroom',
      title: 'Bathroom',
      subtitle: 'Purification',
      description: 'Space for cleansing and purification rituals',
      color: 'from-blue-400 to-cyan-500',
      icon: <Droplets className="w-6 h-6" />,
      recommendations: [
        'Best location: North-West, West, or South',
        'Keep bathroom door closed always',
        'Use light colors like white or light blue',
        'Ensure proper drainage and ventilation',
        'Keep toilet seat cover down',
        'Place mirror on north or east wall',
        'Use exhaust fan for air circulation',
        'Avoid bathroom in north-east',
        'Keep cleaning supplies organized',
        'Use plants that purify air'
      ]
    },
    {
      id: 'study-room',
      title: 'Study Room',
      subtitle: 'Knowledge & Wisdom',
      description: 'Space for learning, concentration, and intellectual growth',
      color: 'from-green-400 to-emerald-500',
      icon: <Star className="w-6 h-6" />,
      recommendations: [
        'Best location: North-East, North, or East',
        'Face east or north while studying',
        'Use light colors like white, light green, or yellow',
        'Ensure proper lighting and ventilation',
        'Keep books organized in north or east',
        'Place study table away from bed',
        'Use crystal or pyramid for concentration',
        'Avoid clutter on study table',
        'Place educational charts on walls',
        'Keep fresh air plants'
      ]
    },
    {
      id: 'pooja-room',
      title: 'Pooja Room',
      subtitle: 'Spirituality',
      description: 'Sacred space for prayers and spiritual practices',
      color: 'from-yellow-400 to-amber-500',
      icon: <Star className="w-6 h-6" />,
      recommendations: [
        'Best location: North-East corner',
        'Face east or north while praying',
        'Use white, yellow, or light colors',
        'Keep the space clean and sacred',
        'Place idols in north-east of the room',
        'Use natural materials like marble or wood',
        'Ensure proper lighting with oil lamps',
        'Keep fresh flowers and incense',
        'Avoid storing non-religious items',
        'Maintain daily cleaning routine'
      ]
    },
    {
      id: 'staircase',
      title: 'Staircase',
      subtitle: 'Movement & Progress',
      description: 'Pathway representing life\'s journey and progress',
      color: 'from-stone-400 to-stone-800',
      icon: <Mountain className="w-6 h-6" />,
      recommendations: [
        'Best location: South, West, or South-West',
        'Should turn clockwise while going up',
        'Use odd number of steps',
        'Ensure proper lighting',
        'Avoid staircase in north-east',
        'Keep the area clutter-free',
        'Use light colors for walls',
        'Place plants at the bottom',
        'Ensure proper ventilation',
        'Avoid storage under stairs'
      ]
    },
    {
      id: 'garage',
      title: 'Garage/Parking',
      subtitle: 'Vehicle Safety',
      description: 'Space for vehicle storage and protection',
      color: 'from-slate-400 to-gray-600',
      icon: <Car className="w-6 h-6" />,
      recommendations: [
        'Best location: North-West or South-East',
        'Face vehicles towards east or north',
        'Ensure proper ventilation',
        'Use light colors for walls',
        'Keep the area clean and organized',
        'Place small plants for positive energy',
        'Avoid storage of inflammable items',
        'Ensure proper drainage',
        'Use good lighting for safety',
        'Keep emergency tools organized'
      ]
    }
  ];

  const elementsData = [
    {
      id: 'earth',
      title: 'Earth (Prithvi)',
      subtitle: 'Stability & Foundation',
      description: 'Represents stability, patience, material prosperity, and grounding energy',
      color: 'from-yellow-600 to-amber-600',
      icon: <Mountain className="w-6 h-6" />,
      direction: 'South-West',
      characteristics: 'Heavy, stable, nurturing, supportive',
      recommendations: [
        'Use earthy colors like brown, yellow, orange, beige',
        'Place heavy objects and furniture in south-west',
        'Incorporate natural materials like clay, stone, marble',
        'Maintain clean and solid foundations',
        'Use square or rectangular shapes',
        'Place crystals or gemstones for stability',
        'Keep heavy storage in earth corners',
        'Use terracotta pots and earthen items',
        'Ensure proper grounding in electrical systems',
        'Place certificates and achievements in earth zones'
      ]
    },
    {
      id: 'water',
      title: 'Water (Jal)',
      subtitle: 'Flow & Purification',
      description: 'Symbolizes life, purity, continuous movement, and emotional balance',
      color: 'from-blue-500 to-cyan-600',
      icon: <Droplets className="w-6 h-6" />,
      direction: 'North & North-East',
      characteristics: 'Flowing, cleansing, cooling, adaptive',
      recommendations: [
        'Place water features in north or north-east',
        'Use blue, black, and white colors mindfully',
        'Ensure clean and flowing water always',
        'Avoid stagnant water anywhere in home',
        'Keep aquariums in north-east corner',
        'Use mirrors to enhance water element',
        'Place fountains for positive energy flow',
        'Keep drinking water in north-east',
        'Use curved and wavy shapes',
        'Maintain proper drainage systems'
      ]
    },
    {
      id: 'fire',
      title: 'Fire (Agni)',
      subtitle: 'Energy & Transformation',
      description: 'Represents energy, passion, transformation, and digestive power',
      color: 'from-red-500 to-orange-600',
      icon: <Flame className="w-6 h-6" />,
      direction: 'South & South-East',
      characteristics: 'Hot, bright, transformative, energizing',
      recommendations: [
        'Use fire colors (red, orange, pink) in south-east',
        'Place kitchen and electrical items in south-east',
        'Ensure proper ventilation for fire elements',
        'Keep candles, lamps, and lights in fire zones',
        'Balance fire energy with other elements',
        'Use triangular shapes for fire enhancement',
        'Place electrical panel in south-east',
        'Keep cooking gas in fire direction',
        'Use bright lighting in fire corners',
        'Avoid water elements in fire zones'
      ]
    },
    {
      id: 'air',
      title: 'Air (Vayu)',
      subtitle: 'Movement & Communication',
      description: 'Governs communication, relationships, mental clarity, and life force',
      color: 'from-gray-400 to-blue-400',
      icon: <Wind className="w-6 h-6" />,
      direction: 'North-West & East',
      characteristics: 'Light, moving, fresh, connecting',
      recommendations: [
        'Ensure proper air circulation throughout',
        'Use light colors like white, cream, light blue',
        'Keep spaces open and uncluttered',
        'Place wind chimes in north-west',
        'Use fans and ventilation systems properly',
        'Keep windows clean for fresh air',
        'Place moving objects in air zones',
        'Use vertical lines and tall plants',
        'Ensure cross ventilation in rooms',
        'Place communication devices in air corners'
      ]
    },
    {
      id: 'space',
      title: 'Space (Akash)',
      subtitle: 'Expansion & Potential',
      description: 'Represents infinite potential, spiritual growth, and cosmic consciousness',
      color: 'from-purple-500 to-indigo-600',
      icon: <Star className="w-6 h-6" />,
      direction: 'Center (Brahmasthan)',
      characteristics: 'Infinite, expansive, connecting, sacred',
      recommendations: [
        'Keep center of house open and unobstructed',
        'Use light colors to enhance space feeling',
        'Avoid heavy decorations in center',
        'Keep central areas clean and sacred',
        'Place spiritual symbols in center',
        'Use natural lighting in central area',
        'Avoid pillars or beams in center',
        'Keep minimal furniture in central space',
        'Use crystals or pyramids for energy enhancement',
        'Maintain proper height ratios in rooms'
      ]
    }
  ];

  const navigationItems = [
    { id: 'directions', label: 'Directions & Elements', icon: <Compass className="w-5 h-5" /> },
    { id: 'rooms', label: 'Room Guidelines', icon: <Home className="w-5 h-5" /> },
    { id: 'elements', label: 'Five Elements', icon: <Flame className="w-5 h-5" /> }
  ];

  const renderCards = () => {
    let data = [];
    switch (activeSection) {
      case 'directions':
        data = directionsData;
        break;
      case 'rooms':
        data = roomsData;
        break;
      case 'elements':
        data = elementsData;
        break;
      default:
        data = directionsData;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-sm text-gray-600 font-medium">{item.subtitle}</p>
                  )}
                  {item.element && (
                    <p className="text-sm text-blue-600 font-medium">{item.element}</p>
                  )}
                  {item.direction && (
                    <p className="text-sm text-purple-600 font-medium">Direction: {item.direction}</p>
                  )}
                </div>
              </div>
              
              {item.ruler && (
                <p className="text-gray-600 text-sm mb-3">
                  <span className="font-medium">Governed by:</span> {item.ruler}
                </p>
              )}
              
              <p className="text-gray-600 text-sm mb-3">
                <span className="font-medium italic">{item.description}</span>
              </p>

              {item.characteristics && (
                <p className="text-gray-600 text-sm mb-3">
                  <span className="font-medium">Characteristics:</span> {item.characteristics}
                </p>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Key Recommendations:</h4>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {item.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                      <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Vastu Shastra Guidelines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ancient wisdom for modern living. Discover the fundamental principles that create 
            harmony between your space and cosmic energies.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 flex-wrap">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Info */}
        <div className="text-center mb-6">
          {activeSection === 'directions' && (
            <p className="text-gray-600">Complete guide to all 8 directions according to Vastu Shastra</p>
          )}
          {activeSection === 'rooms' && (
            <p className="text-gray-600">Detailed guidelines for every room in your home</p>
          )}
          {activeSection === 'elements' && (
            <p className="text-gray-600">Understanding the five fundamental elements and their applications</p>
          )}
        </div>

        {/* Content Cards */}
        {renderCards()}
      </div>
    </div>
  );
};

export default VastuGuidelines;