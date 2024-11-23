import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigator = useNavigate();

  const [step, setStep] = useState(1); // 현재 단계 상태
  const steps = [
    { number: 1, label: "회원정보 입력" },
    { number: 2, label: "회원가입 완료" },
  ];

  const [parent, setParent] = useState({
    id: "",
    pwd: "",
    name: "",
    birthdate: null,
    phone: "",
    email: "",
    role: "ROLE_PARENT",
  });

  // 중복체크 결과 값을 저장 할 idCheckResult
  const [idCheckResult, setIdCheckResult] = useState("");

  // 아이디 중복여부에 따른 css 를 적용하기 위해 상태 변수
  const [isCheckResult, setIsCheckResult] = useState(false);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  //각 text 박스에 값이 변경되었을 때
  const changeValue = (e) => {
    // 입력 필드 값 업데이트
    // setChild({ ...child, [e.target.name]: e.target.value });
    setParent((prevParent) => ({
      ...prevParent,
      [e.target.name]: e.target.value,
    }));

    //id 입력박스에 값이 입력될때마다 axios를 이용해서 비동기통신 - 중복여부 체크
    if (e.target.name === "id" && e.target.value.trim() !== "") {
      axios({
        method: "GET",
        url: `/parents/signup/${e.target.value}`,
      })
        .then((res) => {
          // console.log(res);
          setIdCheckResult(res.data);
          setIsCheckResult(res.data === "아이디 사용 가능");
        })
        .catch((err) => {
          console.log(err);
          setIsCheckResult(false); // 기본값으로 비활성화
        });
    }
  };

  //가입하기
  const submitJoin = (e) => {
    axios({
      method: "POST",
      url: `/parents/signup`,
      data: parent,
    })
      .then((res) => {
        console.log(res);
        // navigator("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // 1단계에서 모든 입력값이 존재하는지 확인
    const allFieldsFilled = Object.values(parent).every(
      (value) => value && value !== ""
    );
    // 모든 필드가 채워져 있고, 아이디 중복 검사가 통과되었는지 확인
    const isFormValid = allFieldsFilled && isCheckResult;

    console.log("parent:", parent);
    console.log("allFieldsFilled:", allFieldsFilled);
    console.log("isCheckResult:", isCheckResult);
    console.log("isFormValid:", isFormValid);

    // 버튼 활성화 상태 업데이트
    setIsButtonEnabled(isFormValid);
  }, [parent, isCheckResult]);

  return (
    <Container>
      {/* Progress Bar */}
      <ProgressBar>
        {steps.map((item, index) => (
          <Step key={index} isActive={step === item.number}>
            <Circle isActive={step >= item.number}>{item.number}</Circle>
            <CustomLabel isActive={step >= item.number}>
              {item.label}
            </CustomLabel>
            {index < steps.length - 1 && <Line isActive={step > item.number} />}
          </Step>
        ))}
      </ProgressBar>

      {/* 단계별 내용 */}
      <Content>
        {step === 1 && (
          <>
            <h2>1단계: 회원가입 정보</h2>
            <InputRow>
              <Label>아이디</Label>
              <Input
                type="text"
                id="id"
                name="id"
                placeholder="아이디 입력"
                onChange={changeValue}
              />
              <p style={isCheckResult ? { color: "blue" } : { color: "red" }}>
                {idCheckResult}
              </p>
            </InputRow>
            <InputRow>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="pwd"
                placeholder="비밀번호 입력"
                onChange={changeValue}
              />
            </InputRow>
            <InputRow>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                placeholder="이름 입력"
                onChange={changeValue}
              />
            </InputRow>
            <InputRow>
              <Label htmlFor="birthdate">생일</Label>
              <Input
                type="date"
                id="birthdate"
                name="birthdate"
                onChange={changeValue}
              />
            </InputRow>
            <InputRow>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                onChange={changeValue}
                placeholder="010-0000-0000"
              />
            </InputRow>

            <InputRow>
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                type="email"
                id="email"
                name="email"
                onChange={changeValue}
                placeholder="donny@donnymoney.com"
              />
            </InputRow>
            <Button
              disabled={!isButtonEnabled}
              onClick={() => {
                submitJoin();
                setStep(2);
              }}
            >
              회원가입
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>회원가입 완료</h2>
            <p>회원가입이 성공적으로 완료되었습니다!</p>
            <Button
              onClick={() => {
                navigator("/login");
              }}
            >
              로그인하기
            </Button>
          </>
        )}
      </Content>
    </Container>
  );
};

export default RegisterPage;

const Container = styled.div`
  width: 600px;
  margin: 50px auto;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  flex: 1; /* 각 Step을 동일한 너비로 설정 */
`;

const Circle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? "#9774FB" : "#e0e0e0")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  z-index: 1;
`;

const CustomLabel = styled.div`
  margin-top: 5px;
  color: ${(props) => (props.isActive ? "#9774FB" : "#a0a0a0")};
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
`;

const Line = styled.div`
  width: 100%; /* Step 사이의 간격에 맞게 조정 */
  height: 2px;
  background-color: ${(props) => (props.isActive ? "#9774FB" : "#e0e0e0")};
  position: absolute;
  top: 15px;
  left: 50%;
  /* transform: translateX(-50%); */
  z-index: -1;
  transition: background-color 0.3s ease; /* 배경색 변경 애니메이션 */
`;

const Content = styled.div`
  text-align: center;
`;

const InputRow = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #9774fb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
