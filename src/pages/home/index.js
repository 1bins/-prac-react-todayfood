import Intro from "../intro";
import {useContext, useMemo, useState} from "react";
import {foods} from "../../database/foods";
import Card from "../../components/card";
import {WeatherContext} from "../../store/context";

const Home = () => {
  // ** state
  const [opendCard, setOpendCard] = useState(0);
  const {isRainy, temp} = useContext(WeatherContext);

  const filteredFoods = useMemo(() => {
    const foodList =  foods.filter(food => food.isRainy === isRainy);

    let shuffledArray = foodList.slice(); // 원본 배열을 복사
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // 배열 요소 교환
    }
    return shuffledArray;
  }, [isRainy])

  return(
      <>
        <Intro/>
        <section id="home">
          <div className="home-inner">
            <section id="hero">
              <div className="hero-inner">
                <h3 className="-font-st">오늘의음식</h3>
                <div className="hero-cont-box">
                  <p className="dsc">{isRainy ? "현재 비가 오고있어요ㅠㅠ" : "현재 해가 쨍쨍 맑은날씨네요!"}</p>
                  <div className="temp-box">
                    <p className="temp">{temp}</p>
                    <p className="temp-type">°C</p>
                  </div>
                </div>
                <div className="hero-img-box">
                  <img src={require(`../../assets/images/home/hero-${isRainy ? "rainy" : "sunny"}.png`)} className="-image" alt="히어로 영역 배경이미지"/>
                </div>
                <div className="hero-card-dsc-box">
                  <p className="cont">카드를 <b className="-key-color">뒤집으면</b><br/>현재 날씨에 맞는 추천메뉴가 나와요</p>
                </div>
              </div>
            </section>
          </div>
        </section>
        <section id="card">
          <h3 className="-offscreen">카드 영역</h3>
          <div className="card-inner">
            {filteredFoods.map(food => {
              return <Card id={food.id}
                           name={food.name}
                           imgSrc={food.imgSrc}
                           description={food.description}
                           isOpen={food.isOpen}
                           opendCard={opendCard}
                           key={food.id}
                     />
            })}
          </div>
        </section>
      </>
  )
}

export default Home;