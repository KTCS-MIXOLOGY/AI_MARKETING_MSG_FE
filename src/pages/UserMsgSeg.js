import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import Badge from "../components/common/Badge";
import ProgressBar from "../components/common/ProgressBar";
import Loading from "../components/common/Loading";

const MessageContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
`;

const StepContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  color: ${(props) =>
    props.active ? props.theme.colors.white : props.theme.colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: ${(props) => props.theme.spacing.md};
`;

const StepTitle = styled.h3`
  margin: 0;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.gray[600]};
`;

const StepContent = styled.div`
  margin-left: 56px;
`;

const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const CustomerCount = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const CountNumber = styled.div`
  font-size: ${(props) => props.theme.fontSizes["3xl"]};
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const CountLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const MessageOption = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 2px solid
    ${(props) => (props.selected ? props.theme.colors.primary : "transparent")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const MessageContent = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  line-height: 1.6;
  color: ${(props) => props.theme.colors.gray[800]};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const GeneratedMessage = styled.div`
  background: ${(props) => props.theme.colors.gray[50]};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.md};
  position: relative;
`;

const MessageText = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.fontSizes.md};
  line-height: 1.5;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const CharCounter = styled.div`
  text-align: right;
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) =>
    props.warning ? props.theme.colors.danger : props.theme.colors.gray[600]};
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const MessageSegment = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: 세그먼트 필터
  const [filters, setFilters] = useState({
    ageGroup: "",
    gender: "",
    region: "",
    membership: "",
    recentPurchase: "",
  });

  // Step 2: 고객 수
  const [customerCount, setCustomerCount] = useState(0);

  // Step 3: 캠페인 선택
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Step 4: 상품 선택
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Step 5: 톤앤매너
  const [tone, setTone] = useState("");

  // Step 6: 생성된 메시지
  const [generatedMessages, setGeneratedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Step 7: 메시지 수정
  const [editingMessage, setEditingMessage] = useState("");

  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: "📊" },
    { id: "messages", label: "메시지 관리", icon: "💬" },
    { id: "campaigns", label: "캠페인", icon: "📢" },
    { id: "customers", label: "고객 관리", icon: "👥" },
    { id: "analytics", label: "분석", icon: "📈" },
  ];

  const ageGroupOptions = [
    { value: "20s", label: "20대" },
    { value: "30s", label: "30대" },
    { value: "40s", label: "40대" },
    { value: "50s", label: "50대+" },
  ];

  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
    { value: "all", label: "전체" },
  ];

  const regionOptions = [
    { value: "seoul", label: "서울" },
    { value: "gyeonggi", label: "경기" },
    { value: "incheon", label: "인천" },
    { value: "busan", label: "부산" },
    { value: "all", label: "전체" },
  ];

  const membershipOptions = [
    { value: "bronze", label: "브론즈" },
    { value: "silver", label: "실버" },
    { value: "gold", label: "골드" },
    { value: "platinum", label: "플래티넘" },
    { value: "all", label: "전체" },
  ];

  const recentPurchaseOptions = [
    { value: "week", label: "1주일 이내" },
    { value: "month", label: "1개월 이내" },
    { value: "quarter", label: "3개월 이내" },
    { value: "year", label: "1년 이내" },
    { value: "all", label: "전체" },
  ];

  const campaignOptions = [
    {
      id: 1,
      name: "갤럭시 S23 사전예약 캠페인",
      type: "신규 고객 유치",
      description: "최신 갤럭시 시리즈 사전예약 고객 대상",
      status: "active",
    },
    {
      id: 2,
      name: "5G 요금제 업그레이드",
      type: "기존 고객 유지",
      description: "기존 4G 요금제 사용자 대상 5G 업그레이드",
      status: "active",
    },
    {
      id: 3,
      name: "IoT 가정용 상품 소개",
      type: "업셀링",
      description: "IoT 제품 관심 고객 대상 홍보",
      status: "active",
    },
  ];

  const productOptions = [
    {
      id: 1,
      name: "갤럭시 S23 Ultra",
      category: "스마트폰",
      price: 1299000,
      discount: 10,
      benefits: ["최신 프로세서", "고화질 카메라", "S펜 포함"],
    },
    {
      id: 2,
      name: "아이폰 14 Pro",
      category: "스마트폰",
      price: 1399000,
      discount: 5,
      benefits: ["A16 칩", "프로 카메라 시스템", "다이나믹 아일랜드"],
    },
    {
      id: 3,
      name: "5G 프리미엄 요금제",
      category: "요금제",
      price: 100000,
      discount: 20,
      benefits: ["무제한 데이터", "프리미엄 부가서비스", "우선 고객지원"],
    },
  ];

  const toneOptions = [
    { value: "formal", label: "격식있는 (Formal)" },
    { value: "friendly", label: "친근한 (Friendly)" },
    { value: "casual", label: "캐주얼한 (Casual)" },
    { value: "professional", label: "전문적인 (Professional)" },
  ];

  const handleMenuClick = (menuId) => {
    if (menuId === "dashboard") {
      navigate("/dashboard");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    // 필터 적용 로직 - API 호출
    setLoading(true);
    setTimeout(() => {
      // 임시 데이터
      setCustomerCount(Math.floor(Math.random() * 5000) + 500);
      setLoading(false);
      setCurrentStep(2);
    }, 1500);
  };

  const selectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setCurrentStep(3);
  };

  const toggleProduct = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const selectTone = (toneValue) => {
    setTone(toneValue);
  };

  const generateMessages = () => {
    // AI 메시지 생성 로직 - API 호출
    setLoading(true);
    setTimeout(() => {
      const messages = [
        {
          id: 1,
          content: `'${
            selectedCampaign.name
          }' 특별 혜택을 만나보세요! ${selectedProducts
            .map((p) => p.name)
            .join(
              ", "
            )} 제품으로 특별한 경험을 선사합니다. 지금 바로 확인하세요!`,
          tone: "friendly",
          charCount: 89,
        },
        {
          id: 2,
          content: `안녕하세요. KT CS에서 준비한 '${
            selectedCampaign.name
          }'을 소개합니다. ${selectedProducts
            .map((p) => p.name)
            .join(", ")} 등 다양한 혜택을 확인해보세요.`,
          tone: "formal",
          charCount: 76,
        },
        {
          id: 3,
          content: `'${
            selectedCampaign.name
          }'이 시작되었습니다! ${selectedProducts
            .map((p) => p.name)
            .join(
              ", "
            )} 제품들이 특별한 가격으로 준비되어 있습니다. 놓치지 마세요!`,
          tone: "casual",
          charCount: 82,
        },
      ];
      setGeneratedMessages(messages);
      setLoading(false);
      setCurrentStep(6);
    }, 3000);
  };

  const selectMessage = (message) => {
    setSelectedMessage(message);
    setEditingMessage(message.content);
    setCurrentStep(7);
  };

  const handleMessageEdit = (content) => {
    setEditingMessage(content);
  };

  const saveMessage = () => {
    // 메시지 저장 로직 - API 호출
    alert("메시지가 저장되었습니다!");
    navigate("/dashboard");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editingMessage);
    alert("클립보드에 복사되었습니다!");
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (loading) {
    return <Loading fullScreen text="AI 메시지 생성 중..." />;
  }

  return (
    <Layout
      sidebar={
        <Sidebar
          menuItems={menuItems}
          activeMenu="messages"
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
            { label: "대시보드", href: "/dashboard" },
            { label: "고객 세그먼트 메시지 생성", active: true },
          ]}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <MessageContainer>
        <h2>고객 세그먼트 메시지 생성</h2>
        <p className="text-muted mb-4">
          AI 기반으로 고객 세그먼트에 맞춘 마케팅 메시지를 생성합니다.
        </p>

        <ProgressBar
          percentage={(currentStep / 7) * 100}
          label={`단계 ${currentStep} / 7`}
          variant="primary"
        />

        {/* Step 1: 세그먼트 필터 선택 */}
        <StepContainer>
          <StepHeader>
            <StepNumber active={currentStep >= 1}>1</StepNumber>
            <StepTitle active={currentStep >= 1}>세그먼트 필터 선택</StepTitle>
          </StepHeader>

          {currentStep >= 1 && (
            <StepContent>
              <FilterGroup>
                <Select
                  label="나이대"
                  name="ageGroup"
                  value={filters.ageGroup}
                  onChange={(e) =>
                    handleFilterChange("ageGroup", e.target.value)
                  }
                  options={ageGroupOptions}
                  placeholder="나이대를 선택하세요"
                />
                <Select
                  label="성별"
                  name="gender"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  options={genderOptions}
                  placeholder="성별을 선택하세요"
                />
                <Select
                  label="지역"
                  name="region"
                  value={filters.region}
                  onChange={(e) => handleFilterChange("region", e.target.value)}
                  options={regionOptions}
                  placeholder="지역을 선택하세요"
                />
                <Select
                  label="멤버십 등급"
                  name="membership"
                  value={filters.membership}
                  onChange={(e) =>
                    handleFilterChange("membership", e.target.value)
                  }
                  options={membershipOptions}
                  placeholder="멤버십 등급을 선택하세요"
                />
                <Select
                  label="최근 구매일"
                  name="recentPurchase"
                  value={filters.recentPurchase}
                  onChange={(e) =>
                    handleFilterChange("recentPurchase", e.target.value)
                  }
                  options={recentPurchaseOptions}
                  placeholder="최근 구매일을 선택하세요"
                />
              </FilterGroup>

              {currentStep === 1 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Button variant="primary" onClick={applyFilters}>
                    필터 적용 및 고객 수 확인
                  </Button>
                </div>
              )}
            </StepContent>
          )}
        </StepContainer>

        {/* Step 2: 필터링 결과 */}
        {currentStep >= 2 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 2}>2</StepNumber>
              <StepTitle active={currentStep >= 2}>
                필터링 실행 및 고객 수 확인
              </StepTitle>
            </StepHeader>

            <StepContent>
              <CustomerCount>
                <CountNumber>{customerCount.toLocaleString()}</CountNumber>
                <CountLabel>명의 고객이 선택되었습니다</CountLabel>
              </CustomerCount>

              {currentStep === 2 && (
                <div style={{ textAlign: "center" }}>
                  <Button variant="primary" onClick={nextStep}>
                    다음 단계로
                  </Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 3: 캠페인 선택 */}
        {currentStep >= 3 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 3}>3</StepNumber>
              <StepTitle active={currentStep >= 3}>캠페인 선택</StepTitle>
            </StepHeader>

            <StepContent>
              {campaignOptions.map((campaign) => (
                <Card
                  key={campaign.id}
                  hover
                  onClick={() => selectCampaign(campaign)}
                  style={{
                    border:
                      selectedCampaign?.id === campaign.id
                        ? "2px solid #0066cc"
                        : "1px solid #dee2e6",
                    cursor: "pointer",
                  }}
                >
                  <h4>{campaign.name}</h4>
                  <p style={{ color: "#6c757d", marginBottom: "8px" }}>
                    {campaign.description}
                  </p>
                  <Badge
                    variant={
                      campaign.status === "active" ? "success" : "secondary"
                    }
                  >
                    {campaign.type}
                  </Badge>
                </Card>
              ))}

              {currentStep === 3 && selectedCampaign && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Button variant="primary" onClick={nextStep}>
                    다음 단계로
                  </Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 4: 상품 선택 */}
        {currentStep >= 4 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 4}>4</StepNumber>
              <StepTitle active={currentStep >= 4}>상품 선택</StepTitle>
            </StepHeader>

            <StepContent>
              {productOptions.map((product) => (
                <Card
                  key={product.id}
                  hover
                  onClick={() => toggleProduct(product)}
                  style={{
                    border: selectedProducts.find((p) => p.id === product.id)
                      ? "2px solid #0066cc"
                      : "1px solid #dee2e6",
                    cursor: "pointer",
                    marginBottom: "16px",
                  }}
                >
                  <h4>{product.name}</h4>
                  <p style={{ color: "#6c757d", marginBottom: "8px" }}>
                    {product.category} • ₩{product.price.toLocaleString()}
                  </p>
                  <div style={{ marginBottom: "8px" }}>
                    {product.benefits.map((benefit, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        style={{ marginRight: "4px" }}
                      >
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant={product.discount > 0 ? "danger" : "primary"}>
                    {product.discount > 0
                      ? `${product.discount}% 할인`
                      : "일반가"}
                  </Badge>
                </Card>
              ))}

              {currentStep === 4 && selectedProducts.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Button variant="primary" onClick={nextStep}>
                    다음 단계로
                  </Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 5: 톤앤매너 선택 */}
        {currentStep >= 5 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 5}>5</StepNumber>
              <StepTitle active={currentStep >= 5}>톤앤매너 선택</StepTitle>
            </StepHeader>

            <StepContent>
              {toneOptions.map((option) => (
                <Card
                  key={option.value}
                  hover
                  onClick={() => selectTone(option.value)}
                  style={{
                    border:
                      tone === option.value
                        ? "2px solid #0066cc"
                        : "1px solid #dee2e6",
                    cursor: "pointer",
                    marginBottom: "16px",
                    padding: "24px",
                  }}
                >
                  <h4 style={{ marginBottom: "8px" }}>{option.label}</h4>
                  <p style={{ color: "#6c757d", margin: 0 }}>
                    {option.value === "formal" && "격식있고 정중한 메시지"}
                    {option.value === "friendly" && "친근하고 따뜻한 메시지"}
                    {option.value === "casual" && "편안하고 캐주얼한 메시지"}
                    {option.value === "professional" &&
                      "전문적이고 신뢰있는 메시지"}
                  </p>
                </Card>
              ))}

              {currentStep === 5 && tone && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Button variant="primary" onClick={generateMessages}>
                    AI 메시지 생성
                  </Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 6: 생성된 메시지 선택 */}
        {currentStep >= 6 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 6}>6</StepNumber>
              <StepTitle active={currentStep >= 6}>메시지 선택</StepTitle>
            </StepHeader>

            <StepContent>
              {generatedMessages.map((message) => (
                <MessageOption
                  key={message.id}
                  selected={selectedMessage?.id === message.id}
                  onClick={() => selectMessage(message)}
                >
                  <MessageContent>{message.content}</MessageContent>
                  <MessageMeta>
                    <span>
                      톤: {message.tone} • 글자 수: {message.charCount}자
                    </span>
                    <Badge
                      variant={message.charCount <= 90 ? "success" : "warning"}
                    >
                      {message.charCount <= 90 ? "SMS 적합" : "SMS 초과"}
                    </Badge>
                  </MessageMeta>
                </MessageOption>
              ))}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 7: 메시지 수정 */}
        {currentStep >= 7 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 7}>7</StepNumber>
              <StepTitle active={currentStep >= 7}>메시지 수정</StepTitle>
            </StepHeader>

            <StepContent>
              <GeneratedMessage>
                <MessageText
                  value={editingMessage}
                  onChange={(e) => handleMessageEdit(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                />
                <CharCounter warning={editingMessage.length > 90}>
                  {editingMessage.length} / 90자 (SMS 기준)
                </CharCounter>
              </GeneratedMessage>

              <ActionButtons>
                <Button variant="secondary" onClick={copyToClipboard}>
                  📋 복사
                </Button>
                <Button variant="primary" onClick={saveMessage}>
                  💾 저장
                </Button>
              </ActionButtons>
            </StepContent>
          </StepContainer>
        )}
      </MessageContainer>
    </Layout>
  );
};

export default MessageSegment;
