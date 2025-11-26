import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

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
  padding: 0.35rem 0.8rem;
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
    age: "",
    gender: "",
    region: "",
    membership: "",
    plan: "",
    period: "all",
  });

  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 초기 메시지 데이터 (더미)
  const defaultMessages = [
    {
      id: "MSG001",
      content:
        "지금 쓰시는 것에 WiFi 6 공유기 구가기 지하에만 안돼 현환 다른건 그냥 괜찮은데요",
      campaign: "여름 프로모션",
      status: "sent",
      type: "segment",
      targetAge: "30대",
      targetRegion: "서울",
      created_at: "2025-11-07T10:00:00Z",
    },
    {
      id: "MSG002",
      content:
        "김OO 고객님, 갤럭시 S20 2년 3개월 사용 중이시네요. 갤럭시 S24로 업그레이드하시면 더 나은 경험을 하실 수 있습니다.",
      campaign: "여름 프로모션",
      status: "sent",
      type: "individual",
      recipientName: "김고객",
      recipientPhone: "010-1234-5678",
      created_at: "2025-11-07T11:00:00Z",
    },
    {
      id: "MSG003",
      content:
        "김OO 고객님, 갤럭시 S20 2년 3개월 사용 중이시네요. 갤럭시 S24로 업그레이드하시면 더 나은 경험을 하실 수 있습니다. 맞춤형 프로모션 특별 혜택을 확인하세요!",
      campaign: "5G 전환 캠페인",
      status: "sent",
      type: "segment",
      targetAge: "20대",
      targetGender: "여성",
      targetMembership: "골드",
      created_at: "2025-11-07T12:00:00Z",
    },
    {
      id: "MSG004",
      content:
        "안녕하세요~ 갤럭시 S24 출시라고 고객님만을 위한 특별 이벤트 준비했어요. 확인하실래요?",
      campaign: "재가입 유도",
      status: "failed",
      type: "segment",
      targetAge: "40대",
      targetRegion: "경기",
      targetPlan: "5G 프리미엄",
      created_at: "2025-11-11T09:00:00Z",
    },
    {
      id: "MSG005",
      content:
        "[KT] 고객님의 데이터 사용량이 90%를 초과했습니다. 데이터 무제한 요금제로 변경하시겠습니까?",
      campaign: "VIP 특별 혜택",
      status: "sent",
      type: "individual",
      recipientName: "이고객",
      recipientPhone: "010-5678-1234",
      created_at: "2025-11-08T14:00:00Z",
    },
    {
      id: "MSG006",
      content:
        "고객님께 특별한 5G 요금제 할인 혜택을 드립니다. 지금 바로 확인하세요!",
      campaign: "5G 전환 캠페인",
      status: "sent",
      type: "segment",
      targetAge: "30대",
      targetMembership: "플래티넘",
      targetRegion: "서울",
      created_at: "2025-11-09T16:00:00Z",
    },
  ];

  useEffect(() => {
    setMessages(defaultMessages);
    setFilteredMessages(defaultMessages);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const reset = {
      status: "",
      type: "",
      campaign: "",
      age: "",
      gender: "",
      region: "",
      membership: "",
      plan: "",
      period: "all",
    };
    setFilters(reset);
    setFilteredMessages(messages);
  };

  const applyFilters = () => {
    let filtered = [...messages];

    const campaignMap = {
      summer: "여름",
      "5g": "5G",
      renewal: "재가입",
      vip: "VIP",
    };

    if (filters.status) {
      filtered = filtered.filter(
        (m) => (m.status || "sent") === filters.status
      );
    }
    if (filters.type) {
      filtered = filtered.filter((m) => (m.type || "segment") === filters.type);
    }
    if (filters.campaign) {
      const searchTerm = campaignMap[filters.campaign] || filters.campaign;
      filtered = filtered.filter((m) =>
        (m.campaign || "").includes(searchTerm)
      );
    }
    if (filters.age) {
      filtered = filtered.filter((m) => m.targetAge === filters.age);
    }
    if (filters.gender) {
      filtered = filtered.filter((m) => m.targetGender === filters.gender);
    }
    if (filters.region) {
      filtered = filtered.filter((m) => m.targetRegion === filters.region);
    }
    if (filters.membership) {
      filtered = filtered.filter(
        (m) => m.targetMembership === filters.membership
      );
    }
    if (filters.plan) {
      filtered = filtered.filter((m) => m.targetPlan === filters.plan);
    }

    setFilteredMessages(filtered);
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
    return status === "sent" ? "✓ 발송완료" : "✗ 발송실패";
  };

  const totalSent = messages.filter((m) => m.status === "sent").length;
  const totalFailed = messages.filter((m) => m.status === "failed").length;

  const showMessageDetail = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
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
                <StatTitle>발송 완료</StatTitle>
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
                <StatTitle>발송 실패</StatTitle>
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
                <StatTitle>평균 전환율</StatTitle>
                <StatValue>
                  15.8<span style={{ fontSize: "1.5rem" }}>%</span>
                </StatValue>
              </div>
              <StatIcon>
                <i className="fas fa-chart-line" />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <FilterSection>
          <h3>
            <i className="fas fa-filter" /> 발송 이력 필터
          </h3>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>발송 상태</FilterLabel>
              <FilterSelect
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">전체</option>
                <option value="sent">발송완료</option>
                <option value="failed">발송실패</option>
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
                <option value="summer">여름 프로모션</option>
                <option value="5g">5G 전환 캠페인</option>
                <option value="renewal">재가입 유도</option>
                <option value="vip">VIP 특별 혜택</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>나이대</FilterLabel>
              <FilterSelect
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
              >
                <option value="">전체</option>
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대 이상">60대 이상</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>성별</FilterLabel>
              <FilterSelect
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
              >
                <option value="">전체</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>지역</FilterLabel>
              <FilterSelect
                value={filters.region}
                onChange={(e) => handleFilterChange("region", e.target.value)}
              >
                <option value="">전체</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
                <option value="인천">인천</option>
                <option value="부산">부산</option>
                <option value="대구">대구</option>
                <option value="기타">기타 지역</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>멤버십</FilterLabel>
              <FilterSelect
                value={filters.membership}
                onChange={(e) =>
                  handleFilterChange("membership", e.target.value)
                }
              >
                <option value="">전체</option>
                <option value="브론즈">🥉 브론즈</option>
                <option value="실버">🥈 실버</option>
                <option value="골드">🥇 골드</option>
                <option value="플래티넘">💎 플래티넘</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>요금제</FilterLabel>
              <FilterSelect
                value={filters.plan}
                onChange={(e) => handleFilterChange("plan", e.target.value)}
              >
                <option value="">전체</option>
                <option value="5G 프리미엄">5G 프리미엄</option>
                <option value="5G 표준">5G 표준</option>
                <option value="LTE">LTE</option>
                <option value="알뜰폰">알뜰폰</option>
                <option value="기업">기업 요금제</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>기간</FilterLabel>
              <FilterSelect
                value={filters.period}
                onChange={(e) => handleFilterChange("period", e.target.value)}
              >
                <option value="all">전체 기간</option>
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
            <Button variant="primary" onClick={applyFilters}>
              <i className="fas fa-search" />
              조회
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
                        <span>{msg.content.length}자</span>
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
