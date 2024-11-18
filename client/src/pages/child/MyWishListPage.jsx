import React, { useRef, useState } from "react";
import styled from "styled-components";
import Activewish from "../../components/pages/child/wish/Activewish";

const MyWishListPage = () => {
  return (
    <>
      <Title>나의 꿈창고</Title>
      <Activewish />
    </>
  );
};
const Title = styled.h3`
  color: black;
  text-align: center;
  padding-top: 50px;
  font-weight: bold;
`;
export default MyWishListPage;
