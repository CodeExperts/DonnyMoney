import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogingedContext } from "../../App";
import styled from "styled-components";
// import "@fortawesome/fontawesome-free/css/all.min.css";

const LoginForm = () => {
  let logingedCon = useContext(LogingedContext);
  const [member, setMember] = useState({
    username: "",
    password: "",
  });

  const navigator = useNavigate();

  const changeValue = (e) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocus = (e) => {
    e.target.parentNode.parentNode.classList.add("focus");
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.parentNode.parentNode.classList.remove("focus");
    }
  };

  const submitLogin = (e) => {
    e.preventDefault();
    console.log("Sending login request with data: ", member); // 요청 데이터 확인
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_LOGIN_URL}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(member),
    })
      .then((res) => {
        console.log("res = ", res.data);

        localStorage.setItem("memberNo", res.data.memberNo);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("Authorization", res.headers.authorization);


        
        logingedCon.onLoggedChange(true);
        navigator("/");
      })
      .catch((err) => {
        console.error("Error: ", err);
        alert("정보를 다시 확인해주세요.");
        setMember({ username: "", password: "" });
      });
  };

  return (
    <LoginFormContainer>
      <ImgContainer>
        <span>
          도니머니와 함께
          <br />
          올바른 경제 습관을 길러봐요!
        </span>
        <img src="images/donnyFamily.png" alt="Donny Family" />
      </ImgContainer>

      <LoginContent>
        <Form onSubmit={submitLogin}>
          <h2 className="title">Welcome</h2>

          <div className="input-div id">
            <div className="i">
              <i className="fas fa-user"></i>
            </div>
            <div className="div">
              <h5>Username</h5>
              <input
                type="text"
                name="username"
                className="input"
                value={member.username}
                onChange={changeValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="input-div password">
            <div className="i">
              <i className="fas fa-lock"></i>
            </div>
            <div className="div">
              <h5>Password</h5>
              <input
                type="password"
                name="password"
                className="input"
                value={member.password}
                onChange={changeValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <input type="submit" className="btn" value="Login" />
        </Form>
      </LoginContent>
    </LoginFormContainer>
  );
};

const LoginFormContainer = styled.div`
  display: flex;
  margin: 0 auto;
  width: 90%;
  /* height: 700px; */

  align-items: center;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden; /* 둥근 모서리에 내용이 잘리지 않도록 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  background-color: #c8bef3;
  position: relative;

  padding: 3% 0;

  img {
    width: 100%;
    /* height: 50%; */
    max-width: 450px;
    /* max-height: 400px; */
    margin: 40px;
    z-index: 2;
  }
  span {
    text-align: center;
    font-size: 28px;
    /* color: black; */
    color: #ffffff;
    z-index: 2;
  }

  &::before {
    content: "";
    position: absolute;
    top: 60%;
    left: 50%;
    width: 95%;
    height: 60%;
    max-width: 500px;
    max-height: 400px;
    background-color: white;
    border-radius: 50%;
    transform: translate(-50%, -50%); /* Center the circle */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow effect */
    z-index: 1;
  }
`;

const LoginContent = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  flex-grow: 1;

  justify-content: flex-start;
  align-items: center;
  text-align: center;
  background-color: white;
`;

const Form = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h2 {
    margin: 30px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
  }

  .input-div:before,
  .input-div:after {
    content: "";
    position: absolute;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #38d39f;
    transition: 0.4s;
  }

  .input-div:before {
    right: 50%;
  }

  .input-div:after {
    left: 50%;
  }

  .input-div.focus:before,
  .input-div.focus:after {
    width: 50%;
  }

  .input-div.focus > div > h5 {
    top: -10px;
    font-size: 15px;
  }

  .input-div.focus > .i > i {
    color: #38d39f;
  }

  .input-div > div > input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 0.5rem 0.7rem;
    font-size: 1.2rem;
    color: #555;
    /* font-family: 'poppins', sans-serif; */
  }

  .input-div.pass {
    margin-bottom: 4px;
  }

  .input-div {
    display: flex;
    align-items: center;
    position: relative;
    margin: 25px 0;
    padding: 5px 0;
    width: 300px;
    border-bottom: 2px solid #d9d9d9;

    .i {
      color: #d9d9d9;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        transition: 0.3s;
      }
    }

    .div {
      position: relative;
      height: 45px;

      h5 {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        font-size: 18px;
        transition: 0.3s;
      }

      input {
        width: 300px;
        height: 100%;
        left: 10px;
        border: none;
        outline: none;
        background: none;
        padding: 2px;
        font-size: 1.2rem;
        color: #555;
      }
    }
  }

  .btn {
    display: block;
    width: 300px;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
    background-size: 200%;
    font-size: 1.2rem;
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      background-position: right;
    }
  }
`;

export default LoginForm;
