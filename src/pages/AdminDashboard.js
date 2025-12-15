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

/* 캠페인 TOP 5 */

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const RankNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: ${(props) => (props.rank === 1 ? "#e60012" : "#f3f4f6")};
  color: ${(props) => (props.rank === 1 ? "#ffffff" : "#6b7280")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const RankInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RankTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RankCategory = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.35rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #e60012 0%, #f97373 100%);
  border-radius: 999px;
  width: ${(props) => props.percentage}%;
  transition: width 0.3s ease;
`;

const RankCount = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #e60012;
  white-space: nowrap;
  flex-shrink: 0;
`;

/* 예약 캠페인 */

const UpcomingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const UpcomingItem = styled.div`
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: #fef3f2;
  border: 1px solid #fee2e2;
  transition: all 0.2s ease;

  &:hover {
    background: #fecaca;
    border-color: #fca5a5;
    transform: translateY(-2px);
  }
`;

const UpcomingTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UpcomingDate = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.15rem;
`;

const UpcomingSegment = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
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
    weeklyMessageCounts: [],  // 월별 → 주간으로 변경
    topCampaigns: [],         // 자주 사용하는 캠페인 TOP 5
    upcomingCampaigns: [],    // 예약 상태 캠페인
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

  // 주간 메시지 통계 계산 함수 (최근 7일, 일~토)
  const calculateWeeklyStats = (messages) => {
    const now = new Date();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekCounts = Array(7).fill(0);

    console.log("=== 주간 통계 계산 시작 ===");
    console.log("현재 날짜:", now.toISOString());
    console.log("총 메시지 수:", messages.length);

    // 최근 7일간의 메시지를 요일별로 집계
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    messages.forEach((msg, index) => {
      if (msg.createdAt) {
        const msgDate = new Date(msg.createdAt);
        if (msgDate >= sevenDaysAgo) {
          const dayOfWeek = msgDate.getDay(); // 0(일) ~ 6(토)
          weekCounts[dayOfWeek]++;
          console.log(`메시지 #${index + 1}: ${weekDays[dayOfWeek]}요일에 추가, 현재 카운트: ${weekCounts[dayOfWeek]}`);
        }
      }
    });

    const result = weekDays.map((day, index) => ({
      day,
      count: weekCounts[index]
    }));

    console.log("=== 최종 주간 통계 ===", JSON.stringify(result, null, 2));
    return result;
  };

  // 캠페인 사용 횟수 통계 계산 함수 (TOP 5) - campaignId 기반
  const calculateTopCampaigns = (messages, campaigns) => {
    const campaignCounts = {};

    // campaignId별 메시지 수 집계
    messages.forEach((msg) => {
      if (msg.campaignId) {
        if (!campaignCounts[msg.campaignId]) {
          // campaigns 배열에서 해당 campaignId의 이름 찾기
          const campaign = campaigns.find(c => c.campaignId === msg.campaignId);
          campaignCounts[msg.campaignId] = {
            id: msg.campaignId,
            name: campaign?.name || msg.campaignName || `캠페인 ${msg.campaignId}`,
            count: 0
          };
        }
        campaignCounts[msg.campaignId].count++;
      }
    });

    // 배열로 변환하고 정렬
    const sorted = Object.values(campaignCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 최대값 대비 퍼센티지 계산
    const maxCount = sorted.length > 0 ? sorted[0].count : 1;
    return sorted.map((item, index) => ({
      rank: index + 1,
      id: item.id,
      name: item.name,
      count: item.count,
      percentage: Math.round((item.count / maxCount) * 100)
    }));
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
          recentMessages = messageList.slice(0, 6).map((msg) => {
            // 실패 상태 판단: status 필드 또는 content 필드 중 하나라도 실패를 나타내면 실패
            const isFailed =
              msg.status === "FAILED" ||
              msg.contentPreview === "메시지 생성 실패" ||
              msg.summary === "메시지 생성 실패" ||
              msg.messageContent === "메시지 생성 실패";

            console.log(`[AdminDashboard] 메시지 ${msg.messageId} 실패 여부:`, isFailed, {
              contentPreview: msg.contentPreview,
              summary: msg.summary,
              messageContent: msg.messageContent,
              status: msg.status
            });

            return {
              id: msg.messageId,
              title: msg.summary?.substring(0, 30) + "..." || "메시지",
              type: msg.messageType === "SEGMENT" ? "세그먼트" : "개인",
              // createdBy: "관리자", // API 응답에 생성자 정보 없음 (createdBy는 ID만)
              createdAt: msg.createdAt ? formatDateTime(msg.createdAt) : "-",
              status: isFailed ? "failed" : "completed",
              campaignId: msg.campaignId, // 캠페인 상세페이지 연동용
            };
          });

          console.log("포맷팅된 최근 메시지:", recentMessages);
        } else {
          console.error("메시지 API success=false:", response.data);
        }
      } else {
        console.error("메시지 데이터 조회 실패:", messagesRes.reason);
      }

      // 주간 메시지 통계 계산 (최근 7일, 일~토)
      const weeklyMessageCounts = calculateWeeklyStats(messageList);
      console.log("주간 메시지 통계:", weeklyMessageCounts);

      // 자주 사용하는 캠페인 TOP 5 (campaignId 기반)
      const topCampaigns = calculateTopCampaigns(messageList, campaignList);
      console.log("캠페인 TOP 5:", topCampaigns);

      // 예약 상태 캠페인 (곧 시작할 캠페인) - today는 위에서 이미 선언됨
      const upcomingCampaigns = campaignList
        .filter((c) => {
          const startDate = new Date(c.startDate);
          startDate.setHours(0, 0, 0, 0);

          // 시작 전이거나 SCHEDULED 상태인 캠페인
          return startDate > today || c.status === "SCHEDULED";
        })
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 3)
        .map((c) => ({
          id: c.campaignId,
          title: c.name,
          startDate: c.startDate,
          type: c.type || "일반",
        }));

      console.log("예약 상태 캠페인:", upcomingCampaigns);

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
        weeklyMessageCounts,     // 월별 → 주간으로 변경
        topCampaigns,            // 자주 사용하는 캠페인 TOP 5
        upcomingCampaigns,       // 예약 상태 캠페인
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

  // 주간 메시지 발송량 (실제 데이터 사용) - 일~토
  const weeklyStats = dashboardData.weeklyMessageCounts.length > 0
    ? dashboardData.weeklyMessageCounts
    : [
        { day: "일", count: 0 },
        { day: "월", count: 0 },
        { day: "화", count: 0 },
        { day: "수", count: 0 },
        { day: "목", count: 0 },
        { day: "금", count: 0 },
        { day: "토", count: 0 },
      ];

  const weeklyData = weeklyStats.map(w => w.count);
  const weekDays = weeklyStats.map(w => w.day);
  const maxValue = Math.max(...weeklyData, 50);

  const step = 100 / weeklyData.length;
  const barWidth = step * 0.45; // 막대 너비

  const barData = weeklyData.map((value, index) => {
    const ratio = value / maxValue; // 0부터 maxValue까지의 비율
    const barHeight = 40 * ratio + 10;
    const y = 60 - barHeight; // 하단 기준점 50 (0의 위치)
    const centerX = step * index + step / 2;
    const x = centerX - barWidth / 2;
    return {
      value,
      day: weekDays[index],
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

        {/* 위쪽: 주간 현황 + 캠페인 TOP 5 */}
        <TopGrid>
          <LargeCardBox>
            <CardHeader>
              <CardTitle>주간 메시지 생성 현황</CardTitle>
              <CardMeta>최근 7일 기준</CardMeta>
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
                            month: b.day + "요일",  // day로 변경
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
                {weekDays.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </ChartXAxis>
            </ChartWrapper>
          </LargeCardBox>

          <CardBox>
            <CardHeader>
              <CardTitle>자주 사용하는 캠페인 TOP 5</CardTitle>
              <CardMeta>최근 30일 기준</CardMeta>
            </CardHeader>

            <RankingList>
              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }}></i>
                </div>
              ) : dashboardData.topCampaigns.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  사용 이력이 없습니다.
                </div>
              ) : (
                dashboardData.topCampaigns.map((campaign) => (
                  <RankingItem
                    key={campaign.rank}
                    onClick={() => navigate('/admin/campaigns', { state: { campaignId: campaign.id } })}
                    style={{ cursor: "pointer" }}
                  >
                    <RankNumber rank={campaign.rank}>{campaign.rank}</RankNumber>
                    <RankInfo>
                      <RankTitle>{campaign.name}</RankTitle>
                      <RankCategory>캠페인 타겟팅</RankCategory>
                      <ProgressBarContainer>
                        <ProgressBarFill percentage={campaign.percentage} />
                      </ProgressBarContainer>
                    </RankInfo>
                    <RankCount>{campaign.count}회 사용</RankCount>
                  </RankingItem>
                ))
              )}
            </RankingList>
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
                    <RecentTr
                      key={m.id}
                      onClick={() => navigate('/admin/messages', { state: { messageId: m.id } })}
                      style={{ cursor: "pointer" }}
                    >
                      <RecentTd>{m.title}</RecentTd>
                      <RecentTd>{m.type}</RecentTd>
                      {/* <RecentTd>{m.createdBy}</RecentTd> */}
                      <RecentTd>{m.createdAt}</RecentTd>
                      <RecentTd>
                        <StatusBadge
                          variant={
                            m.status === "completed"
                              ? "success"
                              : m.status === "failed"
                              ? "danger"
                              : "pending"
                          }
                        >
                          {m.status === "completed"
                            ? "완료"
                            : m.status === "failed"
                            ? "실패"
                            : "예약"}
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
              <CardTitle>이번 주 예정 캠페인</CardTitle>
              <CardMeta>곧 시작할 캠페인</CardMeta>
            </CardHeader>

            <UpcomingList>
              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }}></i>
                </div>
              ) : dashboardData.upcomingCampaigns.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  예정된 캠페인이 없습니다.
                </div>
              ) : (
                dashboardData.upcomingCampaigns.map((campaign) => (
                  <UpcomingItem
                    key={campaign.id}
                    onClick={() => navigate('/admin/campaigns', { state: { campaignId: campaign.id } })}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                      <div style={{
                        fontSize: "1.5rem",
                        width: "40px",
                        height: "40px",
                        background: "#fff5f5",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        📢
                      </div>
                      <div style={{ flex: 1 }}>
                        <UpcomingTitle>{campaign.title}</UpcomingTitle>
                        <UpcomingSegment>
                          <i className="fas fa-tag" style={{ fontSize: "0.75rem" }}></i>
                          {campaign.type}
                        </UpcomingSegment>
                      </div>
                    </div>
                    <UpcomingDate>
                      <i className="fas fa-calendar-alt" style={{ fontSize: "0.8rem", marginRight: "0.35rem" }}></i>
                      {campaign.startDate}
                    </UpcomingDate>
                  </UpcomingItem>
                ))
              )}
            </UpcomingList>
          </CardBox>
        </BottomGrid>
      </DashboardContainer>
    </Layout>
  );
};

export default AdminDashboard;
