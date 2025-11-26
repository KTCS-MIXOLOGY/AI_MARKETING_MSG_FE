import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Grid from "../components/common/Grid";
import Badge from "../components/common/Badge";
import Loading from "../components/common/Loading";

const CustomerContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
`;

const CustomerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const CustomerTitle = styled.h2`
  margin: 0;
  color: ${(props) => props.theme.colors.gray[800]};
`;

const CustomerProfile = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSizes["3xl"]};
  font-weight: 600;
  color: white;
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  font-size: ${(props) => props.theme.fontSizes.xl};
`;

const CustomerMeta = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.fontSizes.sm};
  opacity: 0.9;
`;

const StatusBadge = styled(Badge)`
  font-size: ${(props) => props.theme.fontSizes.sm};
  padding: ${(props) => props.theme.spacing.sm};
  ${(props) => props.theme.spacing.md};
`;

const StatsGrid = styled(Grid)`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${(props) => props.theme.spacing.lg};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: ${(props) => props.theme.fontSizes["2xl"]};
  font-weight: 700;
  color: ${(props) => props.color || props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const SectionTitle = styled.h3`
  margin: ${(props) => props.theme.spacing.lg} 0
    ${(props) => props.theme.spacing.md} 0;
  color: ${(props) => props.theme.colors.gray[800]};
`;

const InfoGrid = styled(Grid)`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const InfoCard = styled(Card)`
  padding: ${(props) => props.theme.spacing.md};
`;

const InfoTitle = styled.h4`
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.gray[700]};
`;

const InfoContent = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.gray[600]};
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const Customer360 = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  // 임시 고객 데이터
  const mockCustomer = {
    id: "CUST001",
    name: "김철수",
    phone: "010-1234-5678",
    email: "kim.cs@email.com",
    age: 32,
    gender: "male",
    region: "서울특별시 강남구",
    membership: "gold",
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

  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: "📊" },
    { id: "messages", label: "메시지 관리", icon: "💬" },
    { id: "campaigns", label: "캠페인", icon: "📢" },
    { id: "customers", label: "고객 관리", icon: "👥" },
    { id: "analytics", label: "분석", icon: "📈" },
  ];

  const handleMenuClick = (menuId) => {
    if (menuId === "dashboard") {
      navigate("/dashboard");
    } else if (menuId === "customers") {
      navigate("/dashboard");
    }
  };

  const generatePersonalizedMessage = () => {
    // 개인화된 메시지 생성
    const message = `${customer.name} 고객님, ${
      customer.membersember === "gold" ? "골드" : "프리미엄"
    } 회원님께 특별한 혜택을 준비했습니다. 현재 사용 중인 ${
      customer.plan
    } 요금제를 더욱 특별하게 이용하실 수 있는 기회입니다.`;

    navigate("/message/individual", {
      state: {
        customer: customer,
        personalizedMessage: message,
      },
    });
  };

  const viewUsageHistory = () => {
    alert("이용 내역 페이지로 이동합니다.");
  };

  const recommendUpgrade = () => {
    const recommendation =
      customer.plan === "5G 프리미엄"
        ? "프리미엄 플러스 요금제"
        : "5G 프리미엄 요금제";
    alert(
      `${customer.name} 고객님께 ${recommendation} 업그레이드를 추천합니다.`
    );
  };

  useEffect(() => {
    // 고객 데이터 로딩
    setTimeout(() => {
      // id를 기반으로 실제 데이터를 로드하는 로직이 들어갈 수 있습니다
      setCustomer(mockCustomer);
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <Layout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            activeMenu="customers"
            onMenuClick={handleMenuClick}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        }
        header={
          <Header
            user={user}
            onLogout={logout}
            sidebarCollapsed={sidebarCollapsed}
            breadcrumbs={[
              { label: "고객 관리", href: "/dashboard" },
              { label: "고객 360도 뷰", active: true },
            ]}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
      >
        <CustomerContainer>
          <Loading text="고객 정보 로딩 중..." />
        </CustomerContainer>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            activeMenu="customers"
            onMenuClick={handleMenuClick}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        }
        header={
          <Header
            user={user}
            onLogout={logout}
            sidebarCollapsed={sidebarCollapsed}
            breadcrumbs={[
              { label: "고객 관리", href: "/dashboard" },
              { label: "고객 360도 뷰", active: true },
            ]}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
      >
        <CustomerContainer>
          <div className="text-center p-5">고객을 찾을 수 없습니다.</div>
        </CustomerContainer>
      </Layout>
    );
  }

  return (
    <Layout
      sidebar={
        <Sidebar
          menuItems={menuItems}
          activeMenu="customers"
          onMenuClick={handleMenuClick}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
      header={
        <Header
          user={user}
          onLogout={logout}
          sidebarCollapsed={sidebarCollapsed}
          breadcrumbs={[
            { label: "고객 관리", href: "/dashboard" },
            { label: "고객 360도 뷰", active: true },
          ]}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <CustomerContainer>
        <CustomerHeader>
          <CustomerTitle>고객 360도 뷰</CustomerTitle>
          <Button variant="primary" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </Button>
        </CustomerHeader>

        {/* 고객 기본 정보 */}
        <CustomerProfile>
          <ProfileHeader>
            <ProfileInfo>
              <Avatar>{customer.name.charAt(0)}</Avatar>
              <CustomerDetails>
                <CustomerName>{customer.name} 고객님</CustomerName>
                <CustomerMeta>
                  <span>📱 {customer.phone}</span>
                  <span>📧 {customer.email}</span>
                  <span>📍 {customer.region}</span>
                </CustomerMeta>
              </CustomerDetails>
            </ProfileInfo>
            <div>
              <StatusBadge
                variant={customer.status === "active" ? "success" : "secondary"}
              >
                {customer.status === "active" ? "활성 고객" : "비활성 고객"}
              </StatusBadge>
            </div>
          </ProfileHeader>
        </CustomerProfile>

        {/* 주요 지표 */}
        <SectionTitle>주요 지표</SectionTitle>
        <StatsGrid columns={4} mdColumns={2} smColumns={1}>
          <StatCard hover>
            <StatValue color="#28a745">{customer.satisfaction}</StatValue>
            <StatLabel>만족도</StatLabel>
          </StatCard>
          <StatCard hover>
            <StatValue color="#ffc107">
              {customer.monthlyCharge.toLocaleString()}원
            </StatValue>
            <StatLabel>월 이용료</StatLabel>
          </StatCard>
          <StatCard hover>
            <StatValue color="#17a2b8">{customer.monthlyData}GB</StatValue>
            <StatLabel>월 데이터 사용량</StatLabel>
          </StatCard>
          <StatCard hover>
            <StatValue color="#6c757d">
              {customer.totalSpent.toLocaleString()}원
            </StatValue>
            <StatLabel>총 이용금액</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* 상세 정보 */}
        <SectionTitle>상세 정보</SectionTitle>
        <InfoGrid columns={2} mdColumns={1}>
          <InfoCard>
            <InfoTitle>📋 기본 정보</InfoTitle>
            <InfoContent>
              <div>고객 ID: {customer.id}</div>
              <div>이름: {customer.name}</div>
              <div>나이: {customer.age}세</div>
              <div>성별: {customer.gender === "male" ? "남성" : "여성"}</div>
              <div>지역: {customer.region}</div>
              <div>이메일: {customer.email}</div>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoTitle>📱 서비스 정보</InfoTitle>
            <InfoContent>
              <div>멤버십 등급: {customer.membership.toUpperCase()}</div>
              <div>요금제: {customer.plan}</div>
              <div>단말기: {customer.device}</div>
              <div>가입일: {customer.joinDate}</div>
              <div>계약만료: {customer.contractEnd}</div>
              <div>최근구매: {customer.recentPurchase}</div>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoTitle>📊 이용 패턴</InfoTitle>
            <InfoContent>
              <div>월평균 데이터: {customer.monthlyData}GB</div>
              <div>월 이용료: {customer.monthlyCharge.toLocaleString()}원</div>
              <div>총 이용금액: {customer.totalSpent.toLocaleString()}원</div>
              <div>만족도: {customer.satisfaction}/5.0</div>
              <div>
                이탈위험:{" "}
                {customer.churnRisk === "low"
                  ? "낮음"
                  : customer.churnRisk === "medium"
                  ? "중간"
                  : "높음"}
              </div>
              <div>
                선호채널:{" "}
                {customer.preferredContact === "sms" ? "SMS" : "이메일"}
              </div>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoTitle>🎯 추천 액션</InfoTitle>
            <InfoContent>
              <div>• {customer.plan} 요금제 업그레이드 권장</div>
              <div>• {customer.device} 신제품 출시 알림</div>
              <div>• 계약 만료 3개월 전 리뉴얼 제안</div>
              <div>• 맞춤형 부가서비스 추천</div>
              <div>• 고객 만족도 개선 프로그램 참여 권장</div>
            </InfoContent>
          </InfoCard>
        </InfoGrid>

        {/* 액션 버튼 */}
        <ActionButtons>
          <Button variant="primary" onClick={generatePersonalizedMessage}>
            💬 개인화 메시지 생성
          </Button>
          <Button variant="secondary" onClick={viewUsageHistory}>
            📊 이용 내역 보기
          </Button>
          <Button variant="secondary" onClick={recommendUpgrade}>
            ⬆️ 업그레이드 추천
          </Button>
        </ActionButtons>
      </CustomerContainer>
    </Layout>
  );
};

export default Customer360;
