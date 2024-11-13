import React from "react";
import styled from "styled-components";

// 공통 버튼 (넓이, 높이, 폰트 사이즈)
export const Button = ({
  bgColor,
  width,
  height,
  borderRadius,
  hoverBgColor,
  text,
}) => {
  return (
    <Outer
      bgColor={bgColor} // 버튼 배경색
      width={width}
      height={height}
      borderRadius={borderRadius}
      hoverBgColor={hoverBgColor} // 버튼의 hover 배경색 필요시 사용
    >
      {text}
    </Outer>
  );
};

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "50px"};
  background-color: ${(props) => props.bgColor || "#9774FB"};
  border-radius: ${(props) => props.borderRadius || "25px"};

  ${(props) =>
    props.hoverBgColor &&
    `
    &:hover {
      background-color: ${props.hoverBgColor};
    }
  `}
`;
