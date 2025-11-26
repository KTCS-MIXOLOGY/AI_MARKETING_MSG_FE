import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
  }

  i {
    margin-right: 0.5rem;
  }
`;

const ProfileCard = styled.div`
  background: linear-gradient(135deg, #e60012 0%, #b8000e 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(230, 0, 18, 0.2);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: white;
`;

const CustomerMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.9375rem;
  opacity: 0.95;

  i {
    margin-right: 0.5rem;
  }
`;

const CreateMessageButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: white;
  color: #e60012;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TabContainer = styled.div`
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "#E60012" : "#6b7280")};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: -2px;

  ${(props) =>
    props.active &&
    `
    border-bottom-color: #E60012;
    color: #E60012;
  `}

  &:hover {
    color: #e60012;
  }

  i {
    margin-right: 0.5rem;
  }
`;

const ProfileTabGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffe5e5 0%, #ffd1d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e60012;
  font-size: 1.25rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const InfoLabel = styled.span`
  color: #6b7280;
  font-size: 0.9375rem;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.9375rem;
`;

const ChartContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid #e60012;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(
    180deg,
    rgba(230, 0, 18, 0.05) 0%,
    rgba(230, 0, 18, 0.02) 100%
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.9375rem;
  border: 2px dashed #e5e7eb;
`;

const Timeline = styled.div`
  position: relative;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 2rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineDate = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const TimelineContent = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const TimelineAmount = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #e60012;
  margin-top: 0.5rem;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecommendationCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(230, 0, 18, 0.15);
    border-color: #e60012;
  }
`;

const RecommendationIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffe5e5 0%, #ffd1d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #e60012;
`;

const RecommendationTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

const RecommendationDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const RecommendationButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #e60012;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b8000e;
    transform: translateY(-2px);
  }

  i {
    margin-right: 0.5rem;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const LoadingSpinner = styled.i`
  font-size: 3rem;
  color: #e60012;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

const EmptyIcon = styled.i`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
`;

const Button = styled.button`
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e60012;
  color: white;

  &:hover {
    background: #b8000e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(230, 0, 18, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const mockCustomers = {
  1: {
    id: "CUST001",
    name: "김철수",
    phone: "010-1234-5678",
    email: "kim@example.com",
    age: 35,
    gender: "male",
    region: "서울",
    membership: "VIP",
    status: "active",
    joinDate: "2023-01-15",
    contractEnd: "2026-01-14",
    plan: "5G 프리미엄",
    device: "갤럭시 S23 Ultra",
    monthlyData: 25.3,
    monthlyCharge: 119000,
    recentPurchase: "2024-11-01",
    totalSpent: 2856000,
    satisfaction: 4.8,
    churnRisk: "low",
    preferredContact: "app",
    lastContact: "2024-11-05",
    usageDays: "1년 11개월",
    segment: "VIP 고객",
    rfm: {
      recency: 5,
      frequency: 5,
      monetary: 5,
      totalScore: 15,
    },
    usageHistory: [
      { month: "1월", usage: 85 },
      { month: "2월", usage: 90 },
      { month: "3월", usage: 88 },
      { month: "4월", usage: 92 },
      { month: "5월", usage: 87 },
      { month: "6월", usage: 89 },
    ],
    monthlyAverage: "180GB (과다)",
    callTime: "월평균 320분",
    lastActivity: "2024-11-20",
  },
  2: {
    id: "CUST002",
    name: "이영희",
    phone: "010-9876-5432",
    email: "lee@example.com",
    age: 28,
    gender: "female",
    region: "부산",
    membership: "일반",
    status: "active",
    joinDate: "2023-03-20",
    contractEnd: "2026-03-19",
    plan: "5G 라이트",
    device: "아이폰 13",
    monthlyData: 15.2,
    monthlyCharge: 65000,
    recentPurchase: "2024-10-28",
    totalSpent: 1560000,
    satisfaction: 4.2,
    churnRisk: "low",
    preferredContact: "sms",
    lastContact: "2024-10-30",
    usageDays: "1년 8개월",
    segment: "일반 사용자",
    rfm: {
      recency: 4,
      frequency: 3,
      monetary: 3,
      totalScore: 10,
    },
    usageHistory: [
      { month: "1월", usage: 75 },
      { month: "2월", usage: 82 },
      { month: "3월", usage: 87 },
      { month: "4월", usage: 85 },
      { month: "5월", usage: 89 },
      { month: "6월", usage: 85 },
    ],
    monthlyAverage: "120GB (적정)",
    callTime: "월평균 180분",
    lastActivity: "2024-11-15",
  },
  3: {
    id: "CUST003",
    name: "박지민",
    phone: "010-5555-7777",
    email: "park@example.com",
    age: 24,
    gender: "female",
    region: "대전",
    membership: "신규",
    status: "dormant",
    joinDate: "2024-09-01",
    contractEnd: "2026-08-31",
    plan: "5G 스탠다드",
    device: "갤럭시 A54",
    monthlyData: 8.5,
    monthlyCharge: 55000,
    recentPurchase: "2024-09-15",
    totalSpent: 165000,
    satisfaction: 3.5,
    churnRisk: "high",
    preferredContact: "call",
    lastContact: "2024-09-20",
    usageDays: "2개월",
    segment: "신규 고객",
    rfm: {
      recency: 2,
      frequency: 1,
      monetary: 1,
      totalScore: 4,
    },
    usageHistory: [
      { month: "1월", usage: 45 },
      { month: "2월", usage: 40 },
      { month: "3월", usage: 38 },
      { month: "4월", usage: 35 },
      { month: "5월", usage: 30 },
      { month: "6월", usage: 32 },
    ],
    monthlyAverage: "65GB (저사용)",
    callTime: "월평균 90분",
    lastActivity: "2024-10-05",
  },
  4: {
    id: "CUST004",
    name: "최민수",
    phone: "010-7777-8888",
    email: "choi@example.com",
    age: 42,
    gender: "male",
    region: "인천",
    membership: "VIP",
    status: "active",
    joinDate: "2022-12-10",
    contractEnd: "2025-12-09",
    plan: "5G 프리미엄 플러스",
    device: "아이폰 15 Pro",
    monthlyData: 30.7,
    monthlyCharge: 135000,
    recentPurchase: "2024-11-05",
    totalSpent: 3240000,
    satisfaction: 4.9,
    churnRisk: "low",
    preferredContact: "email",
    lastContact: "2024-11-10",
    usageDays: "2년",
    segment: "VIP 고객",
    rfm: {
      recency: 5,
      frequency: 5,
      monetary: 5,
      totalScore: 15,
    },
    usageHistory: [
      { month: "1월", usage: 92 },
      { month: "2월", usage: 95 },
      { month: "3월", usage: 93 },
      { month: "4월", usage: 90 },
      { month: "5월", usage: 94 },
      { month: "6월", usage: 91 },
    ],
    monthlyAverage: "200GB (과다)",
    callTime: "월평균 420분",
    lastActivity: "2024-11-22",
  },
};

const getRfmLevel = (score) => {
  if (score >= 4) return "high";
  if (score === 3) return "medium";
  return "low";
};

const getSegmentLevel = (customer) => {
  if (customer.membership === "VIP") return "high";
  if (customer.membership === "일반") return "medium";
  return "low";
};

const UserCustomer360 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    setLoading(true);

    let selected = mockCustomers[id];
    if (!selected) {
      selected = Object.values(mockCustomers).find((c) => c.id === id);
    }

    const timer = setTimeout(() => {
      setCustomer(selected || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleCreateMessage = () => {
    if (!customer) return;
    navigate("/message/individual", {
      state: {
        customer,
        prefilledData: {
          phone: customer.phone,
          name: customer.name,
        },
      },
    });
  };

  if (loading) {
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
          <CenterContainer>
            <LoadingSpinner className="fas fa-spinner fa-spin" />
            <LoadingText>고객 정보 로딩 중...</LoadingText>
          </CenterContainer>
        </Container>
      </Layout>
    );
  }

  if (!customer) {
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
          <CenterContainer>
            <EmptyIcon className="fas fa-user-slash" />
            <EmptyText>고객을 찾을 수 없습니다.</EmptyText>
            <Button
              onClick={() => navigate("/customers")}
              style={{ marginTop: "1.5rem" }}
            >
              <i className="fas fa-arrow-left" />
              고객 목록으로 돌아가기
            </Button>
          </CenterContainer>
        </Container>
      </Layout>
    );
  }

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
          <PageTitle>
            <i
              className="fas fa-user-circle"
              style={{ marginRight: "0.5rem", color: "#E60012" }}
            />
            고객 360도 뷰
          </PageTitle>
          <BackButton onClick={() => navigate("/customers")}>
            <i className="fas fa-arrow-left" />
            뒤로가기
          </BackButton>
        </PageHeader>

        <ProfileCard>
          <ProfileHeader>
            <ProfileInfo>
              <Avatar>{customer.name.charAt(0)}</Avatar>
              <CustomerDetails>
                <CustomerName>{customer.name}</CustomerName>
                <CustomerMeta>
                  <span>
                    <i className="fas fa-phone" />
                    {customer.phone}
                  </span>
                  <span>
                    <i className="fas fa-envelope" />
                    {customer.email}
                  </span>
                  <span>
                    <i className="fas fa-star" />
                    {customer.membership}
                  </span>
                </CustomerMeta>
              </CustomerDetails>
            </ProfileInfo>
            <CreateMessageButton onClick={handleCreateMessage}>
              <i className="fas fa-comment-dots" />
              1:1 메시지 생성
            </CreateMessageButton>
          </ProfileHeader>
        </ProfileCard>

        <TabContainer>
          <TabList>
            <TabButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user" />
              프로필
            </TabButton>
            <TabButton
              active={activeTab === "usage"}
              onClick={() => setActiveTab("usage")}
            >
              <i className="fas fa-chart-line" />
              이용 패턴
            </TabButton>
            <TabButton
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
            >
              <i className="fas fa-history" />
              상담 이력
            </TabButton>
            <TabButton
              active={activeTab === "recommendations"}
              onClick={() => setActiveTab("recommendations")}
            >
              <i className="fas fa-lightbulb" />
              추천 액션
            </TabButton>
          </TabList>
        </TabContainer>

        {activeTab === "profile" && (
          <ProfileTabGrid>
            <InfoCard>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-id-card" />
                </CardIcon>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <InfoList>
                <InfoItem>
                  <InfoLabel>나이</InfoLabel>
                  <InfoValue>{customer.age}세</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>성별</InfoLabel>
                  <InfoValue>
                    {customer.gender === "male" ? "남성" : "여성"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>지역</InfoLabel>
                  <InfoValue>{customer.region}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>가입일</InfoLabel>
                  <InfoValue>{customer.joinDate}</InfoValue>
                </InfoItem>
              </InfoList>
            </InfoCard>

            <InfoCard>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-mobile-alt" />
                </CardIcon>
                <CardTitle>가입 상품</CardTitle>
              </CardHeader>
              <InfoList>
                <InfoItem>
                  <InfoLabel>요금제</InfoLabel>
                  <InfoValue>{customer.plan}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>단말기</InfoLabel>
                  <InfoValue>{customer.device}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>사용 기간</InfoLabel>
                  <InfoValue>{customer.usageDays}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>세그먼트</InfoLabel>
                  <InfoValue>
                    <InfoValue level={getSegmentLevel(customer)}>
                      {customer.segment}
                    </InfoValue>
                  </InfoValue>
                </InfoItem>
              </InfoList>
            </InfoCard>

            <InfoCard>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-chart-bar" />
                </CardIcon>
                <CardTitle>RFM 분석</CardTitle>
              </CardHeader>
              <InfoList>
                <InfoItem>
                  <InfoLabel>Recency</InfoLabel>
                  <InfoValue>
                    <InfoValue level={getRfmLevel(customer.rfm.recency)}>
                      {customer.rfm.recency}점
                    </InfoValue>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Frequency</InfoLabel>
                  <InfoValue>
                    <InfoValue level={getRfmLevel(customer.rfm.frequency)}>
                      {customer.rfm.frequency}점
                    </InfoValue>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Monetary</InfoLabel>
                  <InfoValue>
                    <InfoValue level={getRfmLevel(customer.rfm.monetary)}>
                      {customer.rfm.monetary}점
                    </InfoValue>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>총점</InfoLabel>
                  <InfoValue>
                    <InfoValue level={getRfmLevel(customer.rfm.totalScore)}>
                      {customer.rfm.totalScore}점
                    </InfoValue>
                  </InfoValue>
                </InfoItem>
              </InfoList>
            </InfoCard>
          </ProfileTabGrid>
        )}

        {activeTab === "usage" && (
          <>
            <ChartContainer>
              <ChartTitle>데이터 사용량 추이</ChartTitle>
              <ChartPlaceholder>
                📊 데이터 사용량 차트 영역 (Chart.js 또는 Recharts 연동 필요)
              </ChartPlaceholder>
            </ChartContainer>

            <InfoCard>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-list" />
                </CardIcon>
                <CardTitle>월별 평균</CardTitle>
              </CardHeader>
              <InfoList>
                <InfoItem>
                  <InfoLabel>데이터 사용량</InfoLabel>
                  <InfoValue>{customer.monthlyAverage}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>통화 시간</InfoLabel>
                  <InfoValue>{customer.callTime}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>최근 활동</InfoLabel>
                  <InfoValue>{customer.lastActivity}</InfoValue>
                </InfoItem>
              </InfoList>
            </InfoCard>
          </>
        )}

        {activeTab === "history" && (
          <>
            <InfoCard style={{ marginBottom: "1.5rem" }}>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-headset" />
                </CardIcon>
                <CardTitle>상담 이력</CardTitle>
              </CardHeader>
              <Timeline>
                <TimelineItem>
                  <TimelineContent>
                    <TimelineDate>{customer.lastContact}</TimelineDate>
                    <TimelineTitle>상담사: 김철수</TimelineTitle>
                    <TimelineTitle>
                      선호 채널: {customer.preferredContact.toUpperCase()}
                    </TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </InfoCard>

            <InfoCard>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-shopping-bag" />
                </CardIcon>
                <CardTitle>구매 이력</CardTitle>
              </CardHeader>
              <Timeline>
                <TimelineItem>
                  <TimelineContent>
                    <TimelineDate>{customer.recentPurchase}</TimelineDate>
                    <TimelineTitle>{customer.device}</TimelineTitle>
                    <TimelineAmount>
                      최근 누적 결제액: ₩{customer.totalSpent.toLocaleString()}
                    </TimelineAmount>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </InfoCard>
          </>
        )}

        {activeTab === "recommendations" && (
          <RecommendationGrid>
            <RecommendationCard>
              <RecommendationIcon>
                <i className="fas fa-arrow-up" />
              </RecommendationIcon>
              <RecommendationTitle>
                데이터 무제한 요금제 전환
              </RecommendationTitle>
              <RecommendationDescription>
                AI가 고객 데이터를 분석하여 추천
              </RecommendationDescription>
              <RecommendationButton>
                <i className="fas fa-paper-plane" />
                메시지 생성
              </RecommendationButton>
            </RecommendationCard>

            <RecommendationCard>
              <RecommendationIcon>
                <i className="fas fa-heart" />
              </RecommendationIcon>
              <RecommendationTitle>자동 결제 설정</RecommendationTitle>
              <RecommendationDescription>
                AI가 고객 데이터를 분석하여 추천
              </RecommendationDescription>
              <RecommendationButton>
                <i className="fas fa-paper-plane" />
                메시지 생성
              </RecommendationButton>
            </RecommendationCard>

            <RecommendationCard>
              <RecommendationIcon>
                <i className="fas fa-wifi" />
              </RecommendationIcon>
              <RecommendationTitle>WiFi 공유기</RecommendationTitle>
              <RecommendationDescription>
                AI가 고객 데이터를 분석하여 추천
              </RecommendationDescription>
              <RecommendationButton>
                <i className="fas fa-paper-plane" />
                메시지 생성
              </RecommendationButton>
            </RecommendationCard>
          </RecommendationGrid>
        )}
      </Container>
    </Layout>
  );
};

export default UserCustomer360;
