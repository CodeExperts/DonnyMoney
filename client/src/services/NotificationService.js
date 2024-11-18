import axios from "axios";

// 부모 알림 목록 조회
export const fetcParentNotifications = async (memberNo, authorization) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/notification/parent/${memberNo}`,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    console.log("알림목록 : ", response.data);

    return response.data;
  } catch (err) {
    console.log("알림 조회 에러", err);
  }
};
// 아이 알림 목록 조회
export const fetchChildNotifications = async (memberNo, authorization) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/notification/child/${memberNo}`,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
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
    await axios.patch(
      `${process.env.REACT_APP_BASE_URL}/notification/${notiNum}/read`,
      null,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
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
    `${process.env.REACT_APP_BASE_URL}/notification/sendToChild`,
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
    `${process.env.REACT_APP_BASE_URL}/notification/sendToParent`,
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
