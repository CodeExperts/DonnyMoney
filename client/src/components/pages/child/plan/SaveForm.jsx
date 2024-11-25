import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoughnutChart from "./DoughnutChart";

const SaveForm = () => {
  return (
    <Wapper>
      <Container>
        <Title>내 계획 미리보기</Title>
        <DoughnutChart />
      </Container>
      <DonnyImg
        src={`${process.env.PUBLIC_URL}/images/donny2.png`}
        alt="donny"
      />
    </Wapper>
  );
};

const Wapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  /* margin: -10px 70px 50px 0px; */
`;
const Container = styled.div`
  background-color: white;
  min-height: 80vh;
  /* width: 50vh; */
  width: 100%;
  border-radius: 30px;
  /* border: 5px solid #c8bef3; */
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;

  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h3`
  text-align: center;
  font-weight: bold;
  margin-top: -80px;
`;
const DonnyImg = styled.img`
  width: 10vw;
  margin: 0 0 40px -150px;
`;

export default SaveForm;
