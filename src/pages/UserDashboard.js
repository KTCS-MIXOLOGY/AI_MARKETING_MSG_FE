import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Grid from '../components/common/Grid';
import Badge from '../components/common/Badge';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const WelcomeSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: #2d3748;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 600;
`;

const WelcomeSubtitle = styled.p`
  color: #718096;
  font-size: ${props => props.theme.fontSizes.md};
`;

const StatsGrid = styled(Grid)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${props => props.color || props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.md};
  color: #718096;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const ActionGrid = styled(Grid)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ActionIcon = styled.div`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  color: #2d3748;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 600;
`;

const ActionDescription = styled.p`
  color: #718096;
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
`;

const RecentMessages = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  color: #2d3748;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: 600;
`;

const MessageItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f7fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MessageIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.sm};
  margin-right: ${props => props.theme.spacing.md};
`;

const MessageInfo = styled.div`
  flex: 1;
`;

const MessageTitle = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const MessageDate = styled.div`
  color: #718096;
  font-size: ${props => props.theme.fontSizes.xs};
`;

const UserDashboard = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    { label: '활성 캠페인', value: 8, color: '#38a169' },
    { label: '활성 상품수', value: 24, color: '#3182ce' },
    { label: '생성 메시지 수', value: 156, color: '#d69e2e' }
  ];

  const actions = [
    {
      id: 'message-segment',
      title: '세그먼트 메시지 생성',
      description: '고객 세그먼트를 대상으로 맞춤형 마케팅 메시지를 생성합니다.',
      icon: '🎯',
      path: '/message/segment',
    },
    {
      id: 'message-individual',
      title: '개인 메시지 생성',
      description: '개별 고객에게 최적화된 메시지를 생성합니다.',
      icon: '👤',
      path: '/message/individual',
    },
    {
      id: 'customer-360',
      title: '고객 정보 조회',
      description: '고객의 전체 정보를 한눈에 확인하고 분석합니다.',
      icon: '📊',
      path: '/customers',
    },
    {
      id: 'analytics',
      title: '성과 분석',
      description: '마케팅 캠페인의 성과를 분석하고 인사이트를 도출합니다.',
      icon: '📈',
      path: '/analytics',
    },
  ];

  const recentMessages = [
    { id: 1, title: '5G 프리미엄 요금제 프로모션', type: '세그먼트', date: '2024-01-15', status: 'success' },
    { id: 2, title: '김철수님 맞춤 요금제 안내', type: '개인', date: '2024-01-14', status: 'active' },
    { id: 3, title: '신규 가입자 환영 이벤트', type: '세그먼트', date: '2024-01-13', status: 'active' },
    { id: 4, title: '이영희님 데이터 상품 추천', type: '개인', date: '2024-01-12', status: 'success' },
    { id: 5, title: '요금제 변경 안내', type: '세그먼트', date: '2024-01-11', status: 'active' },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleActionClick = (path) => {
    if (onMenuClick) {
      onMenuClick(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <Layout
      sidebar={<Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onMenuClick={handleActionClick} />}
      header={<Header 
        sidebarCollapsed={sidebarCollapsed} 
        onToggleSidebar={toggleSidebar}
        currentPage="대시보드"
      />}
    >
      <DashboardContainer>
        <WelcomeSection>
          <WelcomeTitle>{user?.name || '사용자'}님, 환영합니다! 👋</WelcomeTitle>
          <WelcomeSubtitle>AI 기반 개인화된 마케팅 메시지 생성 시스템</WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid columns={3} mdColumns={2} smColumns={1}>
          {stats.map((stat, index) => (
            <StatCard key={index} hover>
              <StatValue color={stat.color}>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <ActionGrid columns={2} mdColumns={1} smColumns={1}>
          {actions.slice(0, 2).map((action) => (
            <ActionCard key={action.id} onClick={() => handleActionClick(action.path)} hover>
              <ActionIcon>{action.icon}</ActionIcon>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
            </ActionCard>
          ))}
        </ActionGrid>

        <RecentMessages>
          <SectionTitle>최근 생성된 메시지</SectionTitle>
          <Card>
            {recentMessages.map((message) => (
              <MessageItem key={message.id}>
                <MessageIcon>{message.type === '세그먼트' ? '🎯' : '👤'}</MessageIcon>
                <MessageInfo>
                  <MessageTitle>{message.title}</MessageTitle>
                  <MessageDate>{message.date} • {message.type}</MessageDate>
                </MessageInfo>
                <Badge variant={message.status === 'success' ? 'success' : 'primary'}>
                  {message.status === 'success' ? '완료' : '진행중'}
                </Badge>
              </MessageItem>
            ))}
          </Card>
        </RecentMessages>
      </DashboardContainer>
    </Layout>
  );
};

export default UserDashboard;