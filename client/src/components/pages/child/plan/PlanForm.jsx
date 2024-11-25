import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PlanContext } from "../../../../pages/context/MoneyPlanContext";
import { AuthContext } from "../../../../App";
import api from "../../../../services/api";

const PlanForm = () => {
  const { plan, setPlan } = useContext(PlanContext);
  const { authorization } = useContext(AuthContext); // AuthContext에서 토큰 가져오기
  const [isupdate, setUPdate] = useState(false); // 기타버튼 누르기
  const [isVisible, setIsVisible] = useState(true); //기타버튼 보이기
  const [formData, setFormData] = useState({
    food: plan.food,
    cvs: plan.cvs,
    shopping: plan.shopping,
    transport: plan.transport,
    saving: plan.saving,
    others: {
      name: plan.others?.name,
      value: plan.others?.value,
    },
  });

  const token = authorization;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // 초기값을 API에서 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: `api/children/show/plans?year=${currentYear}&month=${currentMonth}`,
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        console.log("Initial API Response:", response.data);

        // 가져온 데이터를 PlanContext와 formData에 설정
        const planData = response.data;

        setFormData({
          food: planData.food || 0,
          cvs: planData.cvs || 0,
          shopping: planData.shopping || 0,
          transport: planData.transport || 0,
          saving: planData.saving || 0,
          others: {
            name: planData.saving.name, // 이름 필드
            value: planData.saving.value, // 값 필드
          },
        });
      } catch (error) {
        console.error(
          "Error fetching initial data:",
          error.response || error.message
        );
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const numericValue = value.replace(/[^0-9]/g, ""); // 숫자만 추출
    setFormData((prevData) => {
      if (dataset.type === "name") {
        return {
          ...prevData,
          [name]: {
            ...(prevData[name] || { value: 0 }), // 기본값 설정
            name: value,
          },
        };
      } else if (dataset.type === "value") {
        return {
          ...prevData,
          [name]: {
            ...(prevData[name] || { name: "" }), // 기본값 설정
            value: numericValue,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: numericValue, // 일반 필드 업데이트
        };
      }
    });
  };

  const handleUpdatePlan = () => {
    setPlan((prevPlan) => ({
      ...prevPlan,
      ...formData, // formData를 최종적으로 PlanContext로 전달
    }));
  };

  const addCategory = () => {
    setFormData((prevData) => ({
      ...prevData,
      others: { name: "", value: 0 }, // 객체로 초기화
    }));
    setUPdate(true);
    setIsVisible(false);
  };
  return (
    <Container>
      <Title>카테고리</Title>
      <FormPlan>
        <FormG>
          <FormBox>
            <FormImg
              src={`${process.env.PUBLIC_URL}/icons/cvs.png`}
              alt="cvs"
            />
            <FormTitle>편의점</FormTitle>
          </FormBox>
          <FormInput
            type="text"
            name="cvs"
            value={Number(formData.cvs).toLocaleString("ko-KR")}
            onChange={handleInputChange}
          />
        </FormG>
        <FormG>
          <FormBox>
            <FormImg
              src={`${process.env.PUBLIC_URL}/icons/food.png`}
              alt="food"
            />
            <FormTitle>음식</FormTitle>
          </FormBox>
          <FormInput
            type="text"
            name="food"
            value={Number(formData.food).toLocaleString("ko-KR")}
            onChange={handleInputChange}
          />
        </FormG>
        <FormG>
          <FormBox>
            <FormImg
              src={`${process.env.PUBLIC_URL}/icons/shopping.png`}
              alt="shopping cart"
            />
            <FormTitle>쇼핑</FormTitle>
          </FormBox>
          <FormInput
            type="text"
            name="shopping"
            value={Number(formData.shopping).toLocaleString("ko-KR")}
            onChange={handleInputChange}
          />
        </FormG>

        <FormG>
          <FormBox>
            <FormImg
              src={`${process.env.PUBLIC_URL}/icons/transport.png`}
              alt="transport"
            />
            <FormTitle>교통</FormTitle>
          </FormBox>
          <FormInput
            type="text"
            name="transport"
            value={Number(formData.transport).toLocaleString("ko-KR")}
            onChange={handleInputChange}
          />
        </FormG>

        <FormG>
          <FormBox>
            <FormImg
              src={`${process.env.PUBLIC_URL}/icons/saving.png`}
              alt="saving"
            />
            <FormTitle>저축</FormTitle>
          </FormBox>
          <FormInput
            type="text"
            name="saving"
            value={Number(formData.saving).toLocaleString("ko-KR")}
            onChange={handleInputChange}
          />
        </FormG>
        {isVisible && (
          <PlusBtn type="button" onClick={addCategory}>
            추가하기
            <Btnimg
              src={`${process.env.PUBLIC_URL}/icons/others.png`}
              alt="others"
            />
          </PlusBtn>
        )}
        {isupdate && (
          <FormG>
            <FormBox>
              <FormImg
                src={`${process.env.PUBLIC_URL}/icons/others.png`}
                alt="others"
              />
              <OtherForm
                name="others"
                value={formData.others.name}
                data-type="name"
                onChange={handleInputChange}
              />
            </FormBox>
            <UpdateForm
              type="text"
              name="others"
              data-type="value"
              value={Number(formData.others.value).toLocaleString("ko-KR")}
              onChange={handleInputChange}
            />
          </FormG>
        )}

        <UpdateBtn type="button" onClick={handleUpdatePlan}>
          미리보기
        </UpdateBtn>
      </FormPlan>
    </Container>
  );
};

const Container = styled.div`
  /* background-color: #886eff; */
  background-color: white;
  min-height: 80vh;
  /* width: 50vh; */
  width: 100%;
  border-radius: 30px;
  /* margin: -10px 0 50px 40px; */
  /* border: 5px solid #c8bef3; */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  text-align: center;
  padding-top: 50px;
  font-weight: bold;
`;

const FormPlan = styled.form`
  /* width: 33vh; */
  margin: 0 auto;
  padding: 5px 0 0 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 3vh 0 -5vh;
`;

const FormTitle = styled.h4`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  /* color: #ffffff; */
  margin: 0 0 0 1vh;
`;

const FormImg = styled.img`
  display: flex;
  align-self: baseline;
  width: 50px;
  height: 50px;
  margin: 0 0 0 15px;
`;

const FormInput = styled.input`
  padding: 8px;
  border: 5px solid #c8bef3;
  border-radius: 10px;
  outline: none;
  width: 100%;
  text-align: center;
`;

const UpdateBtn = styled.button`
  background-color: #9774fb;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #886eff;
  border-radius: 10px;
  /* width: 15vw; */
  width: 200px;
  height: 5.8vh;
  margin-top: 1vh;
  font-weight: bold;
`;
const FormG = styled.div`
  display: grid;
  grid-template-columns: 1fr auto; /* 첫 번째 칸은 콘텐츠 크기, 두 번째 칸은 남은 공간 차지 */
  align-items: center;
  padding: 10px;
`;

const PlusBtn = styled.button`
  background-color: #4829d7;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #4829d7;
  border-radius: 10px;
  width: 12 vw;
  height: 5.8vh;
  margin-top: 1vh;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 0 5px 0 8px;
`;
const Btnimg = styled.img`
  display: flex;
  align-self: center;
  width: 40px;
  height: 40px;
  margin: 0 0 0 15px;
`;
const OtherForm = styled.input`
  padding: 8px;
  border: 3px solid #c8bef3;
  border-radius: 10px;
  outline: none;
  width: 80px;
  height: 30px;
  margin-left: 3px;
`;
const UpdateForm = styled.input`
  padding: 8px;
  border: 5px solid #c8bef3;
  border-radius: 10px;
  outline: none;
  width: 210px;
  margin-left: -15px;
`;
export default PlanForm;
