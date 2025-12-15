import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { customersAPI } from "../services/api";

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

const MembershipBadge = styled.span`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 700;
  background: ${(props) => {
    switch (props.level?.toUpperCase()) {
      case "VVIP":
        return "#DC2626";
      case "VIP":
        return "#1F2937";
      case "GOLD":
        return "#92400E";
      case "SILVER":
        return "#6B7280";
      case "WHITE":
        return "#FFFFFF";
      case "BASIC":
        return "#E5E7EB";
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.level?.toUpperCase()) {
      case "VVIP":
      case "VIP":
      case "GOLD":
      case "SILVER":
        return "#ffffff";
      case "WHITE":
        return "#374151";
      case "BASIC":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  }};
  border: ${(props) => {
    switch (props.level?.toUpperCase()) {
      case "WHITE":
        return "2px solid #D1D5DB";
      default:
        return "none";
    }
  }};
  box-shadow: ${(props) => {
    switch (props.level?.toUpperCase()) {
      case "VVIP":
        return "0 2px 8px rgba(220, 38, 38, 0.3)";
      case "VIP":
        return "0 2px 8px rgba(0, 0, 0, 0.3)";
      case "GOLD":
        return "0 2px 8px rgba(146, 64, 14, 0.3)";
      case "SILVER":
        return "0 2px 6px rgba(107, 114, 128, 0.3)";
      case "WHITE":
        return "0 2px 6px rgba(0, 0, 0, 0.1)";
      default:
        return "none";
    }
  }};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: uppercase;

  i {
    font-size: 0.875rem;
  }
`;

// 지역 코드 매핑
const regionMap = {
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  SEJONG: "세종",
  GYEONGGI: "경기",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
};

// 성별 매핑
const genderMap = {
  MALE: "남성",
  FEMALE: "여성",
  OTHER: "기타",
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 가입 기간 계산 함수
const calculateUsageDays = (joinDate) => {
  if (!joinDate) return "-";
  const join = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now - join);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0 && months > 0) {
    return `${years}년 ${months}개월`;
  } else if (years > 0) {
    return `${years}년`;
  } else if (months > 0) {
    return `${months}개월`;
  } else {
    return `${diffDays}일`;
  }
};

// 이름 익명화 함수
const anonymizeName = (name) => {
  if (!name || name === "-") return "-";

  const length = name.length;

  if (length === 1) {
    return name; // 1글자는 그대로 표시
  } else if (length === 2) {
    return name[0] + "*"; // 2글자: 첫 글자만 표시
  } else if (length === 3) {
    return name[0] + "*" + name[2]; // 3글자: 첫/끝 글자 표시
  } else {
    // 4글자 이상: 첫 글자 + 중간 * + 끝 글자
    const middle = "*".repeat(length - 2);
    return name[0] + middle + name[length - 1];
  }
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

const UserCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // 캠페인 추천 상태
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        setLoading(true);
        const response = await customersAPI.getCustomer(id);

        if (response.data && response.data.success) {
          const apiData = response.data.data;

          // API 데이터를 UI 형식에 맞게 매핑
          const mappedCustomer = {
            id: apiData.customerId,
            name: anonymizeName(apiData.name) || "-",
            phone: apiData.phoneNumber || "-",
            email: "-", // API에 email 필드 없음
            age: apiData.age || "-",
            gender: apiData.gender || "-",
            region: regionMap[apiData.region] || apiData.region || "-",
            membership: apiData.membershipLevel || "-",
            status: "active", // API에 status 필드 없음
            joinDate: formatDate(apiData.joinDate),
            contractEnd: formatDate(apiData.contractEndDate),
            plan: apiData.currentPlan || "-",
            device: apiData.currentDevice || "-",
            monthlyData: apiData.avgDataUsageGb
              ? `${apiData.avgDataUsageGb.toFixed(1)}GB`
              : "-",
            usageDays: calculateUsageDays(apiData.joinDate),
            segment: `${apiData.membershipLevel || "-"} 고객`,
            recentPurchase: formatDate(apiData.lastPurchaseDate),
            recencyDays: apiData.recencyDays || 0,
            recentPurchases: apiData.recentPurchases || [],
            preferredCategories: apiData.preferredCategories || [],
            // RFM 분석 데이터
            rfm: {
              // Recency: 마지막 구매 후 경과일 (최근성)
              recency:
                apiData.recencyDays <= 30
                  ? 5
                  : apiData.recencyDays <= 90
                  ? 4
                  : apiData.recencyDays <= 180
                  ? 3
                  : apiData.recencyDays <= 365
                  ? 2
                  : 1,
              // Frequency: 월평균 데이터 사용량을 활동성 지표로 활용
              frequency:
                apiData.avgDataUsageGb >= 100
                  ? 5
                  : apiData.avgDataUsageGb >= 70
                  ? 4
                  : apiData.avgDataUsageGb >= 40
                  ? 3
                  : apiData.avgDataUsageGb >= 20
                  ? 2
                  : 1,
              // Monetary: 멤버십 레벨 기반 (연간 구매액)
              monetary:
                apiData.membershipLevel === "VVIP"
                  ? 5
                  : apiData.membershipLevel === "VIP"
                  ? 5
                  : apiData.membershipLevel === "GOLD"
                  ? 4
                  : apiData.membershipLevel === "SILVER"
                  ? 3
                  : apiData.membershipLevel === "WHITE"
                  ? 2
                  : 1,
              totalScore: 0,
            },
            monthlyAverage: apiData.avgDataUsageGb
              ? `${apiData.avgDataUsageGb.toFixed(1)}GB`
              : "-",
            callTime: "-", // API에 통화 시간 데이터 없음
            lastActivity: formatDate(apiData.lastPurchaseDate),
          };

          // RFM 총점 계산
          mappedCustomer.rfm.totalScore =
            mappedCustomer.rfm.recency +
            mappedCustomer.rfm.frequency +
            mappedCustomer.rfm.monetary;

          setCustomer(mappedCustomer);
        } else {
          setCustomer(null);
          toast.error("고객 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("고객 상세 정보 조회 실패:", error);
        const errorMessage =
          error.response?.data?.message ||
          "고객 정보를 불러오는데 실패했습니다.";
        toast.error(errorMessage);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetail();
    }
  }, [id]);

  // 캠페인 추천 불러오기 함수
  const fetchRecommendations = async () => {
    if (!customer) return;

    try {
      setLoadingRecommendations(true);
      console.log(`고객 ${customer.id}에 대한 캠페인 추천 요청 중...`);

      const response = await customersAPI.getCampaignRecommendations(customer.id);
      console.log("추천 API 전체 응답:", response);

      // 백엔드 응답 구조: { success: true, data: { recommendations: [...] } }
      if (response.data && response.data.success) {
        const dataObj = response.data.data;
        console.log("data 객체:", dataObj);

        // recommendations 배열 추출
        const recommendationList = dataObj.recommendations || [];
        console.log("추출된 추천 목록:", recommendationList);
        console.log("추천 개수:", recommendationList.length);

        if (Array.isArray(recommendationList) && recommendationList.length > 0) {
          setRecommendations(recommendationList);
          toast.success(`AI가 ${recommendationList.length}개의 캠페인을 추천했습니다!`);
        } else {
          console.warn("추천 목록이 비어있습니다");
          setRecommendations([]);
        }
      } else {
        console.error("API 응답 실패 또는 success=false:", response.data);
        setRecommendations([]);
      }
    } catch (error) {
      console.error("캠페인 추천 조회 실패:", error);
      console.error("에러 응답:", error.response);
      console.error("에러 데이터:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "캠페인 추천을 불러오는데 실패했습니다.";
      toast.error(errorMessage);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

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
            고객 상세정보
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
                    <i className="fas fa-id-card" />
                    고객 ID: {customer.id}
                  </span>
                  <span>
                    <MembershipBadge level={customer.membership}>
                      <i className="fas fa-trophy" />
                      {customer.membership}
                    </MembershipBadge>
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
              구매 이력
            </TabButton>
            <TabButton
              active={activeTab === "recommendations"}
              onClick={() => setActiveTab("recommendations")}
            >
              <i className="fas fa-lightbulb" />
              캠페인 AI 추천
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
                    {genderMap[customer.gender] || customer.gender}
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
                  <InfoLabel>계약 종료일</InfoLabel>
                  <InfoValue>{customer.contractEnd}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>사용 기간</InfoLabel>
                  <InfoValue>{customer.usageDays}</InfoValue>
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
            {/* <ChartContainer>
              <ChartTitle>데이터 사용량 추이</ChartTitle>
              <ChartPlaceholder>
                📊 데이터 사용량 차트 영역 (Chart.js 또는 Recharts 연동 필요)
              </ChartPlaceholder>
            </ChartContainer> */}

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
                {/* <InfoItem>
                  <InfoLabel>통화 시간</InfoLabel>
                  <InfoValue>{customer.callTime}</InfoValue>
                </InfoItem> */}
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
                  <i className="fas fa-shopping-bag" />
                </CardIcon>
                <CardTitle>구매 이력</CardTitle>
              </CardHeader>
              {customer.recentPurchases && customer.recentPurchases.length > 0 ? (
                <Timeline>
                  {customer.recentPurchases.map((purchase, index) => (
                    <TimelineItem key={index}>
                      <TimelineContent>
                        <TimelineDate>{formatDate(purchase.purchaseDate)}</TimelineDate>
                        <TimelineTitle>{purchase.productName || "상품명 없음"}</TimelineTitle>
                        {purchase.amount && (
                          <TimelineAmount>
                            ₩{purchase.amount.toLocaleString()}
                          </TimelineAmount>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Timeline>
                  <TimelineItem>
                    <TimelineContent>
                      <TimelineDate>{customer.recentPurchase}</TimelineDate>
                      <TimelineTitle>최근 구매 내역</TimelineTitle>
                      <TimelineTitle>
                        마지막 구매일로부터 {customer.recencyDays}일 경과
                      </TimelineTitle>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              )}
            </InfoCard>

            {/* <InfoCard>
              <CardHeader>
                <CardIcon>
                  <i className="fas fa-heart" />
                </CardIcon>
                <CardTitle>선호 카테고리</CardTitle>
              </CardHeader>
              {customer.preferredCategories && customer.preferredCategories.length > 0 ? (
                <InfoList>
                  {customer.preferredCategories.map((category, index) => (
                    <InfoItem key={index}>
                      <InfoLabel>카테고리 {index + 1}</InfoLabel>
                      <InfoValue>{category}</InfoValue>
                    </InfoItem>
                  ))}
                </InfoList>
              ) : (
                <InfoList>
                  <InfoItem>
                    <InfoLabel>선호 카테고리</InfoLabel>
                    <InfoValue>데이터 없음</InfoValue>
                  </InfoItem>
                </InfoList>
              )}
            </InfoCard> */}
          </>
        )}

        {activeTab === "recommendations" && (
          <>
            {loadingRecommendations ? (
              <CenterContainer>
                <LoadingSpinner className="fas fa-spinner fa-spin" />
                <LoadingText>
                  AI가 고객 프로필을 분석하여 최적의 캠페인을 추천중입니다...
                </LoadingText>
                <LoadingText style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#9ca3af" }}>
                  잠시만 기다려주세요 (최대 1분 소요)
                </LoadingText>
              </CenterContainer>
            ) : recommendations.length === 0 ? (
              <CenterContainer>
                <EmptyIcon className="fas fa-lightbulb" />
                <EmptyText>AI 캠페인 추천을 시작하려면 아래 버튼을 클릭하세요</EmptyText>
                <Button
                  onClick={fetchRecommendations}
                  style={{ marginTop: "1.5rem" }}
                >
                  <i className="fas fa-magic" style={{ marginRight: "0.5rem" }} />
                  AI 캠페인 추천 받기
                </Button>
              </CenterContainer>
            ) : (
              <>
                <div style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "1.5rem"
                }}>
                  <Button
                    onClick={fetchRecommendations}
                    style={{
                      background: "#f3f4f6",
                      color: "#4b5563",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <i className="fas fa-redo" style={{ marginRight: "0.5rem" }} />
                    새로 추천받기
                  </Button>
                </div>
                <RecommendationGrid>
                  {recommendations.map((rec, index) => (
                    <RecommendationCard key={index}>
                      <RecommendationIcon>
                        <i className={`fas fa-${index === 0 ? 'crown' : index === 1 ? 'star' : 'bullhorn'}`} />
                      </RecommendationIcon>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            background: rec.rank === 1 ? "#fef2f2" : "#fef9f3",
                            color: rec.rank === 1 ? "#dc2626" : "#d97706",
                          }}
                        >
                          추천 순위 #{rec.rank}
                        </span>
                        {rec.relevanceScore && (
                          <span
                            style={{
                              marginLeft: "0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color: "#059669",
                            }}
                          >
                            적합도: {rec.relevanceScore}%
                          </span>
                        )}
                      </div>
                      <RecommendationTitle>
                        {rec.campaignName || `캠페인 ID: ${rec.campaignId}`}
                      </RecommendationTitle>
                      <RecommendationDescription>
                        <strong style={{ color: "#1a1a1a" }}>추천 이유:</strong><br />
                        {rec.reason || "AI가 고객 데이터를 분석하여 추천"}
                      </RecommendationDescription>
                      {rec.expectedBenefit && (
                        <RecommendationDescription style={{ marginTop: "0.5rem" }}>
                          <strong style={{ color: "#1a1a1a" }}>기대 효과:</strong><br />
                          {rec.expectedBenefit}
                        </RecommendationDescription>
                      )}
                      <RecommendationButton
                        onClick={() => {
                          navigate("/message/individual", {
                            state: {
                              customer,
                              campaignId: rec.campaignId,
                              prefilledData: {
                                phone: customer.phone,
                                name: customer.name,
                              },
                            },
                          });
                        }}
                      >
                        <i className="fas fa-paper-plane" />
                        메시지 생성
                      </RecommendationButton>
                    </RecommendationCard>
                  ))}
                </RecommendationGrid>
              </>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default UserCustomer;
