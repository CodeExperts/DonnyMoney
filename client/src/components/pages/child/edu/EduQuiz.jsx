import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import api from "../../../../services/api";

const EduQuiz = () => {
  const token = localStorage.getItem("Authorization");

  const [quizData, setQuizData] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scoreByCategory, setScoreByCategory] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [curQuizResult, setCurQuizResult] = useState(null); // 현재 퀴즈 결과 상태
  const [totalScore, setTotalScore] = useState(0); // 총점 상태

  // 현재까지 카테고리별 성취도
  const [curAchivementByCategory, setCurAchivementByCategory] = useState({
    exchangeRate: 0,
    government: 0,
    history: 0,
    investment: 0,
    word: 0,
  });

  const categoryMapping = {
    exchangeRate: "💵환율",
    investment: "📈투자",
    history: "🏛️역사",
    government: "🏢정부",
    word: "📚경제용어",
  };

  // GET 요청으로 퀴즈 성취도 결과 가져오기
  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const response = await axios.get(`api/children/show/quiz"`, {
          headers: { Authorization: `${token}` },
        });

        // 퀴즈 결과 데이터 설정
        const quizResult = response.data;

        // curQuizResult 상태에 데이터 저장
        setCurQuizResult(quizResult);

        // 카테고리별 점수 계산
        const newScores = {
          exchangeRate: quizResult.qExchangeRate || 0,
          government: quizResult.qGoverment || 0,
          history: quizResult.qHistory || 0,
          investment: quizResult.qInvestment || 0,
          word: quizResult.qWord || 0,
        };

        setCurAchivementByCategory(newScores);

        // 카테고리별 점수 합계
        const total = Object.values(newScores).reduce(
          (acc, score) => acc + score,
          0
        );
        setTotalScore(total); // 총점 업데이트
      } catch (error) {
        console.error("퀴즈 진행 상황 가져오기 오류:", error);
      }
    };

    fetchQuizResult();
  }, [token]);

  // progressbar width
  const progressBarWidth = (totalScore / 50) * 100;

  // API에서 퀴즈 데이터 가져오기
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`api/children/quiz`, {
          headers: { Authorization: `${token}` },
        });

        const groupedData = response.data.reduce((acc, question) => {
          const { category } = question;
          if (!acc[category]) acc[category] = [];
          acc[category].push(question);
          return acc;
        }, {});

        setQuizData(groupedData);
        setCurrentCategory(Object.keys(groupedData)[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("퀴즈 데이터 조회 오류:", error);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [token]);

  // 정답 처리
  const handleAnswer = (userAnswer) => {
    const currentQuestion = quizData[currentCategory][currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.answer;

    if (isCorrect) {
      setScoreByCategory((prev) => ({
        ...prev,
        [currentCategory]: (prev[currentCategory] || 0) + 1,
      }));
    }

    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < quizData[currentCategory].length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      const categories = Object.keys(quizData);
      const currentCategoryIndex = categories.indexOf(currentCategory);

      if (currentCategoryIndex + 1 < categories.length) {
        setCurrentCategory(categories[currentCategoryIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        setShowResult(true);
      }
    }
  };

  // 퀴즈 다 풀면 각각의 스코어를 전송
  const sendResultsToDB = async () => {
    try {
      const scoreArray = Object.entries(scoreByCategory).map(
        ([category, score]) => ({
          category,
          score,
        })
      );
      await axios.put(`api/children/update/quiz`, scoreArray, {
        headers: { Authorization: `${token}` },
      });
    } catch (error) {
      console.error("결과 전송 오류:", error);
    }
  };

  useEffect(() => {
    if (showResult) {
      sendResultsToDB();
    }
  }, [showResult]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <p>Loading quiz...</p>
      </LoadingContainer>
    );
  }

  if (!quizData || Object.keys(quizData).length === 0) {
    return (
      <ErrorContainer>
        <p>퀴즈 데이터를 불러올 수 없습니다.</p>
      </ErrorContainer>
    );
  }

  //해설 페이지
  const renderExplanation = () => {
    return (
      <ExplanationWrapper>
        {Object.entries(quizData).map(([category, questions]) => (
          <CategoryExplanation key={category}>
            <h3>
              {categoryMapping[category]}{" "}
              <span role="img" aria-label="category"></span>
            </h3>
            <ul>
              {questions.map((q, index) => {
                const userScore = scoreByCategory[category] || 0;
                const isCorrect = userScore > index;

                return (
                  <li
                    key={index}
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      border: isCorrect ? "2px solid green" : "2px solid red",
                      borderRadius: "5px",
                      backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {isCorrect
                        ? "맞췄어요 🎉"
                        : "틀렸어요 😞 설명을 확인해주세요"}
                    </div>
                    <hr />
                    <div>
                      <strong>질문:</strong> {q.quiz}
                    </div>
                    <div>
                      <strong>정답:</strong> {q.answer === "1" ? "⭕" : "❌"}
                    </div>
                    <div>
                      <strong>해설:</strong>{" "}
                      {q.description || "해설이 존재하지 않습니다."}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CategoryExplanation>
        ))}
      </ExplanationWrapper>
    );
  };

  //각 카테고리별 스코어 계산
  const calculateScore = () => {
    let totalScore = 0;
    let totalQuestions = 0;

    Object.entries(quizData).forEach(([category, questions]) => {
      totalQuestions += questions.length;
      totalScore += scoreByCategory[category] || 0;
    });

    return Math.round((totalScore / totalQuestions) * 100);
  };

  return (
    <QuizContainer>
      {showResult ? (
        <ResultContainer>
          <h2>
            🎉퀴즈를 다 풀었습니다
            <span role="img" aria-label="celebrate"></span>
          </h2>
          <p>📃퀴즈결과: {calculateScore()}점 / 100점</p>
          {calculateScore() <= 40 && calculateScore() > 0 && (
            <p>도니머니와 조금 더 공부해볼까요?</p>
          )}
          {calculateScore() > 40 && calculateScore() <= 60 && (
            <p>조금만 더 공부하면 100점 가능해요!</p>
          )}
          {calculateScore() > 60 && calculateScore() <= 80 && (
            <p>100점이 눈앞에 있어요!</p>
          )}
          {calculateScore() > 80 && <p>🎉 💯완벽해요! 100점 달성!</p>}
          <hr />
          {renderExplanation()}
        </ResultContainer>
      ) : (
        quizData[currentCategory] &&
        quizData[currentCategory][currentQuestionIndex] && (
          <QuestionContainer>
            <CategoryHeader>
              {categoryMapping[currentCategory]} 퀴즈
            </CategoryHeader>
            <h2>{quizData[currentCategory][currentQuestionIndex].quiz}</h2>

            <ButtonWrapper>
              <OXButton onClick={() => handleAnswer("1")}>O</OXButton>
              <QuizImage src="images/donny.png" alt="양손 도니" />
              <OXButton onClick={() => handleAnswer("0")}>X</OXButton>
            </ButtonWrapper>
          </QuestionContainer>
        )
      )}
    </QuizContainer>
  );
};

export default EduQuiz;

// Styled Components
const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  /* background-color: rgb(255, 255, 255); */
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
  font-size: 24px;
  font-weight: bold;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
  font-size: 24px;
  color: red;
  font-weight: bold;
`;

const QuestionContainer = styled.div`
  text-align: center;
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 40px 0px;
  background-color: #e0f2f1;
  border: 3px solid #b2dfdb;
  font-size: 20px;
`;

const CategoryHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #004d40;
  margin-bottom: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0px;
  margin-top: 40px;
  padding: 20px;
`;

const OXButton = styled.button`
  background-color: rgb(2, 156, 130); /* 어두운 녹색 */
  color: white;
  border: none;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  font-size: 60px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: content-box;

  &:hover {
    background-color: #004d40;
  }

  &:active {
    background-color: #004d40;
  }
`;

const QuizImage = styled.img`
  width: 35%;
  height: 35%;
  animation: moveCharacter 500ms infinite alternate;
  will-change: transform;

  @keyframes moveCharacter {
    0% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(10px);
    }
  }
`;

const ResultContainer = styled.div`
  text-align: center;
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 40px 0px;
  background-color: #e0f2f1;
  border: 3px solid #b2dfdb;
  font-size: 20px;
`;

const ExplanationWrapper = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #333;
`;

const CategoryExplanation = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 22px;
    color: #004d40;
    margin-bottom: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-size: 16px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  strong {
    font-weight: bold;
  }

  p {
    color: #2121fc;
  }
`;

const CoinImage = styled.img`
  position: absolute;
  top: -30px;
  right: -10px;
  width: 100px;
  height: 100px;
`;
