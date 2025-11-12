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

const SegmentBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #e6fffa;
  color: #234e52;
`;

const CountBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #ebf8ff;
  color: #2c5282;
`;

const AdminSegments = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock segment data
  const segments = [
    {
      id: 1,
      name: 'VIP 고객',
      criteria: '연간 구매액 500만원 이상',
      customerCount: 1250,
      description: '고액 구매 고객 대상 프리미엄 서비스',
      createdBy: 'CRM팀',
      createdAt: '2024-10-01',
      lastUsed: '2024-11-10'
    },
    {
      id: 2,
      name: '신규 가입자',
      criteria: '최근 30일 이내 가입',
      customerCount: 3450,
      description: '신규 고객 대상 환영 이벤트',
      createdBy: '마케팅팀',
      createdAt: '2024-09-15',
      lastUsed: '2024-11-08'
    },
    {
      id: 3,
      name: '휴면 고객',
      criteria: '최근 90일 간 로그인 없음',
      customerCount: 2890,
      description: '재활성화를 위한 타겟 캠페인',
      createdBy: '고객경험팀',
      createdAt: '2024-08-20',
      lastUsed: '2024-10-25'
    },
    {
      id: 4,
      name: '20대 여성',
      criteria: '나이 20-29세, 여성',
      customerCount: 5670,
      description: '젊은 여성 고객층 타겟팅',
      createdBy: '마케팅팀',
      createdAt: '2024-09-01',
      lastUsed: '2024-11-09'
    }
  ];

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="segments"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <Title>세그먼트 관리</Title>
        </PageHeader>

      <Table>
        <thead>
          <tr>
            <Th>세그먼트명</Th>
            <Th>기준</Th>
            <Th>고객수</Th>
            <Th>설명</Th>
            <Th>생성자</Th>
            <Th>생성일</Th>
            <Th>최근사용</Th>
          </tr>
        </thead>
        <tbody>
          {segments.map(segment => (
            <Tr key={segment.id}>
              <Td>
                <SegmentBadge>{segment.name}</SegmentBadge>
              </Td>
              <Td>{segment.criteria}</Td>
              <Td>
                <CountBadge>{segment.customerCount.toLocaleString()}</CountBadge>
              </Td>
              <Td>{segment.description}</Td>
              <Td>{segment.createdBy}</Td>
              <Td>{segment.createdAt}</Td>
              <Td>{segment.lastUsed}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default AdminSegments;