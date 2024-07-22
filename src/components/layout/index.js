import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import classNames from "classnames/bind";
import {WeatherModule} from "../../utils/getWeather";

const Layout = () => {
  const [temp, setTemp] = useState(0);
  const [isRainy, setIsRainy] = useState(false);
  const setWeather = (data) => {
    data.forEach(item => {
      if (item.category === 'T1H') setTemp(item.obsrValue);
      if (item.category === 'PTY') setIsRainy(Number(item.obsrValue) !== 0);
    })
  }

  useEffect(() => {
    WeatherModule()
        .then(response => {
          setWeather(response)
        })
        .catch(response => {
          setWeather(response)
        })
  }, []);

  return(
      <main>
        <div className={classNames('main', {'--rainy': isRainy})}>
          <Outlet />
        </div>
      </main>
  )
}

export default Layout;