import React from "react";
import styled from "styled-components";
import { ListContainer } from "../../../../pages/parent/WishListPage";
import { WishItemCard } from "../../../commons/WishItemCard";
import { wishFinishListDummyData } from "../../../../data/wishFinishListDummyData";

// 성공한 위시 페이지
export const FinishWishList = () => {
  const generateRandomPosition = () => {
    // 랜덤 위치 값 생성 (예: 트리 이미지의 80% 안쪽 범위)
    const top = Math.random() * 50 + "%"; // 0% ~ 80%
    const left = Math.random() * 80 + "%"; // 0% ~ 80%
    return { top, left };
  };

  return (
    <Outer>
      <Title>완성된 나의 위시 열매 🍎</Title>

      {/* <ListContainer>
        {wishFinishListDummyData.map((item, index) => (
          <ItemContainer>
            <Icon>
              <img src="/icons/celebrate5.png" alt="" />
            </Icon>
            <WishItemCard
              key={index}
              imgSrc={item.imgSrc}
              itemName={item.itemName}
              itemPrice={item.itemPrice}
              progressRate={item.progressRate}
              cardWidth={"260px"}
              cardHeight={"350px"}
              cardPadding={"25px"}
              // cardBgColor={"#C0A9EF"}
              cardBgColor={"#9068DC"}
              cardFontColor={"#ffffff"}
              isExpired={true}
            />
          </ItemContainer>
        ))}
      </ListContainer> */}

      <FinishContainer>
        <Tree>
          <img src="/images/tree.png" alt="" />

          {wishFinishListDummyData.map((item, index) => {
            const position = generateRandomPosition();
            return (
              <Apple
                // key={index}
                style={{
                  top: position.top,
                  left: position.left,
                }}
              >
                <img src={item.imgSrc} alt="" />
              </Apple>
            );
          })}
        </Tree>
      </FinishContainer>
    </Outer>
  );
};

const Outer = styled.div`
  width: 100%;
  margin-top: 100px;
  margin-bottom: 80px;
`;
const Title = styled.div`
  font-size: 32px;
  text-align: center;
`;

const ItemContainer = styled.div`
  position: relative;
`;
const Icon = styled.div`
  position: absolute;
  z-index: 1;
  right: -10px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const FinishContainer = styled.div`
  width: 80%;
  margin: 30px auto 0 auto;
  background-color: white;
  border-radius: 25px;
  background: linear-gradient(to top, #5fa109 20%, #91d9f5 20%);
`;
const Tree = styled.div`
  margin: 0 auto;
  width: 55%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }
`;

const Apple = styled.div`
  position: absolute;
  width: 90px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;

  background-image: url("/images/apple.png");
  background-size: cover;
  background-repeat: no-repeat;

  img {
    width: 75%;
    height: 75%;
    border-radius: 50%;
    border: 2px solid white;
  }
`;
