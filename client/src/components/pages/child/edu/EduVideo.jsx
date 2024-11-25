import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import api from "../../../../services/api";

const EduVideo = () => {
  const token = localStorage.getItem("Authorization");
  const [videoList, setVideoList] = useState(null);

  useEffect(() => {
    axios({
      method: "GET",
      //일일 한도가 있기 때문에 확인하고 싶을 때 "/" 제거 후 사용
      url: `api/edu`,
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setVideoList(res.data);
      })
      .catch((err) => {
        alert("유튜브 불러오기 실패");
      });
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  // videoList가 아직 없으면 로딩 상태 표시
  if (!videoList) {
    return <Loading>Loading...</Loading>;
  }

  // HTML 엔티티 디코딩 함수
  const decodeHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent || doc.body.textContent;
  };

  // 디스크립션 글자수 제한 함수 (최대 100자)
  const getLimitedDescription = (text, limit = 100) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  return (
    <Container>
      <PageTitle>🎥 도니와 함께 경제공부를 해볼까요? </PageTitle>

      {/* 첫 번째 영상 크게 */}
      <MainVideoWrapper>
        <iframe
          src={`https://www.youtube.com/embed/${videoList[0].videoId}`}
          title={decodeHtml(videoList[0].title)}
          width="100%"
          height="500"
          allowFullScreen
        />
        <VideoDescription>
          {getLimitedDescription(decodeHtml(videoList[0].description))} 🤓
        </VideoDescription>

        <Character>
          <img src="images/donny2.png" alt="연필 든 캐릭터" />
          {/* 말풍선 추가 */}
          <SpeechBubble>나랑 같이 경제왕이 돼보자!!</SpeechBubble>
        </Character>
      </MainVideoWrapper>

      {/* 나머지 영상들은 3열 그리드 */}
      <VideoGrid>
        {videoList.slice(1).map((video, index) => (
          <VideoCard key={index}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={decodeHtml(video.title)}
              width="100%"
              height="200"
              allowFullScreen
            />
            <VideoDescription>
              {decodeHtml(video.description)} 🌟
            </VideoDescription>
          </VideoCard>
        ))}
      </VideoGrid>
    </Container>
  );
};

export default EduVideo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100%;
  margin: 0;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const MainVideoWrapper = styled.div`
  position: relative;
  margin-bottom: 30px;
  background-color: #2d7f76; // 청록색 배경
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
`;

// const Title = styled.h2`
//   position: absolute;
//   top: 20px;
//   left: 20px;
//   color: white;
//   font-size: 28px;
//   font-weight: bold;
// `;

const VideoDescription = styled.p`
  color: white;
  font-size: 16px;
  margin-top: 10px;
  padding: 10px;
  background-color: rgb(181, 129, 90); // 칠판 나무색 배경
  border-radius: 5px;
  text-align: center;
  font-family: "HakgyoansimDunggeunmisoTTF-R";
  font-weight: lighter;
`;

const Character = styled.div`
  position: absolute;
  top: -100px;
  right: -60px;
  width: 240px;
  height: 240px;

  img {
    width: 80%;
    height: 80%;
    box-sizing: border-box;
  }

  animation: moveCharacter 500ms infinite alternate;

  @keyframes moveCharacter {
    0% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 900px;
  padding: 40px 0px;
`;

const VideoCard = styled.div`
  background-color: #2d7f76;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

// const VideoTitle = styled.p`
//   color: white;
//   text-align: center;
//   padding: 10px;
//   background-color: #444;
//   font-size: 16px;
//   margin: 0;
//   font-weight: bold;
// `;

const SpeechBubble = styled.div`
  position: absolute;
  top: -60px; /* 말풍선 위치 조정 */
  right: 20px; /* 말풍선 오른쪽 위치 */
  background: linear-gradient(
    145deg,
    rgb(142, 43, 255),
    rgb(248, 128, 252)
  ); /* 부드러운 그라데이션 색상 */
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 18px;
  border-radius: 25px;
  width: fit-content;
  text-align: center;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: rotate(-5deg);
  font-family: "HakgyoansimDunggeunmisoTTF-R";
  font-weight: lighter;

  /* 말풍선 꼬리 부분 */
  ::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 30px; /* 꼬리 위치 */
    border-width: 12px;
    border-style: solid;
    border-color: #bb3cf7 transparent transparent transparent;
  }
`;

const Loading = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;
