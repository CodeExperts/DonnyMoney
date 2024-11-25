import React from "react";
import styled from "styled-components";

export const Landing2 = () => {
  return (
    <Outer>
      <Content>
        <h1>아이의 경제 교육</h1>
        <h1>
          혹시 이런 <span style={{ color: "#fd9827" }}>고민</span>
          <span>🧐</span> 없으셨나요?
        </h1>

        <ImageContainer>
          <TextImage src="images/worry.png"></TextImage>
          {/* <TextImage src="images/text1.png" alt="text1" />
          <TextImage src="images/text2.png" alt="text2" />
          <TextImage src="images/text3.png" alt="text3" /> */}
        </ImageContainer>
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

  background-color: #ece9f7;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* border: 1px solid blue; */
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const TextImage = styled.img`
  width: 1200px;
  /* width: 600px; 
  height: auto; */
`;

export default Landing2;
