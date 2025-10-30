import React, { useState } from "react";
import "./App.css";
import { getCoordinates, getWeatherData } from "./api/weatherService";

/**
 * Weather Now App
 * Allows users to check current weather conditions for any city.
 */
function App() {
  // App state
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Map Open-Meteo weather codes to
   * emoji icons, human-readable descriptions, and gradient backgrounds.
   */
  const getWeatherDetails = (code) => {
    if (code === 0) return { icon: "☀️", desc: "Clear Sky", bg: "sunny" };
    if ([1, 2, 3].includes(code))
      return { icon: "🌤", desc: "Partly Cloudy", bg: "cloudy" };
    if ([45, 48].includes(code))
      return { icon: "🌫", desc: "Foggy", bg: "fog" };
    if (code >= 51 && code <= 67)
      return { icon: "🌧", desc: "Rainy", bg: "rain" };
    if (code >= 71 && code <= 77)
      return { icon: "❄️", desc: "Snowy", bg: "snow" };
    if (code >= 80 && code <= 82)
      return { icon: "🌦", desc: "Rain Showers", bg: "rain" };
    if (code >= 95 && code <= 99)
      return { icon: "⛈", desc: "Thunderstorm", bg: "storm" };
    return { icon: "🌍", desc: "Unknown", bg: "default" };
  };

  /**
   * Fetch weather data based on city input.
   * Includes robust error handling and user feedback.
   */
  const handleGetWeather = async () => {
  if (!city.trim()) {
    setError("Please enter a city name.");
    setWeather(null); // clear previous weather result if any
    return;
  }

  setError("");
  setWeather(null); // clear previous data before new fetch
  setLoading(true);

  try {
    // Step 1: Get coordinates
    const { latitude, longitude, name, country } = await getCoordinates(city);

    // Step 2: Get weather data
    const current = await getWeatherData(latitude, longitude);

    // Step 3: Map weather code to visuals
    const details = getWeatherDetails(current.weathercode);

    // Step 4: Update state
    setWeather({
      city: name,
      country,
      temperature: current.temperature,
      windspeed: current.windspeed,
      description: details.desc,
      icon: details.icon,
      bg: details.bg,
    });
  } catch (err) {
    // Clear weather and background on error
    setWeather(null);

    if (err.response) {
      setError("Weather service temporarily unavailable.");
    } else if (err.message.includes("City not found")) {
      setError("City not found. Please try another name.");
    } else {
      setError("Network error. Please check your connection.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`container ${weather ? weather.bg : "default"}`}>
      <h1 className="title">🌤 Weather Now</h1>

      <div className="card">
        {/* City Input */}
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />

        {/* Search Button */}
        <button onClick={handleGetWeather} className="button" disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>

        {/* Error Display */}
        {error && <p className="error">{error}</p>}

        {/* Weather Result */}
        {weather && (
          <div className="result">
            <h2>
              {weather.icon} {weather.city}, {weather.country}
            </h2>
            <p>{weather.description}</p>
            <p>🌡 Temperature: {weather.temperature}°C</p>
            <p>💨 Wind Speed: {weather.windspeed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
