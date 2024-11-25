import { useEffect, useState } from "react";

export const useSSE = (url, onMessage) => {
  const [eventSource, setEventSource] = useState(null); // SSE 연결상태
  const [connectionError, setConnectionError] = useState(false); // 연결 에러 상태

  // SSE 연결
  useEffect(() => {
    if (!url) return;

    // if (eventSource) {
    //   console.log("[SSE] 이미 연결되었습니다.");
    // }
    let sse; //
    sse = new EventSource(url); // GET, SSE 연결생성
    // GET /sse-endpoint HTTP/1.1
    // Host: example.com
    // Accept: text/event-stream
    // Connection: keep-alive

    // 클라이언트는 GET 요청 상태를 유지하며, HTTP연결을 keep-alive로 열어둔 상태로 서버와 실시간으로 데이터를 주고받음
    // 브라우저의 EventSource 객체가 실제 연결을 유지하고 데이터를 처리를 담당함

    const setupSSE = () => {
      console.log("[SSE] 연결시도 중..");
      setConnectionError(false); // 초기화

      sse.onopen = () => {
        console.log(`[SSE] 연결됨`);
      };
      sse.onmessage = (event) => {
        if (event.data !== "ping") {
          // ping 이벤트는 무시하거나 연결 상태를 확인할때 사용됨
          // console.log("[SSE] keep-alive ping ");
          console.log("[SSE] 받은 데이터:", event.data);
          try {
            const data = JSON.parse(event.data); // 데이터 파싱
            onMessage && onMessage(data); // 메세지 핸들러 호출
          } catch (err) {
            console.error("[SSE] 데이터 처리 에러:", err);
          }
        }
      };
      sse.onerror = (err) => {
        console.log("[SSE] 에러발생 : ", err);
        setConnectionError(true); // 에러 상태 설정
        sse.close(); //! 연결 종료
      };

      setEventSource(sse);
    };

    // 초기 연결 시도
    setupSSE();

    return () => {
      console.log("[SSE] Cleaning up connection...");
      if (sse) sse.close();

      setEventSource(null);
    };
  }, [url]); // 수정된 부분: 의존성 배열에 `onMessage` 추가

  return { eventSource, connectionError };
};
