import React from "react";
import styled from "styled-components";

export const Modal = ({ width, height, padding, sidePadding, children }) => {
  return (
    <Outer>
      <Content
        width={width}
        height={height}
        padding={padding}
        sidePadding={sidePadding}
      >
        {children}
      </Content>
    </Outer>
  );
};

const Outer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Content = styled.div`
  width: ${(props) => props.width || "400px"};
  height: ${(props) => props.height || "300px"};
  padding: ${(props) => props.padding || "0"};
  padding: ${(props) => props.sidePadding && props.sidePadding};
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
