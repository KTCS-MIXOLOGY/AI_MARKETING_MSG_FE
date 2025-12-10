import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { messagesAPI, campaignsAPI, usersAPI, segmentsAPI } from "../services/api";

/* 전체 컨테이너 */

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

/* 상단 영역 */

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: #6b7280;
`;

/* --- 상단 통계 카드 영역 --- */

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 1.5rem 1.6rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const StatLabel = styled.div`
  font-size: 0.9375rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.6rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.4rem;
`;

const StatChangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const StatChange = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #16a34a;
`;

const StatChangeCaption = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const IconCircle = styled.div`
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(230, 0, 18, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.1rem;
    color: #e60012;
  }
`;

/* --- 카드 공통 스타일 --- */

const BaseCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
`;

/* 두 박스(월별 현황 / 최근 이력)를 동일 사이즈로 맞추는 카드 */

const LargeCardBox = styled(BaseCard)`
  min-height: 340px;
  display: flex;
  flex-direction: column;
`;

const CardBox = styled(BaseCard)``;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const CardTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: "";
    width: 3px;
    height: 18px;
    border-radius: 999px;
    background: #e60012;
  }
`;

const CardMeta = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;

/* --- 상단 / 하단 레이아웃 --- */

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 1.5rem;
  margin-top: 1.75rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* 차트 영역 */

const ChartWrapper = styled.div`
  width: 100%;
  flex: 1;
  background: #ffffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem 1.5rem;
  border: 5px solid #f3f4f6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ChartSvgWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const ChartTooltip = styled.div`
  position: absolute;
  padding: 0.35rem 0.6rem;
  background: #111827;
  color: #ffffff;
  font-size: 0.75rem;
  border-radius: 999px;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.25);
  pointer-events: none;
  transform: translate(-50%, -130%);
  white-space: nowrap;
`;

const ChartXAxis = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;

  span {
    flex: 1;
    text-align: center;
  }
`;

const ChartYAxis = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 97%; 
  display: flex;
  flex-direction: column;
  font-size: 0.7rem;
  color: #9ca3af;
  padding: 0.5rem 0;

  span {
    flex: 1;
    display: flex;
    align-items: center;
  }
`;

/* 활성 캠페인 */

const CampaignList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const CampaignItem = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #fee2e2;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const CampaignMain = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
`;

const CampaignIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #e60012;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1rem;
    color: #ffffff;
  }
`;

const CampaignText = styled.div``;

const CampaignTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const CampaignTag = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.15rem;
`;

const CampaignDateRow = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.35rem;

  i {
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;

const CampaignDetailButton = styled.button`
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: none;
  background: #e60012;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background: #b8000e;
    transform: translateX(1px);
  }

  i {
    font-size: 0.85rem;
  }
`;

/* 최근 발송 이력 테이블 */

const RecentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.25rem;
`;

const RecentThead = styled.thead`
  background: #f9fafb;
`;

const RecentTh = styled.th`
  padding: 0.7rem 0.5rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const RecentTbody = styled.tbody``;

const RecentTr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const RecentTd = styled.td`
  padding: 0.7rem 0.5rem;
  font-size: 0.85rem;
  color: #111827;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.variant === "success"
      ? "#dcfce7"
      : props.variant === "pending"
      ? "#fef9c3"
      : "#fee2e2"};
  color: ${(props) =>
    props.variant === "success"
      ? "#166534"
      : props.variant === "pending"
      ? "#854d0e"
      : "#b91c1c"};
`;

/* 관리자 알림 */

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AlertItem = styled.div`
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AlertTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
`;

const AlertMeta = styled.div`
  font-size: 0.78rem;
  color: #6b7280;
`;

const AlertTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #eff6ff;
  color: #1d4ed8;
  margin-right: 0.4rem;
`;

/* 컴포넌트 */

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tooltip, setTooltip] = useState({
    index: null,
    x: 0,
    y: 0,
    value: 0,
    month: "",
  });

  // API 데이터 상태
  const [dashboardData, setDashboardData] = useState({
    totalCampaigns: 0,
    totalMessages: 0,
    totalSegments: 0,
    activeUsers: 0,
    activeCampaigns: [],
    recentMessages: [],
    monthlyMessageCounts: [], 
  });

  // 상단 카드용 통계 데이터
  const statCards = [
    {
      label: "총 캠페인",
      value: dashboardData.totalCampaigns.toString(),
      change: "",
      changeCaption: "전체 캠페인 수",
      icon: "fas fa-bullhorn",
    },
    {
      label: "생성 메시지",
      value: dashboardData.totalMessages.toString(),
      change: "",
      changeCaption: "전체 메시지 수",
      icon: "fas fa-envelope",
    },
    {
      label: "고객 세그먼트",
      value: dashboardData.totalSegments.toString(),
      change: "",
      changeCaption: "전체 세그먼트 수",
      icon: "fas fa-layer-group",
    },
    {
      label: "활성 사용자",
      value: dashboardData.activeUsers.toString(),
      change: "",
      changeCaption: "승인된 사용자 수",
      icon: "fas fa-users",
    },
  ];

  // 월별 메시지 통계 계산 함수
  const calculateMonthlyStats = (messages) => {
    const now = new Date();
    const monthCounts = [];

    console.log("=== 월별 통계 계산 시작 ===");
    console.log("현재 날짜:", now.toISOString());
    console.log("총 메시지 수:", messages.length);

    // 최근 6개월 데이터 준비
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${targetDate.getMonth() + 1}월`;

      monthCounts.push({
        month: monthLabel,
        count: 0,
        key: monthKey
      });
    }

    console.log("준비된 월 배열:", JSON.stringify(monthCounts, null, 2));

    // 메시지를 월별로 카운트
    messages.forEach((msg, index) => {
      if (msg.createdAt) {
        const msgDate = new Date(msg.createdAt);
        const msgMonthKey = `${msgDate.getFullYear()}-${String(msgDate.getMonth() + 1).padStart(2, '0')}`;

        console.log(`메시지 #${index + 1}: createdAt="${msg.createdAt}", 월 키="${msgMonthKey}"`);

        const monthData = monthCounts.find(m => m.key === msgMonthKey);
        if (monthData) {
          monthData.count++;
          console.log(`  ✓ ${msgMonthKey}에 추가됨, 현재 카운트: ${monthData.count}`);
        } else {
          console.log(`  ✗ ${msgMonthKey}는 최근 6개월에 포함되지 않음`);
        }
      }
    });

    console.log("=== 최종 월별 통계 ===", JSON.stringify(monthCounts, null, 2));
    return monthCounts;
  };

  // 대시보드 데이터 불러오기
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // 각 API를 개별적으로 호출하여 하나가 실패해도 다른 것들은 계속 진행
      const [campaignsRes, messagesRes, segmentsRes, usersRes] = await Promise.allSettled([
        campaignsAPI.getCampaigns({ page: 0, size: 1000 }),
        messagesAPI.getAdminMessages({ page: 1, size: 1000 }),
        segmentsAPI.getSegments({ page: 0, size: 1000 }),
        usersAPI.getUsers(),
      ]);

      // 캠페인 데이터 처리 (AdminCampaigns.js 패턴 참고)
      let campaignList = [];
      if (campaignsRes.status === "fulfilled") {
        const campaignsData = campaignsRes.value?.data;

        if (campaignsData?.success) {
          const data = campaignsData.data;
          campaignList = data.content || [];
        } else if (campaignsData?.content) {
          // success 필드 없이 바로 content 반환하는 경우
          campaignList = campaignsData.content || [];
        } else {
          console.error("캠페인 API 응답 형식 오류:", campaignsData);
        }
      } else {
        console.error("캠페인 데이터 조회 실패:", campaignsRes.reason);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

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
          tag: c.type || "일반",
          icon: "fas fa-bullhorn",
          dateRange: `${c.startDate} ~ ${c.endDate}`,
        }));

      // 메시지 데이터 처리 (AdminMessages.js와 동일)
      let messageList = [];
      let recentMessages = [];

      if (messagesRes.status === "fulfilled") {
        const response = messagesRes.value;
        console.log("메시지 API 응답:", response);

        if (response.data.success) {
          const data = response.data.data;
          // Admin API는 content 배열로 반환
          messageList = data.content || data.messages || [];
          console.log("추출된 메시지 리스트:", messageList);

          // 최근 메시지 6건 포맷팅 (summary 필드 사용)
          recentMessages = messageList.slice(0, 6).map((msg) => ({
            id: msg.messageId,
            title: msg.summary?.substring(0, 30) + "..." || "메시지",
            type: msg.messageType === "SEGMENT" ? "세그먼트" : "개인",
            // createdBy: "관리자", // API 응답에 생성자 정보 없음 (createdBy는 ID만)
            createdAt: msg.createdAt ? formatDateTime(msg.createdAt) : "-",
            status: "completed", // API 응답에 status 필드 없음
          }));

          console.log("포맷팅된 최근 메시지:", recentMessages);
        } else {
          console.error("메시지 API success=false:", response.data);
        }
      } else {
        console.error("메시지 데이터 조회 실패:", messagesRes.reason);
      }

      // 월별 메시지 통계 계산 (최근 6개월)
      const monthlyMessageCounts = calculateMonthlyStats(messageList);
      console.log("월별 메시지 통계:", monthlyMessageCounts);

      // 세그먼트 데이터 처리
      let segmentList = [];
      if (segmentsRes.status === "fulfilled") {
        const segmentsData = segmentsRes.value?.data;
        console.log("세그먼트 API 응답:", segmentsData);

        if (segmentsData?.success) {
          const data = segmentsData.data;
          // segments 배열 또는 content 배열로 반환될 수 있음
          segmentList = data.segments || data.content || [];
        } else if (segmentsData?.segments) {
          // success 필드 없이 바로 segments 반환하는 경우
          segmentList = segmentsData.segments || [];
        } else if (segmentsData?.content) {
          // success 필드 없이 바로 content 반환하는 경우
          segmentList = segmentsData.content || [];
        } else {
          console.error("세그먼트 API 응답 형식 오류:", segmentsData);
        }
      } else {
        console.error("세그먼트 데이터 조회 실패:", segmentsRes.reason);
      }

      // 사용자 데이터 처리 (AdminUsers.js 패턴 참고, 승인된 사용자만)
      let userList = [];
      let approvedUsers = [];
      if (usersRes.status === "fulfilled") {
        const usersData = usersRes.value?.data;

        if (usersData?.success) {
          const data = usersData.data;
          userList = data.content || [];
          approvedUsers = userList.filter((u) => u.status === "APPROVED");
        } else if (usersData?.content) {
          // success 필드 없이 바로 content 반환하는 경우
          userList = usersData.content || [];
          approvedUsers = userList.filter((u) => u.status === "APPROVED");
        } else {
          console.error("사용자 API 응답 형식 오류:", usersData);
        }
      } else {
        console.error("사용자 데이터 조회 실패:", usersRes.reason);
      }

      setDashboardData({
        totalCampaigns: campaignList.length,
        totalMessages: messageList.length,
        totalSegments: segmentList.length,
        activeUsers: approvedUsers.length,
        activeCampaigns,
        recentMessages,
        monthlyMessageCounts,
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

  // 날짜 포맷 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(/\./g, "");
  };

  // 월별 메시지 발송량 (실제 데이터 사용)
  const monthlyStats = dashboardData.monthlyMessageCounts.length > 0
    ? dashboardData.monthlyMessageCounts
    : [
        { month: "1월", count: 0 },
        { month: "2월", count: 0 },
        { month: "3월", count: 0 },
        { month: "4월", count: 0 },
        { month: "5월", count: 0 },
        { month: "6월", count: 0 },
      ];

  const monthlyData = monthlyStats.map(m => m.count);
  const months = monthlyStats.map(m => m.month);
  const maxValue = Math.max(...monthlyData, 80);

  const step = 100 / monthlyData.length;
  const barWidth = step * 0.45; // 막대 너비

  const barData = monthlyData.map((value, index) => {
    const ratio = value / maxValue; // 0부터 maxValue까지의 비율
    const barHeight = 40 * ratio + 10;
    const y = 60 - barHeight; // 하단 기준점 50 (0의 위치)
    const centerX = step * index + step / 2;
    const x = centerX - barWidth / 2;
    return {
      value,
      month: months[index],
      x,
      y,
      width: barWidth,
      height: barHeight,
      centerX,
    };
  });

  // Y축 라벨 (동적으로 계산) - 위에서 아래로 정렬
  const yTickInterval = Math.ceil(maxValue / 4);
  const yTicks = [
    maxValue,
    yTickInterval * 3,
    yTickInterval * 2,
    yTickInterval,
    0
  ];

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="dashboard"
        />
      }
      header={<Header />}
    >
      <DashboardContainer>
        <TopBar>
          <div>
            <PageTitle>대시보드</PageTitle>
            <PageSubtitle>
              KT 마케팅 메시지 생성 현황과 활성 캠페인을 한눈에 확인하세요.
            </PageSubtitle>
          </div>
        </TopBar>

        {/* 상단 통계 카드 */}
        <StatsRow>
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></i>
              <div>데이터를 불러오는 중...</div>
            </div>
          ) : (
            statCards.map((card) => (
              <StatCard key={card.label}>
                <IconCircle>
                  <i className={card.icon} />
                </IconCircle>
                <StatLabel>{card.label}</StatLabel>
                <StatValue>{card.value}</StatValue>
                <StatChangeRow>
                  {card.change && <StatChange>↑ {card.change}</StatChange>}
                  <StatChangeCaption>{card.changeCaption}</StatChangeCaption>
                </StatChangeRow>
              </StatCard>
            ))
          )}
        </StatsRow>

        {/* 위쪽: 월별 현황 + 활성 캠페인 */}
        <TopGrid>
          <LargeCardBox>
            <CardHeader>
              <CardTitle>월별 메시지 생성 현황</CardTitle>
              <CardMeta>단위: 건</CardMeta>
            </CardHeader>
            <ChartWrapper>
              <ChartSvgWrapper
                onMouseLeave={() =>
                  setTooltip({ index: null, x: 0, y: 0, value: 0, month: "" })
                }
              >
                {/* Y축 라벨 (왼쪽) */}
                <ChartYAxis>
                  {yTicks.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </ChartYAxis>

                <svg
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                  style={{ width: "100%", height: "100%" }}
                >
                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#f97373"
                        stopOpacity="0.95"
                      />
                      <stop
                        offset="100%"
                        stopColor="#fecaca"
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>

                  {/* 그리드 라인 */}
                  {yTicks.map((t, idx) => {
                    const ratio = t / maxValue; // 0부터 maxValue까지의 비율
                    const y = 50 - (45 * ratio); // 하단(50, 0의 위치)에서 상단으로
                    return (
                      <line
                        key={`grid-${t}`}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        stroke="#f3f4f6"
                        strokeWidth="0.4"
                      />
                    );
                  })}

                  {/* 막대 */}
                  {barData.map((b, idx) => (
                    <g key={idx}>
                      <rect
                        x={b.x}
                        y={b.y}
                        width={b.width}
                        height={b.height}
                        rx={2.5}
                        fill="url(#barFill)"
                        stroke="#fecaca"
                        strokeWidth="0.3"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() =>
                          setTooltip({
                            index: idx,
                            x: b.centerX,
                            y: b.y,
                            value: b.value,
                            month: b.month,
                          })
                        }
                      />
                      {/* 막대 위에 카운트 표시 */}
                      <text
                        x={b.centerX}
                        y={b.y - 1}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="#4b5563"
                        fontWeight="600"
                      >
                        {b.value}
                      </text>
                    </g>
                  ))}
                </svg>

                {tooltip.index !== null && (
                  <ChartTooltip
                    style={{
                      left: `${tooltip.x}%`,
                      top: `${tooltip.y}%`,
                    }}
                  >
                    {tooltip.month} · {tooltip.value.toLocaleString()}건
                  </ChartTooltip>
                )}
              </ChartSvgWrapper>

              <ChartXAxis>
                {months.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </ChartXAxis>
            </ChartWrapper>
          </LargeCardBox>

          <CardBox>
            <CardHeader>
              <CardTitle>활성 캠페인</CardTitle>
              <CardMeta>{dashboardData.activeCampaigns.length}개</CardMeta>
            </CardHeader>

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
                    <CampaignMain>
                      <CampaignIcon>
                        <i className={c.icon} />
                      </CampaignIcon>
                      <CampaignText>
                        <CampaignTitle>{c.title}</CampaignTitle>
                        <CampaignTag>{c.tag}</CampaignTag>
                        <CampaignDateRow>
                          <span>{c.dateRange}</span>
                        </CampaignDateRow>
                      </CampaignText>
                    </CampaignMain>
                    <CampaignDetailButton
                      type="button"
                      onClick={() => navigate('/admin/campaigns', { state: { campaignId: c.id } })}
                    >
                      상세보기
                      <i className="fas fa-arrow-right" />
                    </CampaignDetailButton>
                  </CampaignItem>
                ))
              )}
            </CampaignList>
          </CardBox>
        </TopGrid>

        {/* 아래: 최근 발송 이력 + 알림 */}
        <BottomGrid>
          <LargeCardBox>
            <CardHeader>
              <CardTitle>최근 메시지 생성 이력</CardTitle>
              <CardMeta>최근 6건</CardMeta>
            </CardHeader>
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}></i>
                <div>메시지를 불러오는 중...</div>
              </div>
            ) : dashboardData.recentMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
                최근 생성된 메시지가 없습니다.
              </div>
            ) : (
              <RecentTable>
                <RecentThead>
                  <tr>
                    <RecentTh>제목</RecentTh>
                    <RecentTh>유형</RecentTh>
                    {/* <RecentTh>생성자</RecentTh> */}
                    <RecentTh>생성시각</RecentTh>
                    <RecentTh>상태</RecentTh>
                  </tr>
                </RecentThead>
                <RecentTbody>
                  {dashboardData.recentMessages.map((m) => (
                    <RecentTr key={m.id}>
                      <RecentTd>{m.title}</RecentTd>
                      <RecentTd>{m.type}</RecentTd>
                      {/* <RecentTd>{m.createdBy}</RecentTd> */}
                      <RecentTd>{m.createdAt}</RecentTd>
                      <RecentTd>
                        <StatusBadge
                          variant={
                            m.status === "completed"
                              ? "success"
                              : m.status === "scheduled"
                              ? "pending"
                              : "danger"
                          }
                        >
                          {m.status === "completed"
                            ? "완료"
                            : m.status === "scheduled"
                            ? "예약"
                            : "진행중"}
                        </StatusBadge>
                      </RecentTd>
                    </RecentTr>
                  ))}
                </RecentTbody>
              </RecentTable>
            )}
          </LargeCardBox>

          <CardBox>
            <CardHeader>
              <CardTitle>시스템 통계 요약</CardTitle>
              <CardMeta>주요 지표</CardMeta>
            </CardHeader>

            <AlertList>
              <AlertItem>
                <div>
                  <AlertTypeBadge style={{ background: "#fee2e2", color: "#e60012" }}>캠페인</AlertTypeBadge>
                  <AlertTitle>총 {dashboardData.totalCampaigns}개 캠페인 등록</AlertTitle>
                </div>
                <AlertMeta>활성: {dashboardData.activeCampaigns.length}개</AlertMeta>
              </AlertItem>
              <AlertItem>
                <div>
                  <AlertTypeBadge style={{ background: "#dbeafe", color: "#2563eb" }}>메시지</AlertTypeBadge>
                  <AlertTitle>총 {dashboardData.totalMessages}개 메시지 생성</AlertTitle>
                </div>
                <AlertMeta>최근 생성: {dashboardData.recentMessages.length}건</AlertMeta>
              </AlertItem>
              <AlertItem>
                <div>
                  <AlertTypeBadge style={{ background: "#dcfce7", color: "#16a34a" }}>세그먼트</AlertTypeBadge>
                  <AlertTitle>{dashboardData.totalSegments}개 고객 세그먼트</AlertTitle>
                </div>
                <AlertMeta>활성 사용자: {dashboardData.activeUsers}명</AlertMeta>
              </AlertItem>
            </AlertList>
          </CardBox>
        </BottomGrid>
      </DashboardContainer>
    </Layout>
  );
};

export default AdminDashboard;
