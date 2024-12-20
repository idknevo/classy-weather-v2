import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { convertToFlag } from "./util/helpers";
import Input from "./components/Input";
import Weather from "./components/Weather";

export default function App() {
  const [location, setLocation] = useLocalStorage("", "location");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});

  function handleLocationChange(e) {
    setLocation(e.target.value);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchWeather() {
      if (location.length < 2) return setWeather({});
      try {
        setIsLoading(true);
        setError("");
        // 1. getting location data
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
          { signal: controller.signal }
        );
        const geoData = await geoRes.json();
        if (!geoRes.ok || !geoData.results)
          throw new Error("Location not found!");
        const { name, latitude, longitude, timezone, country_code } =
          geoData.results.at(0);
        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);
        // 2. getting weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        if (!weatherRes.ok) throw new Error("Could not load weather data!");
        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
      } catch (error) {
        if (error.name === "AbortError") return;
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();

    return function () {
      controller.abort();
    };
  }, [location]);

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <Input location={location} onLocationChange={handleLocationChange} />
      {isLoading && !error && <p className="loader">Loading...</p>}
      {error && <p>{error}</p>}
      {weather.weathercode && !error && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}
