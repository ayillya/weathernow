import axios from "axios";

/**
 * Fetch coordinates for a given city name
 * using the Open-Meteo Geocoding API.
 */
export const getCoordinates = async (city) => {
  const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}`;
  const response = await axios.get(geoURL);

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country } = response.data.results[0];
  return { latitude, longitude, name, country };
};

/**
 * Fetch current weather using coordinates
 * from Open-Meteo Weather API.
 */
export const getWeatherData = async (latitude, longitude) => {
  const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await axios.get(weatherURL);

  if (!response.data.current_weather) {
    throw new Error("Weather data unavailable");
  }

  return response.data.current_weather;
};
