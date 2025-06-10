from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
import base64
from PIL import Image
import io
from ultralytics import YOLO

# I have used YOLOv8l model used for accuracy and speed 
YOLO_MODEL_PATH = 'yolov8l.pt'
yolo_model = YOLO(YOLO_MODEL_PATH)

app = Flask(__name__)

CORS(app, origins="*", methods=['GET', 'POST', 'PUT', 'DELETE'], allow_headers=['Content-Type', 'Authorization'])


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024 

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


csv_path = 'colors.csv'
if not os.path.exists(csv_path):

    sample_colors = [
        ['White', 'White', '#FFFFFF', 255, 255, 255],
        ['Black', 'Black', '#000000', 0, 0, 0],
        ['Red', 'Red', '#FF0000', 255, 0, 0],
        ['Dark Red', 'Dark Red', '#8B0000', 139, 0, 0],
        ['Light Red', 'Light Red', '#FFB6C1', 255, 182, 193],
        ['Green', 'Green', '#00FF00', 0, 255, 0],
        ['Dark Green', 'Dark Green', '#006400', 0, 100, 0],
        ['Light Green', 'Light Green', '#90EE90', 144, 238, 144],
        ['Forest Green', 'Forest Green', '#228B22', 34, 139, 34],
        ['Blue', 'Blue', '#0000FF', 0, 0, 255],
        ['Dark Blue', 'Dark Blue', '#00008B', 0, 0, 139],
        ['Light Blue', 'Light Blue', '#ADD8E6', 173, 216, 230],
        ['Navy Blue', 'Navy Blue', '#000080', 0, 0, 128],
        ['Sky Blue', 'Sky Blue', '#87CEEB', 135, 206, 235],
        ['Yellow', 'Yellow', '#FFFF00', 255, 255, 0],
        ['Light Yellow', 'Light Yellow', '#FFFFE0', 255, 255, 224],
        ['Gold', 'Gold', '#FFD700', 255, 215, 0],
        ['Orange', 'Orange', '#FFA500', 255, 165, 0],
        ['Dark Orange', 'Dark Orange', '#FF8C00', 255, 140, 0],
        ['Purple', 'Purple', '#800080', 128, 0, 128],
        ['Violet', 'Violet', '#EE82EE', 238, 130, 238],
        ['Pink', 'Pink', '#FFC0CB', 255, 192, 203],
        ['Hot Pink', 'Hot Pink', '#FF69B4', 255, 105, 180],
        ['Brown', 'Brown', '#A52A2A', 165, 42, 42],
        ['Saddle Brown', 'Saddle Brown', '#8B4513', 139, 69, 19],
        ['Tan', 'Tan', '#D2B48C', 210, 180, 140],
        ['Gray', 'Gray', '#808080', 128, 128, 128],
        ['Light Gray', 'Light Gray', '#D3D3D3', 211, 211, 211],
        ['Dark Gray', 'Dark Gray', '#A9A9A9', 169, 169, 169],
        ['Silver', 'Silver', '#C0C0C0', 192, 192, 192],
        ['Maroon', 'Maroon', '#800000', 128, 0, 0],
        ['Olive', 'Olive', '#808000', 128, 128, 0],
        ['Lime', 'Lime', '#00FF00', 0, 255, 0],
        ['Aqua', 'Aqua', '#00FFFF', 0, 255, 255],
        ['Teal', 'Teal', '#008080', 0, 128, 128],
        ['Fuchsia', 'Fuchsia', '#FF00FF', 255, 0, 255],
        ['Beige', 'Beige', '#F5F5DC', 245, 245, 220],
        ['Ivory', 'Ivory', '#FFFFF0', 255, 255, 240],
        ['Khaki', 'Khaki', '#F0E68C', 240, 230, 140],
        ['Lavender', 'Lavender', '#E6E6FA', 230, 230, 250],
        ['Misty Rose', 'Misty Rose', '#FFE4E1', 255, 228, 225],
        ['Peach', 'Peach', '#FFCBA4', 255, 203, 164],
        ['Salmon', 'Salmon', '#FA8072', 250, 128, 114],
        ['Turquoise', 'Turquoise', '#40E0D0', 64, 224, 208],
        ['Coral', 'Coral', '#FF7F50', 255, 127, 80],
        ['Crimson', 'Crimson', '#DC143C', 220, 20, 60],
        ['Indigo', 'Indigo', '#4B0082', 75, 0, 130],
        ['Magenta', 'Magenta', '#FF00FF', 255, 0, 255],
        ['Cyan', 'Cyan', '#00FFFF', 0, 255, 255],
        ['Wheat', 'Wheat', '#F5DEB3', 245, 222, 179],
        ['Plum', 'Plum', '#DDA0DD', 221, 160, 221],
        ['Orchid', 'Orchid', '#DA70D6', 218, 112, 214],
        ['Chocolate', 'Chocolate', '#D2691E', 210, 105, 30],
        ['Peru', 'Peru', '#CD853F', 205, 133, 63],
        ['Rosy Brown', 'Rosy Brown', '#BC8F8F', 188, 143, 143],
        ['Steel Blue', 'Steel Blue', '#4682B4', 70, 130, 180],
        ['Slate Gray', 'Slate Gray', '#708090', 112, 128, 144],
        ['Dim Gray', 'Dim Gray', '#696969', 105, 105, 105],
        ['Medium Gray', 'Medium Gray', '#BEBEBE', 190, 190, 190],
        ['Gainsboro', 'Gainsboro', '#DCDCDC', 220, 220, 220],
        ['Snow', 'Snow', '#FFFAFA', 255, 250, 250],
        ['Mint Cream', 'Mint Cream', '#F5FFFA', 245, 255, 250],
        ['Honeydew', 'Honeydew', '#F0FFF0', 240, 255, 240],
        ['Azure', 'Azure', '#F0FFFF', 240, 255, 255],
        ['Alice Blue', 'Alice Blue', '#F0F8FF', 240, 248, 255],
        ['Ghost White', 'Ghost White', '#F8F8FF', 248, 248, 255],
        ['Linen', 'Linen', '#FAF0E6', 250, 240, 230],
        ['Antique White', 'Antique White', '#FAEBD7', 250, 235, 215],
        ['Papaya Whip', 'Papaya Whip', '#FFEFD5', 255, 239, 213],
        ['Blanched Almond', 'Blanched Almond', '#FFEBCD', 255, 235, 205],
        ['Bisque', 'Bisque', '#FFE4C4', 255, 228, 196],
        ['Moccasin', 'Moccasin', '#FFE4B5', 255, 228, 181],
        ['Navajo White', 'Navajo White', '#FFDEAD', 255, 222, 173],
        ['Peach Puff', 'Peach Puff', '#FFDAB9', 255, 218, 185],
        ['Misty Rose', 'Misty Rose', '#FFE4E1', 255, 228, 225],
        ['Lavender Blush', 'Lavender Blush', '#FFF0F5', 255, 240, 245],
        ['Seashell', 'Seashell', '#FFF5EE', 255, 245, 238],
        ['Old Lace', 'Old Lace', '#FDF5E6', 253, 245, 230],
        ['Floral White', 'Floral White', '#FFFAF0', 255, 250, 240]
    ]
    
    df_sample = pd.DataFrame(sample_colors, columns=['color', 'color_name', 'hex', 'R', 'G', 'B'])
    df_sample.to_csv(csv_path, index=False, header=False)


index = ['color', 'color_name', 'hex', 'R', 'G', 'B']
df = pd.read_csv(csv_path, names=index, header=None)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def euclidean_distance(color1, color2):
    # Calculating Euclidean distance between two RGB colors
    return np.sqrt(sum((c1 - c2) ** 2 for c1, c2 in zip(color1, color2)))

def get_averaged_color(img, x, y, radius=3):

    #Getting averaged color from a small region around the clicked point
    height, width = img.shape[:2]
    
    # Ensureing the sampling area is within image bounds
    x_start = max(0, x - radius)
    x_end = min(width, x + radius + 1)
    y_start = max(0, y - radius)
    y_end = min(height, y + radius + 1)
    
   
    region = img[y_start:y_end, x_start:x_end]
    avg_bgr = np.mean(region, axis=(0, 1))
    
    # Convertion of  BGR to RGB
    return int(avg_bgr[2]), int(avg_bgr[1]), int(avg_bgr[0])

def get_color_name(R, G, B):
    
    minimum = float('inf')
    cname = "Unknown"
    
    # Converting to numpy arrays for better performance
    target_color = np.array([R, G, B])
    
    for i in range(len(df)):
        color_rgb = np.array([int(df.loc[i, 'R']), int(df.loc[i, 'G']), int(df.loc[i, 'B'])])
        
       
        distance = np.linalg.norm(target_color - color_rgb)
        
        if distance < minimum:
            minimum = distance
            cname = df.loc[i, 'color_name']
    
    return cname

def get_vastu_recommendation(color_name, direction, room_type):
    
    direction = direction.lower() if direction else ''
    room_type = room_type.lower() if room_type else ''
    color_lower = color_name.lower()

    
    vastu_guidelines = {
        'north': {
            'favorable': ['white', 'light blue', 'green', 'cream', 'silver'],
            'avoid': ['red', 'orange', 'dark colors'],
            'element': 'Water',
            'benefit': 'prosperity and career growth'
        },
        'northeast': {
            'favorable': ['white', 'light yellow', 'light blue', 'cream'],
            'avoid': ['red', 'orange', 'dark blue', 'black'],
            'element': 'Water + Earth',
            'benefit': 'spiritual growth and wisdom'
        },
        'east': {
            'favorable': ['white', 'light green', 'light blue', 'cream'],
            'avoid': ['red', 'orange', 'dark colors'],
            'element': 'Air',
            'benefit': 'health and new beginnings'
        },
        'southeast': {
            'favorable': ['red', 'orange', 'pink', 'yellow'],
            'avoid': ['blue', 'black', 'white'],
            'element': 'Fire',
            'benefit': 'energy and passion'
        },
        'south': {
            'favorable': ['red', 'orange', 'pink', 'yellow', 'green'],
            'avoid': ['blue', 'black'],
            'element': 'Fire',
            'benefit': 'fame and recognition'
        },
        'southwest': {
            'favorable': ['yellow', 'brown', 'orange', 'pink'],
            'avoid': ['green', 'blue', 'white'],
            'element': 'Earth',
            'benefit': 'stability and relationships'
        },
        'west': {
            'favorable': ['white', 'yellow', 'silver', 'gray'],
            'avoid': ['red', 'green'],
            'element': 'Metal',
            'benefit': 'creativity and children'
        },
        'northwest': {
            'favorable': ['white', 'gray', 'silver', 'light blue'],
            'avoid': ['red', 'orange', 'yellow'],
            'element': 'Air + Metal',
            'benefit': 'support and helpful people'
        },
        'center': {
            'favorable': ['yellow', 'beige', 'cream', 'light brown'],
            'avoid': ['blue', 'black', 'green'],
            'element': 'Earth',
            'benefit': 'balance and stability'
        }
    }


    room_guidelines = {
        'living-room': {
            'recommended': ['white', 'cream', 'light yellow', 'light green'],
            'purpose': 'social harmony and positive energy'
        },
        'bedroom': {
            'recommended': ['light blue', 'pink', 'light green', 'cream'],
            'purpose': 'rest and peaceful sleep'
        },
        'kitchen': {
            'recommended': ['yellow', 'orange', 'red', 'pink'],
            'purpose': 'fire element and nourishment'
        },
        'bathroom': {
            'recommended': ['white', 'light blue', 'cream'],
            'purpose': 'cleanliness and purification'
        },
        'study-room': {
            'recommended': ['white', 'light green', 'light yellow'],
            'purpose': 'concentration and learning'
        },
        'office': {
            'recommended': ['white', 'light blue', 'cream', 'light green'],
            'purpose': 'productivity and success'
        }
    }

    direction_color_table = {
        'north': {
            'element': 'Water',
            'ideal_colors': ['green', 'blue'],
            'taboos': ['heavy storage', 'toilets'],
            'recommendations': ['Wealth vaults', 'Tulsi plant', 'water features (fountains)', 'study desks']
        },
        'northeast': {
            'element': 'Water + Air',
            'ideal_colors': ['light blue', 'white'],
            'taboos': ['toilets', 'heavy furniture', 'clutter'],
            'recommendations': ['Puja room', 'meditation area', 'water source', 'open windows']
        },
        'east': {
            'element': 'Air',
            'ideal_colors': ['light blue', 'white', 'green'],
            'taboos': ['stairs', 'toilets', 'large trees blocking light'],
            'recommendations': ['Main entrance', 'morning sunlight access', 'tulsi plant']
        },
        'southeast': {
            'element': 'Fire',
            'ideal_colors': ['orange', 'pink', 'red'],
            'taboos': ['toilets', 'bedrooms', 'underground tanks'],
            'recommendations': ['Kitchen', 'electrical equipment', 'lighting setup']
        },
        'south': {
            'element': 'Fire',
            'ideal_colors': ['red', 'maroon'],
            'taboos': ['water bodies', 'open spaces', 'entrances'],
            'recommendations': ['Storage', 'bedrooms', 'office for people in authority']
        },
        'southwest': {
            'element': 'Earth',
            'ideal_colors': ['brown', 'yellow', 'peach'],
            'taboos': ['bathrooms', 'water tanks', 'cut corners'],
            'recommendations': ['Master bedroom', 'safe/vault', 'heavy furniture']
        },
        'west': {
            'element': 'Water',
            'ideal_colors': ['grey', 'blue', 'white'],
            'taboos': ['large openings', 'water tanks'],
            'recommendations': ["Dining area", "children's bedroom", 'storage']
        },
        'northwest': {
            'element': 'Air',
            'ideal_colors': ['white', 'cream', 'light grey'],
            'taboos': ['heavy furniture', 'septic tanks'],
            'recommendations': ['Guest room', 'storage', 'washroom (if well-placed)']
        },
        'center': {
            'element': 'Space',
            'ideal_colors': ['off-white', 'light tones'],
            'taboos': ['pillars', 'walls', 'heavy weight', 'toilets'],
            'recommendations': ['Keep clean and open', 'place decorative items', 'small skylight']
        }
    }

    recommendation = {
        'color_analysis': f"Detected color: {color_name}",
        'direction_suitability': '',
        'room_suitability': '',
        'overall_recommendation': '',
        'tips': [],
        'direction_color_info': None
    }
    
    # direction suitability
    if direction in vastu_guidelines:
        guideline = vastu_guidelines[direction]
        is_favorable = any(fav_color in color_lower for fav_color in guideline['favorable'])
        is_unfavorable = any(avoid_color in color_lower for avoid_color in guideline['avoid'])
        
        if is_favorable:
            recommendation['direction_suitability'] = f"✅ {color_name} is excellent for {direction.title()} direction. It enhances {guideline['benefit']} and aligns with the {guideline['element']} element."
        elif is_unfavorable:
            recommendation['direction_suitability'] = f"⚠️ {color_name} may not be ideal for {direction.title()} direction. Consider using: {', '.join(guideline['favorable'])}."
        else:
            recommendation['direction_suitability'] = f"🔶 {color_name} is neutral for {direction.title()} direction. Recommended colors: {', '.join(guideline['favorable'])}."
    
    #  room suitability
    if room_type in room_guidelines:
        room_guide = room_guidelines[room_type]
        is_room_suitable = any(rec_color in color_lower for rec_color in room_guide['recommended'])
        
        if is_room_suitable:
            recommendation['room_suitability'] = f"✅ {color_name} works well in {room_type.replace('-', ' ').title()} for {room_guide['purpose']}."
        else:
            recommendation['room_suitability'] = f"💡 For {room_type.replace('-', ' ').title()}, consider: {', '.join(room_guide['recommended'])} for better {room_guide['purpose']}."
    
    # Overall recommendation
    if recommendation['direction_suitability'].startswith('✅') and recommendation['room_suitability'].startswith('✅'):
        recommendation['overall_recommendation'] = "🌟 Excellent choice! This color perfectly aligns with Vastu principles for this space."
    elif recommendation['direction_suitability'].startswith('⚠️') or recommendation['room_suitability'].startswith('💡'):
        recommendation['overall_recommendation'] = "🔄 Consider adjusting the color scheme for better Vastu harmony."
    else:
        recommendation['overall_recommendation'] = "👍 This color is acceptable but could be optimized for better energy flow."
    
    # tips
    recommendation['tips'] = [
        "Use lighter shades for smaller rooms to create spaciousness",
        "Combine colors thoughtfully - avoid conflicting elements",
        "Natural light enhances color energy - ensure good lighting",
        "Consider the psychological impact of colors on mood"
    ]
    
    
    if direction in direction_color_table:
        dct = direction_color_table[direction]
       
        match = any(ideal_color in color_lower for ideal_color in [c.lower() for c in dct['ideal_colors']])
        recommendation['direction_color_info'] = {
            'element': dct['element'],
            'ideal_colors': dct['ideal_colors'],
            'taboos': dct['taboos'],
            'recommendations': dct['recommendations'],
            'match': match
        }

    return recommendation

def get_object_vastu_recommendation(object_name, color_name, direction):

    object_vastu = {
        'chair': {
            'north': 'North-facing chair is good for career growth.',
            'south': 'South-facing chair is good for leadership.',
            'east': 'East-facing chair is best for students.',
            'west': 'West-facing chair is good for creative work.',
            'northeast': 'Northeast is very good for meditation chairs.',
            'southeast': 'Southeast is good for dining chairs.',
            'southwest': 'Southwest is stable for armchairs.',
            'northwest': 'Northwest is good for guest chairs.'
        },
        'couch': {
            'north': 'Place sofa facing North for prosperity. Use white or green covers.',
            'south': 'South-facing sofa is good for fame. Use red or orange.',
            'east': 'East is ideal for social harmony. Use light green or cream.',
            'west': 'West is good for creativity. Use yellow or gray.',
            'northeast': 'Northeast is very good for sofas. Use light colors.',
            'southeast': 'Southeast is less ideal. Use warm colors if placed here.',
            'southwest': 'Southwest is stable for heavy sofas.',
            'northwest': 'Northwest is good for movement and guests.'
        },
        'sofa': {
            'north': 'Place sofa facing North for prosperity. Use white or green covers.',
            'south': 'South-facing sofa is good for fame. Use red or orange.',
            'east': 'East is ideal for social harmony. Use light green or cream.',
            'west': 'West is good for creativity. Use yellow or gray.',
            'northeast': 'Northeast is very good for sofas. Use light colors.',
            'southeast': 'Southeast is less ideal. Use warm colors if placed here.',
            'southwest': 'Southwest is stable for heavy sofas.',
            'northwest': 'Northwest is good for movement and guests.'
        },
        'potted plant': {
            'north': 'North is good for potted plants, especially money plant.',
            'east': 'East is best for indoor plants for health and growth.',
            'northeast': 'Northeast is very good for plants.',
            'southeast': 'Southeast is less ideal for plants.',
            'south': 'South is not recommended for plants.',
            'southwest': 'Southwest is not recommended for plants.',
            'west': 'West is acceptable for flowering plants.',
            'northwest': 'Northwest is good for air-purifying plants.'
        },
        'bed': {
            'north': 'Avoid placing the bed in the North. Use light blue or white bedsheets for better sleep.',
            'south': 'South is ideal for bed placement. Use red, orange, or pink for prosperity.',
            'east': 'East is acceptable for bed placement. Use light green or cream.',
            'west': 'West is good for stability. Use yellow or gray.',
            'northeast': 'Avoid placing the bed in the Northeast. It may disturb peace.',
            'southeast': 'Avoid placing the bed in the Southeast. It may cause restlessness.',
            'southwest': 'Best for master bedrooms. Promotes stability and relationships.',
            'northwest': 'Good for guest bedrooms. Promotes movement.'
        },
        'dining table': {
            'north': 'North is less ideal for dining tables.',
            'south': 'South is acceptable.',
            'east': 'East is good for dining tables.',
            'west': 'West is best for dining tables. Promotes family bonding.',
            'northeast': 'Northeast is not recommended for dining tables.',
            'southeast': 'Southeast is good for dining tables.',
            'southwest': 'Southwest is stable for heavy dining tables.',
            'northwest': 'Northwest is good for round dining tables.'
        },
        'toilet': {
            'north': 'Avoid toilets in the North.',
            'south': 'South is acceptable for toilets.',
            'east': 'East is less ideal for toilets.',
            'west': 'West is acceptable.',
            'northeast': 'Avoid toilets in the Northeast.',
            'southeast': 'Southeast is acceptable.',
            'southwest': 'Southwest is not recommended.',
            'northwest': 'Northwest is acceptable.'
        },
        'tv': {
            'north': 'North is acceptable for TV units.',
            'south': 'Avoid TV on South wall.',
            'east': 'East is good for TV units.',
            'west': 'West is acceptable.',
            'northeast': 'Northeast is not recommended.',
            'southeast': 'Southeast is best for TV units.',
            'southwest': 'Southwest is not recommended.',
            'northwest': 'Northwest is acceptable.'
        },
        'laptop': {
            'north': 'North is good for work with laptops.',
            'south': 'South is good for leadership tasks.',
            'east': 'East is best for study/work with laptops.',
            'west': 'West is good for creative laptop work.',
            'northeast': 'Northeast is good for research.',
            'southeast': 'Southeast is good for tech work.',
            'southwest': 'Southwest is stable for long work.',
            'northwest': 'Northwest is good for meetings.'
        },
        'microwave': {
            'north': 'North is not recommended for microwaves.',
            'south': 'South is acceptable.',
            'east': 'East is good for microwaves.',
            'west': 'West is acceptable.',
            'northeast': 'Northeast is not recommended.',
            'southeast': 'Southeast is best for microwaves.',
            'southwest': 'Southwest is not recommended.',
            'northwest': 'Northwest is acceptable.'
        },
        'oven': {
            'north': 'North is not recommended for ovens.',
            'south': 'South is acceptable.',
            'east': 'East is good for ovens.',
            'west': 'West is acceptable.',
            'northeast': 'Northeast is not recommended.',
            'southeast': 'Southeast is best for ovens.',
            'southwest': 'Southwest is not recommended.',
            'northwest': 'Northwest is acceptable.'
        },
        'sink': {
            'north': 'North is good for sinks.',
            'south': 'South is less ideal for sinks.',
            'east': 'East is good for sinks.',
            'west': 'West is acceptable.',
            'northeast': 'Northeast is best for sinks.',
            'southeast': 'Southeast is less ideal.',
            'southwest': 'Southwest is not recommended.',
            'northwest': 'Northwest is acceptable.'
        },
        'refrigerator': {
            'north': 'North is good for refrigerators.',
            'south': 'South is less ideal.',
            'east': 'East is good for refrigerators.',
            'west': 'West is acceptable.',
            'northeast': 'Northeast is not recommended.',
            'southeast': 'Southeast is best for refrigerators.',
            'southwest': 'Southwest is not recommended.',
            'northwest': 'Northwest is acceptable.'
        },
        'book': {
            'north': 'North is good for bookshelves/books.',
            'south': 'South is less ideal.',
            'east': 'East is best for books.',
            'west': 'West is good for creative books.',
            'northeast': 'Northeast is ideal for study books.',
            'southeast': 'Southeast is good for cookbooks.',
            'southwest': 'Southwest is stable for heavy books.',
            'northwest': 'Northwest is good for guest books.'
        },
        'clock': {
            'north': 'North is best for clocks.',
            'south': 'South is less ideal.',
            'east': 'East is also good.',
            'west': 'West is acceptable.',
            'northeast': 'Northeast is good for meditation clocks.',
            'southeast': 'Southeast is good for kitchen clocks.',
            'southwest': 'Southwest is stable for antique clocks.',
            'northwest': 'Northwest is good for guest clocks.'
        },
        'vase': {
            'north': 'North is good for vases with water.',
            'south': 'South is good for red flowers.',
            'east': 'East is good for fresh flowers.',
            'west': 'West is good for metal vases.',
            'northeast': 'Northeast is very good for vases.',
            'southeast': 'Southeast is good for decorative vases.',
            'southwest': 'Southwest is stable for heavy vases.',
            'northwest': 'Northwest is good for guest vases.'
        }
    }
    obj = object_name.lower()
    dir = direction.lower() if direction else ''
    if obj in object_vastu and dir in object_vastu[obj]:
        return object_vastu[obj][dir]
    return f"No specific Vastu guideline for {object_name} in {direction}."

@app.route('/')
def home():
    return jsonify({'message': 'Flask Vastu Color and Object Detection API is running!', 'status': 'active'})

@app.route('/upload', methods=['POST'])
def upload_image():
    
    try:
        print("Upload request received")
        print("Files in request:", request.files.keys())
        
        if 'image' not in request.files:
            print("No image file in request")
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        print(f"File received: {file.filename}")
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, BMP'}), 400
        
        
        filename = secure_filename(file.filename)

        # Adding timestamp to avoid filename conflicts
        import time
        timestamp = str(int(time.time()))
        name, ext = os.path.splitext(filename)
        filename = f"{name}_{timestamp}{ext}"
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        print(f"Saving to: {filepath}")
        
        
        file.save(filepath)
        
 
        if not os.path.exists(filepath):
            return jsonify({'error': 'Failed to save file'}), 500
        
        # Geting image dimensions
        img = cv2.imread(filepath)
        if img is None:
            print("Failed to read image with OpenCV")
            return jsonify({'error': 'Failed to process image'}), 500
        
        height, width = img.shape[:2]
        print(f"Image dimensions: {width}x{height}")
        
        # Converting image to base64 for frontend display
        with open(filepath, 'rb') as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
        
        response_data = {
            'message': 'Image uploaded successfully',
            'filename': filename,
            'dimensions': {'width': width, 'height': height},
            'image_data': f"data:image/{filename.split('.')[-1].lower()};base64,{img_base64}"
        }
        
        print("Upload successful")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to upload image: {str(e)}'}), 500

@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
   
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/detect_color', methods=['POST'])
def detect_color():
    #Detecting color at specific pixel coordinates
    try:
        data = request.json
        filename = data.get('filename')
        x = data.get('x')
        y = data.get('y')
        direction = data.get('direction', '')
        room_type = data.get('room_type', '')
        
        if not filename or x is None or y is None:
            return jsonify({'error': 'Missing required parameters: filename, x, y'}), 400
        
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(img_path):
            return jsonify({'error': 'Image not found'}), 404
        
      
        img = cv2.imread(img_path)
        if img is None:
            return jsonify({'error': 'Failed to read image'}), 500
        
        height, width = img.shape[:2]
        
        # Ensureing coordinates are within image bounds
        x = max(0, min(width - 1, int(x)))
        y = max(0, min(height - 1, int(y)))
        
        # Geting averaged color from a small region more accurate than single pixel therefore
        r, g, b = get_averaged_color(img, x, y, radius=2)
        
       
        color_name = get_color_name(r, g, b)
        
       
        vastu_rec = get_vastu_recommendation(color_name, direction, room_type)
        
        # Converting RGB to HEX
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        
        response = {
            'success': True,
            'coordinates': {'x': x, 'y': y},
            'color': {
                'name': color_name,
                'rgb': {'r': r, 'g': g, 'b': b},
                'hex': hex_color
            },
            'vastu_analysis': vastu_rec,
            'room_type': room_type,
            'direction': direction
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': f'Color detection failed: {str(e)}'}), 500

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    
    try:
        data = request.json
        filename = data.get('filename')
        direction = data.get('direction', '')
        room_type = data.get('room_type', '')
        
        if not filename:
            return jsonify({'error': 'Missing filename'}), 400
        
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(img_path):
            return jsonify({'error': 'Image not found'}), 404
        

        img = cv2.imread(img_path)
        if img is None:
            return jsonify({'error': 'Failed to read image'}), 500
        
        # Converting BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resizeing image for faster processing if it's too large
        height, width = img_rgb.shape[:2]
        if width > 300:
            ratio = 300 / width
            new_width = 300
            new_height = int(height * ratio)
            img_rgb = cv2.resize(img_rgb, (new_width, new_height))
        
        # Reshapeing image to be a list of pixels
        pixels = img_rgb.reshape((-1, 3))
        
        # Filtering out extreme values (likely shadows/highlights)
        brightness = np.mean(pixels, axis=1)
        mask = (brightness > 20) & (brightness < 235)
        filtered_pixels = pixels[mask]
        
        if len(filtered_pixels) < 5:
            filtered_pixels = pixels
        
        # Used k-means clustering to find dominant colors
        from sklearn.cluster import KMeans
        
        # Finding 5 dominant colors
        kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
        kmeans.fit(filtered_pixels)
        
        dominant_colors = []
        for color in kmeans.cluster_centers_:
            r, g, b = int(color[0]), int(color[1]), int(color[2])
            color_name = get_color_name(r, g, b)
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
            
            dominant_colors.append({
                'name': color_name,
                'rgb': {'r': r, 'g': g, 'b': b},
                'hex': hex_color
            })
        
       
        overall_analysis = []
        for color_info in dominant_colors:
            analysis = get_vastu_recommendation(color_info['name'], direction, room_type)
            overall_analysis.append({
                'color': color_info,
                'analysis': analysis
            })
        
        return jsonify({
            'success': True,
            'dominant_colors': dominant_colors,
            'analysis': overall_analysis,
            'room_type': room_type,
            'direction': direction
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Image analysis failed: {str(e)}'}), 500

@app.route('/analyze_image_with_objects', methods=['POST'])
def analyze_image_with_objects():
    try:
        data = request.json
        filename = data.get('filename')
        direction = data.get('direction', '')
        room_type = data.get('room_type', '')
        if not filename:
            return jsonify({'error': 'Missing filename'}), 400
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(img_path):
            return jsonify({'error': 'Image not found'}), 404
        img = cv2.imread(img_path)
        if img is None:
            return jsonify({'error': 'Failed to read image'}), 500
        
        

        max_dim = 640
        height, width = img.shape[:2]
        if max(height, width) > max_dim:
            scale = max_dim / float(max(height, width))
            img = cv2.resize(img, (int(width * scale), int(height * scale)))

        # Used the preloaded YOLO model with higher confidence threshold(higer confidence threshold helps to reduce chances of wrong detection )
        results = yolo_model(img, conf=0.3)  
        detected_objects = []
        for r in results:
            boxes = r.boxes
            names = r.names if hasattr(r, 'names') else yolo_model.names
            for box in boxes:
                cls_id = int(box.cls[0])
                object_name = names[cls_id] if names and cls_id < len(names) else str(cls_id)
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                object_vastu = get_object_vastu_recommendation(object_name, '', direction)

                #  bounding box and label on image

                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                label = f"{object_name}"
                cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                detected_objects.append({
                    'object': object_name,
                    'object_vastu_guideline': object_vastu,
                    'bbox': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2}
                })
        # Saved the image with boxes to a new file
        boxed_filename = f"boxed_{filename}"
        boxed_path = os.path.join(app.config['UPLOAD_FOLDER'], boxed_filename)
        cv2.imwrite(boxed_path, img)

        # Encoding boxed image to base64 for frontend display
        
        with open(boxed_path, 'rb') as img_file:
            boxed_img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
        boxed_img_data = f"data:image/{boxed_filename.split('.')[-1].lower()};base64,{boxed_img_base64}"
        return jsonify({
            'success': True,
            'detected_objects': detected_objects,
            'boxed_image': boxed_img_data,
            'direction': direction,
            'room_type': room_type
        }), 200
    except Exception as e:
        return jsonify({'error': f'Object detection and analysis failed: {str(e)}'}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Vastu Color and Object Detection API...")
    print("Available endpoints:")
    print("  POST /upload - Upload image")
    print("  POST /detect_color - Detect color at coordinates")
    print("  POST /analyze_image - Analyze dominant colors")
    print("  POST /analyze_image_with_objects - Analyze image with object detection")
    print("  GET /uploads/<filename> - Serve uploaded files")
    
    app.run(debug=True, host='0.0.0.0', port=5000)