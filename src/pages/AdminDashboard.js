import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

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
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem 1.5rem;
  border: 1px solid #f3f4f6;
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
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;
`;

const ChartYAxis = styled.div`
  position: absolute;
  left: 0;
  top: 0.4rem;
  bottom: 0.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #9ca3af;
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [tooltip, setTooltip] = useState({
    index: null,
    x: 0,
    y: 0,
    value: 0,
    month: "",
  });

  // 상단 카드용 통계 데이터
  const statCards = [
    {
      label: "총 캠페인",
      value: "4",
      change: "+12%",
      changeCaption: "지난달 대비",
      icon: "fas fa-bullhorn",
    },
    {
      label: "발송 메시지",
      value: "7",
      change: "+8%",
      changeCaption: "지난주 대비",
      icon: "fas fa-envelope",
    },
    {
      label: "평균 전환율",
      value: "15.8%",
      change: "+2.3%",
      changeCaption: "변동률",
      icon: "fas fa-chart-line",
    },
    {
      label: "활성 사용자",
      value: "24",
      change: "+3명",
      changeCaption: "전일 대비",
      icon: "fas fa-users",
    },
  ];

  // 월별 메시지 발송량
  const monthlyData = [450, 520, 680, 730, 810, 920];
  const months = ["1월", "2월", "3월", "4월", "5월", "6월"];
  const maxValue = Math.max(...monthlyData);
  const minValue = Math.min(...monthlyData);
  const range = maxValue - minValue || 1;

  const step = 100 / monthlyData.length;
  const barWidth = step * 0.45; // 막대 너비

  const barData = monthlyData.map((value, index) => {
    const normalized = (value - minValue) / range;
    const barHeight = 26 * normalized + 8; // 8~34 사이
    const y = 40 - barHeight;
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

  // Y축 라벨 (400, 600, 800 정도)
  const yTicks = [400, 600, 800, 1000];

  // 활성 캠페인
  const activeCampaigns = [
    {
      id: 1,
      title: "장기 고객 감사 이벤트",
      tag: "기존 고객 유지",
      icon: "fas fa-heart",
      dateRange: "2024-02-01 ~ 2024-06-30",
    },
    {
      id: 2,
      title: "IoT 결합 상품 안내",
      tag: "크로스셀링",
      icon: "fas fa-retweet",
      dateRange: "2024-01-15 ~ 2024-04-15",
    },
    {
      id: 3,
      title: "데이터 무제한 전환",
      tag: "이탈 방지",
      icon: "fas fa-shield-alt",
      dateRange: "2024-02-01 ~ 2024-05-31",
    },
  ];

  // 최근 메시지 발송 이력
  const recentMessages = [
    {
      id: 1,
      title: "5G 프리미엄 요금제 프로모션",
      type: "세그먼트",
      createdBy: "김철수",
      createdAt: "2024-02-20 14:30",
      status: "completed",
    },
    {
      id: 2,
      title: "신규 가입자 환영 이벤트",
      type: "세그먼트",
      createdBy: "이영희",
      createdAt: "2024-02-19 09:15",
      status: "completed",
    },
    {
      id: 3,
      title: "데이터 사용량 초과 안내",
      type: "개인",
      createdBy: "박민수",
      createdAt: "2024-02-18 16:45",
      status: "in-progress",
    },
    {
      id: 4,
      title: "장기 고객 감사 쿠폰 발송",
      type: "세그먼트",
      createdBy: "정다은",
      createdAt: "2024-02-17 11:10",
      status: "scheduled",
    },
    {
      id: 5,
      title: "생일 축하 쿠폰 발송",
      type: "개인",
      createdBy: "김진아",
      createdAt: "2025-01-17 11:10",
      status: "scheduled",
    },
    {
      id: 6,
      title: "장기 고객 감사 쿠폰 발송",
      type: "개인",
      createdBy: "윤지영",
      createdAt: "2025-09-17 11:10",
      status: "scheduled",
    },
  ];

  // 관리자 알림
  const adminAlerts = [
    {
      id: 1,
      type: "시스템",
      title: "다음 주 일요일 02:00~04:00 시스템 점검 예정",
      datetime: "2024-02-20 09:00 등록",
    },
    {
      id: 2,
      type: "가이드",
      title: "신규 캠페인 템플릿 v2가 추가되었습니다.",
      datetime: "2024-02-18 15:20 등록",
    },
    {
      id: 3,
      type: "주의",
      title: "최근 7일간 반송률이 3%를 초과한 캠페인이 있습니다.",
      datetime: "2024-02-17 10:05 등록",
    },
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
              KT 마케팅 메시지 발송 현황과 활성 캠페인을 한눈에 확인하세요.
            </PageSubtitle>
          </div>
        </TopBar>

        {/* 상단 통계 카드 */}
        <StatsRow>
          {statCards.map((card) => (
            <StatCard key={card.label}>
              <IconCircle>
                <i className={card.icon} />
              </IconCircle>
              <StatLabel>{card.label}</StatLabel>
              <StatValue>{card.value}</StatValue>
              <StatChangeRow>
                <StatChange>↑ {card.change}</StatChange>
                <StatChangeCaption>{card.changeCaption}</StatChangeCaption>
              </StatChangeRow>
            </StatCard>
          ))}
        </StatsRow>

        {/* 위쪽: 월별 현황 + 활성 캠페인 */}
        <TopGrid>
          <LargeCardBox>
            <CardHeader>
              <CardTitle>월별 메시지 발송 현황</CardTitle>
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
                  viewBox="0 0 100 40"
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
                    const ratio = (t - minValue) / range;
                    const y = 40 - (26 * ratio + 8);
                    return (
                      <line
                        key={t}
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
                    <rect
                      key={idx}
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
              <CardMeta>{activeCampaigns.length}개</CardMeta>
            </CardHeader>

            <CampaignList>
              {activeCampaigns.map((c) => (
                <CampaignItem key={c.id}>
                  <CampaignMain>
                    <CampaignIcon>
                      <i className={c.icon} />
                    </CampaignIcon>
                    <CampaignText>
                      <CampaignTitle>{c.title}</CampaignTitle>
                      <CampaignTag>{c.tag}</CampaignTag>
                      <CampaignDateRow>
                        <i className="far fa-calendar-alt" />
                        <span>{c.dateRange}</span>
                      </CampaignDateRow>
                    </CampaignText>
                  </CampaignMain>
                  <CampaignDetailButton type="button">
                    상세보기
                    <i className="fas fa-arrow-right" />
                  </CampaignDetailButton>
                </CampaignItem>
              ))}
            </CampaignList>
          </CardBox>
        </TopGrid>

        {/* 아래: 최근 발송 이력 + 알림 */}
        <BottomGrid>
          <LargeCardBox>
            <CardHeader>
              <CardTitle>최근 메시지 발송 이력</CardTitle>
              <CardMeta>최근 4건</CardMeta>
            </CardHeader>
            <RecentTable>
              <RecentThead>
                <tr>
                  <RecentTh>제목</RecentTh>
                  <RecentTh>유형</RecentTh>
                  <RecentTh>생성자</RecentTh>
                  <RecentTh>발송시각</RecentTh>
                  <RecentTh>상태</RecentTh>
                </tr>
              </RecentThead>
              <RecentTbody>
                {recentMessages.map((m) => (
                  <RecentTr key={m.id}>
                    <RecentTd>{m.title}</RecentTd>
                    <RecentTd>{m.type}</RecentTd>
                    <RecentTd>{m.createdBy}</RecentTd>
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
          </LargeCardBox>

          <CardBox>
            <CardHeader>
              <CardTitle>관리자 알림</CardTitle>
              <CardMeta>중요 공지 및 가이드</CardMeta>
            </CardHeader>

            <AlertList>
              {adminAlerts.map((a) => (
                <AlertItem key={a.id}>
                  <div>
                    <AlertTypeBadge>{a.type}</AlertTypeBadge>
                    <AlertTitle>{a.title}</AlertTitle>
                  </div>
                  <AlertMeta>{a.datetime}</AlertMeta>
                </AlertItem>
              ))}
            </AlertList>
          </CardBox>
        </BottomGrid>
      </DashboardContainer>
    </Layout>
  );
};

export default AdminDashboard;
