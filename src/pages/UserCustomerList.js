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

// Customer Profile Card
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

// Section Title
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 2rem 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #e60012;
  }
`;

// Stats Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e60012;
    box-shadow: 0 4px 12px rgba(230, 0, 18, 0.1);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.color || "#E60012"};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

// Info Grid
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e60012;
    box-shadow: 0 4px 12px rgba(230, 0, 18, 0.1);
  }
`;

const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #e60012;
  }
`;

const InfoContent = styled.div`
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.8;

  div {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const InfoLabel = styled.span`
  color: #6b7280;
  margin-right: 0.5rem;
`;

const InfoValue = styled.span`
  color: #1a1a1a;
  font-weight: 500;
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

  ${(props) =>
    props.variant === "primary"
      ? `
    background: #E60012;
    color: white;

    &:hover {
      background: #B8000E;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(230, 0, 18, 0.3);
    }
  `
      : `
    background: #f3f4f6;
    color: #4b5563;
    border: 1px solid #e5e7eb;

    &:hover {
      background: #e5e7eb;
      border-color: #d1d5db;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

// Loading & Empty State
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

// ==================== Component ====================

const Customer360 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  // Mock customer data
  const mockCustomer = {
    id: "CUST001",
    name: "김철수",
    phone: "010-1234-5678",
    email: "kim.cs@email.com",
    age: 32,
    gender: "male",
    region: "서울특별시 강남구",
    membership: "Gold",
    status: "active",
    joinDate: "2022-03-15",
    contractEnd: "2025-03-14",
    plan: "5G 프리미엄",
    device: "갤럭시 S23 Ultra",
    monthlyData: 15.2,
    monthlyCharge: 129000,
    recentPurchase: "2024-01-10",
    totalSpent: 3870000,
    satisfaction: 4.2,
    churnRisk: "low",
    preferredContact: "sms",
    lastContact: "2024-01-08",
  };

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setCustomer(mockCustomer);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleCreateMessage = () => {
    navigate("/message/individual", {
      state: {
        customer: customer,
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
            <LoadingSpinner className="fas fa-spinner fa-spin"></LoadingSpinner>
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
            <EmptyIcon className="fas fa-user-slash"></EmptyIcon>
            <EmptyText>고객을 찾을 수 없습니다.</EmptyText>
            <Button
              variant="primary"
              onClick={() => navigate("/customers")}
              style={{ marginTop: "1.5rem" }}
            >
              <i className="fas fa-arrow-left"></i>
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
            ></i>
            고객 360도 뷰
          </PageTitle>
          <BackButton onClick={() => navigate("/customers")}>
            <i className="fas fa-arrow-left"></i>
            뒤로가기
          </BackButton>
        </PageHeader>

        {/* Customer Profile */}
        <ProfileCard>
          <ProfileHeader>
            <ProfileInfo>
              <Avatar>{customer.name.charAt(0)}</Avatar>
              <CustomerDetails>
                <CustomerName>{customer.name} 고객님</CustomerName>
                <CustomerMeta>
                  <span>
                    <i className="fas fa-phone"></i>
                    {customer.phone}
                  </span>
                  <span>
                    <i className="fas fa-envelope"></i>
                    {customer.email}
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i>
                    {customer.region}
                  </span>
                </CustomerMeta>
              </CustomerDetails>
            </ProfileInfo>
            <CreateMessageButton onClick={handleCreateMessage}>
              <i className="fas fa-comment-dots"></i>
              1:1 메시지 생성
            </CreateMessageButton>
          </ProfileHeader>
        </ProfileCard>

        {/* Key Stats */}
        <SectionTitle>
          <i className="fas fa-chart-bar"></i>
          주요 지표
        </SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue color="#10b981">{customer.satisfaction}</StatValue>
            <StatLabel>만족도 (5점 만점)</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#f59e0b">
              {customer.monthlyCharge.toLocaleString()}원
            </StatValue>
            <StatLabel>월 이용료</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#3b82f6">{customer.monthlyData}GB</StatValue>
            <StatLabel>월 데이터 사용량</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#6b7280">
              {customer.totalSpent.toLocaleString()}원
            </StatValue>
            <StatLabel>총 이용금액</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Detailed Info */}
        <SectionTitle>
          <i className="fas fa-info-circle"></i>
          상세 정보
        </SectionTitle>
        <InfoGrid>
          <InfoCard>
            <InfoTitle>
              <i className="fas fa-id-card"></i>
              기본 정보
            </InfoTitle>
            <InfoContent>
              <div>
                <InfoLabel>고객 ID:</InfoLabel>
                <InfoValue>{customer.id}</InfoValue>
              </div>
              <div>
                <InfoLabel>이름:</InfoLabel>
                <InfoValue>{customer.name}</InfoValue>
              </div>
              <div>
                <InfoLabel>나이:</InfoLabel>
                <InfoValue>{customer.age}세</InfoValue>
              </div>
              <div>
                <InfoLabel>성별:</InfoLabel>
                <InfoValue>
                  {customer.gender === "male" ? "남성" : "여성"}
                </InfoValue>
              </div>
              <div>
                <InfoLabel>지역:</InfoLabel>
                <InfoValue>{customer.region}</InfoValue>
              </div>
              <div>
                <InfoLabel>이메일:</InfoLabel>
                <InfoValue>{customer.email}</InfoValue>
              </div>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoTitle>
              <i className="fas fa-mobile-alt"></i>
              서비스 정보
            </InfoTitle>
            <InfoContent>
              <div>
                <InfoLabel>멤버십 등급:</InfoLabel>
                <InfoValue>{customer.membership}</InfoValue>
              </div>
              <div>
                <InfoLabel>요금제:</InfoLabel>
                <InfoValue>{customer.plan}</InfoValue>
              </div>
              <div>
                <InfoLabel>단말기:</InfoLabel>
                <InfoValue>{customer.device}</InfoValue>
              </div>
              <div>
                <InfoLabel>가입일:</InfoLabel>
                <InfoValue>{customer.joinDate}</InfoValue>
              </div>
              <div>
                <InfoLabel>계약만료:</InfoLabel>
                <InfoValue>{customer.contractEnd}</InfoValue>
              </div>
              <div>
                <InfoLabel>최근구매:</InfoLabel>
                <InfoValue>{customer.recentPurchase}</InfoValue>
              </div>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoTitle>
              <i className="fas fa-chart-line"></i>
              이용 패턴
            </InfoTitle>
            <InfoContent>
              <div>
                <InfoLabel>월평균 데이터:</InfoLabel>
                <InfoValue>{customer.monthlyData}GB</InfoValue>
              </div>
              <div>
                <InfoLabel>월 이용료:</InfoLabel>
                <InfoValue>
                  {customer.monthlyCharge.toLocaleString()}원
                </InfoValue>
              </div>
              <div>
                <InfoLabel>총 이용금액:</InfoLabel>
                <InfoValue>{customer.totalSpent.toLocaleString()}원</InfoValue>
              </div>
              <div>
                <InfoLabel>만족도:</InfoLabel>
                <InfoValue>{customer.satisfaction}/5.0</InfoValue>
              </div>
              <div>
                <InfoLabel>이탈위험:</InfoLabel>
                <InfoValue>
                  {customer.churnRisk === "low"
                    ? "낮음"
                    : customer.churnRisk === "medium"
                    ? "중간"
                    : "높음"}
                </InfoValue>
              </div>
              <div>
                <InfoLabel>선호채널:</InfoLabel>
                <InfoValue>
                  {customer.preferredContact === "sms" ? "SMS" : "이메일"}
                </InfoValue>
              </div>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoTitle>
              <i className="fas fa-bullseye"></i>
              추천 액션
            </InfoTitle>
            <InfoContent>
              <div>• {customer.plan} 요금제 업그레이드 권장</div>
              <div>• {customer.device} 신제품 출시 알림</div>
              <div>• 계약 만료 3개월 전 리뉴얼 제안</div>
              <div>• 맞춤형 부가서비스 추천</div>
              <div>• 고객 만족도 개선 프로그램 참여 권장</div>
            </InfoContent>
          </InfoCard>
        </InfoGrid>
      </Container>
    </Layout>
  );
};

export default Customer360;
