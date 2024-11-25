import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";

const RegisterPage = () => {
  const navigator = useNavigate();

  const [step, setStep] = useState(1); // 현재 단계 상태
  const steps = [
    { number: 1, label: "회원가입 정보" },
    { number: 2, label: "부모님 연동" },
    { number: 3, label: "회원가입 완료" },
  ];

  const [child, setChild] = useState({
    id: "",
    pwd: "",
    name: "",
    birthdate: null,
    phone: "",
    email: "",
    role: "ROLE_CHILD",
    parentNum: 1, // 부모 번호는 초기값이 없을 수도있음
  });

  // 중복체크 결과 값을 저장 할 idCheckResult
  const [idCheckResult, setIdCheckResult] = useState("");

  // 아이디 중복여부에 따른 css 를 적용하기 위해 상태 변수
  const [isCheckResult, setIsCheckResult] = useState(false);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // 부모님 존재 여부 메시지
  const [parentExistMessage, setParentExistMessage] = useState("");

  // 부모님 존재 여부 상태
  const [isParentExist, setIsParentExist] = useState(false);

  // 부모님 이름 연락처 상태
  const [parentInfo, setParentInfo] = useState({
    name: "",
    phone: "",
  });

  //각 text 박스에 값이 변경되었을 때
  const changeValue = (e) => {
    // 입력 필드 값 업데이트
    // setChild({ ...child, [e.target.name]: e.target.value });
    setChild((prevChild) => ({
      ...prevChild,
      [e.target.name]: e.target.value,
    }));

    //id 입력박스에 값이 입력될때마다 axios를 이용해서 비동기통신 - 중복여부 체크
    if (e.target.name === "id" && e.target.value.trim() !== "") {
      axios({
        method: "GET",
        url: `api/children/signup/${e.target.value}`,
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
  // 부모님 찾기 버튼을 눌렀을 떄
  const findParent = (e) => {
    if (parentInfo.name !== "" && parentInfo.phone !== "") {
      axios({
        method: "POST",
        url: `api/children/signup/findMyParent`,
        data: parentInfo,
      })
        .then((res) => {
          console.log(res.data);
          const parentExists = !!res.data;
          setIsParentExist(parentExists);
          setParentExistMessage(
            parentExists
              ? "부모님 정보 찾기 완료! 회원가입 버튼을 눌러주세요"
              : "부모님 정보가 존재하지 않습니다. 부모님께 확인해보세요"
          );

          if (parentExists) {
            setChild({ ...child, parentNum: res.data.parentNum });
          }
          // setIsParentExist(res.data);
          // if (res.data) {
          //   setChild({ ...child, parentNum: res.data.parentNum });
          //   setParentExistMessage(
          //     "부모님 찾기 완료! 회원가입 버튼을 눌러주세요"
          //   );
          //   setIsParentExist(true);
          // } else {
          //   setParentExistMessage(
          //     "부모님이 존재하지 않습니다. 부모님께 확인해보세요"
          //   );
          //   setIsParentExist(false);
          // }
        })
        .catch((err) => {
          if (err.response && err.response.status === 403) {
            // 403 Forbidden
            console.error("403 Forbidden:", err.response.data);
            setParentExistMessage(
              "접근 권한이 없습니다. 관리자에게 문의하세요"
            );
          } else {
            // 다른 오류 처리
            console.error("Error:", err);
            setParentExistMessage("예기치 않은 오류가 발생했습니다.");
          }
        });
    } else {
      setParentExistMessage("부모님의 정보를 모두 입력해주세요.");
      setIsParentExist(false);
    }
  };

  //가입하기
  const submitJoin = (e) => {
    if (!child.parentNum) {
      alert("부모님 정보를 확인한 후, 가입을 진행해주세요.");
      return;
    }
    axios({
      method: "POST",
      url: `api/children/signup`,
      data: child,
    })
      .then((res) => {
        console.log(res);
        navigator("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // 1단계에서 parentNum 외 모든 입력값이 존재하는지 확인
    const fieldsToValidate = Object.entries(child).filter(
      ([key]) => key !== "parentNum" // parentNum 제외
    );
    const allFieldsFilled = Object.values(child).every(
      (value) => value && value !== ""
    );
    // 모든 필드가 채워져 있고, 아이디 중복 검사가 통과되었는지 확인
    const isFormValid = allFieldsFilled && isCheckResult;

    console.log("child:", child);
    console.log("allFieldsFilled:", allFieldsFilled);
    console.log("isCheckResult:", isCheckResult);
    console.log("isFormValid:", isFormValid);

    // 버튼 활성화 상태 업데이트
    setIsButtonEnabled(isFormValid);
  }, [child, isCheckResult]);

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
                autoComplete="off"
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
                autoComplete="off"
              />
            </InputRow>
            <InputRow>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                placeholder="이름 입력"
                onChange={changeValue}
                autoComplete="off"
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
                autoComplete="off"
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
            <Button disabled={!isButtonEnabled} onClick={() => setStep(2)}>
              다음
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>부모님 연동하기</h2>
            <InputRow>
              <Label>부모님 이름</Label>
              <Input
                type="text"
                placeholder="부모님 이름 입력"
                onChange={(e) =>
                  setParentInfo({ ...parentInfo, name: e.target.value })
                }
              />
            </InputRow>
            <InputRow>
              <Label>부모님 연락처</Label>
              <Input
                type="text"
                placeholder="부모님 연락처 입력"
                onChange={(e) =>
                  setParentInfo({ ...parentInfo, phone: e.target.value })
                }
              />
            </InputRow>

            <p style={isParentExist ? { color: "green" } : { color: "red" }}>
              {parentExistMessage}
            </p>

            {!isParentExist && (
              <Button onClick={findParent}>부모님 정보 확인</Button>
            )}
            {/* 회원가입버튼 */}
            {isParentExist && (
              <Button
                onClick={() => {
                  submitJoin();
                  setStep((prev) => Math.min(prev + 1, steps.length));
                }}
              >
                가입하기
              </Button>
            )}
          </>
        )}
        {step === 3 && (
          <>
            <h2>회원가입 완료</h2>
            <p>회원가입이 성공적으로 완료되었습니다!</p>
            <Button onClick={() => navigator("/login")}>로그인하기</Button>
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
