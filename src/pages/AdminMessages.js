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

/* 필터 영역 */
const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  min-width: 180px;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  font-size: 0.9375rem;
  color: #374151;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  background-size: 10px 6px;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
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
  padding: 1.2rem 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
  white-space: nowrap;
`;

/* 뱃지 스타일 통일 */
const TypeBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  background: ${(p) => (p.type === "segment" ? "#E6FFFA" : "#EBF8FF")};
  color: ${(p) => (p.type === "segment" ? "#234E52" : "#2C5282")};
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  background: ${(p) => {
    switch (p.status) {
      case "completed":
        return "#D1F2D8";
      case "processing":
        return "#D6E9F8";
      case "failed":
        return "#FADADD";
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(p) => {
    switch (p.status) {
      case "completed":
        return "#2E7D32";
      case "processing":
        return "#1565C0";
      case "failed":
        return "#C2185B";
      default:
        return "#4B5563";
    }
  }};
`;

/* 자세히 보기 버튼 */
const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  }
`;

/* 모달 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  width: 520px;
  max-width: 90vw;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
  color: #9ca3af;

  &:hover {
    color: #4b5563;
  }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.75rem 1.5rem;
  overflow-y: auto;
`;

const ModalMeta = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const ModalText = styled.p`
  font-size: 0.9375rem;
  color: #111827;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
`;

const AdminMessages = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    {
      id: 1,
      type: "segment",
      target: "VIP 고객",
      content: "안녕하세요 {name}님, 특별 할인 혜택을 드립니다.",
      status: "completed",
      createdBy: "마케팅팀",
      createdAt: "2024-11-11 14:30",
      processedCount: 1250,
      successCount: 1200,
    },
    {
      id: 2,
      type: "individual",
      target: "김철수 고객",
      content: "김철수님, 고객님께 맞춤형 상품을 추천드립니다.",
      status: "processing",
      createdBy: "CRM팀",
      createdAt: "2024-11-11 15:45",
      processedCount: 1,
      successCount: 0,
    },
    {
      id: 3,
      type: "segment",
      target: "신규 가입자",
      content: "환영합니다! 신규 고객님께 드리는 특별 안내입니다.",
      status: "completed",
      createdBy: "고객경험팀",
      createdAt: "2024-11-10 09:20",
      processedCount: 3450,
      successCount: 3400,
    },
    {
      id: 4,
      type: "individual",
      target: "이영희 고객",
      content: "이영희님, 오랜만에 찾아주셔서 감사합니다.",
      status: "failed",
      createdBy: "마케팅팀",
      createdAt: "2024-11-09 16:10",
      processedCount: 1,
      successCount: 0,
    },
    {
      id: 5,
      type: "segment",
      target: "데이터 초과 고객",
      content: "이번 달 데이터가 부족해질 수 있어요!",
      status: "completed",
      createdBy: "CRM팀",
      createdAt: "2024-11-09 10:15",
      processedCount: 2200,
      successCount: 2150,
    },
  ];

  const filteredMessages = messages.filter((m) => {
    const typeOk = typeFilter === "all" || m.type === typeFilter;
    const statusOk = statusFilter === "all" || m.status === statusFilter;
    const creatorOk = creatorFilter === "all" || m.createdBy === creatorFilter;
    return typeOk && statusOk && creatorOk;
  });

  const creators = [...new Set(messages.map((m) => m.createdBy))];

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
          <PageTitle>메시지 로그 관리</PageTitle>
        </PageHeader>

        {/* 필터 */}
        <FilterBar>
          <FilterSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">전체 유형</option>
            <option value="segment">세그먼트</option>
            <option value="individual">개인</option>
          </FilterSelect>

          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="completed">완료</option>
            <option value="processing">처리중</option>
            <option value="failed">실패</option>
          </FilterSelect>

          <FilterSelect
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          >
            <option value="all">전체 생성자</option>
            {creators.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </FilterSelect>
        </FilterBar>

        {/* 테이블 */}
        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th>유형</Th>
                <Th>대상</Th>
                <Th>상태</Th>
                <Th>생성자</Th>
                <Th>생성일</Th>
                <Th>처리수</Th>
                <Th>성공수</Th>
                <Th>내용</Th>
              </tr>
            </Thead>

            <Tbody>
              {filteredMessages.map((msg) => (
                <Tr key={msg.id}>
                  <Td>{msg.type === "segment" ? "세그먼트" : "개인"}</Td>
                  <Td>{msg.target}</Td>
                  <Td>
                    <StatusBadge status={msg.status}>
                      {msg.status === "completed"
                        ? "완료"
                        : msg.status === "processing"
                        ? "처리중"
                        : "실패"}
                    </StatusBadge>
                  </Td>
                  <Td>{msg.createdBy}</Td>
                  <Td>{msg.createdAt}</Td>
                  <Td>{msg.processedCount}</Td>
                  <Td>{msg.successCount}</Td>
                  <Td>
                    <ViewButton
                      type="button"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      자세히 보기
                    </ViewButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>

      {selectedMessage && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>메시지 상세</ModalTitle>
              <CloseButton onClick={() => setSelectedMessage(null)}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalText>{selectedMessage.content}</ModalText>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default AdminMessages;
