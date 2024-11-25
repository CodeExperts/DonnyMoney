import React, { createContext, useState } from "react"; 



const PlanContext = createContext();

// PlanProvider 컴포넌트
const PlanProvider = ({ children }) => {
  // plan 데이터의 초기값 설정
  const [plan, setPlan] = useState({
    cvs: 0,
    food: 0,
    shopping: 0,
    transport: 0,
    saving: 0,
    others: {
      name: "",  // 이름 필드
      value: 0,  // 값 필드
    },
  });
  const [selectedYear, setSelectedYear] = useState(0); // 연도 상태
  const [selectedMonth, setSelectedMonth] = useState(0); // 월 상태
  const [overlayStatus, setOverlayStatus] = useState(null); 
 

  
  return (
    <PlanContext.Provider value={{ plan, setPlan,selectedMonth, setSelectedMonth,selectedYear, setSelectedYear,overlayStatus, setOverlayStatus }}>
      {children}
    </PlanContext.Provider>
  );
};

export default PlanProvider;


export { PlanContext };