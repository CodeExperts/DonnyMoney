import { createGlobalStyle } from "styled-components";

// 전역 스타일 정의
export const GlobalStyle = createGlobalStyle`
/* 기본 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}
body{
  /* background-image: url("https://i.pinimg.com/1200x/41/65/78/41657884a3e5a5069cdc324b1e44c6ea.jpg"); */
  /* background-image: url("https://i.pinimg.com/1200x/41/65/78/41657884a3e5a5069cdc324b1e44c6ea.jpg"); */
  /* background-repeat: no-repeat;
  background-size: cover; */
  // background-color: #f0e6ff; /* 연한 보라색 */

  /* background-color: #F1EEE1; */
  /* background-color: #F1F1F1; */
  background-color: #F4F1F2;
}

/* 폰트 정의 */
  @font-face {
    font-family: 'HakgyoansimDunggeunmisoTTF-B';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimDunggeunmisoTTF-B.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'HakgyoansimDunggeunmisoTTF-R';
    src: url("/assets/fonts/Hakgyoansim_Dunggeunmiso_TTF_R.ttf");
    font-weight: 700;
    font-style: normal;
  }
  
  /* 전역 스타일 정의 */
  body {
    font-family: 'HakgyoansimDunggeunmisoTTF-B', sans-serif;
    color: #3D3D3D;
    
    overflow-y: ${({ scrollEnabled }) =>
      scrollEnabled ? "auto" : "hidden"}; /* 스크롤 활성화 여부 */
    /* cursor: url('/icons/star.png'),auto; */
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* 기본 링크 속성 */
  a {
    text-decoration: none;
    color: inherit;
  }
  /* 기본 ul 속성 */
  ul {
    list-style: none;
  }
`;
