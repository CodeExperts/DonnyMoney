import React from "react";
import styled from "styled-components";

export const Landing1 = () => {
  return (
    <Outer>
      <LeftContainer>
        <img src="images/coin-1.svg" className="coin1" alt="Large Coin" />
        <img src="images/coin-2.svg" className="coin2" alt="Small Left Coin" />
        <img src="images/coin-3.svg" className="coin3" alt="Small Right Coin" />
        <img
          src="images/stockCoin1.png"
          className="stockCoin1"
          alt="Bottom Coin"
        />
        {/* <img src="images/stockCoin2.png" class = "stockCoin2"/> */}
        <img src="images/final_Donny.png" className="Donny" />
      </LeftContainer>

      <RightContainer>
        <SliderWrapper>
          <Slider>
            {/* &#91; &#93;  */}
            <div>
              <div>금융이</div>
            </div>
            <div>
              <div>투자가</div>
            </div>
            <div>
              <div>돈이</div>
            </div>
          </Slider>
          <Word>뭐니?</Word>
        </SliderWrapper>

        <h1>
          {/* <span style={{ color: "#fd9827" }}>도니머니</span>가 알려줄게!! */}
          {/* <span style={{ color: "#FD6A18" }}>도니머니</span>가 알려줄게!! */}
          <span style={{ color: "#FFFFE0" }}>도니머니</span>가 알려줄게!!
        </h1>
        <Description>아이의 입장에서 경제를 바라봅니다</Description>
        <Description>경제를 알아야 세상을 읽을 수 있습니다</Description>
        <Description>아이에게 세상을 이끌 힘을 길러주세요</Description>
      </RightContainer>
    </Outer>
  );
};
const Outer = styled.div`
  /* border: 3px solid red; */
  width: 100%;
  height: 100%;
  scroll-snap-align: start; /* 섹션 시작 지점에서 스크롤 정지 */

  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #8529fd; */
  /* background-color: #9068dc; // */
  background-color: #bea9ed; //
`;

const LeftContainer = styled.div`
  /* width: 60%; */
  width: 50%;
  height: 100%;
  flex-direction: column;
  text-align: center;
  position: relative;

  .Donny {
    width: 300px;
    position: absolute;
    left: 400px;
    top: 250px;
    z-index: 0;
  }

  .stockCoin2 {
    position: absolute;
    width: 500px;
    top: 180px;
    left: 300px;
    z-index: 1;
  }
  .stockCoin1 {
    position: absolute;
    width: 800px;
    bottom: 90px;
    left: 150px;
    z-index: 0;
  }
  .coin1 {
    // 큰 코인
    position: absolute;
    left: 100px;
    top: 20px;
    animation: mainbounce 1.2s alternate infinite;
    animation-delay: 0.3s;
    z-index: 1;
  }
  .coin2 {
    position: absolute;
    right: 200px;
    top: 100px;
    animation: mainbounce 1.2s alternate infinite;
    animation-delay: 0.3s;
    z-index: 1;
  }
  .coin3 {
    position: absolute;
    left: 200px;
    top: 200px;
    animation: mainbounce 1.2s alternate infinite;
    animation-delay: 0.3s;
    z-index: 1;
  }

  @keyframes mainbounce {
    0% {
      -webkit-transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(15px);
    }
  }
`;

const RightContainer = styled.div`
  width: 40%;
  /* border: 3px solid blue; */
  align-items: center;
  /* color: white; */
  color: black;
  position: relative;

  h1 {
    font-size: 50px;
    margin-bottom: 14px;
  }
`;

const SliderWrapper = styled.div`
  /* color: #999; */
  text-transform: uppercase;
  /* font-size: 36px; */
  font-size: 38px;
  font-weight: bold;
  /* padding-top:200px;   */
  position: absolute;
  width: 100%;
  /* bottom:45%; */
  top: -70px;
  display: block;
`;

const Word = styled.div`
  position: absolute;

  left: 130px;
  top: 0%;
`;

const Description = styled.h5`
  font-size: 24px;
  font-family: "HakgyoansimDunggeunmisoTTF-R";
`;

const Slider = styled.div`
  height: 50px;
  overflow: hidden;
  /* border: 1px solid red; */

  div > div {
    color: #fff;
    /* padding:4px 12px; */
    height: 45px;
    margin-bottom: 45px;
    display: inline-block;

    width: 120px;
    text-align: center;
  }

  div:first-child {
    animation: show 10s linear infinite;
  }

  div div {
    /* color: #42c58a; */
    /* color: #00ced1; */
    /* color: #ff69b4; */
    color: #fd6a18;
  }
  div:first-child div {
    color: #3eb489;
  }
  div:last-child div {
    color: #ffd700;
  }

  @keyframes show {
    0% {
      margin-top: -270px;
    }
    5% {
      margin-top: -180px;
    }
    33% {
      margin-top: -180px;
    }
    38% {
      margin-top: -90px;
    }
    66% {
      margin-top: -90px;
    }
    71% {
      margin-top: 0px;
    }
    99.99% {
      margin-top: 0px;
    }
    100% {
      margin-top: -270px;
    }
  }
`;
