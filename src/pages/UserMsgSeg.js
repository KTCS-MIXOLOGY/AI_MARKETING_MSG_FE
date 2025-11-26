import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
`;

const BackButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e5e7eb;
  }

  i {
    margin-right: 0.5rem;
  }
`;

// Progress Steps
const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    height: 2px;
    background: #d1d5db;
    z-index: 0;
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 24px;
  left: 0;
  height: 2px;
  background: #e60012;
  z-index: 1;
  transition: width 0.3s ease;
  width: ${(props) => props.progress}%;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;
`;

const StepCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) =>
    props.completed ? "#10b981" : props.active ? "#E60012" : "#d1d5db"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 0 0 4px rgba(230, 0, 18, 0.2)" : "none"};
`;

const StepTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "#E60012" : "#6b7280")};
  text-align: center;
`;

const StepContent = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};
  animation: ${(props) => (props.active ? "fadeIn 0.3s ease" : "none")};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Filter Grid
const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const FilterTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #e60012;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: #374151;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &:hover {
    color: #e60012;
  }
`;

const EstimatedCount = styled.div`
  background: #e60012;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 1.125rem;

  span {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

// Campaign/Product Cards
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border: 2px solid ${(props) => (props.selected ? "#E60012" : "#e5e7eb")};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.selected ? "#FEE2E2" : "white")};

  &:hover {
    border-color: #e60012;
    box-shadow: 0 8px 24px rgba(230, 0, 18, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const CardIcon = styled.i`
  font-size: 2rem;
  color: #e60012;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
`;

// Product List
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const ProductItem = styled.div`
  background: ${(props) => (props.selected ? "#FEE2E2" : "#f9fafb")};
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.selected ? "#E60012" : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: start;
  gap: 1rem;

  &:hover {
    border-color: #e60012;
  }
`;

const ProductCheckbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 0.25rem;
  cursor: pointer;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

// Tone & Message Selection Combined
const ToneMessageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ToneMessageCard = styled.div`
  background: white;
  border: 2px solid ${(props) => (props.selected ? "#E60012" : "#e5e7eb")};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    `
    box-shadow: 0 8px 24px rgba(230, 0, 18, 0.2);
  `}

  &:hover {
    border-color: #e60012;
  }
`;

const ToneHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ToneIcon = styled.i`
  font-size: 1.5rem;
  color: #e60012;
`;

const ToneInfo = styled.div`
  flex: 1;
`;

const ToneName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const ToneSubtitle = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const MessageContent = styled.div`
  font-size: 0.9375rem;
  color: #1a1a1a;
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  min-height: 120px;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

// Buttons
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: #e60012;
  color: white;

  &:hover {
    background: #b8000e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(230, 0, 18, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;

  &:hover {
    background: #e5e7eb;
  }
`;

// ==================== Component ====================

const UserMsgSeg = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    age: [],
    gender: [],
    region: [],
    grade: [],
    lastPurchase: [],
    plan: [],
  });

  // Selections
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Estimated count
  const [estimatedCount, setEstimatedCount] = useState(50000);

  // Mock data
  const campaigns = [
    {
      id: 1,
      name: "여름 프로모션",
      description: "여름 시즌 특별 할인 이벤트",
      icon: "fa-sun",
    },
    {
      id: 2,
      name: "신규 가입 이벤트",
      description: "신규 고객 대상 웰컴 메시지",
      icon: "fa-gift",
    },
    {
      id: 3,
      name: "갤럭시 S24 출시",
      description: "갤럭시 S24 신제품 프로모션",
      icon: "fa-mobile-alt",
    },
  ];

  const products = [
    {
      id: 1,
      name: "5G 프리미어 플러스",
      description: "월 79,000원 / 데이터 무제한",
    },
    {
      id: 2,
      name: "5G 프리미어 에센셜",
      description: "월 59,000원 / 데이터 100GB",
    },
    { id: 3, name: "갤럭시 S24", description: "최신 갤럭시 S24 단말기" },
  ];

  const messages = [
    {
      id: 1,
      tone: "polite",
      toneLabel: "정중한 톤",
      toneSubtitle: "격식있고 예의바른 표현",
      icon: "fa-user-tie",
      content:
        "안녕하세요 고객님,\n\nKT에서 특별한 혜택을 준비했습니다.\n5G 프리미어 플러스 요금제로 데이터 무제한을 경험해보세요.\n\n지금 가입하시면 갤럭시 S24를 특별가로 만나보실 수 있습니다.",
      charCount: 102,
      conversion: "16.2%",
    },
    {
      id: 2,
      tone: "friendly",
      toneLabel: "친근한 톤",
      toneSubtitle: "편안하고 친근한 표현",
      icon: "fa-smile",
      content:
        "고객님 반가워요! 😊\n\nKT가 준비한 꿀혜택 확인하셨나요?\n5G 프리미어 플러스로 데이터 걱정 없이 사용하세요~\n\n갤럭시 S24도 함께 특가로 드립니다!",
      charCount: 95,
      conversion: "18.5%",
    },
    {
      id: 3,
      tone: "urgent",
      toneLabel: "긴급한 톤",
      toneSubtitle: "긴박감있는 표현",
      icon: "fa-bolt",
      content:
        "[KT 긴급 특가]\n\n⚡️ 오늘만 특별가!\n5G 프리미어 플러스 + 갤럭시 S24\n최대 30% 할인!\n\n지금 바로 확인하세요 👉",
      charCount: 78,
      conversion: "22.1%",
    },
  ];

  const steps = [
    { num: 1, title: "세그먼트 선택" },
    { num: 2, title: "캠페인 선택" },
    { num: 3, title: "상품 선택" },
    { num: 4, title: "메시지 생성 및 선택" },
  ];

  useEffect(() => {
    // Calculate estimated count based on filters
    let count = 50000;
    const totalFilters = Object.values(filters).flat().length;
    if (totalFilters > 0) {
      count = Math.max(100, Math.floor(50000 * Math.pow(0.7, totalFilters)));
      count += Math.floor(Math.random() * 200 - 100); // Add variation
    }
    setEstimatedCount(count);
  }, [filters]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 3) {
          alert("최대 3개까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, productId];
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSend = () => {
    alert("메시지가 발송되었습니다!");
    navigate("/history");
  };

  const canProceed = () => {
    if (currentStep === 1) return Object.values(filters).flat().length > 0;
    if (currentStep === 2) return selectedCampaign !== null;
    if (currentStep === 3) return selectedProducts.length > 0;
    if (currentStep === 4) return selectedMessage !== null;
    return false;
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <Layout
      sidebar={<Sidebar activeMenu="message" />}
      header={
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
    >
      <Container>
        <PageHeader>
          <TitleSection>
            <PageTitle>
              <i
                className="fas fa-users"
                style={{ marginRight: "0.5rem", color: "#E60012" }}
              ></i>
              세그먼트 메시지 생성
            </PageTitle>
            <PageDescription>
              고객 세그먼트를 선택하고 AI가 맞춤형 메시지를 자동으로 생성합니다.
            </PageDescription>
          </TitleSection>
          <BackButton onClick={() => navigate("/message")}>
            <i className="fas fa-arrow-left"></i>
            돌아가기
          </BackButton>
        </PageHeader>

        {/* Progress Steps */}
        <ProgressSteps>
          <ProgressLine progress={progress} />
          {steps.map((step) => (
            <Step key={step.num}>
              <StepCircle
                active={currentStep === step.num}
                completed={currentStep > step.num}
              >
                {currentStep > step.num ? (
                  <i className="fas fa-check"></i>
                ) : (
                  step.num
                )}
              </StepCircle>
              <StepTitle active={currentStep === step.num}>
                {step.title}
              </StepTitle>
            </Step>
          ))}
        </ProgressSteps>

        {/* Step 1: Segment Selection */}
        <StepContent active={currentStep === 1}>
          <FilterSection>
            <SectionTitle>
              <i
                className="fas fa-filter"
                style={{ marginRight: "0.5rem", color: "#E60012" }}
              ></i>
              타겟 세그먼트 선택
            </SectionTitle>
            <FilterGrid>
              {/* Age */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-birthday-cake"></i>
                  연령대
                </FilterTitle>
                <CheckboxGroup>
                  {["전체", "10대", "20대", "30대", "40대", "50대 이상"].map(
                    (age) => (
                      <CheckboxLabel key={age}>
                        <input
                          type="checkbox"
                          checked={filters.age.includes(age)}
                          onChange={() => handleFilterChange("age", age)}
                        />
                        {age}
                      </CheckboxLabel>
                    )
                  )}
                </CheckboxGroup>
              </FilterGroup>

              {/* Gender */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-venus-mars"></i>
                  성별
                </FilterTitle>
                <CheckboxGroup>
                  {["전체", "남성", "여성"].map((gender) => (
                    <CheckboxLabel key={gender}>
                      <input
                        type="checkbox"
                        checked={filters.gender.includes(gender)}
                        onChange={() => handleFilterChange("gender", gender)}
                      />
                      {gender}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              {/* Region */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-map-marker-alt"></i>
                  지역
                </FilterTitle>
                <CheckboxGroup>
                  {["전체", "서울", "경기", "인천", "부산", "기타"].map(
                    (region) => (
                      <CheckboxLabel key={region}>
                        <input
                          type="checkbox"
                          checked={filters.region.includes(region)}
                          onChange={() => handleFilterChange("region", region)}
                        />
                        {region}
                      </CheckboxLabel>
                    )
                  )}
                </CheckboxGroup>
              </FilterGroup>

              {/* Grade */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-crown"></i>
                  등급
                </FilterTitle>
                <CheckboxGroup>
                  {["전체", "Bronze", "Silver", "Gold", "Platinum"].map(
                    (grade) => (
                      <CheckboxLabel key={grade}>
                        <input
                          type="checkbox"
                          checked={filters.grade.includes(grade)}
                          onChange={() => handleFilterChange("grade", grade)}
                        />
                        {grade}
                      </CheckboxLabel>
                    )
                  )}
                </CheckboxGroup>
              </FilterGroup>

              {/* Last Purchase */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-calendar-alt"></i>
                  최근 구매일
                </FilterTitle>
                <CheckboxGroup>
                  {[
                    "전체",
                    "1개월 이내",
                    "3개월 이내",
                    "6개월 이내",
                    "6개월 이상",
                  ].map((period) => (
                    <CheckboxLabel key={period}>
                      <input
                        type="checkbox"
                        checked={filters.lastPurchase.includes(period)}
                        onChange={() =>
                          handleFilterChange("lastPurchase", period)
                        }
                      />
                      {period}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              {/* Plan */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-sim-card"></i>
                  요금제
                </FilterTitle>
                <CheckboxGroup>
                  {[
                    "전체",
                    "5G 프리미어 플러스",
                    "5G 프리미어 에센셜",
                    "5G 슬림",
                    "LTE",
                  ].map((plan) => (
                    <CheckboxLabel key={plan}>
                      <input
                        type="checkbox"
                        checked={filters.plan.includes(plan)}
                        onChange={() => handleFilterChange("plan", plan)}
                      />
                      {plan}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>
            </FilterGrid>

            <EstimatedCount>
              예상 타겟: <span>{estimatedCount.toLocaleString()}</span>명
            </EstimatedCount>
          </FilterSection>
        </StepContent>

        {/* Step 2: Campaign Selection */}
        <StepContent active={currentStep === 2}>
          <SectionTitle>
            <i
              className="fas fa-bullhorn"
              style={{ marginRight: "0.5rem", color: "#E60012" }}
            ></i>
            캠페인 선택
          </SectionTitle>
          <CardGrid>
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                selected={selectedCampaign === campaign.id}
                onClick={() => setSelectedCampaign(campaign.id)}
              >
                <CardHeader>
                  <CardIcon className={`fas ${campaign.icon}`}></CardIcon>
                </CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </Card>
            ))}
          </CardGrid>
        </StepContent>

        {/* Step 3: Product Selection */}
        <StepContent active={currentStep === 3}>
          <SectionTitle>
            <i
              className="fas fa-box"
              style={{ marginRight: "0.5rem", color: "#E60012" }}
            ></i>
            상품 선택 (최대 3개)
          </SectionTitle>
          <ProductList>
            {products.map((product) => (
              <ProductItem
                key={product.id}
                selected={selectedProducts.includes(product.id)}
                onClick={() => handleProductToggle(product.id)}
              >
                <ProductCheckbox
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => {}}
                />
                <ProductInfo>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductDescription>{product.description}</ProductDescription>
                </ProductInfo>
              </ProductItem>
            ))}
          </ProductList>
        </StepContent>

        {/* Step 4: Tone & Message Selection Combined */}
        <StepContent active={currentStep === 4}>
          <SectionTitle>
            <i
              className="fas fa-magic"
              style={{ marginRight: "0.5rem", color: "#E60012" }}
            ></i>
            메시지 톤 및 내용 선택
          </SectionTitle>
          <ToneMessageGrid>
            {messages.map((msg) => (
              <ToneMessageCard
                key={msg.id}
                selected={selectedMessage === msg.id}
                onClick={() => setSelectedMessage(msg.id)}
              >
                <ToneHeader>
                  <ToneIcon className={`fas ${msg.icon}`}></ToneIcon>
                  <ToneInfo>
                    <ToneName>{msg.toneLabel}</ToneName>
                    <ToneSubtitle>{msg.toneSubtitle}</ToneSubtitle>
                  </ToneInfo>
                </ToneHeader>
                <MessageContent>{msg.content}</MessageContent>
                <MessageMeta>
                  <span>{msg.charCount}자</span>
                  <span>예상 전환율: {msg.conversion}</span>
                </MessageMeta>
              </ToneMessageCard>
            ))}
          </ToneMessageGrid>
        </StepContent>

        {/* Navigation Buttons */}
        <ButtonGroup>
          {currentStep > 1 && (
            <SecondaryButton onClick={handlePrev}>
              <i
                className="fas fa-arrow-left"
                style={{ marginRight: "0.5rem" }}
              ></i>
              이전
            </SecondaryButton>
          )}
          {currentStep < 4 ? (
            <PrimaryButton onClick={handleNext} disabled={!canProceed()}>
              다음
              <i
                className="fas fa-arrow-right"
                style={{ marginLeft: "0.5rem" }}
              ></i>
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSend} disabled={!canProceed()}>
              <i
                className="fas fa-paper-plane"
                style={{ marginRight: "0.5rem" }}
              ></i>
              발송하기
            </PrimaryButton>
          )}
        </ButtonGroup>
      </Container>
    </Layout>
  );
};

export default UserMsgSeg;
