import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

const TypeBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'segment': return '#e6fffa';
      case 'individual': return '#ebf8ff';
      default: return '#f0fff4';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'segment': return '#234e52';
      case 'individual': return '#2c5282';
      default: return '#22543d';
    }
  }};
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#d4edda';
      case 'processing': return '#cce5ff';
      case 'failed': return '#f8d7da';
      default: return '#fff3cd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#155724';
      case 'processing': return '#004085';
      case 'failed': return '#721c24';
      default: return '#856404';
    }
  }};
`;

const AdminMessages = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock message data
  const messages = [
    {
      id: 1,
      type: 'segment',
      target: 'VIP 고객',
      content: '안녕하세요 {name}님, 특별 할인 혜택을...',
      status: 'completed',
      createdBy: '마케팅팀',
      createdAt: '2024-11-11 14:30',
      processedCount: 1250,
      successCount: 1200
    },
    {
      id: 2,
      type: 'individual',
      target: '김철수 고객',
      content: '김철수님, 고객님께 맞춤형 상품을 추천...',
      status: 'processing',
      createdBy: 'CRM팀',
      createdAt: '2024-11-11 15:45',
      processedCount: 1,
      successCount: 0
    },
    {
      id: 3,
      type: 'segment',
      target: '신규 가입자',
      content: '환영합니다! 신규 고객님께 드리는 특별...',
      status: 'completed',
      createdBy: '고객경험팀',
      createdAt: '2024-11-10 09:20',
      processedCount: 3450,
      successCount: 3400
    },
    {
      id: 4,
      type: 'individual',
      target: '이영희 고객',
      content: '이영희님, 오랜만에 찾아주셔서 감사...',
      status: 'failed',
      createdBy: '마케팅팀',
      createdAt: '2024-11-09 16:10',
      processedCount: 1,
      successCount: 0
    }
  ];

  const getTypeText = (type) => {
    return type === 'segment' ? '세그먼트' : '개인';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '완료';
      case 'processing': return '처리중';
      case 'failed': return '실패';
      default: return status;
    }
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
          <Title>메시지 로그 관리</Title>
        </PageHeader>

      <Table>
        <thead>
          <tr>
            <Th>유형</Th>
            <Th>대상</Th>
            <Th>메시지 내용</Th>
            <Th>상태</Th>
            <Th>생성자</Th>
            <Th>생성일</Th>
            <Th>처리수</Th>
            <Th>성공수</Th>
          </tr>
        </thead>
        <tbody>
          {messages.map(message => (
            <Tr key={message.id}>
              <Td>
                <TypeBadge type={message.type}>
                  {getTypeText(message.type)}
                </TypeBadge>
              </Td>
              <Td>{message.target}</Td>
              <Td>{message.content.substring(0, 20)}...</Td>
              <Td>
                <StatusBadge status={message.status}>
                  {getStatusText(message.status)}
                </StatusBadge>
              </Td>
              <Td>{message.createdBy}</Td>
              <Td>{message.createdAt}</Td>
              <Td>{message.processedCount}</Td>
              <Td>{message.successCount}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default AdminMessages;