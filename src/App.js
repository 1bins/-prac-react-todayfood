import './assets/scss/style.scss'
import Router from "./router";
import {WeatherProvider} from "./store/context";

const App = () => {
  return (
      <WeatherProvider>
        <Router />
      </WeatherProvider>
  );
}
export default App;
