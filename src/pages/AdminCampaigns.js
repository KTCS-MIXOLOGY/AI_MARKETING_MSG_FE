import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import Loading from "../components/common/Loading";
import { campaignsAPI } from "../services/api";

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

/* --- 페이지네이션 --- */

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  min-width: 38px;
  height: 38px;
  padding: 0 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.active ? "#e60012" : "#e5e7eb")};
  background: ${(props) => (props.active ? "#e60012" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#4b5563")};
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? "#b8000e" : "#f9fafb")};
    border-color: ${(props) => (props.active ? "#b8000e" : "#d1d5db")};
  }

  i {
    font-size: 0.75rem;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0.5rem;
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

// 캠페인 상세정보 모달
const NameButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: #111827;          
  cursor: pointer;
  text-align: left;
  width: 100%;

  /* 기본 상태는 그냥 텍스트처럼 보이도록 */
  &:hover {
    color: #e60012;        
  }

  &:focus-visible {
    outline: 2px solid rgba(230, 0, 18, 0.4);
    outline-offset: 2px;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailFullRow = styled.div`
  grid-column: 1 / -1;
`;

const ReadonlyField = styled.div`
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  font-size: 0.9375rem;
  color: #111827;
  display: flex;
  align-items: center;
  line-height: 1.5;
`;

const ReadonlyTextareaField = styled(ReadonlyField)`
  min-height: 100px;
  align-items: flex-start;
  white-space: pre-line;
  line-height: 1.6;
`;

const StatusBadgeWrapper = styled.div`
  display: inline-flex;
  padding: 0.5rem 0;
`;


// Backend CampaignType 매핑
const CAMPAIGN_TYPE_MAP = {
  신규유치: "신규유치",
  고객유지: "고객유지",
  업셀링: "업셀링",
  크로스셀링: "크로스셀링",
  이탈방지: "이탈방지",
};

// Backend CampaignStatus 매핑
const CAMPAIGN_STATUS_MAP = {
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// Status 표시용 매핑 (UI용)
const STATUS_DISPLAY_MAP = {
  ACTIVE: "활성",
  DRAFT: "임시",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

// Status 스타일 매핑
const STATUS_STYLE_MAP = {
  ACTIVE: "active",
  DRAFT: "scheduled",
  COMPLETED: "ended",
  CANCELLED: "ended",
};

const AdminCampaigns = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 전체 캠페인 목록을 별도로 보관
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // 페이지네이션 상태 (이제는 클라이언트에서만 사용)
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
  });

  // 초기 한 번만 전체 캠페인 조회 (페이지 변경 시마다 서버 호출하지 않음)
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // 필터가 바뀌면 페이지를 0으로 리셋
  useEffect(() => {
    setCurrentPage(0);
  }, [statusFilter, typeFilter]);

  // AdminDashboard에서 전달받은 campaignId로 상세 모달 자동 열기
  useEffect(() => {
    if (location.state?.campaignId && allCampaigns.length > 0) {
      const campaign = allCampaigns.find(c => c.id === location.state.campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
        setIsDetailOpen(true);
        // state 초기화 (뒤로가기 시 다시 열리지 않도록)
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, allCampaigns, navigate, location.pathname]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      
      const response = await campaignsAPI.getCampaigns({
        page: 0,
        size: 1000,
      });

      if (response.data && response.data.success) {
        const pageData = response.data.data;
        const campaignList = pageData.content || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mappedCampaigns = campaignList.map((campaign) => {
          const endDate = new Date(campaign.endDate);
          endDate.setHours(0, 0, 0, 0);

          let status = campaign.status;
          if (status === "ACTIVE" && endDate < today) {
            status = "COMPLETED";
            updateCampaignStatusToCompleted(campaign.campaignId, campaign);
          }

          return {
            id: campaign.campaignId,
            name: campaign.name,
            type: campaign.type,
            status: status,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            description: campaign.description || "",
            targetCount: campaign.targetCustomerCount || 0,
            createdBy: campaign.createdBy || "관리자",
            createdAt: campaign.createdAt ? campaign.createdAt.slice(0, 10) : "",
          };
        });

        // 전체 목록 상태에 저장
        setAllCampaigns(mappedCampaigns);
      }
    } catch (error) {
      console.error("캠페인 조회 실패:", error);
      const errorMessage =
        error.response?.data?.message || "캠페인 목록을 불러오는데 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 캠페인 상태를 COMPLETED로 자동 업데이트
  const updateCampaignStatusToCompleted = async (campaignId, campaign) => {
    try {
      const campaignData = {
        name: campaign.name,
        type: campaign.type,
        description: campaign.description || "",
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: "COMPLETED",
      };

      await campaignsAPI.updateCampaign(campaignId, campaignData);
      console.log(`캠페인 ${campaignId}의 상태가 자동으로 COMPLETED로 변경되었습니다.`);
    } catch (error) {
      console.error("캠페인 상태 자동 업데이트 실패:", error);
      // 에러가 발생해도 사용자에게는 알리지 않음 (백그라운드 처리)
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "DRAFT",
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
      status: campaign.status || "DRAFT",
    });
    setIsModalOpen(true);
  };
  const openDetailModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailOpen(true);
  };


  const handleDelete = async (id) => {
    const campaign = allCampaigns.find((c) => c.id === id);

    if (!campaign) {
      toast.error("캠페인을 찾을 수 없습니다.");
      return;
    }

    // DRAFT 상태인 경우에만 실제 삭제, 그 외에는 상태를 CANCELLED로 변경
    if (campaign.status === "DRAFT") {
      if (!window) {
        toast.error("해당 캠페인을 완전히 삭제되었습니다.");
        return;
      }

      try {
        const response = await campaignsAPI.deleteCampaign(id);

        if (response.data && response.data.success) {
          toast.success("캠페인이 삭제되었습니다.");
          fetchCampaigns(); // 목록 새로고침
        }
      } catch (error) {
        console.error("캠페인 삭제 실패:", error);
        const errorMessage = error.response?.data?.message || "캠페인 삭제에 실패했습니다.";
        toast.error(errorMessage);
      }
    } else {
      // ACTIVE, COMPLETED 상태인 경우 CANCELLED로 변경
      if (!window) {
        toast.error("해당 캠페인을 취소 상태로 변경하시겠습니까?");
        return;
      }

      try {
        const campaignData = {
          name: campaign.name,
          type: campaign.type,
          description: campaign.description,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: "CANCELLED",
        };

        const response = await campaignsAPI.updateCampaign(id, campaignData);

        if (response.data && response.data.success) {
          toast.success("캠페인이 취소되었습니다.");
          fetchCampaigns(); // 목록 새로고침
        }
      } catch (error) {
        console.error("캠페인 상태 변경 실패:", error);
        const errorMessage = error.response?.data?.message || "캠페인 상태 변경에 실패했습니다.";
        toast.error(errorMessage);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.type ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      // Backend API 형식으로 데이터 준비
      const campaignData = {
        name: formData.name,
        type: formData.type,
        description: formData.description || "",
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      if (editingCampaign) {
        // 캠페인 수정
        const response = await campaignsAPI.updateCampaign(editingCampaign.id, campaignData);

        if (response.data && response.data.success) {
          toast.success("캠페인이 수정되었습니다.");
          fetchCampaigns(); // 목록 새로고침
        }
      } else {
        // 캠페인 생성
        const response = await campaignsAPI.createCampaign(campaignData);

        if (response.data && response.data.success) {
          toast.success("캠페인이 생성되었습니다.");
          fetchCampaigns(); // 목록 새로고침
        }
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("캠페인 저장 실패:", error);
      const errorMessage = error.response?.data?.message || "캠페인 저장에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  const getStatusText = (status) => {
    return STATUS_DISPLAY_MAP[status] || status;
  };

  const getStatusStyle = (status) => {
    return STATUS_STYLE_MAP[status] || "ended";
  };

  // 전체 목록에서 먼저 필터링
  const filteredCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => {
      const statusOk =
        statusFilter === "all" ? true : campaign.status === statusFilter;
      const typeOk =
        typeFilter === "all" ? true : campaign.type === typeFilter;
      return statusOk && typeOk;
    });
  }, [allCampaigns, statusFilter, typeFilter]);

  // 필터된 결과에 대해 다시 페이지네이션
  const paginatedCampaigns = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredCampaigns.slice(start, end);
  }, [filteredCampaigns, currentPage]);

  const totalElements = filteredCampaigns.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 0;

  const campaignTypes = Array.from(new Set(allCampaigns.map((c) => c.type)));

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

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

        {loading ? (
          <Loading />
        ) : (
          <>
            <FilterBar>
              <FilterGroup>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">전체 상태</option>
                  <option value="ACTIVE">활성</option>
                  <option value="DRAFT">임시</option>
                  <option value="COMPLETED">완료</option>
                  <option value="CANCELLED">취소</option>
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
                    {/* <Th>대상수</Th> */}
                    {/* <Th>생성자</Th> */}
                    <Th>생성일</Th>
                    <Th>작업</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {paginatedCampaigns.length > 0 ? (
                    paginatedCampaigns.map((campaign) => (
                      <Tr key={campaign.id}>
                        <Td>
                          <NameButton
                            type="button"
                            onClick={() => openDetailModal(campaign)}
                          >
                            {campaign.name}
                          </NameButton>
                        </Td>
                        <Td>{campaign.type}</Td>
                        <Td>
                          <StatusBadge status={getStatusStyle(campaign.status)}>
                            {getStatusText(campaign.status)}
                          </StatusBadge>
                        </Td>
                        <Td>{campaign.startDate}</Td>
                        <Td>{campaign.endDate}</Td>
                        {/* <Td>{campaign.targetCount.toLocaleString()}</Td> */}
                        {/* <Td>{campaign.createdBy}</Td> */}
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
                              onClick={() =>
                                handleDelete(campaign.id)
                              }
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
                          <EmptyText>
                            조건에 맞는 캠페인이 없습니다.
                          </EmptyText>
                        </EmptyState>
                      </Td>
                    </tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <PaginationContainer>
                <PageButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <i className="fas fa-chevron-left"></i>
                </PageButton>

                {getPageNumbers().map((pageNum) => (
                  <PageButton
                    key={pageNum}
                    active={pageNum === currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum + 1}
                  </PageButton>
                ))}

                <PageButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </PageButton>

                <PageInfo>
                  {totalElements > 0 && (
                    <>
                      {totalElements}개 중{" "}
                      {currentPage * pageSize + 1}-
                      {Math.min((currentPage + 1) * pageSize, totalElements)}
                    </>
                  )}
                </PageInfo>
              </PaginationContainer>
            )}
          </>
        )}
      </Container>

      {isDetailOpen && selectedCampaign && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>캠페인 상세</ModalTitle>
              <CloseButton
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedCampaign(null);
                }}
              >
                &times;
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <DetailFullRow>
                <FormRow>
                  <Label>캠페인명</Label>
                  <ReadonlyField>{selectedCampaign.name}</ReadonlyField>
                </FormRow>
              </DetailFullRow>

              <DetailGrid>
                <FormRow>
                  <Label>캠페인 유형</Label>
                  <ReadonlyField>{selectedCampaign.type}</ReadonlyField>
                </FormRow>

                <FormRow>
                  <Label>상태</Label>
                  <StatusBadgeWrapper>
                    <StatusBadge status={getStatusStyle(selectedCampaign.status)}>
                      {getStatusText(selectedCampaign.status)}
                    </StatusBadge>
                  </StatusBadgeWrapper>
                </FormRow>
              </DetailGrid>

              <DetailFullRow>
                <FormRow>
                  <Label>설명</Label>
                  <ReadonlyTextareaField>
                    {selectedCampaign.description || "설명 없음"}
                  </ReadonlyTextareaField>
                </FormRow>
              </DetailFullRow>

              <DetailGrid>
                <FormRow>
                  <Label>시작일</Label>
                  <ReadonlyField>{selectedCampaign.startDate}</ReadonlyField>
                </FormRow>

                <FormRow>
                  <Label>종료일</Label>
                  <ReadonlyField>{selectedCampaign.endDate}</ReadonlyField>
                </FormRow>
              </DetailGrid>

              <DetailGrid>
                <FormRow>
                  <Label>대상 고객 수</Label>
                  <ReadonlyField>
                    {selectedCampaign.targetCount.toLocaleString()}명
                  </ReadonlyField>
                </FormRow>

                <FormRow>
                  <Label>생성자</Label>
                  <ReadonlyField>{selectedCampaign.createdBy}</ReadonlyField>
                </FormRow>
              </DetailGrid>

              <DetailFullRow>
                <FormRow>
                  <Label>생성일</Label>
                  <ReadonlyField>{selectedCampaign.createdAt}</ReadonlyField>
                </FormRow>
              </DetailFullRow>

              <FormRow
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <ModalSubmitButton
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    openEditModal(selectedCampaign);
                  }}
                >
                  <i className="fas fa-pen" style={{ marginRight: "0.5rem" }}></i>
                  수정
                </ModalSubmitButton>
              </FormRow>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

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
                    <option value="신규유치">신규유치</option>
                    <option value="고객유지">고객유지</option>
                    <option value="업셀링">업셀링</option>
                    <option value="크로스셀링">크로스셀링</option>
                    <option value="이탈방지">이탈방지</option>
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

                <FormRow>
                  <Label>
                    상태<RequiredMark>*</RequiredMark>
                  </Label>
                  <SelectField
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="DRAFT">임시 저장</option>
                    <option value="ACTIVE">활성</option>
                    <option value="COMPLETED">완료</option>
                    <option value="CANCELLED">취소</option>
                  </SelectField>
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
