import React, {useEffect, useState} from "react";
import {WeatherModule} from "../utils/getWeather";

export const WeatherContext = React.createContext();

export const WeatherProvider = ({ children }) => {
  const [isRainy, setIsRainy] = useState(false);
  const [temp, setTemp] = useState(null);

  const setWeather = (data) => {
    data.forEach(item => {
      if (item.category === 'T1H') setTemp(item.obsrValue);
      if (item.category === 'PTY') setIsRainy(Number(item.obsrValue) !== 0);
    });

    localStorage.setItem('weatherData', JSON.stringify(data));
    localStorage.setItem('timeData', new Date().toISOString())
  };

  const fetchWeather = () => {
    WeatherModule()
        .then(response => {
          setWeather(response);
        })
        .catch(response => {
          setWeather(response);
        });
  }

  useEffect(() => {
    const storedData = localStorage.getItem('weatherData');
    const lastFetchTime = localStorage.getItem('timeData');

    if(storedData && lastFetchTime){
      const lastHour = new Date(lastFetchTime).getHours();

      if(new Date().getHours() > lastHour){
        fetchWeather();
      }else {
        setWeather(JSON.parse(storedData));
      }
    }else {
      fetchWeather();
    }
  }, []);

  return (
      <WeatherContext.Provider value={{ isRainy, temp }}>
        {children}
      </WeatherContext.Provider>
  );
};