import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import api from "../../../../services/api";

const Order = ({ childNum, year, month, paymentStatusUpdate }) => {
  //결제 내역 유무
  const [hasPayments, setHasPayments] = useState(false);

  //결제 데이터
  const [payments, setPayments] = useState([]);

  //결제 타입 변환
  const changePayType = (payType) => {
    const payTypeMap = {
      card: "카드",
      account: "계좌",
    };

    return payTypeMap[payType] || payType;
  };

  useEffect(() => {
    axios
      .get(`api/parents/orders`, {
        params: {
          childNum: childNum,
          year: year,
          month: month,
        },
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log("orderData : " + res.data);

        //null/undefined 확인 + 빈 객체인지 확인(객체의 키 개수 개산)
        if (!res.data || Object.keys(res.data).length === 0) {
          setHasPayments(false);
        } else {
          setHasPayments(true);
          setPayments(res.data);
        }
      })
      .catch((err) => {
        console.log("용돈 계약서 조회 중 에러 발생", err);
        setHasPayments(false);
      });
  }, [childNum, year, month, paymentStatusUpdate]);

  return (
    <Outer>
      <Title>결제 내역</Title>
      <Container>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>번호</TableHeader>
              <TableHeader>지급 날짜</TableHeader>
              <TableHeader>금액</TableHeader>
              <TableHeader>지급 수단</TableHeader>
              <TableHeader>상태</TableHeader>
            </TableRow>
          </thead>
          {hasPayments ? (
            <tbody>
              {payments.map((payment, idx) => (
                <TableRow key={idx}>
                  <TableData>{idx + 1}</TableData>
                  <TableData>
                    {payment.createdAt[0]}년 {payment.createdAt[1]}월{" "}
                    {payment.createdAt[2]}일
                  </TableData>
                  <TableData>{payment.amount.toLocaleString()} 원</TableData>
                  <TableData>{changePayType(payment.payType)}</TableData>
                  <TableData>결제 완료</TableData>
                </TableRow>
              ))}
            </tbody>
          ) : (
            <NoDataRow>
              <NoDataCell colSpan="5">
                <h3>📢 결제 내역이 없습니다</h3>
                <p>
                  {year}년 {month}월 결제 내역이 없습니다.
                </p>
              </NoDataCell>
            </NoDataRow>
          )}
        </Table>
      </Container>
    </Outer>
  );
};

export default Order;

const Outer = styled.div`
  width: 100%;
  margin: 100px 0px;
`;
const Title = styled.h1`
  text-align: left;
  color: #8529fd;
  font-size: 40px;
`;

const Container = styled.div`
  max-width: 100%;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 20px;

  text-align: center;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f3f3f3;
  }
`;

const TableHeader = styled.th`
  /* background-color: #7f56e7; */
  background-color: #8529fd;
  color: white;
  padding: 12px;
  font-size: 20px;
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-family: "HakgyoansimDunggeunmisoTTF-R";
  color: ${(props) =>
    props.status === "완료"
      ? "blue"
      : props.status === "취소"
      ? "red"
      : "black"};
`;

const NoDataRow = styled.tr`
  text-align: center;
`;

const NoDataCell = styled.td`
  text-align: center;
  vertical-align: middle;
  padding: 20px;
  font-size: 18px;
  color: gray;
`;
