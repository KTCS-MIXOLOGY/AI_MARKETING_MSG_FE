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

/* 상단 헤더 */

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

/* 필터 바 */

const FilterBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  min-width: 180px;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #374151;
  background-color: #ffffff;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 10px 6px;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

/* 테이블 */

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

/* 상태 뱃지 */

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "active":
        return "#D1F2D8"; // 초록
      case "pending":
        return "#D6E9F8"; // 파랑
      case "inactive":
        return "#FADADD"; // 분홍
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "active":
        return "#2E7D32";
      case "pending":
        return "#1565C0";
      case "inactive":
        return "#C2185B";
      default:
        return "#4B5563";
    }
  }};
`;

/* 빈 상태 */

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

const AdminUsers = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "김관식",
      email: "admin@ktcs.com",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-11-11",
      department: "IT본부",
      lastSentAt: "2024-11-10",
    },
    {
      id: 2,
      name: "이마케터",
      email: "marketer@ktcs.com",
      status: "active",
      joinDate: "2024-02-20",
      lastLogin: "2024-11-10",
      department: "마케팅팀",
      lastSentAt: "2024-11-09",
    },
    {
      id: 3,
      name: "박분석",
      email: "analyst@ktcs.com",
      status: "pending",
      joinDate: "2024-09-01",
      lastLogin: "2025-09-01",
      department: "CRM팀",
      lastSentAt: "2025-08-30",
    },
    {
      id: 4,
      name: "최고객",
      email: "choi@ktcs.com",
      status: "inactive",
      joinDate: "2023-12-10",
      lastLogin: "2024-10-25",
      department: "고객경험팀",
      lastSentAt: "2024-08-30",
    },
  ];

  const departments = Array.from(new Set(users.map((u) => u.department)));

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "활성";
      case "pending":
        return "대기";
      case "inactive":
        return "비활성";
      default:
        return status;
    }
  };

  const filteredUsers = users.filter((user) => {
    const statusOk =
      statusFilter === "all" ? true : user.status === statusFilter;
    const deptOk = deptFilter === "all" ? true : user.department === deptFilter;
    return statusOk && deptOk;
  });

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
          <PageTitle>회원 관리</PageTitle>
        </PageHeader>

        {/* 상태 / 부서 필터 */}
        <FilterBar>
          <FilterGroup>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="pending">대기</option>
              <option value="inactive">비활성</option>
            </Select>

            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="all">전체 부서</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </FilterGroup>
        </FilterBar>

        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th>이름</Th>
                <Th>이메일</Th>
                <Th>부서</Th>
                <Th>가입일</Th>
                <Th>마지막 로그인</Th>
                <Th>최근 발송일</Th>
                <Th>상태</Th>
              </tr>
            </Thead>
            <Tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.department}</Td>
                    <Td>{user.joinDate}</Td>
                    <Td>{user.lastLogin}</Td>
                    <Td>{user.lastSentAt}</Td>
                    <Td>
                      <StatusBadge status={user.status}>
                        {getStatusText(user.status)}
                      </StatusBadge>
                    </Td>
                  </Tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={7}>
                    <EmptyState>
                      <EmptyIcon className="fas fa-search" />
                      <EmptyText>조건에 맞는 회원이 없습니다.</EmptyText>
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

export default AdminUsers;
