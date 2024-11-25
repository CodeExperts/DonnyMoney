import React, { useState } from "react";
import PlanReport from "../../components/pages/parent/monthly-report/PlanReport";
import SendMessage from "../../components/pages/parent/monthly-report/SendMessage";
import SelectOptionNav from "../../components/pages/parent/SelectOptionNav";
import styled from "styled-components";
import AccessDeniedPage from "../common/AccessDeniedPage";

const MonthlyReportPage = () => {
  const [selectOption, setSelectOption] = useState({
    childNum: 1,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const handleChildData = (updateData) => {
    console.log("data : ", updateData);

    setSelectOption((prev) => ({
      ...prev,
      ...updateData, // 기존 데이터에 새로 전달된 값 병합
    }));
  };

  const role = localStorage.getItem("role");

  return (
    <>
      {role === "ROLE_CHILD" && <AccessDeniedPage />}
      {role === "ROLE_PARENT" && (
        <>
          <ContainAll>
            <SelectOptionNav onHandleData={handleChildData} />

            <PlanReport
              childNum={selectOption.childNum}
              year={selectOption.year}
              month={selectOption.month}
            />
          </ContainAll>
          <SendMessage childNum={selectOption.childNum} />
        </>
      )}
    </>
  );
};

const ContainAll = styled.div`
  margin-bottom: 50px;
`;

export default MonthlyReportPage;
