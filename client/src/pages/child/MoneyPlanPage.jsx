import React, { useContext, useState, useEffect } from "react";
import PlanForm from "../../components/pages/child/plan/PlanForm";
import styled from "styled-components";
import SaveForm from "../../components/pages/child/plan/SaveForm";
import SelectBox from "../../components/pages/child/plan/SelectBox";
import { Modal } from "../../components/commons/Modal";
import { PlanContext } from "../context/MoneyPlanContext";
import axios from "axios";
import { AuthContext } from "../../App";
import { sendNotificationToParent } from "../../services/NotificationService";
import api from "../../services/api";

const MoneyPlanPage = () => {
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const {
    plan,
    selectedYear,
    selectedMonth,
    overlayStatus,
    setOverlayStatus,
    setPlan,
  } = useContext(PlanContext); // Context에서 overlayStatus 가져오기
  const { memberNo, role, name, authorization } = useContext(AuthContext);
  // 데이터를 숫자로 변환하는 함수
  const parseValue = (value) => {
    const parsedValue = parseFloat(value); // 문자열을 숫자로 변환
    return isNaN(parsedValue) ? 0 : parsedValue; // NaN이면 0으로 처리
  };
  // console.log("auth 확인하기", authorization);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const [parentNum, setParentNum] = useState(null);
  // 데이터값 배열 생성
  // Context 값이 변경될 때 dataValues 동기화
  // 부모찾기
  const findParentNum = async () => {
    try {
      const response = await axios.get(
        `api/notification/findParentNo/${memberNo}`,
        {
          headers: {
            Authorization: `${authorization}`,
          },
        }
      );
      // console.log("부모찾기", response.data);
      setParentNum(response.data);
    } catch (error) {
      console.log("부모 넘버 조회 에러 : ", error);
    }
  };

  useEffect(() => {
    findParentNum();
    getplan();
    if (plan) {
      console.log("Moneyplanpage의 plan", plan);
      setPlan([
        { label: "쇼핑", value: plan.shopping ?? 0 },
        { label: "교통", value: plan.transport ?? 0 },
        { label: "편의점", value: plan.cvs ?? 0 },
        { label: "음식", value: plan.food ?? 0 },
        {
          label: plan.others?.name || "기타",
          value: parseValue(plan.others?.value),
        },
        { label: "저축", value: plan.saving ?? 0 },
      ]);
    }
  }, []); // plan 변경 시 실행

  const handleSend = () => {
    console.log("모달 연 후  plan", plan);
    setModalOpen(true); // "부모님한테 보내기" 버튼 클릭 시 모달 열기
  };
  //console.log("db로 보낼 데이터", dataToSend);
  // console.log("MoneyPlanPage plan : ", plan);
  // console.log("MoneyPlanPage dataValues : ", plan);

  //나중에 로컬스토리지에서 데이터 받아오는거롤 수정해야함
  const token = authorization;

  const [isLoading, setIsLoading] = useState(false); // 전송 중 로딩 상태
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태
  const submitJoin = (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    setErrorMessage(null);
    // 요청할 데이터를 변환하는 함수
    const transformPlanToRequestFormat = () => {
      return {
        shopping: plan.shopping ?? 0,
        transport: plan.transport ?? 0,
        cvs: plan.cvs ?? 0,
        food: plan.food ?? 0,
        others: parseValue(plan.others?.value) ?? 0, // 값은 parseValue로 처리
        saving: plan.saving ?? 0,
      };
    };

    const requestBody = transformPlanToRequestFormat();
    // console.log("보낼 데이터를 다시 확인하기", requestBody);
    axios({
      method: "POST",
      url: `api/children/plans?year=${currentYear}&month=${currentMonth}`,
      data: requestBody,
      headers: {
        Authorization: token, // Authorization 헤더에 토큰 추가
        "Content-Type": "application/json", // 데이터가 JSON 형식임을 명시
      },
    })
      .then((res) => {
        setModalOpen(false); // 모달 닫기
        setIsLoading(false); // 로딩 상태 해제

        // console.log("authorization : ", authorization);

        setOverlayStatus(true); //수정 불가 창업데이트
        sendNotificationToParent(
          memberNo,
          parentNum,
          authorization,
          "",
          "contract"
        );
      })
      .catch((err) => {
        console.error("Error:", err.message); // 오류 메시지 출력
        setIsLoading(false); // 로딩 상태 해제
        setErrorMessage("전송 중 오류가 발생했습니다. 다시 시도해주세요.");
        setOverlayStatus(false); //수정 불가 창업데이트
      });
  };
  // 이달의 플랜 가져오기
  const getplan = (e) => {
    if (e) e.preventDefault(); // 폼 제출 시 새로고침 방지
    setIsLoading(true);
    setErrorMessage(null);
    axios({
      method: "GET",
      url: `api/children/show/plans?year=${currentYear}&month=${currentMonth}`,
      headers: {
        Authorization: token, // Authorization 헤더에 토큰 추가
        "Content-Type": "application/json", // 데이터가 JSON 형식임을 명시
      },
    })
      .then((res) => {
        console.log("axios res------", res);
        const planData = res.data;
        setPlan([
          { label: "편의점", value: planData.cvs ?? 0 },
          { label: "음식", value: planData.food ?? 0 },
          { label: "쇼핑", value: planData.shopping ?? 0 },
          { label: "교통", value: planData.transport ?? 0 },
          { label: "저축", value: planData.saving ?? 0 },
          {
            label: plan.others?.name || "기타",
            value: parseValue(plan.others?.value),
          },
        ]);
        setIsLoading(false);
        console.log("머니플랜페이지의 ", plan);
      })

      .catch((err) => {
        console.error("Error:", err.message); // 오류 메시지 출력
        console.error("Error response:", err.response); // 서버 응답 (응답이 있을 경우)
        console.error("Error stack:", err.stack); // 오류 스택 추적
        setIsLoading(false); // 로딩 상태 해제
        setErrorMessage("전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };
  //모달에 표시하기 위해서 포맷팅하기
  const formattedPlan = [
    { label: "편의점", value: plan.cvs },
    { label: "음식", value: plan.food },
    { label: "쇼핑", value: plan.shopping },
    { label: "교통", value: plan.transport },
    { label: "저축", value: plan.saving },
    { label: plan.others?.name || "기타", value: plan.others?.value || 0 },
  ];

  const isMatchingDate =
    selectedYear === currentYear && selectedMonth === currentMonth;
  console.log("선택된 날짜", selectedYear, selectedMonth);
  // 숫자를 원화 형식으로 포맷 (예: 1,000,000)
  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) {
      return "0"; // 기본값으로 "0" 반환
    }
    return parseInt(value, 10).toLocaleString("ko-KR"); // 한국 원화 포맷
  };
  return (
    <>
      <TitleWapper>
        <PageTitle>소비계획 세우기</PageTitle>

        <SelectBox />
      </TitleWapper>
      <Wapper>
        {/* 오버레이 상태와 날짜 조건이 모두 충족될 때만 표시 */}
        {overlayStatus && isMatchingDate && (
          <OverlayDiv>
            <OverlayMessage>
              계획 전송 완료! 부모님이 계획을 확인 중이에요!
            </OverlayMessage>
          </OverlayDiv>
        )}
        <Container>
          <PlanForm />
        </Container>
        <Container>
          <SaveForm />
        </Container>
      </Wapper>
      <BtnWapper>
        {/* 날짜가 일치할 때만 버튼 표시 */}
        {isMatchingDate && (
          <>
            <UpdateBtn onClick={() => setOverlayStatus(false)}>
              수정하기
            </UpdateBtn>
            <SendBtn onClick={handleSend} disabled={overlayStatus}>
              부모님한테 보내기
            </SendBtn>
          </>
        )}
      </BtnWapper>
      {/* 모달이 열렸을 때만 표시 */}
      {isModalOpen && (
        <Modal width="500px" height="600px" padding="20px">
          <ModalTitle>보낼 계획 내용</ModalTitle>
          <ModalTextBox>
            {/* dataValues 배열을 순회하며 데이터를 표시 */}
            {formattedPlan.map((item, index) => (
              <p key={index}>
                <strong>{item.label}:</strong> {formatCurrency(item.value)}원
              </p>
            ))}
          </ModalTextBox>
          <ModalBtnWapper>
            <ModalBtn className="closeBtn" onClick={() => setModalOpen(false)}>
              닫기
            </ModalBtn>
            <ModalBtn onClick={submitJoin} disabled={isLoading}>
              {isLoading ? "전송 중..." : "전송"}
            </ModalBtn>
          </ModalBtnWapper>
        </Modal>
      )}
    </>
  );
};

const TitleWapper = styled.div`
  display: flex;
  align-items: center;
  /* margin-top: 30px;
  margin-bottom: 30px; */
  margin: 0 auto;
  margin-bottom: 30px;
  width: 1140px;
  display: flex;
  justify-content: space-between;
`;
const Wapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 30px;
  position: relative; /* OverlayDiv 위치 제어를 위해 추가 */
  margin-bottom: 50px;
`;

const Container = styled.div`
  width: 45%;
`;

const PageTitle = styled.h3`
  font-weight: bold;
  color: #3d3d3d;
  text-align: center;
  margin: 0;
`;
const UpdateBtn = styled.button`
  all: unset;
  /* background-color: #4829d7; */
  background-color: #9774fb;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  /* border: 2px solid #4829d7; */
  border-radius: 10px;
  /* width: 15vw; */
  width: 300px;
  height: 5.8vh;
  font-weight: bold;
  text-align: center;
`;
const SendBtn = styled.button`
  background-color: #9774fb;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #9774fb;
  border-radius: 10px;
  /* width: 25vw; */
  width: 300px;
  height: 5.8vh;
  font-weight: bold;
  margin-left: 30px;
`;
const BtnWapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -20px;
  margin-bottom: 20px;
`;
const OverlayDiv = styled.div`
  position: absolute; /* Wapper 내부에서 위치 고정 */
  top: 0;
  left: 20px;
  width: 95%; /* Wapper의 전체 너비 */
  height: 100%; /* Wapper의 전체 높이 */
  background-color: rgba(255, 255, 255, 0.8); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  z-index: 1000; /* Wapper의 다른 요소 위에 표시 */
`;
const OverlayMessage = styled.h1`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background: #9774fb;
  padding: 20px;
  border-radius: 8px;
`;
const ModalBtn = styled.button`
  background-color: #9774fb;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: none;
  border-radius: 10px;
  width: 8vw;
  height: 5.8vh;
  font-weight: bold;
  margin-left: 30px;
`;
const ModalBtnWapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
  .closeBtn {
    background-color: #f77833;
  }
`;
const ModalTitle = styled.h3`
  margin-bottom: 80px;
`;
const ModalTextBox = styled.div``;

export default MoneyPlanPage;
