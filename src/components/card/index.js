import {useContext, useState} from "react";
import classNames from "classnames/bind";
import {WeatherContext} from "../../store/context";

const Card = ({name, description, imgSrc, isOpen}) => {
  const {isRainy} = useContext(WeatherContext)
  const [cardOpend, setCardOpened] = useState(isOpen);

  return(
      <div className="card-area" onClick={() => setCardOpened(!cardOpend)}>
        <div className={classNames("card", {"rotated": cardOpend})}>
          <div className="card-cont card-back">
            <img src={require(`../../assets/images/home/food-card-back${isRainy ? "_rainy" : ""}.jpg`)} className="-image" alt="카드 배경이미지"/>
          </div>
          <div className="card-cont card-front">
            <div className="img-box">
              <img src={require(`../../assets/images/foods/${imgSrc}.jpg`)} className="-image" alt="음식 이미지"/>
            </div>
            <div className="cont-box">
              <p className="dsc">{description}</p>
              <p className="name -font-st">{name}</p>
            </div>
            <div className="button-box">
              <button type={"button"}>근처 맛집검색</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Card;