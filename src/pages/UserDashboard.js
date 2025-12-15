import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Card from "../components/common/Card";
import { messagesAPI, campaignsAPI } from "../services/api";

/* ----- 공통 컨테이너 ----- */

const DashboardContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

/* ----- 상단 빨간 Hero 영역 ----- */

const HeroSection = styled.div`
  background: #e60012;
  border-radius: 24px;
  padding: 3rem 3.5rem;
  margin-bottom: 2.5rem;
  color: #ffffff;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const HeroSubtitle = styled.p`
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const HeroButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled.button`
  min-width: 180px;
  height: 52px;
  border-radius: 10px;
  border: none;
  padding: 0 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  background: ${(props) =>
    props.variant === "primary" ? "#ffffff" : "#b8000e"};
  color: ${(props) => (props.variant === "primary" ? "#e60012" : "#ffffff")};

  &:hover {
    transform: translateY(-2px);
    background: ${(props) =>
      props.variant === "primary" ? "#f7f7f7" : "#9f000c"};
  }

  i {
    font-size: 1rem;
  }
`;

/* ----- 통계 카드 영역 ----- */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Card)`
  padding: 1.75rem 1.5rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #e60012;
`;

/* ----- 활성 캠페인 카드 ----- */

const SectionCard = styled(Card)`
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;

  display: flex;
  gap: 0.35rem;
  align-items: center;

  &::before {
    content: "";
    width: 3px;
    height: 18px;
    background: #e60012;
    border-radius: 999px;
  }
`;

const CampaignList = styled.div`
  padding: 0.75rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CampaignItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9rem 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const CampaignIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  flex-shrink: 0;

  background: #e60012;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 1rem;

  i {
    font-size: 1.3rem;
  }
`;

const CampaignInfo = styled.div`
  flex: 1;
`;

const CampaignTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
`;

const CampaignMeta = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.82rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  i {
    font-size: 0.75rem;
  }
`;

const CampaignButton = styled.button`
  padding: 0.55rem 1.4rem;
  border-radius: 6px;
  border: none;
  background: #e60012;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  i {
    font-size: 0.75rem;
  }

  &:hover {
    background: #c00010;
    transform: translateY(-1px);
  }
`;

/* ----- 아이콘 매핑 함수 ----- */

const getCampaignIcon = (type) => {
  if (type.includes("신규")) return "fa-users";
  if (type.includes("기존")) return "fa-user-check";
  if (type.includes("크로스")) return "fa-layer-group";
  if (type.includes("이탈")) return "fa-shield-alt";
  return "fa-bullhorn";
};

const UserDashboard = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // API 데이터 상태
  const [dashboardData, setDashboardData] = useState({
    totalMessages: 0,
    completedMessages: 0,
    failedMessages: 0,
    activeCampaignsCount: 0,
    activeCampaigns: [],
    thisMonthMessages: 0,
  });

  // 대시보드 데이터 불러오기
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Executor API 호출
      const [campaignsRes, messagesRes] = await Promise.allSettled([
        campaignsAPI.getCampaigns({ page: 0, size: 1000 }),
        messagesAPI.getMessages({ page: 1, size: 1000 }), // Executor용 메시지 API
      ]);

      // 캠페인 데이터 처리
      let campaignList = [];
      if (campaignsRes.status === "fulfilled") {
        const campaignsData = campaignsRes.value?.data;

        if (campaignsData?.success) {
          const data = campaignsData.data;
          campaignList = data.content || [];
        } else if (campaignsData?.content) {
          campaignList = campaignsData.content || [];
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 전체 활성 캠페인 수 계산
      const activeCampaignsCount = campaignList.filter((c) => {
        const endDate = new Date(c.endDate);
        endDate.setHours(0, 0, 0, 0);
        return c.status === "ACTIVE" && endDate >= today;
      }).length;

      // 활성 캠페인 목록 (상위 4개만 표시)
      const activeCampaigns = campaignList
        .filter((c) => {
          const endDate = new Date(c.endDate);
          endDate.setHours(0, 0, 0, 0);
          return c.status === "ACTIVE" && endDate >= today;
        })
        .slice(0, 4)
        .map((c) => ({
          id: c.campaignId,
          title: c.name,
          type: c.type || "일반",
          start: c.startDate,
          end: c.endDate,
        }));

      // 메시지 데이터 처리
      let messageList = [];
      if (messagesRes.status === "fulfilled") {
        const response = messagesRes.value;
        console.log("메시지 API 응답:", response);

        if (response.data?.success) {
          const data = response.data.data;
          messageList = data.content || data.messages || [];
          console.log("추출된 메시지 리스트:", messageList);
        } else {
          console.error("메시지 API success=false:", response.data);
        }
      } else {
        console.error("메시지 데이터 조회 실패:", messagesRes.reason);
        // API 실패 시 토스트 메시지 표시 (전체 에러는 아니므로 개별 경고)
        toast.warning("메시지 데이터를 불러오는데 실패했습니다. 메시지 통계는 0으로 표시됩니다.");
      }

      // 생성 완료 메시지 카운트 (contentPreview가 "메시지 생성 실패"가 아닌 것만)
      const completedMessages = messageList.filter((msg) =>
        msg.contentPreview !== "메시지 생성 실패"
      ).length;

      // 생성 실패 메시지 카운트
      const failedMessages = messageList.filter((msg) =>
        msg.contentPreview === "메시지 생성 실패"
      ).length;

      // 이번 달 생성 메시지 카운트 (전체 메시지 기준)
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthMessages = messageList.filter((msg) => {
        if (msg.createdAt) {
          const msgDate = new Date(msg.createdAt);
          return msgDate >= thisMonthStart;
        }
        return false;
      }).length;

      console.log("총 메시지 수:", messageList.length, "완료된 메시지:", completedMessages, "실패한 메시지:", failedMessages, "이번 달 생성:", thisMonthMessages, "활성 캠페인:", activeCampaignsCount);

      setDashboardData({
        totalMessages: messageList.length,
        completedMessages: completedMessages,
        failedMessages: failedMessages,
        activeCampaignsCount: activeCampaignsCount,
        activeCampaigns,
        thisMonthMessages,
      });
    } catch (error) {
      console.error("대시보드 데이터 조회 실패:", error);
      toast.error("대시보드 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    { label: "생성한 메시지", value: dashboardData.totalMessages, icon: "fa-file-alt" },
    { label: "생성 완료", value: dashboardData.completedMessages, icon: "fa-paper-plane" },
    { label: "생성 실패", value: dashboardData.failedMessages, icon: "fa-exclamation-triangle" },
    { label: "활성 캠페인", value: dashboardData.activeCampaignsCount, icon: "fa-bullhorn" },
  ];

  const handleNavigate = (path) => {
    if (onMenuClick) onMenuClick(path);
    else window.location.href = path;
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMenuClick={handleNavigate}
        />
      }
      header={
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentPage="대시보드"
        />
      }
    >
      <DashboardContainer>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle>AI 기반 마케팅 메시지 자동 생성</HeroTitle>
          <HeroSubtitle>
            고객 세그먼트와 캠페인을 선택하면 AI가 최적화된 메시지를 생성합니다.
          </HeroSubtitle>

          <HeroButtonRow>
            <HeroButton
              variant="primary"
              onClick={() => handleNavigate("/message")}
            >
              <i className="fas fa-pen" />
              메시지 생성하기
            </HeroButton>

            <HeroButton
              variant="secondary"
              onClick={() => handleNavigate("/customers")}
            >
              <i className="fas fa-user" />
              고객 조회
            </HeroButton>
          </HeroButtonRow>
        </HeroSection>

        {/* Stats */}
        <StatsGrid>
          {stats.map((s, i) => (
            <StatCard key={i}>
              <StatLabel>{s.label}</StatLabel>
              <StatValue>{s.value}</StatValue>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Campaign List */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>활성 캠페인</SectionTitle>
          </SectionHeader>

          <CampaignList>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }}></i>
              </div>
            ) : dashboardData.activeCampaigns.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                활성 캠페인이 없습니다.
              </div>
            ) : (
              dashboardData.activeCampaigns.map((c) => (
                <CampaignItem key={c.id}>
                  <CampaignIcon>
                    <i className={`fas ${getCampaignIcon(c.type)}`} />
                  </CampaignIcon>

                  <CampaignInfo>
                    <CampaignTitle>{c.title}</CampaignTitle>

                    <CampaignMeta>
                      <span>
                        <i className="fas fa-tag" />
                        {c.type}
                      </span>

                      <span>
                        <i className="fas fa-calendar-alt" />
                        {c.start} ~ {c.end}
                      </span>
                    </CampaignMeta>
                  </CampaignInfo>

                  <CampaignButton
                    onClick={() => navigate('/campaigns', { state: { campaignId: c.id } })}
                  >
                    상세보기
                    <i className="fas fa-arrow-right" />
                  </CampaignButton>
                </CampaignItem>
              ))
            )}
          </CampaignList>
        </SectionCard>
      </DashboardContainer>
    </Layout>
  );
};

export default UserDashboard;
