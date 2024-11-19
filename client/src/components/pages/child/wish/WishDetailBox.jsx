import React, { useRef, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "../../../commons/Modal";
import axios from "axios";
import { AuthContext } from "../../../../App";
import {formatCurrency} from "../../../../services/GlobalFunction";
import { PlanContext } from "../../../../pages/context/MoneyPlanContext";
const WishDetailBox = () => {
  const { selectedCard, setSelectedCard } = useContext(PlanContext);
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열리고 닫고 상태 보관
  const [savingAmt, setSavingAmt] = useState(0); // 사용자가 입력한 저축 금액
  const [currentSaving, setCurrentSaving] = useState(0); // 현재 아이가 가진돈
  const { memberNo, name, authorization } = useContext(AuthContext);

  const token = authorization;
  console.log(token);
  //모달 오픈
  const inserModalOpen = () => {
    setModalOpen(true);
  };
  //모달 닫기
  const inserModalClose = () => {
    setModalOpen(false);
  };
  console.log("지금 선택된 wish 처음",selectedCard?.id);

  // 부모에 데이터 전달
  const onHandleData = (data) => {
    // updateParentState(data);
    // handleSelectCard(data)
  }

//   const fetchWishData = async () => {
//     // console.log("token ================> ", token);
    
//     if(!selectedCard.id) {
//       console.log("id 없음") ;
//       return;
//     }

//     if (selectedCard.id) {
//       console.log("fetchWishData if ");
      
//       try {
//         const response = await axios.get(
//           `http://localhost:9999/children/wishes/${selectedCard.id}`,
//           {
//             headers: {
//               Authorization: token, // 필요한 경우 토큰 추가
//             },
//           }
//         );
        
//         // console.log("fetchWishData 위시 업데이트된 데이터 ========> ",response.data );
        
// // 부모 상태 갱신
//         handleSelectCard(response.data); // 새 객체 전달

//       } catch (error) {
//         console.error("Wish 데이터 로드 실패:", error);
//         alert("Wish 데이터를 가져오는 데 실패했습니다.");
//       }
//     }
//   };
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
  
    try {
      const response = await axios.put(
        `http://localhost:9999/children/saving/wishes`,
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
  
      console.log("저축 성공 :", response.data);
  
      // 성공 후 상태 업데이트
      // setCurrentSaving((prev) => prev + parseInt(selectedCard.savingAmt, 10));
      // setSavingAmt(""); // 입력 필드 초기화
      // alert("성공적으로 저축되었습니다!");

      ///////////////////////////////////////////////////
      // console.log("handleCollectMoney selectedCard ====================== : ", selectedCard);
      // console.log("handleCollectMoney response.data ====================== : ", response.data);
      
      
      // console.log("Saving money successful!");
      // handleSelectCard(response.data); // 데이터 갱신

      // console.log("지금 선택된 wish 업데이트 시",selectedCard?.id);
      setSelectedCard({
        id: response.data.wishNum,
        imgSrc: response.data.img,
        itemName: response.data.name,
        itemPrice: response.data.price,
        progressRate: (response.data.savingAmt / response.data.price) * 100,
        savingAmt: response.data.savingAmt, 
      }); // 데이터 갱신
      setModalOpen(false); // 모달 닫기
      setSavingAmt(0);
      console.log("지금 선택된 wish 업데이트 완료후",selectedCard?.id);
    } catch (error) {
      console.error("저축 실패:", error);
      if (error.response?.status === 403) {
        alert("권한이 없습니다. 다시 로그인해주세요.");
      } else {
        alert("저축에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };      
  
// 나의 포인트
const callMyMoney = async () => {
  try {
    const response = await axios.get(
      "http://localhost:9999/children/get/point",
      {
        headers: {
          Authorization: token, // 필요한 경우 토큰 추가
        },
      }
    );

    // console.log("금액 가져오기 성공:", response.data);

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
            <DetailText>진행률: {selectedCard.progressRate}%</DetailText>
            <ProgressBar progressRate={selectedCard.progressRate}></ProgressBar>
          </DetailTextBox>
        </DetailBox>
        <DeleteWish >위시 삭제</DeleteWish>
        <CollectMoney onClick={inserModalOpen}>돈모으기</CollectMoney>
      </WishDetailBack>
      {/* 돈모으기 모달이 열렸을 때만 표시 */}
      {isModalOpen && (
        <Modal width="400px" height="600px">
          <ModalTitle>위시 돈 모으기</ModalTitle>
          <ModalPreview src={selectedCard.imgSrc} />
          <DetailText>{selectedCard.itemName}</DetailText>
          <DetailText>
            목표가격 : {formatCurrency(selectedCard.itemPrice)}원
          </DetailText>
          <DetailText>현재까지 모은 돈 : {formatCurrency(selectedCard.savingAmt)}원</DetailText>
          <DetailText>저축가능한 돈 : {formatCurrency(currentSaving)}</DetailText>
          <DetailText>넣을 돈</DetailText>
          <FormInput 
            type="text" 
            value={savingAmt} 
            onChange={(e) => setSavingAmt(e.target.value)} 
          />
          <CollectMoney onClick={ handleCollectMoney }>돈모으기</CollectMoney>
        </Modal>
      )}
    </>
  );
};
const WishDetailBack = styled.div`
  background-color: #ececec;
  margin-top: 100px;
`;
const Title = styled.h3`
  color: black;
  text-align: center;
  padding-top: 50px;
  font-weight: bold;
`;
const ModalTitle = styled.h3`
  color: black;
  text-align: center;
  font-weight: bold;
`;
const DetailBox = styled.div`
  display: flex;
`;

const InsertPreview = styled.img`
  width: 20vw;
  height: 20vh;
  border: 1px solid #ccc;
  border-radius: 10px;
`;
const ModalPreview = styled.img`
  max-width: 20vw;
  max-height: 20vh;
  border: 1px solid #ccc;
  border-radius: 10px;
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
  color: black;
  text-align: center;
  padding-top: 10px;
  font-weight: bold;
`;
const DeleteWish = styled.button`
  background-color: #4829d7;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #4829d7;
  border-radius: 10px;
  width: 15vw;
  height: 5.8vh;
  margin-top: 1vh;
  font-weight: bold;
`;
const CollectMoney = styled.button`
  background-color: #4829d7;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border: 2px solid #4829d7;
  border-radius: 10px;
  width: 15vw;
  height: 5.8vh;
  margin-top: 1vh;
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
    width: ${(props) => (props.progressRate ? props.progressRate : 0)}%;
    background-color: #448c27;
    transition: width 0.3s ease-in-out;
  }
`;
export default WishDetailBox;
