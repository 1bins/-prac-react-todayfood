import {useContext, useState} from "react";
import classNames from "classnames/bind";
import {Context} from "../../store/context";
import Button from "../button";
import {useNavigate} from "react-router-dom";

const Card = ({name, description, imgSrc, isOpen}) => {
  // ** state
  const {isRainy} = useContext(Context)
  const [cardOpend, setCardOpened] = useState(isOpen);

  // ** variables
  const navigate = useNavigate();
  const handleButtonClick = (event) => {
    // 이벤트 버블링 방지
    event.stopPropagation();
    window.open(`https://map.kakao.com/link/search/${name}`, '_blank');
  }

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
              <Button onClick={handleButtonClick}>근처 맛집검색</Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Card;