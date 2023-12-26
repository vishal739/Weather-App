import './App.css';
import Search from './components/search/Search';
import CurrentWeather from './components/current-weather/CurrentWeather';
import { WEATHER_API_KEY, WEATHER_API_URL } from './components/api';
import { useState, useEffect } from 'react';
import Forecast from './components/forecast/Forecast';

function App() {

  const lastSearchedCity = localStorage.getItem('lastSearchedCity') || 'Kolkata, IN';
  const lastSearchedLocation = localStorage.getItem('lastSearchedLocation') || '22.5726723 88.3638815';

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);

  useEffect(() => {
    // Fetch weather data for the last searched city
    handleOnSearchChange({ label: lastSearchedCity, value: lastSearchedLocation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSearchChange = (searchData) => {
    console.log(searchData);
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    const weatherForecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    localStorage.setItem('lastSearchedCity', searchData.label);
    localStorage.setItem('lastSearchedLocation', searchData.value);

    Promise.all([currentWeatherFetch, weatherForecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecastWeather({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  }

  console.log(currentWeather);
  console.log(forecastWeather);
  return (
    <div className="Container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecastWeather && <Forecast data={forecastWeather}/>}
    </div>
  );
}

export default App;
