import React, { useEffect, useState, useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import styled from "styled-components";
import { PlanContext } from "../../../../pages/context/MoneyPlanContext";
import { formatCurrency } from "../../../../services/GlobalFunction";

const ChartContainer = styled.div`
  width: 100%; /* 차트의 너비 */
  height: 25vh; /* 차트의 높이 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -230px;
`;
// 색상 칩 스타일
const ColorChip = styled.span`
  display: inline-block;
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
  border-radius: 20%;
`;
const DataTextContainer = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-bottom: -250px;
`;
const FormInput = styled.input`
  padding: 8px;
  border: 5px solid #c8bef3;
  border-radius: 10px;
  margin-bottom: -100px;
  text-align: center;
  outline: none;
  width: 60%;
  height: 8vh;
`;
//컬러칩 수정예정
const backgroundColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "#886eff",
  "rgba(255, 159, 64, 1)",
];
ChartJS.register(ArcElement, Tooltip);
const DoughnutChart = () => {
  const { plan, setPlan } = useContext(PlanContext);
  const [formattedDataValues, setFormattedDataValues] = useState([]);

  // 데이터를 숫자로 변환하는 함수
  const parseValue = (value) => {
    const parsedValue = parseFloat(value); // 문자열을 숫자로 변환
    return isNaN(parsedValue) ? 0 : parsedValue; // NaN이면 0으로 처리
  };

  // 데이터 값 처리: plan 값이 없을 경우 기본값 0으로 처리
  const dataValues = [
    { label: "쇼핑", value: plan.shopping },
    { label: "교통", value: plan.transport },
    { label: "편의점", value: plan.cvs },
    { label: "음식", value: plan.food },
    {
      label: plan.others?.name || "기타",
      value: parseValue(plan.others?.value),
    },
    { label: "저축", value: plan.saving },
  ];

  useEffect(() => {
    if (plan) {
      const updatedValues = [
        { label: "쇼핑", value: parseValue(plan.shopping) },
        { label: "교통", value: parseValue(plan.transport) },
        { label: "편의점", value: parseValue(plan.cvs) },
        { label: "음식", value: parseValue(plan.food) },
        {
          label: plan.others?.name || "기타",
          value: parseValue(plan.others?.value),
        },
        { label: "저축", value: parseValue(plan.saving) },
      ].map((item) => ({
        ...item,
        formattedValue: item.value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","), // 원단위 구분기호 추가
      }));

      // 내림차순으로 정렬
      updatedValues.sort((a, b) => b.value - a.value);
      setFormattedDataValues(updatedValues);
    }
  }, [plan]); // plan이 바뀔 때마다 실행

  const sortedLabels = formattedDataValues.map((item) => item.label);
  const sortedDataValues = formattedDataValues.map((item) => item.value);

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        label: "미리보기 차트",
        data: sortedDataValues,
        backgroundColor: backgroundColors.slice(0, sortedLabels.length),
        borderColor: ["gray", "darkgray"],
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  const sumdata = sortedDataValues.reduce((acc, value) => acc + value, 0);
  const sumConma = formatCurrency(sumdata);

  return (
    <>
      {sortedDataValues.every((value) => value === 0) ? (
        <ChartContainer>
          <p style={{ fontSize: "20px", color: "#555" }}>
            미리보기를 눌러주세요
          </p>
        </ChartContainer>
      ) : (
        <>
          <ChartContainer>
            <Pie data={data} options={options} />
            <DataTextContainer>
              {formattedDataValues.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <ColorChip color={backgroundColors[index]} />
                  <strong>{item.label}</strong>: {item.formattedValue} 원
                </div>
              ))}
            </DataTextContainer>
          </ChartContainer>
          <FormInput
            type="text"
            value={`예상 소비금액: ${sumConma || "0"}`}
            readOnly
          />
        </>
      )}
    </>
  );
};

export default DoughnutChart;
