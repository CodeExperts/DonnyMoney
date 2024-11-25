import React, { useRef, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "../../../commons/Modal";
import axios from "axios";
import { AuthContext } from "../../../../App";
import { formatCurrency } from "../../../../services/GlobalFunction";
import api from "../../../../services/api";

const WishDetailBox = ({ selectedCard, onSendData, onCloseDetail }) => {
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열리고 닫고 상태 보관
  const [savingAmt, setSavingAmt] = useState(0); // 사용자가 입력한 저축 금액
  const [currentSaving, setCurrentSaving] = useState(0); // 현재 아이가 가진돈
  const { memberNo, name, authorization } = useContext(AuthContext);

  const token = authorization;
  // console.log(token);
  //모달 오픈
  const inserModalOpen = () => {
    setModalOpen(true);
  };
  //모달 닫기
  const inserModalClose = () => {
    setModalOpen(false);
  };
  // console.log("지금 선택된 wish 처음", selectedCard?.id);

  // 부모에 데이터 전달
  const onHandleData = (data) => {
    onSendData(data);
  };

  // 선택된 wish 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    callMyMoney();
  }, []);

  // 돈 모으기 핸들러
  const handleCollectMoney = async () => {
    if (!savingAmt || parseInt(savingAmt, 10) <= 0) {
      alert("저축할 금액을 올바르게 입력하세요.");
      return;
    }

    onHandleData();

    try {
      const response = await axios.put(
        `api/children/saving/wishes`,
        null, // PUT 요청에서 body가 필요하지 않으므로 null 사용
        {
          params: {
            wishNum: selectedCard.id,
            savingAmt: parseInt(savingAmt, 10),
          },
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("저축 성공:", response.data);

      setSavingAmt(""); // 입력 필드 초기화

      // 부모 컴포넌트로 데이터 전달
      onSendData(response.data); // 서버 응답 데이터를 부모 컴포넌트로 전달
      setModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error("저축 실패:", error);
    }
  };

  // 나의 포인트
  const callMyMoney = async () => {
    try {
      const response = await axios.get("api/children/get/point", {
        headers: {
          Authorization: token, // 필요한 경우 토큰 추가
        },
      });
      // 성공 후 상태 업데이트 (현재 모은 돈)
      setCurrentSaving(parseInt(response.data, 10));
    } catch (error) {
      console.error("금액 가져오기 실패:", error);
      alert("금액 가져오기 실패. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <WishDetailBack>
        <Title>나의 위시 상세보기</Title>
        <DetailBox>
          <InsertPreview src={selectedCard.imgSrc} />
          <DetailTextBox>
            <DetailText>나의 물품 이름 : {selectedCard.itemName}</DetailText>
            <DetailText>
              목표가격 : {formatCurrency(selectedCard.itemPrice)}원
            </DetailText>
            <DetailText>
              모은 돈 : {formatCurrency(selectedCard.savingAmt)}원
            </DetailText>
            <DetailText>
              진행률:
              {(
                (selectedCard.savingAmt / selectedCard.itemPrice) *
                100
              ).toFixed(2)}
              %
            </DetailText>
            <ProgressBar
              $progressRate={
                (selectedCard.savingAmt / selectedCard.itemPrice) * 100
              }
            ></ProgressBar>
          </DetailTextBox>
        </DetailBox>
        <BtnBox>
          <DeleteWish onClick={onCloseDetail}>상세 닫기 </DeleteWish>
          <CollectMoney onClick={inserModalOpen}>돈모으기</CollectMoney>
        </BtnBox>
      </WishDetailBack>
      {/* 돈모으기 모달이 열렸을 때만 표시 */}
      {isModalOpen && (
        <Modal width="400px" height="fit-content" padding="20px">
          <Outer>
            <ModalWapper>
              <ModalTitle>위시 돈 모으기</ModalTitle>
              <CancleIcon
                src={`${process.env.PUBLIC_URL}/icons/cancle.png`}
                alt="cancle"
                onClick={inserModalClose}
              />
            </ModalWapper>

            <ModalPreview>
              <img src={selectedCard.imgSrc} alt="" />
            </ModalPreview>

            <DetailText>{selectedCard.itemName}</DetailText>
            <DetailText>
              목표가격 : {formatCurrency(selectedCard.itemPrice)}원
            </DetailText>
            <DetailText>
              현재까지 모은 돈 : {formatCurrency(selectedCard.savingAmt)}원
            </DetailText>
            <DetailText>
              저축가능한 돈 : {formatCurrency(currentSaving)}
            </DetailText>
            <DetailText>넣을 돈</DetailText>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <FormInput
                type="text"
                value={savingAmt}
                onChange={(e) => setSavingAmt(e.target.value)}
              />
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CollectMoney onClick={handleCollectMoney}>돈모으기</CollectMoney>
            </div>
          </Outer>
        </Modal>
      )}
    </>
  );
};
const WishDetailBack = styled.div`
  /* background-color: #ececec; */
  background-color: #ffffff;
  border-radius: 20px;
  margin-top: 100px;
  padding: 30px;
  width: 75%;
  margin: 100px auto 0;
`;
const Title = styled.h3`
  text-align: center;
  /* padding-top: 20px; */
  margin-bottom: 40px;
  font-weight: bold;
`;
const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 30px;
  margin: 0 auto;
`;
const DetailBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
`;
const CancleIcon = styled.img`
  cursor: pointer;
  position: absolute;
  top: -20px;
  right: -20px;
  width: 30px;
  height: 30px;
  margin-left: 60px;
`;
const Outer = styled.div`
  position: relative;
  width: 100%;
`;
const ModalWapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  width: 100%;
`;
const InsertPreview = styled.img`
  width: 15vw;
  height: 25vh;
  border: 1px solid #ccc;
  border-radius: 10px;
`;
const ModalPreview = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 0 auto;
  img {
    width: 100%;
  }
`;
const DetailTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  flex-wrap: wrap;
  max-width: 300px;
  align-items: flex-start;
`;
const DetailText = styled.h5`
  text-align: center;
  padding-top: 10px;
  font-weight: bold;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const DeleteWish = styled.button`
  background-color: #f98d5a;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #f98d5a;
  border-radius: 20px;
  width: 180px;
  height: 43px;
  font-weight: bold;
`;
const CollectMoney = styled.button`
  background-color: #9774fb;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #9774fb;
  border-radius: 20px;
  width: 180px;
  height: 43px;
  font-weight: bold;
`;
const FormInput = styled.input`
  padding: 8px;
  border: 5px solid #c8bef3;
  border-radius: 10px;
  outline: none;
  width: 70%;
`;

const ProgressBar = styled.div`
  width: 300px;
  position: relative;
  height: 30px;
  background-color: lightgray;
  border-radius: 10px;
  overflow: hidden;
  margin: 5px 0;

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: ${(props) => (props.$progressRate ? props.$progressRate : 0)}%;
    background-color: #448c27;
    transition: width 0.3s ease-in-out;
  }
`;

export default WishDetailBox;
