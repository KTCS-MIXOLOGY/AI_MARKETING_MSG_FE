import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #718096;
  margin-bottom: 32px;
`;

const UserInfo = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #4a5568;
`;

const InfoValue = styled.span`
  color: #2d3748;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${props => props.variant === 'danger' ? '#f56565' : '#3182ce'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 8px;
  
  &:hover {
    background: ${props => props.variant === 'danger' ? '#e53e3e' : '#2c5282'};
  }
`;

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
          activeMenu="settings"
        />
      }
      header={<Header />}
    >
      <Container>
      <Card>
        <Title>설정</Title>
        <Subtitle>계정 정보 및 기본 설정을 관리하세요</Subtitle>

        <UserInfo>
          <InfoRow>
            <InfoLabel>이름:</InfoLabel>
            <InfoValue>{user?.name || '사용자'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>이메일:</InfoLabel>
            <InfoValue>{user?.email || 'user@example.com'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>역할:</InfoLabel>
            <InfoValue>{user?.role === 'admin' ? '관리자' : '일반 사용자'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>가입일:</InfoLabel>
            <InfoValue>2024-01-15</InfoValue>
          </InfoRow>
        </UserInfo>

        <div>
          <Button onClick={handleBack}>뒤로가기</Button>
          <Button variant="danger" onClick={handleLogout}>로그아웃</Button>
        </div>
      </Card>
    </Container>
    </Layout>
  );
};

export default Settings;