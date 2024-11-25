import React, { useState } from "react";
import styled from "styled-components";

const img = [
  `${process.env.PUBLIC_URL}/images/PlanPageimg.png`,
  `${process.env.PUBLIC_URL}/images/QuizPageimg.png`,
  `${process.env.PUBLIC_URL}/images/WishPageimg.png`,
];

// 상세내용 컴포넌트
const Card = ({ title, text, src }) => {
  return (
    <>
      <SubTitle>{title}</SubTitle>
      <Description>{text}</Description>
      {/* 도니모니 화면 캡쳐 이미지 */}
      <ImageContainer>
        <img src={src} alt="" />
      </ImageContainer>
    </>
  );
};

export const Landing3 = () => {
  const [selectedButton, setSelectedButton] = useState("용돈계획서"); // 선택된 버튼

  const cards = {
    용돈계획서: {
      title: "용돈계획서를 작성하고 관리하세요!",
      text: "아이가 용돈계획서를 스스로 작성하고 실제 소비와 비교해볼 수 있습니다.",
      src: `${process.env.PUBLIC_URL}/images/PlanPageimg.png`,
    },
    경제배우기: {
      title: "경제 개념을 쉽게 배워보세요!",
      text: "경제 용어, 투자, 환율 등 카테고리에 따라 영상과 퀴즈를 통해 쉽게 배워볼 수 있습니다.",
      src: `${process.env.PUBLIC_URL}/images/QuizPageimg.png`,
    },
    내꿈모으기: {
      title: "나의 꿈을 이루기 위한 계획을 세워보세요!",
      text: "위시리스트에 원하는 목표를 올리고, 적금하는 방식을 통해 저축 습관을 길러보세요.",
      src: `${process.env.PUBLIC_URL}/images/WishPageimg.png`,
    },
  };
  return (
    <Outer>
      <Content>
        <Title>
          <div>
            아이들을 위한 쉽고 재미있는 <span>경제 교육 플랫폼</span>
          </div>
          <div>
            <span>도니머니</span>의 장점을 경험하세요!
          </div>
        </Title>

        <ButtonSection>
          {Object.keys(cards).map((buttonLabel) => (
            <CustomButton
              key={buttonLabel}
              className={selectedButton === buttonLabel ? "selected" : ""}
              // isSelected={selectedButton === buttonLabel} // 현재 선택된 버튼
              onClick={() => setSelectedButton(buttonLabel)} // 버튼 클릭 시 상태 업데이트
            >
              {buttonLabel}
            </CustomButton>
          ))}
        </ButtonSection>

        {selectedButton && (
          <Card
            title={cards[selectedButton].title}
            text={cards[selectedButton].text}
            src={cards[selectedButton].src}
          />
        )}
      </Content>
    </Outer>
  );
};

const Outer = styled.div`
  width: 100%;
  height: 100%;
  scroll-snap-align: start; /* 섹션 시작 지점에서 스크롤 정지 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-size: 36px;
  margin-bottom: 24px;
  font-weight: bold;

  div:first-child > span {
    color: #8529fd;
  }

  div:last-child > span {
    color: #fd9827;
  }
`;
const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 800px;
  margin: 0 auto 30px auto;
`;
const CustomButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;

  width: 200px;
  height: 60px;
  border-radius: 30px;
  font-size: 24px;

  /* border: 1px solid gray; */

  &:hover {
    color: white;
    border: 1px solid #8529fd;
    background-color: #8529fd;
  }

  &.selected {
    border: 1px solid #8529fd;
    background-color: #8529fd;
    color: #ffffff;
  }
  /* border: ${(props) =>
    props.isSelected ? "1px solid #8529fd" : "border: 1px solid gray"};
  background-color: ${(props) => (props.isSelected ? "#8529fd" : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#ffffff" : "#808080")}; */
`;

const SubTitle = styled.div`
  font-size: 24px;
`;
const Description = styled.div`
  margin-bottom: 20px;
  font-size: 18px;
  font-family: "HakgyoansimDunggeunmisoTTF-R";
`;

const ImageContainer = styled.div`
  /* border: 1px solid lightgray; */
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 400px;
  background-color: #ffffff;

  img {
    /* width: 100%; */
    height: 95%;
  }
`;
