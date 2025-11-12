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
  background: ${props => {
    switch (props.status) {
      case 'active': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'inactive': return '#f8d7da';
      default: return '#fff3cd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#155724';
      case 'pending': return '#856404';
      case 'inactive': return '#721c24';
      default: return '#856404';
    }
  }};
`;

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #e6fffa;
  color: #234e52;
`;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock user data
  const users = [
    {
      id: 1,
      name: '김관리',
      email: 'admin@ktcs.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-11-11',
      department: 'IT본부'
    },
    {
      id: 2,
      name: '이마케터',
      email: 'marketer@ktcs.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-02-20',
      lastLogin: '2024-11-10',
      department: '마케팅팀'
    },
    {
      id: 3,
      name: '박분석',
      email: 'analyst@ktcs.com',
      role: 'user',
      status: 'pending',
      joinDate: '2024-09-01',
      lastLogin: '-',
      department: 'CRM팀'
    },
    {
      id: 4,
      name: '최고객',
      email: 'choi@ktcs.com',
      role: 'user',
      status: 'inactive',
      joinDate: '2023-12-10',
      lastLogin: '2024-10-25',
      department: '고객경험팀'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm) ||
    user.email.includes(searchTerm) ||
    user.department.includes(searchTerm)
  );

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '활성';
      case 'pending': return '대기';
      case 'inactive': return '비활성';
      default: return status;
    }
  };

  const getRoleText = (role) => {
    return role === 'admin' ? '관리자' : '사용자';
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
          activeMenu="users"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <Title>회원 관리</Title>
        </PageHeader>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="이름, 이메일, 부서로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>검색</Button>
        <Button onClick={() => setSearchTerm('')}>초기화</Button>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>이름</Th>
            <Th>이메일</Th>
            <Th>역할</Th>
            <Th>부서</Th>
            <Th>가입일</Th>
            <Th>마지막 로그인</Th>
            <Th>상태</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <RoleBadge>{getRoleText(user.role)}</RoleBadge>
              </Td>
              <Td>{user.department}</Td>
              <Td>{user.joinDate}</Td>
              <Td>{user.lastLogin}</Td>
              <Td>
                <StatusBadge status={user.status}>
                  {getStatusText(user.status)}
                </StatusBadge>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default AdminUsers;