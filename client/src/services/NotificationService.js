import axios from "axios";
import api from "./api";

// 부모 알림 목록 조회
export const fetcParentNotifications = async (memberNo, authorization) => {
  try {
    const response = await axios.get(`api/notification/parent/${memberNo}`, {
      headers: {
        Authorization: authorization,
      },
    });
    console.log("알림목록 : ", response.data);

    return response.data;
  } catch (err) {
    console.log("알림 조회 에러", err);
  }
};
// 아이 알림 목록 조회
export const fetchChildNotifications = async (memberNo, authorization) => {
  try {
    const response = await axios.get(`api/notification/child/${memberNo}`, {
      headers: {
        Authorization: authorization,
      },
    });
    console.log("알림목록 : ", response.data);
    return response.data;
  } catch (err) {
    console.log("알림 조회 에러", err);
    return []; // 기본값 반환
  }
};

// 알림 읽음으로 업데이트
export const updateRead = async (notiNum, authorization) => {
  try {
    await axios.patch(`api/notification/${notiNum}/read`, null, {
      headers: {
        Authorization: authorization,
      },
    });
    console.log("알림 읽음 완료");
  } catch (err) {
    console.log("알림 읽음 처리 에러 : ", err);
  }
};

/**
 * !알림 전송시 category 종류
 * 부모가 전송 : money(부모가 용돈지급), parentMsg(부모의 한마디)
 * 아이가 전송 : contract(소비계획서 전송)
 */
// 알림 전송 (부모 -> 아이)
export const sendNotificationToChild = async (
  childNum,
  parentNum,
  authorization,
  message, // 한마디의 내용
  category
) => {
  const notificationData = {
    childNum: childNum,
    parentNum: parentNum,
    message: message,
    category: category,
    senderType: "parent",
  };
  const response = await fetch(
    `api/notification/sendToChild`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(notificationData),
    }
  );

  if (response.ok) {
    console.log("아이에게 알림전송 완료");
  } else {
    console.error("아이에게 알림전송 실패");
  }
};

// 알림 전송 (아이 -> 부모)
export const sendNotificationToParent = async (
  childNum,
  parentNum,
  authorization,
  message,
  category
) => {
  const notificationData = {
    childNum: childNum,
    parentNum: parentNum,
    message: message,
    category: category,
    senderType: "child",
  };
  const response = await fetch(
    `api/notification/sendToParent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(notificationData),
    }
  );

  if (response.ok) {
    console.log("부모에게 알림전송 완료");
  } else {
    console.error("부모에게 알림전송 실패");
  }
};

// parent_num 찾기
export const findParentNum = async (childNum, authorization) => {
  try {
    const response = await axios.get(
      `api/notification/findParentNo/${childNum}`,
      {
        headers: {
          Authorization: `${authorization}`,
        },
      }
    );
    console.log("findParentNum : ", response.data);
    return response.data; // parent_num 반환
  } catch (error) {
    console.log("부모 넘버 조회 에러 : ", error);
  }
};

// 날짜 배열 변환
export const getDaysAgo = (dateArray) => {
  const [year, month, day] = dateArray;
  // Date  객체로 변환
  const tragetDate = new Date(year, month - 1, day); // month는 0부터 시작됨
  // 현재 날짜
  const currentDate = new Date();
  // 시간 차이를 계산
  const diffTime = currentDate - tragetDate;

  // 일 단위로 변환
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 문구로 변환
  if (diffDays === 0) {
    return "오늘";
  } else if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else {
    return `${Math.abs(diffDays)}일 후`;
  }
};
