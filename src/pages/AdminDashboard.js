import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Grid from '../components/common/Grid';
import Table from '../components/common/Table';
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  background: none;
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: 500;
  color: ${props => props.active ? props.theme.colors.primary : '#718096'};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: #f7fafc;
  }
`;

const AdminDashboard = ({ onMenuClick }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  // 임시 데이터
  const stats = [
    {
      label: '총 사용자',
      value: 48,
      color: '#3182ce',
    },
    {
      label: '총 캠페인',
      value: 24,
      color: '#38a169',
    },
    {
      label: '총 상품',
      value: 156,
      color: '#d69e2e',
    },
    {
      label: '고객 세그먼트',
      value: 18,
      color: '#3182ce',
    },
  ];

  const users = [
    {
      id: 1,
      username: 'admin001',
      name: '관리자',
      email: 'admin@ktcs.com',
      department: '마케팅팀',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      username: 'user001',
      name: '김철수',
      email: 'user001@ktcs.com',
      department: '영업팀',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      username: 'user002',
      name: '이영희',
      email: 'user002@ktcs.com',
      department: '고객관리팀',
      role: 'user',
      status: 'inactive',
      createdAt: '2024-01-03',
    },
  ];

  const campaigns = [
    {
      id: 1,
      name: '5G 프리미엄 프로모션',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      participants: 1250,
    },
    {
      id: 2,
      name: '신규 가입자 환영 이벤트',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      participants: 890,
    },
    {
      id: 3,
      name: '데이터 상품 할인',
      status: 'inactive',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      participants: 2100,
    },
  ];

  const products = [
    {
      id: 1,
      name: '5G 프리미엄',
      category: '요금제',
      price: '85,000',
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: '5G 스탠다드',
      category: '요금제',
      price: '65,000',
      status: 'active',
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      name: '5G 라이트',
      category: '요금제',
      price: '45,000',
      status: 'active',
      createdAt: '2024-01-03',
    },
  ];

  const messageLogs = [
    {
      id: 1,
      title: '5G 프리미엄 요금제 프로모션',
      type: '세그먼트',
      createdBy: '김철수',
      createdAt: '2024-01-15 14:30',
      status: 'completed',
    },
    {
      id: 2,
      title: '신규 가입자 환영 이벤트',
      type: '세그먼트',
      createdBy: '이영희',
      createdAt: '2024-01-14 09:15',
      status: 'completed',
    },
    {
      id: 3,
      title: '데이터 상품 안내',
      type: '개인',
      createdBy: '박민수',
      createdAt: '2024-01-13 16:45',
      status: 'in-progress',
    },
  ];

  const menuItems = [
    { id: 'users', label: '회원관리', icon: '👥', path: '/admin/users' },
    { id: 'campaigns', label: '캠페인관리', icon: '📢', path: '/admin/campaigns' },
    { id: 'products', label: '상품관리', icon: '📦', path: '/admin/products' },
    { id: 'segments', label: '세그먼트관리', icon: '🎯', path: '/admin/segments' },
    { id: 'messages', label: '메시지로그', icon: '📝', path: '/admin/messages' },
  ];

  const userColumns = [
    { header: '아이디', accessor: 'username' },
    { header: '이름', accessor: 'name' },
    { header: '이메일', accessor: 'email' },
    { header: '부서', accessor: 'department' },
    { header: '역할', accessor: 'role' },
    { header: '상태', accessor: 'status' },
    { header: '생성일', accessor: 'createdAt' },
  ];

  const campaignColumns = [
    { header: '캠페인명', accessor: 'name' },
    { header: '상태', accessor: 'status' },
    { header: '시작일', accessor: 'startDate' },
    { header: '종료일', accessor: 'endDate' },
    { header: '참여자', accessor: 'participants' },
  ];

  const productColumns = [
    { header: '상품명', accessor: 'name' },
    { header: '카테고리', accessor: 'category' },
    { header: '가격', accessor: 'price' },
    { header: '상태', accessor: 'status' },
    { header: '생성일', accessor: 'createdAt' },
  ];

  const messageColumns = [
    { header: '메시지 제목', accessor: 'title' },
    { header: '유형', accessor: 'type' },
    { header: '생성자', accessor: 'createdBy' },
    { header: '생성일', accessor: 'createdAt' },
    { header: '상태', accessor: 'status' },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleMenuClick = (path) => {
    if (onMenuClick) {
      onMenuClick(path);
    } else {
      window.location.href = path;
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'users':
        return { columns: userColumns, data: users };
      case 'campaigns':
        return { columns: campaignColumns, data: campaigns };
      case 'products':
        return { columns: productColumns, data: products };
      case 'messages':
        return { columns: messageColumns, data: messageLogs };
      default:
        return { columns: userColumns, data: users };
    }
  };

  const currentData = getCurrentData();

  return (
    <Layout
      sidebar={<Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        activeMenu="dashboard"
        onMenuClick={handleMenuClick}
      />}
      header={<Header 
        sidebarCollapsed={sidebarCollapsed} 
        onToggleSidebar={toggleSidebar}
        currentPage="관리자 대시보드"
      />}
    >
      <DashboardContainer>
        <WelcomeSection>
          <WelcomeTitle>관리자님, 환영합니다! 👋</WelcomeTitle>
          <WelcomeSubtitle>KT CS 마케팅 메시지 생성 시스템 관리</WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid columns={4} mdColumns={2} smColumns={1}>
          {stats.map((stat, index) => (
            <StatCard key={index} hover>
              <StatValue color={stat.color}>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <TabContainer>
          {menuItems.map((item) => (
            <Tab
              key={item.id}
              active={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
            >
              {item.icon} {item.label}
            </Tab>
          ))}
        </TabContainer>

        <Card>
          <Table
            columns={currentData.columns}
            data={currentData.data}
            renderCell={(column, row) => {
              if (column.accessor === 'role') {
                return (
                  <Badge variant={row.role === 'admin' ? 'primary' : 'secondary'}>
                    {row.role === 'admin' ? '관리자' : '사용자'}
                  </Badge>
                );
              }
              if (column.accessor === 'status') {
                return (
                  <Badge variant={row.status === 'active' || row.status === 'completed' ? 'success' : 'danger'}>
                    {row.status === 'active' || row.status === 'completed' ? '활성' : '비활성'}
                  </Badge>
                );
              }
              return row[column.accessor];
            }}
          />
        </Card>
      </DashboardContainer>
    </Layout>
  );
};

export default AdminDashboard;