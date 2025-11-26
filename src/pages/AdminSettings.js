import React from "react";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const AdminSettings = () => {
  return (
    <Layout sidebar={<Sidebar />} header={<Header currentPage="관리자 설정" />}>
      <div style={{ padding: "2rem" }}>
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}
        >
          설정
        </h1>
        <p style={{ color: "#4b5563" }}>
          관리자 설정 페이지입니다. (내용은 나중에 채우기)
        </p>
      </div>
    </Layout>
  );
};

export default AdminSettings;
