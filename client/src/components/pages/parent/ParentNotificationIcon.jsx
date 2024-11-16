import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../../App";
import {
  fetcParentNotifications,
  updateRead,
} from "../../../services/NotificationService";
import { useSSE } from "../../../services/sseEmitter";

// 부모님용 알림아이콘, 알림목록
export const ParentNotificationIcon = () => {
  const { memberNo, role, name, authorization } = useContext(AuthContext);

  const listRef = useRef(null);
  const [listOpen, setListOpen] = useState(false); // 알림목록 오픈여부
  const [notifications, setNotifications] = useState([]); // 알림 목록 상태
  const [hasUnread, setHasUnread] = useState(false); // 미읽은 알림 여부

  // 알림 목록 가져옴
  const getNotifications = async () => {
    const data = await fetcParentNotifications(memberNo, authorization);
    setNotifications(data);
    setHasUnread(data.some((noti) => !noti.isRead)); // 미읽은 알림이 있는지 확인
  };
  // 알림 읽음 처리
  const handleRead = async (notiNum) => {
    await updateRead(notiNum, authorization);
    getNotifications(); //읽음 처리후 알림목록 갱신
  };
  // 알림 아이콘 클릭시 처리
  const handleClickIcon = () => {
    listOpen ? setListOpen(false) : setListOpen(true); // 알림목록 오픈여부
    // setHasUnread(false); // 알림표시제거
  };

  // SSE 연결
  const { eventSource, connectionError } = useSSE(
    `http://localhost:9999/notification/subscribe/${memberNo}`,
    (notification) => {
      try {
        if (notification.notiNum !== -1) {
          setNotifications((prev) => [notification, ...prev]); // 알림 목록 업데이트
          setHasUnread(true); // 새 알림이 오면 미읽은 상태로 나타냄
        }
      } catch (err) {
        console.log("SSE 데이터 파싱 에러 : ", err);
      }
    }
  );

  // 컴포넌트 처음 렌더링될때 기존 알림목록 가져오기
  useEffect(() => {
    setListOpen(false);
    getNotifications();
  }, []);

  // 알림 목록 변경시 로그출력해봄
  // useEffect(() => {
  //   console.log("알림 목록 변경 : ", notifications);
  // }, [notifications]);

  // 알림목록 바깥 클릭 감지시 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 알림목록 외부를 클릭하면 닫기
      if (listRef.current && !listRef.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    // 전역 클릭 이벤트 등록
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 제거
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* SSE 연결 에러 메시지 표시 */}
      {connectionError && (
        <ErrorMessage>알림 서버와 연결할 수 없습니다.</ErrorMessage>
      )}
      {/* 알림 아이콘 */}
      <BellSection onClick={handleClickIcon}>
        <BellButton type="button" className="bell-button" />
        {/* 안읽은 알림이 존재하면 점으로 표시 */}
        {hasUnread && <div className="red_point" />}
      </BellSection>

      {/* 알림 목록 */}
      {listOpen && (
        <NotificationList ref={listRef}>
          {notifications.length > 0 ? (
            notifications.map((noti, index) => (
              <NotificationItem
                key={noti.notiNum}
                isRead={noti.isRead}
                onClick={() => handleRead(noti.notiNum)}
              >
                {noti.message}
                {/* {noti.isRead ? "(읽음)" : "(미읽음)"} */}
              </NotificationItem>
            ))
          ) : (
            <NotificationItem>알림이 없습니다.</NotificationItem>
          )}
        </NotificationList>
      )}
    </>
  );
};

const BellSection = styled.div`
  position: relative;

  .red_point {
    position: absolute;
    top: 0;
    right: 6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: red;
  }
`;
const BellButton = styled.div`
  background: url("images/bell_2.png") no-repeat center center;
  background-size: contain;
  width: 40px;
  height: 40px;
  position: relative;
`;

const NotificationList = styled.div`
  position: absolute;
  top: 50px;

  width: 300px;
  max-height: 300px;
  right: 0;
  z-index: 1;
  overflow-y: scroll;

  font-size: 16px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
`;

const NotificationItem = styled.div`
  cursor: pointer;
  padding: 5px;

  background-color: ${(props) => (props.isRead ? "#ffffff" : "#fff9b1")};
`;

const ErrorMessage = styled.div`
  color: lightgray;
  font-size: 14px;
  text-align: center;
  margin-bottom: 5px;
`;