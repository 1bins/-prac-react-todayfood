import {useEffect, useState} from "react";
import Button from "../../components/button";
import {disableScroll, enableScroll} from "../../utils/scrollEvent";

const Intro = () => {
  // ** state
  const [visited, setVisited] = useState(() => {  // useState안에 함수를 바로 작성 가능
    const visitedData = localStorage.getItem('visited');
    return visitedData ? visitedData : false;
  });

  // ** variables
  const handleIntroHide = () => {
    setVisited(true);
    enableScroll();
    localStorage.setItem('visited', JSON.stringify(true));
  }

  useEffect(() => {
    if(visited === false){
      disableScroll();
    }
  }, [visited]);

  return(
      <>
        {
          !visited &&
          <section id="intro">
            <div className="intro-inner">
              <div className="intro-cont-box">
                <h3 className="-font-st">오늘<br/>뭐먹지?</h3>
                <p className="cont">오늘 날씨와 함께 음식 추천 받아보기!<span>* 매 시간 정각 기준의 데이터를 기준으로 반영됩니다.</span></p>
                <Button onClick={handleIntroHide}>음식 추천받기!</Button>
              </div>
            </div>
          </section>
        }
      </>
  )
}

export default Intro;