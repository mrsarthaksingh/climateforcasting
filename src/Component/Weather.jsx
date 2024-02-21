import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTint } from '@fortawesome/free-solid-svg-icons';
import './weather.css';

const Weather = () => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey =  'd2d596d11b3a9dadf04ca1821eee4c9b';
  const addCity = () => {
    setCities([...cities, '']);
  };

  const removeCity = index => {
    const updatedCities = [...cities];
    updatedCities.splice(index, 1);
    setCities(updatedCities);
  };

  const handleInputChange = (index, event) => {
    const updatedCities = [...cities];
    updatedCities[index] = event.target.value;
    setCities(updatedCities);
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    const promises = cities.map(city =>
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    );
    try {
      const responses = await Promise.all(promises);
      const data = responses.map(response => response.data);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cities.length > 0) {
      fetchWeatherData();
    }
  }, [cities, apiKey]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
            .then(response => {
              setWeatherData([response.data]);
            })
            .catch(error => {
              console.error('Error fetching weather data:', error);
            });
        },
        error => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [apiKey]);

  const convertKelvinToCelsius = kelvin => {
    return (kelvin - 273.15).toFixed(1); // Convert Kelvin to Celsius and round to 1 decimal place
  };

  return (
    <div className="weather-container">
      <div className="input-container">
        {cities.map((city, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={event => handleInputChange(index, event)}
            />
            <button onClick={() => removeCity(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addCity}>Add City</button>
      </div>
      <div className="weather-data">
        {loading ? (
          <p>Loading...</p>
        ) : (
          weatherData.length > 0 ? (
            weatherData.map((data, index) => (
              <div key={index}>
                <h2>{data.name}</h2>
                <div className="weather-icon">
                  <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather Icon" />
                </div>
                <p><FontAwesomeIcon icon={faThermometerHalf} /> Temperature: {convertKelvinToCelsius(data.main.temp)} °C</p>
                <p>Description: {data.weather[0].description}</p>
                <p><FontAwesomeIcon icon={faTint} /> Humidity: {data.main.humidity}%</p>
              </div>
            ))
          ) : (
            <p>No weather data available</p>
          )
        )}
      </div>
    </div>
  );
};

export default Weather;
