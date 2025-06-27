# 🏠 AI Powered Harmonious Living – Vastu Compliance Web App

An AI-powered web application that helps users align their living spaces with **Vastu Shastra** by analyzing room images, detecting wall colors using OpenCV, and suggesting appropriate remedies or changes based on direction and color psychology.

---

## 🚀 Features

* 🖼️ Upload room images and select specific areas by clicking
* 🎨 Detect pixel-level wall colors using OpenCV
* 📊 Analyze dominant colors using clustering (K-Means)
* 🧭 Direction-based Vastu suggestions (e.g., North-East, South-West)
* 🧘 Room-type input (Bedroom, Kitchen, etc.) for personalized advice
* 🛠️ Remedy suggestions or color changes if the current color is non-compliant

---

## 🧠 Tech Stack

### 🔹 Frontend

* React.js
* Axios
* HTML5, CSS3

### 🔹 Backend

* Python Flask
* OpenCV
* Scikit-learn (for K-Means clustering)
* NumPy
* Flask-CORS

---

## 📷 How It Works

1. **Image Upload:** User uploads an image of a room wall.
2. **Color Detection:**
   * Click on any point in the image to get the exact RGB/HEX color.
   * OR analyze the **dominant color** using clustering.
3. **Vastu Processing:**
   * Select direction (e.g., North-East) and room type.
   * Based on detected color, fetch Vastu-compliant suggestions.
4. **Output:**
   * Shows Vastu alignment status.
   * Recommends remedies or better color options.

---

## 🔄 API Endpoints (Flask)

| Method | Endpoint                      | Description                                      |
|--------|-------------------------------|--------------------------------------------------|
| POST   | `/upload`                     | Uploads the image                                |
| POST   | `/detect_color`               | Returns color at selected pixel (x, y)           |
| POST   | `/analyze_image`              | Returns dominant colors from image               |
| POST   | `/analyze_image_with_objects` | Returns object detection + Vastu analysis        |
| GET    | `/uploads/<filename>`         | Serves uploaded files                            |

---

## 📁 Project Structure

```
AI-POWERED-HARMONIOUS-LIVING-PROJECT/
├── Backend/
│   ├── app.py
│   ├── colors.csv
│   ├── yolov8l.pt
│   └── uploads/
├── Frontend/
│   └── vastu-frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Hero.jsx
│       │   │   ├── AIColorDetection.jsx
│       │   │   ├── VastuGuideLines.jsx
│       │   │   ├── ColorGuideVastu.jsx
│       │   │   └── Header.jsx
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   ├── App.css
│       │   └── index.css
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── eslint.config.js
└── README.md
```

---

## 📌 To Run the Project

### ⚙️ Backend (Flask)

```bash
cd Backend
pip install -r requirements.txt
python app.py
```

### 🌐 Frontend (React)

```bash
cd Frontend/vastu-frontend
npm install
npm run dev
```

> Make sure both the backend and frontend are running on different ports (e.g., Flask: 5000, React: 5173)

---

## 🧪 Sample Use Case

> “A user uploads a photo of their bedroom wall facing East. The app detects a red color and warns that it's not Vastu-compliant for the East direction. It then suggests switching to green or white and offers spiritual remedies.”

---
![Screenshot 2025-06-24 180202](https://github.com/user-attachments/assets/f16da47a-5bb8-476d-8f26-5bc141a09c24)



## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---


