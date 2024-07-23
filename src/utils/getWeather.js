import axios from "axios";

const newDate = new Date();
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
const dfs_xy_conv = (code, v1, v2) => {

  // LCC DFS 좌표변환을 위한 기초 자료
  let RE = 6371.00877; // 지구 반경(km)
  let GRID = 5.0; // 격자 간격(km)
  let SLAT1 = 30.0; // 투영 위도1(degree)
  let SLAT2 = 60.0; // 투영 위도2(degree)
  let OLON = 126.0; // 기준점 경도(degree)
  let OLAT = 38.0; // 기준점 위도(degree)
  let XO = 43; // 기준점 X좌표(GRID)
  let YO = 136; // 기1준점 Y좌표(GRID)

  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  const sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5));
  const sf = Math.pow(Math.tan(Math.PI * 0.25 + slat1 * 0.5), sn) * Math.cos(slat1) / sn;
  const ro = re * sf / Math.pow(Math.tan(Math.PI * 0.25 + olat * 0.5), sn);
  const rs = {};

  if (code === "toXY") {
    rs['lat'] = v1;
    rs['lng'] = v2;

    const ra = re * sf / Math.pow(Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5), sn);
    let theta = v2 * DEGRAD - olon;
    theta = (theta > Math.PI) ? theta - 2.0 * Math.PI : (theta < -Math.PI) ? theta + 2.0 * Math.PI : theta;
    theta *= sn;

    rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs['x'] = v1;
    rs['y'] = v2;

    const xn = v1 - XO;
    const yn = ro - v2 + YO;
    let ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) ra *= -1;

    let alat = 2.0 * Math.atan(Math.pow((re * sf / ra), (1.0 / sn))) - Math.PI * 0.5;
    let theta = (Math.abs(xn) <= 0.0) ? 0.0 : (Math.abs(yn) <= 0.0) ? Math.PI * 0.5 * ((xn < 0.0) ? -1 : 1) : Math.atan2(xn, yn);
    let alon = theta / sn + olon;

    rs['lat'] = alat * RADDEG;
    rs['lng'] = alon * RADDEG;
  }
  return rs;
}

export const WeatherModule = (() => {
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