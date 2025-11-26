import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const Container = styled.div`
  padding: 24px;
  background: white;
  min-height: calc(100vh - 70px);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: ${props => props.variant === 'primary' ? '#3182ce' : '#e2e8f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#4a5568'};
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#2c5282' : '#cbd5e0'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: #f7fafc;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #2d3748;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#d4edda';
      case 'scheduled': return '#cce5ff';
      case 'ended': return '#f8d7da';
      default: return '#fff3cd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#155724';
      case 'scheduled': return '#004085';
      case 'ended': return '#721c24';
      default: return '#856404';
    }
  }};
`;

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: '겨울 신제품 출시 캠페인',
      type: '이메일',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      status: 'active',
      targetCount: 15000,
      sentCount: 12000,
      openRate: 25.3,
      createdBy: '마케팅팀'
    },
    {
      id: 2,
      name: '블랙프라이데이 특가 이벤트',
      type: 'SMS',
      startDate: '2024-11-15',
      endDate: '2024-11-25',
      status: 'scheduled',
      targetCount: 25000,
      sentCount: 0,
      openRate: 0,
      createdBy: 'CRM팀'
    },
    {
      id: 3,
      name: '고객 생일 축하 메시지',
      type: '카카오알림',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      status: 'ended',
      targetCount: 8000,
      sentCount: 7800,
      openRate: 45.2,
      createdBy: '고객경험팀'
    },
    {
      id: 4,
      name: 'VIP 고객 감사 이벤트',
      type: '이메일',
      startDate: '2024-11-05',
      endDate: '2024-11-20',
      status: 'active',
      targetCount: 5000,
      sentCount: 4800,
      openRate: 38.7,
      createdBy: 'VIP관리팀'
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.includes(searchTerm) ||
    campaign.type.includes(searchTerm) ||
    campaign.createdBy.includes(searchTerm)
  );

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '진행중';
      case 'scheduled': return '예약됨';
      case 'ended': return '종료';
      default: return status;
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="campaigns"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <Title>캠페인 조회</Title>
        </PageHeader>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="캠페인명, 유형, 생성자로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>검색</Button>
        <Button onClick={() => setSearchTerm('')}>초기화</Button>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>캠페인명</Th>
            <Th>유형</Th>
            <Th>시작일</Th>
            <Th>종료일</Th>
            <Th>상태</Th>
            <Th>대상수</Th>
            <Th>발송수</Th>
            <Th>오픈률</Th>
            <Th>생성자</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.map(campaign => (
            <Tr key={campaign.id}>
              <Td>{campaign.name}</Td>
              <Td>{campaign.type}</Td>
              <Td>{campaign.startDate}</Td>
              <Td>{campaign.endDate}</Td>
              <Td>
                <StatusBadge status={campaign.status}>
                  {getStatusText(campaign.status)}
                </StatusBadge>
              </Td>
              <Td>{campaign.targetCount.toLocaleString()}</Td>
              <Td>{campaign.sentCount.toLocaleString()}</Td>
              <Td>{campaign.openRate}%</Td>
              <Td>{campaign.createdBy}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default Campaigns;