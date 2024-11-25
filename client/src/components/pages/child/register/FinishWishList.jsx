import React from "react";
import styled from "styled-components";
import { ListContainer } from "../../../../pages/parent/WishListPage";
import { WishItemCard } from "../../../commons/WishItemCard";
import { wishFinishListDummyData } from "../../../../data/wishFinishListDummyData";

// 성공한 위시 페이지
export const FinishWishList = () => {
  // console.log("FinishWishList : ", wishFinishListDummyData);

  return (
    <Outer>
      <Title>성공한 위시 🥳</Title>

      <ListContainer>
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
      </ListContainer>
    </Outer>
  );
};

const Outer = styled.div`
  width: 100%;
  margin-top: 100px;
  margin-bottom: 80px;

  /* border: 1px solid red; */
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
  /* bottom: 0; */
  right: -10px;
  /* width: 35%; */
  /* transform: translate(-50%, -50%); */
  img {
    width: 100%;
    height: 100%;
  }
`;
