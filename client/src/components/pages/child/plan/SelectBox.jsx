import React, { useEffect, useState, useContext, useMemo } from "react";
import styled from "styled-components";
import axios from "axios";
import { PlanContext } from "../../../../pages/context/MoneyPlanContext";
import { AuthContext } from "../../../../App";
import api from "../../../../services/api";

const SelectBoxContainer = styled.div`
  position: relative;
  width: 200px;
  margin-right: 50px;
`;

const SelectedOption = styled.div`
  padding: 10px;
  border: 1px solid #c8bef3;
  border-radius: 5px;
  cursor: pointer;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #c8bef3;
  border-radius: 5px;
  background-color: #fff;
  max-height: 150px;
  overflow-y: auto;
  padding: 0;
  margin: 5px 0 0;
  list-style: none;
  z-index: 1200;
  display: ${(props) => (props.open ? "block" : "none")};
`;

const OptionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SelectBox = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 전송 중 로딩 상태
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태
  const { memberNo, role, name, authorization } = useContext(AuthContext);
  const { setPlan, setSelectedYear, setSelectedMonth } =
    useContext(PlanContext); // PlanContext 업데이트 함수

  // 전달부터 12개월치 옵션 생성
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const options = [];

    for (let i = 1; i <= 12; i++) {
      const date = new Date(currentDate); // 현재 날짜 복사
      date.setMonth(currentDate.getMonth() - i + 1); // 전달부터 12개월 전으로 이동
      const monthYear = date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
      });
      options.push({ id: i, value: monthYear, date });
    }

    return options;
  };

  const options = useMemo(() => generateMonthOptions(), []); // 한번만 생성

  // 기본값을 현재 달로 설정
  useEffect(() => {
    setSelectedOption(options[0]?.value); // 첫 번째 옵션(전달)으로 초기화
    if (options[0]?.date) {
      const initialDate = options[0]?.date;
      setSelectedYear(initialDate.getFullYear());
      setSelectedMonth(initialDate.getMonth() + 1);
    }
  }, [options, setSelectedYear, setSelectedMonth]);

  const handleOptionClick = (option) => {
    setSelectedOption(option.value);
    setIsOpen(false);

    const year = option.date.getFullYear();
    const month = option.date.getMonth() + 1;

    // Context에 저장
    setSelectedYear(year);
    setSelectedMonth(month);

    // API 호출
    fetchPlanData(year, month);
  };
  //로컬스토리지에서 토큰 가져와야함
  const token = authorization;
  const fetchPlanData = (year, month) => {
    setIsLoading(true);
    setErrorMessage(null);

    const token = authorization || localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("인증 토큰이 없습니다.");
      setIsLoading(false);
      return;
    }

    axios({
      method: "GET",
      url: `api/children/show/plans?year=${year}&month=${month}`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("API Response:", res);
        setPlan(res.data); // 데이터 구조 확인 후 업데이트
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err.response || err.message);
        setErrorMessage(
          "데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요."
        );
        setIsLoading(false);
      });
  };

  return (
    <SelectBoxContainer>
      <SelectedOption onClick={() => setIsOpen(!isOpen)}>
        <div>{selectedOption || "옵션을 선택하세요"}</div>
        <>
          <img src="/icons/down.png" width={"15px"} height={"15px"} />
        </>
      </SelectedOption>
      <OptionsList open={isOpen}>
        {options.map((option) => (
          <OptionItem key={option.id} onClick={() => handleOptionClick(option)}>
            {option.value}
          </OptionItem>
        ))}
      </OptionsList>

      {isLoading && <p>로딩 중...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </SelectBoxContainer>
  );
};

export default SelectBox;
