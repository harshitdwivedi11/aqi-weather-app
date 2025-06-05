# Weather & AQI Dashboard

A modern web app to view **current weather** and **air quality index (AQI)** for any city or your current location, with live icons, PM2.5 details, and health advice.

## 🚀 Features

- 🌍 **Search by city** or use your current geolocation
- 🌤️ **Weather details:** temperature, feels like, humidity, wind, visibility, and weather condition
- 🖼️ **Live weather icons** from WeatherAPI (day/night aware)
- 🏥 **PM2.5 and AQI prediction** with health category and advice
- 💬 **Responsive UI** built with Next.js and React
- 🐍 **Flask backend** for AQI prediction from PM2.5



## 🏗️ Project Structure

```
/frontend   # Next.js React frontend
/backend    # Flask backend (AQI prediction)
```

---

## ⚡ Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/harshitdwivedi11/aqi-weather-app.git
cd aqi-weather-app.git
```

---

### 2. WeatherAPI Key

- Get a (free) API key from [WeatherAPI.com](https://www.weatherapi.com/).
- In `/frontend`, create a `.env` file:

    ```
    NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
    ```

---

### 3. Run the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

> By default, backend runs at `http://localhost:5000`

---

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

> Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Flask (Python)
- **Weather Data:** [WeatherAPI.com](https://www.weatherapi.com/)
- **AQI Model:** Custom logic or ML model (see `backend/app.py`)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

---

## 🙏 Credits

- Weather icons by [WeatherAPI.com](https://www.weatherapi.com/)
- PM2.5/AQI info: US EPA

---

**Made with ❤️ by Harshit Dwivedi**
