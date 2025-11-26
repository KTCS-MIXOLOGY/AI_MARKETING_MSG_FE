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
  background: ${props => props.status === 'active' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.status === 'active' ? '#155724' : '#856404'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #cbd5e0;
  }
`;

const Customers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      segment: 'VIP',
      joinDate: '2023-01-15',
      status: 'active',
      lastPurchase: '2024-11-01'
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-9876-5432',
      segment: '일반',
      joinDate: '2023-03-20',
      status: 'active',
      lastPurchase: '2024-10-28'
    },
    {
      id: 3,
      name: '박지민',
      email: 'park@example.com',
      phone: '010-5555-7777',
      segment: '신규',
      joinDate: '2024-09-01',
      status: 'dormant',
      lastPurchase: '2024-09-15'
    },
    {
      id: 4,
      name: '최민수',
      email: 'choi@example.com',
      phone: '010-7777-8888',
      segment: 'VIP',
      joinDate: '2022-12-10',
      status: 'active',
      lastPurchase: '2024-11-05'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.includes(searchTerm) ||
    customer.email.includes(searchTerm) ||
    customer.segment.includes(searchTerm)
  );

  const handleCustomerClick = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  const handleSearch = () => {
    // Search functionality is handled by the filter
    console.log('Searching for:', searchTerm);
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="customers"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <Title>고객 정보 조회</Title>
        </PageHeader>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="고객명, 이메일, 세그먼트로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>검색</Button>
        <Button onClick={() => setSearchTerm('')}>초기화</Button>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>고객명</Th>
            <Th>이메일</Th>
            <Th>전화번호</Th>
            <Th>세그먼트</Th>
            <Th>가입일</Th>
            <Th>상태</Th>
            <Th>최근구매</Th>
            <Th>관리</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <Tr key={customer.id}>
              <Td>{customer.name}</Td>
              <Td>{customer.email}</Td>
              <Td>{customer.phone}</Td>
              <Td>{customer.segment}</Td>
              <Td>{customer.joinDate}</Td>
              <Td>
                <StatusBadge status={customer.status}>
                  {customer.status === 'active' ? '활성' : '휴면'}
                </StatusBadge>
              </Td>
              <Td>{customer.lastPurchase}</Td>
              <Td>
                <ActionButtons>
                  <ActionButton onClick={() => handleCustomerClick(customer.id)}>
                    상세보기
                  </ActionButton>
                </ActionButtons>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default Customers;