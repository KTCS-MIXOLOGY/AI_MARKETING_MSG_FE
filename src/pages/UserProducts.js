import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.variant === "primary" ? "#E60012" : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#4b5563")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#B8000E" : "#e5e7eb"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f9fafb;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const Td = styled.td`
  padding: 1.25rem 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.status === "active" ? "#D1F2D8" : "#FADADD")};
  color: ${(props) => (props.status === "active" ? "#2E7D32" : "#C2185B")};
`;

const CategoryBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #e6fffa;
  color: #234e52;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.i`
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const Products = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock product data
  const products = [
    {
      id: 1,
      name: "갤럭시 Z 플립5",
      category: "스마트폰",
      price: 1299000,
      status: "active",
      launchDate: "2024-08-11",
      salesCount: 15420,
      reviewScore: 4.5,
      manager: "모바일팀",
    },
    {
      id: 2,
      name: "갤럭시 워치6",
      category: "웨어러블",
      price: 399000,
      status: "active",
      launchDate: "2024-07-20",
      salesCount: 8750,
      reviewScore: 4.3,
      manager: "웨어러블팀",
    },
    {
      id: 3,
      name: "갤럭시 탭 S9",
      category: "태블릿",
      price: 899000,
      status: "active",
      launchDate: "2024-06-15",
      salesCount: 5230,
      reviewScore: 4.4,
      manager: "태블릿팀",
    },
    {
      id: 4,
      name: "갤럭시 버즈2 프로",
      category: "오디오",
      price: 199000,
      status: "active",
      launchDate: "2024-05-10",
      salesCount: 12300,
      reviewScore: 4.2,
      manager: "오디오팀",
    },
    {
      id: 5,
      name: "갤럭시 북3 프로",
      category: "노트북",
      price: 1599000,
      status: "dormant",
      launchDate: "2024-04-01",
      salesCount: 2100,
      reviewScore: 4.1,
      manager: "PC팀",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.name.includes(searchTerm) ||
      product.category.includes(searchTerm) ||
      product.manager.includes(searchTerm)
  );

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  return (
    <Layout
      sidebar={<Sidebar activeMenu="products" />}
      header={
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
    >
      <Container>
        <PageHeader>
          <PageTitle>상품 조회</PageTitle>
        </PageHeader>

        <SearchBar>
          <SearchInput
            type="text"
            placeholder="상품명, 카테고리, 담당자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="primary" onClick={handleSearch}>
            검색
          </Button>
          <Button onClick={handleReset}>초기화</Button>
        </SearchBar>

        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th>상품명</Th>
                <Th>카테고리</Th>
                <Th>가격</Th>
                <Th>출시일</Th>
                <Th>상태</Th>
                <Th>판매량</Th>
                <Th>평점</Th>
                <Th>담당자</Th>
              </tr>
            </Thead>
            <Tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.name}</Td>
                    <Td>{product.category}</Td>
                    <Td>{product.price.toLocaleString()}원</Td>
                    <Td>{product.launchDate}</Td>
                    <Td>
                      <StatusBadge status={product.status}>
                        {product.status === "active" ? "활성" : "휴면"}
                      </StatusBadge>
                    </Td>
                    <Td>{product.salesCount.toLocaleString()}개</Td>
                    <Td>{product.reviewScore}/5.0</Td>
                    <Td>{product.manager}</Td>
                  </Tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={8}>
                    <EmptyState>
                      <EmptyIcon className="fas fa-search" />
                      <EmptyText>검색 결과가 없습니다.</EmptyText>
                    </EmptyState>
                  </Td>
                </tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default Products;
