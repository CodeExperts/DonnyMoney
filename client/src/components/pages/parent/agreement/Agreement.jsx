import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Modal } from "../../../commons/Modal";
import { sendNotificationToChild } from "../../../../services/NotificationService";
import api from "../../../../services/api";

// props를 하나의 객체로 받는다.
const Agreement = ({
  childNum,
  year,
  month,
  childName,
  onPaymentSuccess,
  agreement,
  setAgreement,
}) => {
  console.log("Agreement 내 childName 출력>> " + childName);

  const [contractData, setContractData] = useState({
    categories: [],
    totalAmount: 0, // 총 금액
    contractDate: "", // 계약 날짜
  });

  const parentNum = localStorage.getItem("memberNo");
  const authorization = localStorage.getItem("Authorization");

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부 확인
  const [hasPlan, sethasPlan] = useState(false); //리포트 존재 여부 확인
  const [redirectUrl, setredirectUrl] = useState(); //받아온 카카오  url 담는 상태
  const [modalBack, setModalBack] = useState(false); //모달의 뒷면 보여주기
  //결제 버튼 누른 후 결제 기능
  const Payment = () => {
    setIsModalOpen(true); //모달 창 띄우기
    axios
      .post(
        `api/parents/orders`,
        {
          childNum: childNum,
          amount: contractData.totalAmount,
          payType: "card",
        },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        console.log("agreement의 응답요청 확인", res.data);

        //null/undefined 확인 + 빈 객체인지 확인(객체의 키 개수 개산)
        if (!res.data || Object.keys(res.data).length === 0) {
          console.log(" 결제 실패");
        } else {
          console.log("결제 성공 " + res.data);
          onPaymentSuccess(); // 상위 컴포넌트에 결제 성공 알림
          setAgreement({
            pointOrderNum: res.data.pointOrderNum,
            amount: res.data.amount,
            childNum: res.data.childNum,
            payType: res.data.payType,
          });
          console.log("담긴 agreenemt값 확인", agreement);
          console.log(childNum + ", " + parentNum + ", " + authorization);
          console.log("order번호를 확인하기", res.data.pointOrderNum);
          payReady(res.data.pointOrderNum);
          sendNotificationToChild(
            childNum,
            parentNum,
            authorization,
            `부모님이 용돈 ${contractData.totalAmount.toLocaleString()} 원을 지급했습니다.`, // 한마디의 내용
            "money"
          );
        }
      })
      .catch((err) => {
        console.log("결제 중 에러 발생", err);
      });
  };

  //결제 요청 보내기
  const payReady = (ord_id) => {
    // ord_id를 URL 경로에 포함시켜 GET 요청 보내기
    axios({
      method: "GET",
      url: `api/order/pay/${ord_id}`,
      headers: {
        Authorization: localStorage.getItem("Authorization"), // Authorization 헤더에 토큰 추가
        "Content-Type": "application/json", // 데이터가 JSON 형식임을 명시
      }, // ord_id를 URL 경로로 전달
    })
      .then((res) => {
        console.log("payReady의 결과 값", res.data);
        setredirectUrl(res.data.next_redirect_pc_url);
        console.log("redirect url확인용", res.data.next_redirect_pc_url);
        handleRedirect(res.data.next_redirect_pc_url);
      })
      .catch((error) => {
        console.error(
          "Error fetching initial data:",
          error.response || error.message
        );
        // 에러 처리
      });
  };
  //url 화면에 뿌리기
  console.log("redirect url iframe용", redirectUrl);
  const handleRedirect = (url) => {
    window.location.href = url;
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isCurYearMonth = (year, month) => {
    const curYear = new Date().getFullYear();
    const curMonth = new Date().getMonth() + 1;

    if (curYear === year && curMonth === month) return true;
    else return false;
  };

  const changeData = (data) => {
    const category = [
      { name: "식비", amount: data.food },
      { name: "쇼핑", amount: data.shopping },
      { name: "교통", amount: data.transport },
      { name: "저축", amount: data.saving },
      { name: "편의점", amount: data.cvs },
      { name: "기타", amount: data.others },
    ];

    return {
      contractDate: `${data.createdAt[0]}년 ${data.createdAt[1]}월 ${data.createdAt[2]}일`,
      categories: category,
      totalAmount: category.reduce((sum, item) => sum + item.amount, 0),
    };
  };

  //소비 계획 가져오기
  useEffect(() => {
    axios
      .get(`api/parents/contracts`, {
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
        console.log("소비 계획 데이터 : " + res.data);

        //null/undefined 확인 + 빈 객체인지 확인(객체의 키 개수 개산)
        if (!res.data || Object.keys(res.data).length === 0) {
          sethasPlan(false);
        } else {
          sethasPlan(true);

          //데이터 가공하기 후 저장
          setContractData(changeData(res.data));
        }
      })
      .catch((err) => {
        //console.log("용돈 계약서 조회 중 에러 발생", err);
        sethasPlan(false);
      });
  }, [childNum, year, month]);

  return (
    <Outer>
      <Container isCurrent={isCurYearMonth(year, month)} hasPlan={hasPlan}>
        {hasPlan && !isCurYearMonth(year, month) && (
          <ImageWrapper>
            <img src="images/payComplete.png" alt="알림 이미지" />
          </ImageWrapper>
        )}

        {hasPlan ? (
          <>
            <ContractTitle>용돈 계약서</ContractTitle>
            <ContractSubTitle>
              {childName}의 용돈 계획을 확인하세요!
            </ContractSubTitle>

            <ContractDetails>
              <DetailRow>
                <Label>아이 이름:</Label>
                <Value>{childName}</Value>
              </DetailRow>
              <DetailRow>
                <Label>계약 날짜:</Label>
                <Value>{contractData.contractDate}</Value>
              </DetailRow>

              <CategoryList>
                {contractData.categories.map((category, index) => (
                  <CategoryRow key={index}>
                    <Category>{category.name}</Category>
                    <Amount>
                      <span className="priceText">
                        {category.amount.toLocaleString()}
                      </span>
                      &nbsp;원
                    </Amount>
                  </CategoryRow>
                ))}
              </CategoryList>

              <TotalAmount>
                <TotalText>총 용돈 금액 : </TotalText>
                <TotalPrice>
                  <span className="priceText">
                    {contractData.totalAmount.toLocaleString()}
                  </span>
                  &nbsp;원
                </TotalPrice>
              </TotalAmount>
              <Sign>
                <Label>부모 서명: </Label>
                <Stamp>{localStorage.getItem("name")}</Stamp>
                <br></br>
                <Label>아이 서명: </Label>
                <Stamp>{childName}</Stamp>
              </Sign>
            </ContractDetails>

            {isCurYearMonth(year, month) && (
              <ButtonWrapper>
                <Button onClick={Payment}>결제하기</Button>
              </ButtonWrapper>
            )}

            {/* 모달 */}
            {isModalOpen && (
              <Modal>
                <h2>결제가 완료됐습니다!</h2>
                <br />
                <p>
                  <Value>{childName}</Value> 에게 용돈{" "}
                  <Value>{contractData.totalAmount.toLocaleString()}</Value> 원
                  을 지급했습니다.
                </p>
                <Button onClick={closeModal}>닫기</Button>
              </Modal>
            )}
          </>
        ) : (
          <>
            <h3>📢 용돈 계약서가 없습니다</h3>
            <p style={{ color: "gray" }}>
              <Value>{childName}</Value>의{" "}
              <Value>
                {year}년 {month}월
              </Value>{" "}
              소비 계획이 존재하지 않습니다.
            </p>
          </>
        )}
      </Container>
    </Outer>
  );
};

export default Agreement;

const Outer = styled.div`
  max-width: 100%;
  padding: 20px;
  border-radius: 15px;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); */
  /* background-color: ${({ hasPlan, isCurrent }) =>
    hasPlan && !isCurrent ? "gray" : "transparent"}; */
  color: ${({ hasPlan, isCurrent }) =>
    hasPlan && !isCurrent ? "white" : "black"};

  /* border: 1px solid red; */
  /* background-color: white; */
`;

const Container = styled.div`
  width: 100%;
  /* max-width: 600px; */
  max-width: 700px;
  margin: 0 auto;
  /* background-color: #f6f2fd; */
  /* background-image: url("images/contract.jpg"); */
  padding: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;

  position: relative;
  border-radius: 25px;

  background-color: white;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: auto;
  z-index: 10;
  text-align: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 영역에 맞게 조정됨 */
    opacity: 0.9; /* 약간 투명하게 설정 (선택 사항) */
  }
`;

const ContractTitle = styled.h1`
  /* color: #7f56e7; */
  /* color: #5b2b7d; */
  color: #232323;
  font-size: 40px;
  margin-bottom: 10px;
`;

const ContractSubTitle = styled.h3`
  font-family: "HakgyoansimDunggeunmisoTTF-R";
  /* color: #7f56e7; */
  /* color: #5b2b7d; */
  font-size: 20px;
  margin-bottom: 20px;
`;

const ContractDetails = styled.div`
  text-align: left;
  margin-bottom: 30px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 20px;
`;

const Label = styled.span`
  font-weight: 600;
  /* color: #5b2b7d; */
  color: #232323;
`;

const Value = styled.span`
  /* color: #9b59b6; */
  color: #232323;
`;

const Stamp = styled.div`
  text-align: right;
  color: #ffffff;
  background-image: url("images/stamp.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding: 20px;
  display: inline-block;
  font-size: 15px;
`;

const CategoryList = styled.div`
  margin-top: 20px;
`;

const CategoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
`;

const Category = styled.span`
  font-weight: 600;
  /* color: #8529fd; */
`;

const Amount = styled.span`
  /* color: #5b2b7d; */
  .priceText {
    color: #7f56e7;
  }
`;

const TotalAmount = styled.div`
  margin-top: 20px;
  font-size: 20px;
  font-weight: 600;
  text-align: right;
`;

const TotalText = styled.span`
  /* color: #5b2b7d; */
  font-size: 1.1rem;
`;

const TotalPrice = styled.span`
  font-size: 20px;

  .priceText {
    color: #7f56e7;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const Sign = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const Button = styled.button`
  background-color: #8529fd;
  color: white;
  padding: 12px 25px;
  font-size: 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background-color: #7f56e7;
  }
`;
const IframeWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 400px; // iframe 높이 조정
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
