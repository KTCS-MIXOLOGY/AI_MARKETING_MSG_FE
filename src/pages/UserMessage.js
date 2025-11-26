import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #e60012;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: #e60012;
    box-shadow: 0 12px 24px rgba(230, 0, 18, 0.15);
    transform: translateY(-4px);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const CardIconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #e60012 0%, #b8000e 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

const CardFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0 0;
  text-align: left;
`;

const CardFeature = styled.li`
  font-size: 0.875rem;
  color: #4b5563;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "✓";
    color: #e60012;
    font-weight: 700;
    font-size: 1rem;
  }
`;

// ==================== Component ====================

const UserMessage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSegmentClick = () => {
    navigate("/message/segment");
  };

  const handleIndividualClick = () => {
    navigate("/message/individual");
  };

  return (
    <Layout
      sidebar={<Sidebar activeMenu="message" />}
      header={
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
    >
      <Container>
        <PageHeader>
          <PageTitle>
            <i
              className="fas fa-envelope"
              style={{ marginRight: "0.5rem", color: "#E60012" }}
            ></i>
            메시지 생성
          </PageTitle>
          <PageDescription>생성할 메시지 유형을 선택하세요</PageDescription>
        </PageHeader>

        <CardContainer>
          <Card onClick={handleSegmentClick}>
            <CardIconWrapper>
              <i className="fas fa-users" style={{ color: "white" }}></i>
            </CardIconWrapper>
            <CardTitle>세그먼트 메시지 생성</CardTitle>
            <CardDescription>
              특정 고객 세그먼트를 대상으로 대량 메시지를 생성합니다. 타겟
              고객군별 맞춤형 메시지를 한 번에 생성하세요.
            </CardDescription>
            <CardFeatures>
              <CardFeature>다중 필터링으로 타겟 고객 선택</CardFeature>
              <CardFeature>예상 타겟 인원 실시간 계산</CardFeature>
              <CardFeature>AI 자동 메시지 생성 (3가지 톤)</CardFeature>
            </CardFeatures>
          </Card>

          <Card onClick={handleIndividualClick}>
            <CardIconWrapper>
              <i className="fas fa-user-circle" style={{ color: "white" }}></i>
            </CardIconWrapper>
            <CardTitle>개인 메시지 생성</CardTitle>
            <CardDescription>
              개별 고객에게 맞춤형 메시지를 생성합니다. 1:1 개인화된 마케팅
              메시지를 만들어보세요.
            </CardDescription>
            <CardFeatures>
              <CardFeature>전화번호로 고객 검색</CardFeature>
              <CardFeature>고객 정보 기반 개인화</CardFeature>
              <CardFeature>고객 이름 포함 맞춤 메시지</CardFeature>
            </CardFeatures>
          </Card>
        </CardContainer>
      </Container>
    </Layout>
  );
};

export default UserMessage;
