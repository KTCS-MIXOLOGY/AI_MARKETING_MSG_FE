import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 24px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #718096;
  margin: 0;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 32px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  width: 300px;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #3182ce;
  }
`;

const CardIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
  margin: 0;
`;

const BackButton = styled.button`
  margin-top: 32px;
  padding: 12px 24px;
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #cbd5e0;
  }
`;

const Message = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSegmentClick = () => {
    navigate('/message/segment');
  };

  const handleIndividualClick = () => {
    navigate('/message/individual');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="messages"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <Title>메시지 생성</Title>
          <Subtitle>생성할 메시지 유형을 선택하세요</Subtitle>
        </PageHeader>

      <CardContainer>
        <Card onClick={handleSegmentClick}>
          <CardIcon>👥</CardIcon>
          <CardTitle>세그먼트 메시지 생성</CardTitle>
          <CardDescription>
            특정 고객 세그먼트를 대상으로 대량 메시지를 생성합니다.
            타겟 고객군별 맞춤형 메시지를 한 번에 생성하세요.
          </CardDescription>
        </Card>

        <Card onClick={handleIndividualClick}>
          <CardIcon>👤</CardIcon>
          <CardTitle>개인 메시지 생성</CardTitle>
          <CardDescription>
            개별 고객에게 맞춤형 메시지를 생성합니다.
            1:1 개인화된 마케팅 메시지를 만들어보세요.
          </CardDescription>
        </Card>
      </CardContainer>

      <BackButton onClick={handleBack}>
        ← 대시보드로 돌아가기
      </BackButton>
    </Container>
    </Layout>
  );
};

export default Message;