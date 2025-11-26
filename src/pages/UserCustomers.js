import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

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
  padding: 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "active":
        return "#D1F2D8";
      case "dormant":
        return "#FADADD";
      case "reserved":
        return "#D6E9F8";
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "active":
        return "#2E7D32";
      case "dormant":
        return "#C2185B";
      case "reserved":
        return "#1565C0";
      default:
        return "#4B5563";
    }
  }};
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
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

// ==================== Component ====================

const CustomerView = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      phone: "010-1234-5678",
      segment: "VIP",
      joinDate: "2023-01-15",
      status: "active",
      lastPurchase: "2024-11-01",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      phone: "010-9876-5432",
      segment: "일반",
      joinDate: "2023-03-20",
      status: "active",
      lastPurchase: "2024-10-28",
    },
    {
      id: 3,
      name: "박지민",
      email: "park@example.com",
      phone: "010-5555-7777",
      segment: "신규",
      joinDate: "2024-09-01",
      status: "dormant",
      lastPurchase: "2024-09-15",
    },
    {
      id: 4,
      name: "최민수",
      email: "choi@example.com",
      phone: "010-7777-8888",
      segment: "VIP",
      joinDate: "2022-12-10",
      status: "reserved",
      lastPurchase: "2024-11-05",
    },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.segment.includes(searchTerm)
  );

  const handleCustomerClick = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  const handleSearch = () => {
    // Search is handled by the filter
    console.log("Searching for:", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const getStatusLabel = (status) => {
    if (status === "active") return "진행중";
    if (status === "reserved") return "예약됨";
    if (status === "dormant") return "종료";
    return status;
  };

  return (
    <Layout
      sidebar={<Sidebar activeMenu="customers" />}
      header={
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
    >
      <Container>
        <PageHeader>
          <PageTitle>고객 정보 조회</PageTitle>
        </PageHeader>

        <SearchBar>
          <SearchInput
            type="text"
            placeholder="고객명, 이메일, 세그먼트로 검색"
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
                <Th>고객명</Th>
                <Th>이메일</Th>
                <Th>전화번호</Th>
                <Th>세그먼트</Th>
                <Th>가입일</Th>
                <Th>상태</Th>
                <Th>최근구매</Th>
                <Th>관리</Th>
              </tr>
            </Thead>
            <Tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <Tr key={customer.id}>
                    <Td>{customer.name}</Td>
                    <Td>{customer.email}</Td>
                    <Td>{customer.phone}</Td>
                    <Td>{customer.segment}</Td>
                    <Td>{customer.joinDate}</Td>
                    <Td>
                      <StatusBadge status={customer.status}>
                        {getStatusLabel(customer.status)}
                      </StatusBadge>
                    </Td>
                    <Td>{customer.lastPurchase}</Td>
                    <Td>
                      <ActionButton
                        onClick={() => handleCustomerClick(customer.id)}
                      >
                        상세보기
                      </ActionButton>
                    </Td>
                  </Tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={8}>
                    <EmptyState>
                      <EmptyIcon className="fas fa-search"></EmptyIcon>
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

export default CustomerView;
