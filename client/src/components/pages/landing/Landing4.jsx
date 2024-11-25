import React from "react";
import styled from "styled-components";

// 컴포넌트
const Card = ({ src, title, description }) => {
  return (
    <CardItem>
      <ImageContainer>
        <img src={`/icons/${src}`} />
      </ImageContainer>
      <CardTitle>{title}</CardTitle>
      <CardDesc>{description}</CardDesc>
    </CardItem>
  );
};
export const Landing4 = () => {
  const cardData = [
    {
      src: "landing4-icon1.png",
      title: "아이 소비 계획",
      description:
        "아이의 월간 소비 및 계획을 한눈에 보고 피드백을 해주세요.  ",
    },
    {
      src: "landing4-icon2.png",
      title: "경제 교육 성취도",
      description: "아이의 소비계획을 확인하고 용돈을 지급해주세요.",
    },
    {
      src: "landing4-icon3.png",
      title: "금융 생활 가이드",
      description: "아이의 저축 현황과 원하는 물건 리스트를 확인 할 수 있어요.",
    },
  ];

  return (
    <Outer>
      <Content>
        <Title>
          미리 준비하는
          <br /> 우리 아이 <span>라이프 플랜</span>
        </Title>
        <SubTitle>
          우리 아이의 소비계획 달성률과 경제교육 성취도 등을 분석하여
          <br />
          <span>올바른 금융 생활</span>을 가이드합니다.
        </SubTitle>
        <CardSection>
          {cardData.map((card, index) => (
            <Card
              key={index}
              src={card.src}
              title={card.title}
              description={card.description}
            />
          ))}
        </CardSection>
      </Content>
    </Outer>
  );
};

const Outer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  scroll-snap-align: start; /* 섹션 시작 지점에서 스크롤 정지 */
  background-color: white;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-bottom: 50px;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
  font-weight: bold;

  span {
    color: #8529fd;
  }
`;
const SubTitle = styled.div`
  font-size: 24px;
  margin-bottom: 50px;

  span {
    color: #fd9827;
  }
`;

const CardSection = styled.div`
  display: flex;
  gap: 40px;
`;
const CardItem = styled.div`
  border: 1px solid #3d3d3d;
  border-radius: 20px;
  overflow: hidden;
  width: 280px;
  height: 350px;
  padding: 20px;
`;
const ImageContainer = styled.div`
  /* width: 80%; */
  height: 64%;
  margin: 0 auto 20px auto;

  img {
    width: 100%;
    height: 100%;
  }
`;

const CardTitle = styled.div`
  font-size: 22px;
`;
const CardDesc = styled.div`
  font-size: 18px;
  font-family: "HakgyoansimDunggeunmisoTTF-R";
`;
