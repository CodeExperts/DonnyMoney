import React, { useRef, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Slider from "react-slick"; // react-slick 라이브러리 임포트
import "slick-carousel/slick/slick.css"; // slick 스타일시트 임포트
import "slick-carousel/slick/slick-theme.css";
import { WishItemCard } from "../../../commons/WishItemCard";
import axios from "axios";
import { AuthContext } from "../../../../App";
import { Modal } from "../../../commons/Modal";
import WishDetailBox from "./WishDetailBox";
import api from "../../../../services/api";
import { wishSlickDummyData } from "../../../../data/wishSlickDummyData";

const Activewish = (imgSrc) => {
  const { memberNo, name, authorization } = useContext(AuthContext);
  const token = authorization;
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열리고 닫고 상태 보관
  const [file, setFile] = useState(null); // 위시등록 파일 상태
  const fileInputRef = useRef(null); // 파일 입력창 참조
  const [previewUrl, setPreviewUrl] = useState(null); //위시등록전송 url 상태
  const [wishName, setWishName] = useState(""); // 위시생성 이름 상태
  const [wishPrice, setWishPrice] = useState(""); // 위시생성 가격 상태
  const [uploading, setUploading] = useState(false); // 업로드 로딩 상태
  const [wishDetail, setWishDetail] = useState(false); //디테일창 상태
  const [cards, setCards] = useState([]); // 슬릭 카드  수 상태
  const [selectedCard, setSelectedCard] = useState(null); // 선택된 카드 상태

  const localStorageAuth = localStorage.getItem("Authorization");

  // 위시 목록 보기
  const showSlick = () => {
    console.log("Activewish - showSlick ...token : ", localStorageAuth);
    axios({
      method: "GET",
      url: `api/children/wishes/active`,
      headers: {
        Authorization: localStorageAuth, // Authorization 헤더에 토큰 추가
        "Content-Type": "multipart/form-data", // 데이터가 multipart/form-data 형식임을 명시
      },
    })
      .then((res) => {
        const formattedData = res.data.map((item) => {
          const savingAmt = Number(item.savingAmt); // savingAmt 변환 및 기본값 처리
          const itemPrice = Number(item.price); // itemPrice 변환 및 기본값 처리
          const progressRate = (savingAmt / itemPrice) * 100 || 0; // 진행률 계산

          return {
            id: item.wishNum, // wishNum을 id로 사용
            imgSrc: item.img, // 이미지 URL
            itemName: item.name, // 아이템 이름
            itemPrice: itemPrice, // 숫자로 변환된 아이템 가격
            progressRate: progressRate, // 계산된 진행률
            savingAmt: savingAmt, // 숫자로 변환된 저축한 돈
          };
        });
        setCards(wishSlickDummyData, ...formattedData);
        console.log("진행률 확인", formattedData);
      })
      .catch((err) => {
        console.error("위시 등록 실패:", err);
      });
  };
  console.log("현재 카드 상태 확인", cards);
  //카드 넣기...
  const handleSubmitWish = async () => {
    console.log("Activewish - handleSubmitWish ... token ", localStorageAuth);

    if (!file || !wishName || !wishPrice) {
      alert("모든 필드를 입력해 주세요."); // 파일과 텍스트 필드가 모두 채워졌는지 확인
      return;
    }
    // FormData 객체 생성
    const formData = new FormData();
    formData.append(
      "wishRequestDtoJson",
      JSON.stringify({
        name: wishName,
        price: parseInt(wishPrice, 10),
      })
    );
    formData.append("wishFile", file); // 파일 첨부
    try {
      const response = await axios.post("api/children/wishes", formData, {
        headers: {
          Authorization: localStorageAuth, // Authorization 헤더에 토큰 추가
          "Content-Type": "multipart/form-data", // 데이터 형식 명시
        },
      });

      // console.log("위시 등록 성공:", response.data);
      // 데이터가 배열인지 객체인지 확인 후 처리
      if (Array.isArray(response.data)) {
        const newCards = response.data.map((item) => ({
          id: item.wishNum,
          imgSrc: item.img,
          itemName: item.name,
          itemPrice: item.price,
          progressRate: 0,
          savingAmt: item.savingAmt,
        }));
        setCards((prevCards) => [...prevCards, ...newCards]);
      } else {
        const newCard = {
          id: response.data.wishNum,
          imgSrc: response.data.img,
          itemName: response.data.name,
          itemPrice: response.data.price,
          progressRate: 0,
          savingAmt: response.data.savingAmt,
        };
        setCards((prevCards) => [...prevCards, newCard]);
      }

      // 요청 성공 후 상태 초기화 및 모달 닫기
      setWishName(""); // 위시 이름 초기화
      setWishPrice(""); // 위시 가격 초기화
      setFile(null); // 파일 초기화
      setPreviewUrl(null); // 미리보기 URL 초기화
      setModalOpen(false); // 모달 닫기
      alert("위시가 성공적으로 등록되었습니다!");
    } catch (error) {
      console.error("위시 등록 실패:", error);
      alert("위시 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  //모달 오픈
  const inserModalOpen = () => {
    setModalOpen(true);
  };
  //모달 닫기
  const inserModalClose = () => {
    setModalOpen(false);
  };
  // 파일 입력창 활성화
  const handleActivateFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          width: "50px",
          height: "50px",
          display: "block",
          position: "absolute",
          right: "-50px", // 슬라이더 외부에 배치
          top: "50%", // 슬라이더의 가운데 배치
          transform: "translateY(-50%)",
          zIndex: 10, // 슬라이더 위에 표시되도록 설정
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <img src="/icons/next-arrow.png" alt="Next" style={{ width: "100%" }} />
      </div>
    );
  };

  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          width: "50px",
          height: "50px",
          display: "block",
          position: "absolute",
          left: "-50px", // 슬라이더 외부에 배치
          top: "50%", // 슬라이더의 가운데 배치
          transform: "translateY(-50%)",
          zIndex: 10, // 슬라이더 위에 표시되도록 설정
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <img src="/icons/prev-arrow.png" alt="Next" style={{ width: "100%" }} />
      </div>
    );
  };

  // Slick Slider 설정 옵션
  const settings = {
    infinite: true, // 무한 스크롤 설정
    // speed: 500, // 전환 속도 (ms)
    slidesToShow: 3, // 한 번에 보여질 슬라이드 수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
    // centerMode: true, // 슬라이드 가운데 정렬 활성화
    nextArrow: <CustomNextArrow />, // 커스텀 화살표 적용
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1000, // 화면 크기가 768px 이하일 경우
        settings: {
          slidesToShow: 1, // 슬라이드 1개씩 표시
        },
      },
    ],
  };
  // 카드 클릭 핸들러
  const showDetail = (card) => {
    setSelectedCard(card); // 클릭된 카드 데이터 설정
    setWishDetail(true); // 디테일 창 열기
  };
  //디테일창 닫기
  const closeDetail = () => {
    setWishDetail(false);
  };
  // WishDetailBox 업데이트
  const handleSelectCard = (updateData) => {
    console.log("부모의 handleSelectCard 호출: ", updateData);

    setSelectedCard((prev) => ({
      ...prev,
      ...updateData,
    }));
  };

  useEffect(() => {
    console.log("Activewish - useEffect ...");
    showSlick();
  }, []);

  return (
    <>
      <ButtonSection>
        <InsertWish onClick={inserModalOpen}>위시 등록하기</InsertWish>
      </ButtonSection>
      {/* 위시 생성 모달이 열렸을 때만 표시 */}
      {isModalOpen && (
        <Modal width="430px" height="fit-content" sidePadding="50px 0">
          <ModalWapper>
            <MTitle>내 위시 등록</MTitle>
            <CancleIcon
              src={`${process.env.PUBLIC_URL}/icons/cancle.png`}
              alt="cancle"
              onClick={inserModalClose}
            />
          </ModalWapper>
          <PreviwImg>
            {/* 이미지 미리보기 */}
            {previewUrl && <InsertPreview src={previewUrl} alt="미리보기" />}
          </PreviwImg>

          {/* 파일 선택 */}
          <InsertImg onClick={handleActivateFileInput}>이미지등록</InsertImg>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} // input을 숨김
          />
          <FormBox>
            <FormTitle>이름</FormTitle>
            <FormInput
              type="text"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
            />
          </FormBox>
          <FormBox>
            <FormPrice>물품 가격</FormPrice>
            <FormInput
              type="text"
              value={wishPrice}
              onChange={(e) => setWishPrice(e.target.value)}
            />
          </FormBox>
          <InsertWishinModal onClick={handleSubmitWish}>
            내 위시 올리기
          </InsertWishinModal>
        </Modal>
      )}
      <SliderContainer style={{ width: "80%", margin: "auto" }}>
        {/* Slick Slider */}
        <Slider {...settings}>
          {cards.map((card) => (
            <WishItemCard
              imgSrc={card.imgSrc}
              itemName={card.itemName}
              itemPrice={card.itemPrice}
              progressRate={card.progressRate}
              cardWidth={"260px"}
              cardHeight={"350px"}
              cardPadding={"25px"}
              cardBgColor={"#C0A9EF"}
              cardFontColor={"#ffffff"}
              onClick={() => showDetail(card)}
            />
          ))}
        </Slider>
      </SliderContainer>
      {wishDetail && (
        <WishDetailBox
          selectedCard={selectedCard}
          onSendData={handleSelectCard}
          onCloseDetail={closeDetail}
        />
      )}
    </>
  );
};

const ButtonSection = styled.div`
  display: flex;
  justify-content: end;
  // border: 1px solid red;
  margin-bottom: 50px;
  margin-right: 50px;
`;

const InsertPreview = styled.img`
  width: 10vw;
  height: 20vh;
  border: 1px solid #ccc;
  border-radius: 10px;
`;
const PreviwImg = styled.div`
  width: 10vw;
  height: 20vh;
  border: 1px solid #ccc;
  border-radius: 10px;
  /* margin-bottom: 20px; */
`;
const InsertWish = styled.button`
  background-color: #9774fb;
  border: none;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border-radius: 30px;
  width: 200px;
  height: 50px;
  margin-top: 10px;
  font-weight: bold;
  margin-right: 110px;
`;
const MTitle = styled.h2`
  text-align: center;
  margin-left: 90px;
`;
const ModalWapper = styled.div`
  display: flex;
  align-content: space-around;
  justify-content: space-around;
  align-items: flex-end;
  margin-bottom: 25px;
`;
const CancleIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-left: 60px;
`;

const InsertImg = styled.button`
  background-color: white;
  border: none;
  border-bottom: 2px solid lightgray;
  color: #919090;
  font-style: bold;
  font-size: 1.2rem;
  /* border-radius: 30px; */
  /* width: 150px; */
  height: 30px;
  /* margin-top: 15px; */
  margin-bottom: 24px;
  font-weight: bold;
`;
const FormBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 15px 0 10px 0;
  align-items: center;
  /* border: 1px solid red; */
  width: 75%;
`;
const FormTitle = styled.h4`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin: 0 55px 0 0;
`;
const FormPrice = styled.h4`
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  color: black;
`;
const FormInput = styled.input`
  padding: 8px;
  border: 5px solid #c8bef3;
  border-radius: 10px;
  outline: none;
  max-width: 30vw;
`;
const InsertWishinModal = styled.button`
  background-color: #9774fb;
  border: none;
  color: white;
  font-style: bold;
  font-size: 1.2rem;
  border-radius: 30px;
  width: 200px;
  height: 50px;
  margin-top: 20px;
  font-weight: bold;
`;

const SliderContainer = styled.div`
  .slick-prev:before,
  .slick-next:before {
    display: none;
  }
`;
export default Activewish;
