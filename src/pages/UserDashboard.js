import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Card from "../components/common/Card";

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
  border-radius: 9999px;
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
  border-radius: 9999px;
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 샘플 캠페인 데이터
  const campaigns = [
    {
      id: 1,
      title: "갤럭시 S24 출시 프로모션",
      type: "신규 고객 유치",
      start: "2024-01-01",
      end: "2024-03-31",
    },
    {
      id: 2,
      title: "장기 고객 감사 이벤트",
      type: "기존 고객 유지",
      start: "2024-02-01",
      end: "2024-06-30",
    },
    {
      id: 3,
      title: "IoT 결합 상품 안내",
      type: "크로스셀링",
      start: "2024-01-15",
      end: "2024-04-15",
    },
    {
      id: 4,
      title: "데이터 무제한 전환",
      type: "이탈 방지",
      start: "2024-02-01",
      end: "2024-05-31",
    },
  ];

  const stats = [
    { label: "생성한 메시지", value: 7 },
    { label: "발송 완료", value: 5 },
    { label: "활성 캠페인", value: 4 },
    { label: "평균 전환율", value: "15.8%" },
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
              onClick={() => handleNavigate("/message/segment")}
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
            {campaigns.map((c) => (
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
                  onClick={() => handleNavigate("/message/segment")}
                >
                  <i className="fas fa-edit" />
                  메시지 생성
                </CampaignButton>
              </CampaignItem>
            ))}
          </CampaignList>
        </SectionCard>
      </DashboardContainer>
    </Layout>
  );
};

export default UserDashboard;
