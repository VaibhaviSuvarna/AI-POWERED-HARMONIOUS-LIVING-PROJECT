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
    
    recommendation = {
        'color_analysis': f"Detected color: {color_name}",
        'direction_suitability': '',
        'room_suitability': '',
        'overall_recommendation': '',
        'tips': []
    }
    
    # Checking direction suitability
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
    
    # Checking room suitability
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
    
    # Adding general tips
    recommendation['tips'] = [
        "Use lighter shades for smaller rooms to create spaciousness",
        "Combine colors thoughtfully - avoid conflicting elements",
        "Natural light enhances color energy - ensure good lighting",
        "Consider the psychological impact of colors on mood"
    ]
    
    return recommendation

@app.route('/')
def home():
    return jsonify({'message': 'Flask Vastu Color Detection API is running!', 'status': 'active'})

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
        
        # Getting color name
        color_name = get_color_name(r, g, b)
        
        # Get Vastu recommendation
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
    print("Starting Vastu Color Detection API...")
    print("Available endpoints:")
    print("  POST /upload - Upload image")
    print("  POST /detect_color - Detect color at coordinates")
    print("  POST /analyze_image - Analyze dominant colors")
    print("  GET /uploads/<filename> - Serve uploaded files")
    
    app.run(debug=True, host='0.0.0.0', port=5000)