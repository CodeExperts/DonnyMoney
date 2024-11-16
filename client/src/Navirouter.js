import React from "react";
import { Route, Routes } from "react-router-dom";
// import SaveForm from "./components/pages/child/plan/SaveForm";
// import UpdateForm from "./components/pages/child/plan/UpdateForm";
// import PlanPage from "./pages/child/PlanPage";
// import SendTest from "./pages/test/child/SendTest";
// import ParentTest from "./pages/test/parent/ParentTest";

import LandingPage from "./pages/common/LandingPage";
import ChildReportPage from "./pages/child/ChildReportPage";
import EduPage from "./pages/child/EduPage";
import MoneyPlanPage from "./pages/child/MoneyPlanPage";
import MyWishListPage from "./pages/child/MyWishListPage";
import AgreementPage from "./pages/parent/AgreementPage";
import MonthlyReportPage from "./pages/parent/MonthlyReportPage";
import WishListPage from "./pages/parent/WishListPage";
import LoginPage from "./pages/common/LoginPage";
// import { SelectUserType } from "./pages/common/SelectUserType";
// import LoginForm from "./components/pages/LoginForm";
import { RegisterPage } from "./pages/common/RegisterPage";
import Layout from "./components/layouts/Layout";

const Navirouter = () => {
  return (
    <div>
      <Routes>
        {/* 공통 */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        {/* <Route
          path="/select-user"
          element={
            <Layout>
              <SelectUserType />
            </Layout>
          }
        /> */}
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }
        />

        {/* 아이 페이지 */}
        <Route
          path="/child-report"
          element={
            <Layout>
              <ChildReportPage />
            </Layout>
          }
        />
        <Route
          path="/edu"
          element={
            <Layout>
              <EduPage />
            </Layout>
          }
        />
        <Route
          path="/money-plan"
          element={
            <Layout>
              <MoneyPlanPage />
            </Layout>
          }
        />
        <Route
          path="/mywish-list"
          element={
            <Layout>
              <MyWishListPage />
            </Layout>
          }
        />
        {/* <Route path="/register-child" element={<ChildRegisterPage />} /> */}

        {/* 부모 페이지 */}
        <Route
          path="/agreement"
          element={
            <Layout>
              <AgreementPage />
            </Layout>
          }
        />
        <Route
          path="/monthly-report"
          element={
            <Layout>
              <MonthlyReportPage />
            </Layout>
          }
        />
        <Route
          path="/wish-list"
          element={
            <Layout>
              <WishListPage />
            </Layout>
          }
        />
        {/* <Route path="/register-parent" element={<RegisterPage />} /> */}
        {/* <Route path="/save-form" element={<SaveForm />} />
        {/* <Route path="/save-form" element={<SaveForm />} />
        <Route path="/update-form" element={<UpdateForm />} />
        <Route path="/plan" element={<PlanPage />} /> */}
        {/* <Route path="/test-child" element={<SendTest />} />
        <Route path="/test-parent" element={<ParentTest />} /> */}
      </Routes>
    </div>
  );
};

export default Navirouter;
