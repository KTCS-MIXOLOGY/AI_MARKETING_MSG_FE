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

/* --- 필터 & 상단 우측 버튼 영역 --- */

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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

const NewCampaignButton = styled.button`
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.9375rem;
  background: #e60012;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 16px rgba(230, 0, 18, 0.25);
  transition: all 0.15s ease;

  &:hover {
    background: #b8000e;
    transform: translateY(-1px);
  }

  i {
    font-size: 0.95rem;
  }
`;

/* --- 테이블 --- */

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
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
      case "active":
        return "#D1F2D8";
      case "scheduled":
        return "#D6E9F8";
      case "ended":
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

/* 작업 컬럼 버튼 */

const ActionsCell = styled.td`
  padding: 1.1rem 1rem;
  white-space: nowrap;
`;

const ActionsWrapper = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: ${(props) =>
    props.variant === "danger" ? "none" : "1px solid #e5e7eb"};
  background: ${(props) =>
    props.variant === "danger" ? "#e60012" : "#ffffff"};
  color: ${(props) => (props.variant === "danger" ? "#ffffff" : "#4b5563")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(15, 23, 42, 0.12);
    transform: translateY(-1px);
    background: ${(props) =>
      props.variant === "danger" ? "#b8000e" : "#f9fafb"};
  }

  i {
    font-size: 0.9rem;
  }
`;

/* 비어있을 때 */

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

/* --- 모달 --- */

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
  width: 640px;
  max-width: 90vw;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
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
  padding: 0.65rem 2rem;
  overflow-y: auto;
`;

const FormRow = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #374151;
`;

const RequiredMark = styled.span`
  color: #e60012;
  margin-left: 2px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
  }
`;

const SelectField = styled(Select)`
  width: 100%;
  min-width: 0;
  background-position: right 0.9rem center;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  min-height: 100px;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
  }
`;

const ModalSubmitButton = styled.button`
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  border: none;
  background: #e60012;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #b8000e;
  }
`;

const initialCampaigns = [
  {
    id: 1,
    name: "장기 고객 감사 이벤트",
    type: "기존 고객 유지",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    approval: "관리자 승인",
    targetCount: 15000,
    createdBy: "마케팅팀",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    name: "5G 요금제 업그레이드",
    type: "업셀링",
    status: "ended",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    approval: "자체 승인",
    targetCount: 22000,
    createdBy: "CRM팀",
    createdAt: "2023-09-15",
  },
  {
    id: 3,
    name: "IoT 결합 상품 안내",
    type: "크로스셀링",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    approval: "자체 승인",
    targetCount: 8000,
    createdBy: "스마트홈팀",
    createdAt: "2023-12-28",
  },
  {
    id: 4,
    name: "데이터 무제한 전환",
    type: "이탈 방지",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    approval: "관리자 승인",
    targetCount: 12000,
    createdBy: "상품기획팀",
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    name: "생일 축하 이벤트",
    type: "기존 고객 유지",
    status: "scheduled",
    startDate: "2026-02-01",
    endDate: "2026-06-30",
    approval: "관리자 승인",
    targetCount: 15000,
    createdBy: "마케팅팀",
    createdAt: "2025-11-24",
  },
];

const AdminCampaigns = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    approval: "실행자 자체 승인",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
      approval: "실행자 자체 승인",
    });
    setEditingCampaign(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type,
      description: campaign.description || "",
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      approval: campaign.approval || "실행자 자체 승인",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("해당 캠페인을 삭제하시겠습니까?")) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.type ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (editingCampaign) {
      // 업데이트
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === editingCampaign.id
            ? {
                ...c,
                ...formData,
              }
            : c
        )
      );
    } else {
      // 새 캠페인 생성 (mock)
      const newId =
        campaigns.length > 0 ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1;
      setCampaigns((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
          status: "active",
          approval: formData.approval,
          targetCount: 0,
          createdBy: "관리자",
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "활성";
      case "scheduled":
        return "예약";
      case "ended":
        return "완료";
      default:
        return status;
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const statusOk =
      statusFilter === "all" ? true : campaign.status === statusFilter;
    const typeOk = typeFilter === "all" ? true : campaign.type === typeFilter;
    return statusOk && typeOk;
  });

  const campaignTypes = Array.from(new Set(campaigns.map((c) => c.type)));

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="campaigns"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <PageTitle>캠페인 관리</PageTitle>
        </PageHeader>

        <FilterBar>
          <FilterGroup>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="scheduled">예약</option>
              <option value="ended">완료</option>
            </Select>

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">전체 유형</option>
              {campaignTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <NewCampaignButton onClick={openCreateModal}>
            <i className="fas fa-plus"></i>캠페인 생성
          </NewCampaignButton>
        </FilterBar>

        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th>캠페인명</Th>
                <Th>유형</Th>
                <Th>상태</Th>
                <Th>시작일</Th>
                <Th>종료일</Th>
                <Th>대상수</Th>
                <Th>생성자</Th>
                <Th>생성일</Th>
                <Th>작업</Th>
              </tr>
            </Thead>
            <Tbody>
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <Tr key={campaign.id}>
                    <Td>{campaign.name}</Td>
                    <Td>{campaign.type}</Td>
                    <Td>
                      <StatusBadge status={campaign.status}>
                        {getStatusText(campaign.status)}
                      </StatusBadge>
                    </Td>
                    <Td>{campaign.startDate}</Td>
                    <Td>{campaign.endDate}</Td>
                    <Td>{campaign.targetCount.toLocaleString()}</Td>
                    <Td>{campaign.createdBy}</Td>
                    <Td>{campaign.createdAt}</Td>
                    <ActionsCell>
                      <ActionsWrapper>
                        <IconButton
                          type="button"
                          onClick={() => openEditModal(campaign)}
                        >
                          <i className="fas fa-pen" />
                        </IconButton>
                        <IconButton
                          type="button"
                          variant="danger"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <i className="fas fa-trash" />
                        </IconButton>
                      </ActionsWrapper>
                    </ActionsCell>
                  </Tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={10}>
                    <EmptyState>
                      <EmptyIcon className="fas fa-search" />
                      <EmptyText>조건에 맞는 캠페인이 없습니다.</EmptyText>
                    </EmptyState>
                  </Td>
                </tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingCampaign ? "캠페인 수정" : "새 캠페인 생성"}
              </ModalTitle>
              <CloseButton
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                &times;
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormRow>
                  <Label>
                    캠페인명<RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    name="name"
                    placeholder="캠페인명을 입력하세요"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>
                    캠페인 유형<RequiredMark>*</RequiredMark>
                  </Label>
                  <SelectField
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="기존 고객 유지">기존 고객 유지</option>
                    <option value="업셀링">업셀링</option>
                    <option value="크로스셀링">크로스셀링</option>
                    <option value="이탈 방지">이탈 방지</option>
                  </SelectField>
                </FormRow>

                <FormRow>
                  <Label>설명</Label>
                  <Textarea
                    name="description"
                    placeholder="캠페인에 대한 설명을 입력하세요"
                    value={formData.description}
                    onChange={handleFormChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>
                    시작일<RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>
                    종료일<RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                  />
                </FormRow>

                {/* 버튼을 모달 본문 맨 아래에 하나만 배치 */}
                <FormRow
                  style={{
                    marginTop: "1.75rem",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ModalSubmitButton type="submit">
                    {editingCampaign ? "저장" : "생성"}
                  </ModalSubmitButton>
                </FormRow>
              </ModalBody>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default AdminCampaigns;
