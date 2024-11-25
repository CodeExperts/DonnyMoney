import React, { useState } from "react";
import styled from "styled-components";
import { WishItemCard } from "../../components/commons/WishItemCard";
import SelectOptionNav from "../../components/pages/parent/SelectOptionNav";
import { wishlistDummyData } from "../../data/wishlistDummyData";

// 위시리스트 보기
const WishListPage = () => {
  const [selectOption, setSelectOption] = useState({
    childNum: 1,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [selectChild, setSelectChild] = useState(null);

  const handleChildData = (updateData) => {
    console.log("data : ", updateData.childNum);
    setSelectChild(updateData.childNum);
  };

  return (
    <Outer>
      <Title>우리 아이 위시리스트</Title>
      <SelectOptionNav
        hasDateSelectOption={false}
        childrenCenter={true}
        selectAllChildren={true}
        onHandleData={handleChildData}
      />

      <ListContainer>
        {(selectChild === null
          ? wishlistDummyData
          : wishlistDummyData.filter((item) => item.childNum === selectChild)
        ).map((item) => (
          <WishItemCard
            key={item.itemName}
            childNum={item.childNum}
            imgSrc={item.imgSrc}
            itemName={item.itemName}
            itemPrice={item.itemPrice}
            progressRate={item.progressRate}
            // cardWidth={"200px"}
            // cardBgColor={"#FFD25C"}
            cardWidth={"260px"}
            cardHeight={"350px"}
            cardBgColor={item.childNum === 1 ? "#9774FB" : "#FEBA6F"}
            cardFontColor={item.childNum === 1 && "#ffffff"}
            cardPadding={"25px"}
          />
        ))}
      </ListContainer>
    </Outer>
  );
};

const Outer = styled.div`
  padding: 20px;
  /* border: 1px solid red; */
`;
export const ListContainer = styled.div`
  margin: 50px auto 0 auto;
  width: 80%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
  row-gap: 50px;
`;
const Title = styled.div`
  font-size: 48px;
  text-align: center;
  margin-bottom: 50px;
`;

export default WishListPage;
