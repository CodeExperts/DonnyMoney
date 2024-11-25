import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  formatCurrency,
  formatDate,
} from "../../../../services/GlobalFunction";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import api from "../../../../services/api";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const PaymentReport = () => {
  const [point, setPoint] = useState(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [chartMonth, setChartMonth] = useState(new Date().getMonth() + 1);

  const [monthList, setMonthList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [paymentChart, setPaymentChart] = useState([]);
  const [planChart, setPlanChart] = useState([]);

  const [isMonthList, setIsMonthList] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(true);

  //카테고리
  const planCategories = Object.keys(planChart);

  // 카테고리 value의 값 total 이 0일 경우
  const isPlanEmpty =
    Object.values(planChart).reduce((acc, val) => acc + val, 0) === 0;
  const isPaymentEmpty =
    Object.values(paymentChart).reduce((acc, val) => acc + val, 0) === 0;

  // 월 선택 처리
  const changeMonth = (value) => {
    setMonth(value);
  };

  // 내 포인트 가져오기
  const showPoint = () => {
    axios
      .get(`api/children/get/point`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log(res);
        setPoint(res.data);
      })
      .catch((err) => {
        console.log("point 조회 중 에러 발생", err);
      });
  };

  // 이번 달 내가 쓴 돈 가져오기
  const showMonthList = () => {
    axios
      .get(`api/children/payments`, {
        params: {
          year: year,
          month: month,
        },
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log("달에 쓴 돈 보여주기", res.data);
        setIsMonthList(true);
        setIsChartVisible(false);
        setMonthList(res.data); // 데이터를 상태에 저장
      })
      .catch((err) => {
        console.log("소비 내역 조회 중 에러 발생", err);
      });
  };

  // 선택한 달의 소비 카테고리별로 가져오기
  const showPaymentChart = () => {
    axios
      .get(`api/children/payments/chart`, {
        params: {
          year: year,
          month: month,
        },
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsMonthList(false);
        setIsChartVisible(true);
        setPaymentChart(res.data);
      })
      .catch((err) => {
        console.log("소비 차트 조회 중 에러 발생", err);
      });
  };

  // 선택한 달의 계획 카테고리별로 가져오기
  const showPlanChart = () => {
    axios
      .get(`api/children/plan/chart`, {
        params: {
          year: year,
          month: month,
        },
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsMonthList(false);
        setIsChartVisible(true);
        setPlanChart(res.data);
      })
      .catch((err) => {
        console.log("소비 차트 조회 중 에러 발생", err);
      });
  };

  // 총합 계산 함수
  const calculateTotalAmount = (list) => {
    const total = list.reduce((sum, item) => sum + item.paymentAmt, 0);
    setTotalAmount(total); // 총합 상태 업데이트
  };

  // monthList 변경 시 총합 계산
  useEffect(() => {
    if (monthList.length > 0) {
      calculateTotalAmount(monthList); // 총합 계산
    }
  }, [monthList]); // monthList가 변경될 때마다 실행

  useEffect(() => {
    showPoint();
  }, []);

  // 월 변경 시, 차트 데이터를 가져오는 useEffect
  useEffect(() => {
    if (month) {
      showPaymentChart();
      showPlanChart();
    }
  }, [month]); // chartMonth 상태 값이 변경될 때마다 실행

  // Chart1 ) 각 카테고리별로 바 차트 데이터 생성
  const planVerseActual = (category) => {
    return {
      labels: [category], // 해당 카테고리만 사용
      datasets: [
        {
          label: "계획",
          data: [planChart[category] || 0], // 해당 카테고리의 계획값
          backgroundColor: "rgb(0, 122, 255)",
        },
        {
          label: "지출",
          data: [paymentChart[category] || 0], // 해당 카테고리의 실제값[true||false]
          backgroundColor: "rgb(255, 99, 132)",
        },
      ],
    };
  };

  // Chart1 ) bar 차트 옵션
  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          // 툴팁 내용만 표시 (축 레이블 안보이게 하기)
          title: function () {
            return ""; // 제목(카테고리 이름) 없애기
          },
          label: function (tooltipItem) {
            return (
              tooltipItem.dataset.label +
              ": " +
              formatCurrency(tooltipItem.raw) +
              " 원"
            ); // 데이터 값만 표시
          },
        },
      },
    },
    scales: {
      y: {
        display: false, // Y축 표시를 안함
        grid: {
          display: false, // Y축 그리드 라인 제거
        },
        ticks: {
          display: false, // Y축 틱 제거
        },
      },
      x: {
        display: false, // X축 표시를 안함
        grid: {
          display: true, // X축 그리드 라인 제거
          borderWidth: 1,
        },
        ticks: {
          display: false, // X축 틱 제거
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };

  return (
    <Outer>
      <MainSection>
        <div>
          <Button className="tabBtn" onClick={showPaymentChart}>
            리포트 보기
          </Button>
          <Button className="tabBtn" onClick={showMonthList}>
            내가 쓴 돈 보기
          </Button>
        </div>

        <PointSection>
          <div>
            내 포인트 잔액&nbsp;&nbsp;
            <span>{point !== null ? formatCurrency(point) : "로딩 중..."}</span>
            P
          </div>
          {/* 포인트 데이터 표시 */}
        </PointSection>
      </MainSection>

      {/* 월간 소비내역 차트 영역*/}
      {isChartVisible && (
        <Report>
          <PaymentChart>
            <Title>
              {month}월 내 <PlanColor>계획</PlanColor>과
              <PayedColor>소비</PayedColor> 한눈에 보기
            </Title>
            <br />
            {/* 월별 버튼 */}
            <Buttons>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (chartMonth) => (
                  <Button
                    className="monthBtn"
                    key={chartMonth}
                    value={chartMonth}
                    onClick={() => changeMonth(chartMonth)}
                  >
                    {chartMonth}월
                  </Button>
                )
              )}
            </Buttons>
            {/* 월별차트 */}
            <ContainChart>
              <Message>🖱️마우스를 올려 금액을 확인해보세요! </Message>
              {!(isPaymentEmpty && isPlanEmpty) && (
                <>
                  <ChartGrid>
                    {planCategories.map((category, index) => (
                      <div key={index}>
                        <ChartItem>
                          <Chart1Icon>
                            {category === "shopping" && (
                              <>
                                <img src="/icons/shopping.png" alt="icon" />{" "}
                                <p>쇼핑</p>
                              </>
                            )}
                            {category === "food" && (
                              <>
                                <img src="/icons/food.png" alt="icon" />{" "}
                                <p>식비</p>
                              </>
                            )}
                            {category === "transport" && (
                              <>
                                <img src="/icons/transport.png" alt="icon" />{" "}
                                <p>교통</p>
                              </>
                            )}
                            {category === "cvs" && (
                              <>
                                <img src="/icons/cvs.png" alt="icon" />{" "}
                                <p>편의점</p>
                              </>
                            )}
                            {category === "saving" && (
                              <>
                                <img src="/icons/saving.png" alt="icon" />{" "}
                                <p>저축</p>
                              </>
                            )}
                            {category === "others" && (
                              <>
                                <img src="/icons/others.png" alt="icon" />{" "}
                                <p>기타</p>
                              </>
                            )}
                          </Chart1Icon>
                          <Chart1BarAll>
                            <Bar
                              data={planVerseActual(category)}
                              options={options1}
                            />
                          </Chart1BarAll>
                        </ChartItem>
                      </div>
                    ))}
                  </ChartGrid>
                </>
              )}
              {isPaymentEmpty && isPlanEmpty && (
                <Message style={{ color: "blueviolet" }}>
                  📢 계획과 소비내역이 없습니다.{" "}
                </Message>
              )}
            </ContainChart>
          </PaymentChart>
        </Report>
      )}

      {/* 내가 쓴 돈 목록을 표로 출력 */}
      {isMonthList && !isChartVisible && (
        <Payment>
          {monthList.length === 0 ? (
            <NoData>
              <p>📢 소비 내역이 없습니다</p>
            </NoData>
          ) : (
            <MonthPayment>
              <Title>
                <span style={{ color: "#9068dc" }}>{month}월</span> 내가 쓴 돈
              </Title>
              <TotalPrice>
                총합 : <Price>{formatCurrency(totalAmount)}</Price>원
              </TotalPrice>
              <Table>
                <thead>
                  <TableRow>
                    <TableHeader>카테고리</TableHeader>
                    <TableHeader>날짜</TableHeader>
                    <TableHeader>상호명</TableHeader>
                    <TableHeader>금액</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {monthList.map((item, index) => (
                    <TableRow key={index}>
                      <TableData>
                        <img
                          src={`icons/${item.category}.png`}
                          alt="category icon"
                        />
                      </TableData>
                      <TableData>{formatDate(item.createdAt)}</TableData>
                      <TableData>{item.storeName}</TableData>
                      <TableData>
                        <Price>{formatCurrency(item.paymentAmt)}</Price>원
                      </TableData>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </MonthPayment>
          )}
        </Payment>
      )}
    </Outer>
  );
};

export default PaymentReport;

const Outer = styled.div`
  width: 100%;
  margin: 0 auto 40px auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const MainSection = styled.div`
  width: 100%;
  text-align: left;
  /* margin-left: 20px; */
  display: flex;
  justify-content: space-between;
  align-items: end;

  padding-left: 20px;
`;

const PointSection = styled.div`
  width: fit-content;
  height: fit-content;
  align-items: center;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0px 20px;
  margin-bottom: 30px;

  div {
    padding: 14px 0;
    font-size: 24px;
  }
  span {
    color: #9068dc;
  }
`;

const Button = styled.button`
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;

  color: white;
  padding: 20px 25px;
  font-size: 20px;
  border: 1px solid white;
  position: relative;
  cursor: pointer;
  font-weight: 600;
  /* background-color: #bea9ed; */
  background-color: #f98d5a;
  &:hover {
    background-color: #f77833;
    /* background-color: #9068dc; */
  }

  &.monthBtn {
    border-radius: 14px;
    /* background-color: #f98d5a; */
    background-color: #bea9ed;
    padding: 10px 20px;
  }
  &.monthBtn:hover {
    /* background-color: #f77833; */
    background-color: #9068dc;
  }
`;

const Payment = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;
const NoData = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  p {
    margin: 0;
    font-size: 32px;
    color: gray;
  }
`;

const MonthPayment = styled.div`
  width: 70%;
  text-align: center;
  margin: 30px 0px;
`;

const Title = styled.div`
  font-size: 32px;
  text-align: center;
  margin-bottom: 10px;
`;

const TotalPrice = styled.div`
  font-size: 20px;
  text-align: right;
  margin: 10px;
`;

const Price = styled.span`
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #ddd;
`;

const TableHeader = styled.th`
  /* background-color: #f98d5a; */
  background-color: #9068dc;
  color: white;
  padding: 12px;
  font-size: 25px;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f3f3f3;
  }
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-family: "HakgyoansimDunggeunmisoTTF-R";
  font-size: 20px;
  img {
    width: 100px;
  }
`;

const Report = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
`;

const PaymentChart = styled.div`
  /* margin: 30px 0px; */
  padding: 50px 0;
  border-radius: 24px;
`;
// 텍스트 CSS
const PlanColor = styled.span`
  color: rgb(0, 122, 255);
`;

const PayedColor = styled.span`
  color: rgb(255, 99, 132);
`;

const ContainChart = styled.div`
  border-radius: 10px;
  margin: 0px 30px;
  box-sizing: border-box;
`;
// Button 그룹
const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center; /* 필요 시 세로 정렬 추가 */
  gap: 10px; /* 버튼 간격 추가 */
  width: 100%; /* 필요 시 부모 크기 기반 정렬 */
  margin: 0 auto 32px auto;
  justify-content: center;
  box-sizing: border-box;
`;
const Message = styled.div`
  box-sizing: border-box;
  font-size: 20px;
  text-align: center;
  margin: 10px 0px;
  color: gray;
`;

// 2x3 배열을 위한 Grid 스타일
const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개의 컬럼으로 나누기 */
  gap: 20px;
  height: fit-content;
  box-sizing: border-box;
  margin: 20px 20px;
`;

// 각 아이템에 대한 스타일
const ChartItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px 20px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  height: 100%;
`;

const Chart1Icon = styled.div`
  width: 60%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%; /* 부모 div 너비를 초과하지 않도록 제한 */
    height: 100%; /* 비율에 맞게 높이 자동 조정 */
  }
  p {
    font-size: 14px;
    text-align: center;
    margin-bottom: 0px;
  }
`;
const Chart1BarAll = styled.div`
  box-sizing: border-box;
  width: 70%;
`;
