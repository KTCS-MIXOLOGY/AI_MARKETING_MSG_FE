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

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.status === 'active' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.status === 'active' ? '#155724' : '#856404'};
`;

const CategoryBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #e6fffa;
  color: #234e52;
`;

const AdminProducts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock product data
  const products = [
    {
      id: 1,
      name: '갤럭시 Z 플립5',
      category: '스마트폰',
      price: 1299000,
      status: 'active',
      launchDate: '2024-08-11',
      salesCount: 15420,
      reviewScore: 4.5,
      manager: '모바일팀',
      createdAt: '2024-07-15'
    },
    {
      id: 2,
      name: '갤럭시 워치6',
      category: '웨어러블',
      price: 399000,
      status: 'active',
      launchDate: '2024-07-20',
      salesCount: 8750,
      reviewScore: 4.3,
      manager: '웨어러블팀',
      createdAt: '2024-06-10'
    },
    {
      id: 3,
      name: '갤럭시 탭 S9',
      category: '태블릿',
      price: 899000,
      status: 'active',
      launchDate: '2024-06-15',
      salesCount: 5230,
      reviewScore: 4.4,
      manager: '태블릿팀',
      createdAt: '2024-05-20'
    }
  ];

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="products"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <Title>상품 관리</Title>
        </PageHeader>

      <Table>
        <thead>
          <tr>
            <Th>상품명</Th>
            <Th>카테고리</Th>
            <Th>가격</Th>
            <Th>출시일</Th>
            <Th>상태</Th>
            <Th>판매량</Th>
            <Th>평점</Th>
            <Th>담당자</Th>
            <Th>등록일</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <Tr key={product.id}>
              <Td>{product.name}</Td>
              <Td>
                <CategoryBadge>{product.category}</CategoryBadge>
              </Td>
              <Td>{product.price.toLocaleString()}원</Td>
              <Td>{product.launchDate}</Td>
              <Td>
                <StatusBadge status={product.status}>
                  {product.status === 'active' ? '활성' : '휴면'}
                </StatusBadge>
              </Td>
              <Td>{product.salesCount.toLocaleString()}개</Td>
              <Td>{product.reviewScore}/5.0</Td>
              <Td>{product.manager}</Td>
              <Td>{product.createdAt}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default AdminProducts;