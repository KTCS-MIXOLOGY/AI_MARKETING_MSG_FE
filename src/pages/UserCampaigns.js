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
  background: ${(props) => {
    switch (props.status) {
      case "active": // 진행중
        return "#D1F2D8";
      case "scheduled": // 예약됨
        return "#D6E9F8";
      case "ended": // 종료
        return "#FADADD";
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "active":
        return "#2E7D32";
      case "scheduled":
        return "#1565C0";
      case "ended":
        return "#C2185B";
      default:
        return "#4B5563";
    }
  }};
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

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: "겨울 신제품 출시 캠페인",
      type: "이메일",
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      status: "active",
      targetCount: 15000,
      sentCount: 12000,
      openRate: 25.3,
      createdBy: "마케팅팀",
    },
    {
      id: 2,
      name: "블랙프라이데이 특가 이벤트",
      type: "SMS",
      startDate: "2024-11-15",
      endDate: "2024-11-25",
      status: "scheduled",
      targetCount: 25000,
      sentCount: 0,
      openRate: 0,
      createdBy: "CRM팀",
    },
    {
      id: 3,
      name: "고객 생일 축하 메시지",
      type: "카카오알림",
      startDate: "2024-10-01",
      endDate: "2024-10-31",
      status: "ended",
      targetCount: 8000,
      sentCount: 7800,
      openRate: 45.2,
      createdBy: "고객경험팀",
    },
    {
      id: 4,
      name: "VIP 고객 감사 이벤트",
      type: "이메일",
      startDate: "2024-11-05",
      endDate: "2024-11-20",
      status: "active",
      targetCount: 5000,
      sentCount: 4800,
      openRate: 38.7,
      createdBy: "VIP관리팀",
    },
  ];

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.includes(searchTerm) ||
      campaign.type.includes(searchTerm) ||
      campaign.createdBy.includes(searchTerm)
  );

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "진행중";
      case "scheduled":
        return "예약됨";
      case "ended":
        return "종료";
      default:
        return status;
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  return (
    <Layout
      sidebar={<Sidebar activeMenu="campaigns" />}
      header={
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
    >
      <Container>
        <PageHeader>
          <PageTitle>캠페인 조회</PageTitle>
        </PageHeader>

        <SearchBar>
          <SearchInput
            type="text"
            placeholder="캠페인명, 유형, 생성자로 검색"
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
            </Thead>
            <Tbody>
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
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
                ))
              ) : (
                <tr>
                  <Td colSpan={9}>
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

export default Campaigns;
