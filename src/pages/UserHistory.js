import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { messagesAPI } from "../services/api";

const HistoryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e5e5;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #e60012 0%, #b8000e 100%);
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: #737373;
  font-weight: 500;
  margin-bottom: 0.75rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #e60012 0%, #b8000e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #e60012;
  box-shadow: 0 4px 12px rgba(230, 0, 18, 0.15);
`;

const FilterSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e5e5;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: #171717;

    i {
      color: #e60012;
      margin-right: 0.5rem;
    }
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #525252;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-size: 0.9375rem;
  background: #ffffff;
  transition: all 0.2s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23525252'%3E%3Cpath d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
  }

  &:hover {
    border-color: #a3a3a3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
`;

const Button = styled.button`
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) =>
    props.variant === "primary" ? "#E60012" : "#f5f5f5"};
  color: ${(props) => (props.variant === "primary" ? "#ffffff" : "#171717")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#C50010" : "#e5e5e5"};
  }

  i {
    font-size: 1rem;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #171717;
  margin: 0;
`;

const Badge = styled.span`
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #e60012;
  color: #ffffff;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const MessagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
`;

const MessageCard = styled.div`
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #e60012;
    box-shadow: 0 8px 24px rgba(230, 0, 18, 0.15);
    transform: translateY(-2px);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const MessageStatus = styled.span`
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => (props.status === "sent" ? "#D1FAE5" : "#FEE2E2")};
  color: ${(props) => (props.status === "sent" ? "#065F46" : "#991B1B")};
`;

const MessageDate = styled.span`
  font-size: 0.75rem;
  color: #737373;
`;

const MessageContent = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #525252;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MessageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
  font-size: 0.8125rem;
  color: #737373;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  i {
    color: #e60012;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #737373;

  i {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    display: block;
    color: #d4d4d4;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #525252;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9375rem;
    color: #737373;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #171717;
  margin: 0;
`;

const ModalClose = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5e5;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #525252;
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  color: #171717;
  font-size: 0.9375rem;
`;

const UserHistory = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    type: "",
    campaign: "",
    period: "",
    startDate: "",
    endDate: "",
  });

  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // eslint-disable-line no-unused-vars
  const [totalCount, setTotalCount] = useState(0); // eslint-disable-line no-unused-vars
  const [campaignList, setCampaignList] = useState([]); // 캠페인 목록

  // 메시지 목록 불러오기
  const fetchMessages = useCallback(async (page = 1) => {
    try {
      setLoading(true);

      // API 요청 파라미터 구성
      const params = {
        page: page,
        size: 10,
      };

      // 기본 필터 추가
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.type) {
        params.messageType = filters.type === "segment" ? "SEGMENT" : "INDIVIDUAL";
      }
      if (filters.campaign) {
        params.campaignName = filters.campaign;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      console.log("메시지 목록 조회 파라미터:", params);

      const response = await messagesAPI.getMessages(params);

      if (response.data.success) {
        const data = response.data.data;
        let formattedMessages = data.messages.map((msg) => ({
          id: msg.messageId,
          content: msg.contentPreview,
          campaign: msg.campaignName,
          status: "sent", // API에서 status가 없으므로 기본값
          type: msg.messageType === "SEGMENT" ? "segment" : "individual",
          product: msg.productName,
          tone: msg.tone,
          version: msg.messageVersion,
          charCount: msg.characterCount,
          aiModel: msg.aiModelUsed,
          created_at: msg.createdAt,
        }));

        // 백엔드가 필터링을 하지 않으므로 프론트엔드에서 필터링
        if (filters.type) {
          formattedMessages = formattedMessages.filter(
            (msg) => msg.type === filters.type
          );
        }
        if (filters.status) {
          formattedMessages = formattedMessages.filter(
            (msg) => msg.status === filters.status
          );
        }
        if (filters.campaign) {
          formattedMessages = formattedMessages.filter((msg) =>
            msg.campaign?.toLowerCase().includes(filters.campaign.toLowerCase())
          );
        }
        if (filters.startDate || filters.endDate) {
          formattedMessages = formattedMessages.filter((msg) => {
            const msgDate = new Date(msg.created_at);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate + "T23:59:59") : null;

            if (startDate && msgDate < startDate) return false;
            if (endDate && msgDate > endDate) return false;
            return true;
          });
        }

        setMessages(formattedMessages);
        setFilteredMessages(formattedMessages);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalCount(formattedMessages.length); // 필터링 후 개수

        // 캠페인 목록 추출 (중복 제거)
        const campaigns = [...new Set(data.messages.map(msg => msg.campaignName).filter(Boolean))];
        setCampaignList(campaigns);
      }
    } catch (error) {
      console.error("메시지 목록 조회 실패:", error);
      toast.error("메시지 목록을 불러오는데 실패했습니다.");
      // 실패 시 빈 배열
      setMessages([]);
      setFilteredMessages([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.type, filters.campaign, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage, fetchMessages]);

  // 이름 익명화 함수 (가운데 글자 * 처리)
  const anonymizeName = (name) => {
    if (!name || name.length === 0) return name;
    if (name.length === 1) return name;
    if (name.length === 2) return name[0] + "*";

    const firstChar = name[0];
    const lastChar = name[name.length - 1];
    const middleStars = "*".repeat(name.length - 2);
    return firstChar + middleStars + lastChar;
  };

  const handleFilterChange = (key, value) => {
    // 필터 변경 시 페이지를 1로 리셋
    setCurrentPage(1);

    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // 기간 필터를 선택하면 startDate와 endDate를 자동으로 설정
      if (key === "period" && value) {
        const today = new Date();
        let startDate = "";

        switch (value) {
          case "today":
            startDate = today.toISOString().split("T")[0];
            newFilters.startDate = startDate;
            newFilters.endDate = startDate;
            break;
          case "week":
            startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            newFilters.startDate = startDate;
            newFilters.endDate = today.toISOString().split("T")[0];
            break;
          case "month":
            startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            newFilters.startDate = startDate;
            newFilters.endDate = today.toISOString().split("T")[0];
            break;
          case "3months":
            startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            newFilters.startDate = startDate;
            newFilters.endDate = today.toISOString().split("T")[0];
            break;
          case "6months":
            startDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            newFilters.startDate = startDate;
            newFilters.endDate = today.toISOString().split("T")[0];
            break;
          default:
            // "전체 기간" 선택 시 날짜 필터 제거
            newFilters.startDate = "";
            newFilters.endDate = "";
        }
      }

      return newFilters;
    });
  };

  const resetFilters = () => {
    const reset = {
      status: "",
      type: "",
      campaign: "",
      period: "",
      startDate: "",
      endDate: "",
    };
    setFilters(reset);
    setCurrentPage(1); // 페이지도 첫 페이지로 리셋
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusText = (status) => {
    return status === "sent" ? "✓ 생성완료" : "✗ 생성실패";
  };

  const totalSent = messages.filter((m) => m.status === "sent").length;
  const totalFailed = messages.filter((m) => m.status === "failed").length;

  // 이번 달 생성 메시지 카운트
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthMessages = messages.filter((msg) => {
    if (msg.created_at) {
      const msgDate = new Date(msg.created_at);
      return msgDate >= thisMonthStart;
    }
    return false;
  }).length;

  const showMessageDetail = async (message) => {
    try {
      setLoading(true);
      const response = await messagesAPI.getMessage(message.id);

      if (response.data.success) {
        const detail = response.data.data;

        // API 응답을 기존 구조에 맞게 변환
        const formattedDetail = {
          id: detail.messageId,
          content: detail.messageContent,
          campaign: detail.campaignName,
          status: "sent",
          type: detail.messageType === "SEGMENT" ? "segment" : "individual",
          product: detail.productName,
          tone: detail.tone,
          toneId: detail.toneId,
          version: detail.messageVersion,
          charCount: detail.characterCount,
          aiModel: detail.aiModelUsed,
          generationPrompt: detail.generationPrompt,
          created_at: detail.createdAt,
          // INDIVIDUAL 타입일 경우 고객 정보 (이름 익명화)
          recipientName: detail.customerName ? anonymizeName(detail.customerName) : null,
          customerId: detail.customerId,
          // SEGMENT 타입일 경우 세그먼트 정보
          segmentInfo: detail.segmentInfo,
        };

        setSelectedMessage(formattedDetail);
        setShowModal(true);
      }
    } catch (error) {
      console.error("메시지 상세 조회 실패:", error);
      toast.error("메시지 상세 정보를 불러오는데 실패했습니다.");
      // 실패 시 기본 정보만 표시
      setSelectedMessage(message);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="history"
        />
      }
      header={<Header />}
    >
      <HistoryContainer>
        {/* 통계 카드 */}
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <div>
                <StatTitle>생성한 메시지</StatTitle>
                <StatValue>{messages.length}</StatValue>
              </div>
              <StatIcon>
                <i className="fas fa-file-alt" />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard>
            <StatHeader>
              <div>
                <StatTitle>생성 완료</StatTitle>
                <StatValue>{totalSent}</StatValue>
              </div>
              <StatIcon>
                <i className="fas fa-paper-plane" />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard>
            <StatHeader>
              <div>
                <StatTitle>생성 실패</StatTitle>
                <StatValue>{totalFailed}</StatValue>
              </div>
              <StatIcon>
                <i className="fas fa-exclamation-triangle" />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard>
            <StatHeader>
              <div>
                <StatTitle>이번 달 생성 메시지</StatTitle>
                <StatValue>{thisMonthMessages}</StatValue>
              </div>
              <StatIcon>
                <i className="fas fa-calendar-check" />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <FilterSection>
          <h3>
            <i className="fas fa-filter" /> 생성 이력 필터
          </h3>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>생성 상태</FilterLabel>
              <FilterSelect
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">전체</option>
                <option value="sent">생성완료</option>
                <option value="failed">생성실패</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>메시지 유형</FilterLabel>
              <FilterSelect
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">전체</option>
                <option value="segment">세그먼트 발송</option>
                <option value="individual">개인 발송</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>캠페인</FilterLabel>
              <FilterSelect
                value={filters.campaign}
                onChange={(e) => handleFilterChange("campaign", e.target.value)}
              >
                <option value="">전체</option>
                {campaignList.map((campaign, index) => (
                  <option key={index} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>기간</FilterLabel>
              <FilterSelect
                value={filters.period}
                onChange={(e) => handleFilterChange("period", e.target.value)}
              >
                <option value="">전체 기간</option>
                <option value="today">오늘</option>
                <option value="week">최근 7일</option>
                <option value="month">최근 30일</option>
                <option value="3months">최근 3개월</option>
                <option value="6months">최근 6개월</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>

          <ButtonGroup>
            <Button variant="secondary" onClick={resetFilters}>
              <i className="fas fa-redo" />
              필터 초기화
            </Button>
          </ButtonGroup>
        </FilterSection>

        {/* 메시지 목록 */}
        {filteredMessages.length === 0 ? (
          <Card>
            <EmptyState>
              <i className="fas fa-inbox" />
              <h3>메시지가 없습니다</h3>
              <p>조건에 맞는 메시지가 없습니다. 필터를 변경해보세요.</p>
            </EmptyState>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>메시지 목록</CardTitle>
              <Badge>{filteredMessages.length}건</Badge>
            </CardHeader>
            <CardBody>
              <MessagesGrid>
                {filteredMessages.map((msg) => (
                  <MessageCard
                    key={msg.id}
                    onClick={() => showMessageDetail(msg)}
                  >
                    <MessageHeader>
                      <MessageStatus status={msg.status || "sent"}>
                        {getStatusText(msg.status || "sent")}
                      </MessageStatus>
                      <MessageDate>{formatDate(msg.created_at)}</MessageDate>
                    </MessageHeader>
                    <MessageContent>{msg.content}</MessageContent>
                    <MessageMeta>
                      <MetaItem>
                        <i className="fas fa-bullhorn" />
                        <span>{msg.campaign}</span>
                      </MetaItem>
                      <MetaItem>
                        <i
                          className={`fas fa-${
                            msg.type === "individual" ? "user" : "users"
                          }`}
                        />
                        <span>
                          {msg.type === "individual"
                            ? "개인 발송"
                            : "세그먼트 발송"}
                        </span>
                      </MetaItem>
                      <MetaItem>
                        <i className="fas fa-font" />
                        <span>{msg.charCount || msg.content?.length || 0}자</span>
                      </MetaItem>
                      {msg.status === "sent" && (
                        <MetaItem>
                          <i className="fas fa-check-circle" />
                          <span>전송 성공</span>
                        </MetaItem>
                      )}
                      {msg.status === "failed" && (
                        <MetaItem style={{ color: "#991B1B" }}>
                          <i className="fas fa-exclamation-circle" />
                          <span>전송 실패</span>
                        </MetaItem>
                      )}
                    </MessageMeta>
                  </MessageCard>
                ))}
              </MessagesGrid>
            </CardBody>
          </Card>
        )}
      </HistoryContainer>

      {/* 상세 모달 */}
      <ModalOverlay show={showModal} onClick={closeModal}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>메시지 상세</ModalTitle>
            <ModalClose onClick={closeModal}>
              <i className="fas fa-times" />
            </ModalClose>
          </ModalHeader>
          {selectedMessage && (
            <>
              <ModalBody>
                <DetailRow>
                  <DetailLabel>상태</DetailLabel>
                  <DetailValue>
                    <MessageStatus status={selectedMessage.status || "sent"}>
                      {getStatusText(selectedMessage.status || "sent")}
                    </MessageStatus>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>발송 유형</DetailLabel>
                  <DetailValue>
                    <i
                      className={`fas fa-${
                        selectedMessage.type === "individual" ? "user" : "users"
                      }`}
                      style={{
                        color: "#E60012",
                        marginRight: "0.5rem",
                      }}
                    />
                    {selectedMessage.type === "individual"
                      ? "개인 발송"
                      : "세그먼트 발송"}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>캠페인</DetailLabel>
                  <DetailValue>{selectedMessage.campaign}</DetailValue>
                </DetailRow>
                {selectedMessage.type === "individual" && (
                  <DetailRow>
                    <DetailLabel>수신자</DetailLabel>
                    <DetailValue>
                      {selectedMessage.recipientName} (
                      {selectedMessage.recipientPhone})
                    </DetailValue>
                  </DetailRow>
                )}
                <DetailRow>
                  <DetailLabel>생성일</DetailLabel>
                  <DetailValue>
                    {formatDate(selectedMessage.created_at)}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>글자수</DetailLabel>
                  <DetailValue>{selectedMessage.content.length}자</DetailValue>
                </DetailRow>
                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1.25rem",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  <DetailLabel
                    style={{
                      marginBottom: "0.75rem",
                      display: "block",
                    }}
                  >
                    메시지 내용
                  </DetailLabel>
                  <div style={{ lineHeight: 1.7, color: "#525252" }}>
                    {selectedMessage.content}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </Modal>
      </ModalOverlay>
    </Layout>
  );
};

export default UserHistory;
