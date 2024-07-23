import React, {useEffect, useState} from "react";
import axios from "axios";
import {dfs_xy_conv} from "../utils/transferLocation";

export const Context = React.createContext();

export const WeatherProvider = ({ children }) => {
  // ** state
  const [isRainy, setIsRainy] = useState(false);
  const [temp, setTemp] = useState(null);
  const newDate = new Date();

  // ** varibales
  const WeatherModule = (() => {
    const API_KEY = process.env.REACT_APP_KMA_KEY;

    // 시간 데이터 설정
    const today = () => {
      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const date = newDate.getDate();

      return `${year}${String(month).padStart(2,'0')}${String(date).padStart(2,'0')}`
    }
    // 기상청 자료 매시 40분에 업데이트, 40분 전에는 이전시간으로 나오도록
    const nowTime = () =>{
      return newDate.getMinutes() < 40
          ? (newDate.getHours() - 1).toString().padStart(2, '0') + '00'
          : (newDate.getHours()).toString().padStart(2, '0') + '00';
    }

    // 기상청 현재 지역 날씨 가져오는 API
    const getWeather = async (x, y, today, nowTime) => {
      const todayDate = today();
      const time = nowTime();
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${todayDate}&base_time=${time}&nx=${x}&ny=${y}`;

      try {
        const response = await axios.get(url, { responseType: 'json' });
        switch(response.data.response.header.resultCode){
          case '00':
            return response.data.response.body.items.item;
          default:
            alert('현재 기상청 서비스에 문제가 있습니다.\n잠시 후 다시 이용해주세요.') // server error (기상청)
        }
      } catch(error){
        alert('기상청 데이터 연결에 실패하였습니다.\n잠시 후 다시 이용해주세요.');
      }
    }

    // 현재 지역 가져오기
    const getCurrentLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude: lat, longitude: lon } = position.coords;
        const { x: latX, y: lonY } = dfs_xy_conv("toXY", lat, lon);
        const weatherData = await getWeather(latX, lonY, today, nowTime);
        return weatherData;
      } catch (tempData) {
        const { x: latX, y: lonY } = dfs_xy_conv("toXY", 37.5664056, 126.9778222);
        const weatherData = await getWeather(latX, lonY, today, nowTime)
        return weatherData;
      }
    };
    return getCurrentLocation
  })();

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
      const nowHour = new Date().getHours();
      const lastHour = new Date(lastFetchTime).getHours();

      if(nowHour > lastHour){
        fetchWeather();
      }else {
        setWeather(JSON.parse(storedData));
      }
    }else {
      fetchWeather();
    }
  }, []);

  return (
      <Context.Provider value={{ isRainy, temp }}>
        {children}
      </Context.Provider>
  );
};