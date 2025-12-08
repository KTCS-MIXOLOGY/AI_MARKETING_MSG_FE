import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { segmentsAPI, toneMannerAPI, campaignsAPI, productsAPI, messagesAPI } from "../services/api";

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

// Section Title
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;

  i {
    margin-right: 0.5rem;
    color: #e60012;
  }
`;

// Filter Section for Segment
const FilterSection = styled.div`
  margin-bottom: 2rem;
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

const RangeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const RangeInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #e60012;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #e60012;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${(props) => (props.checked ? "#FEE2E2" : "white")};
  border: 1px solid ${(props) => (props.checked ? "#E60012" : "#d1d5db")};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  color: ${(props) => (props.checked ? "#E60012" : "#374151")};
  transition: all 0.2s ease;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &:hover {
    border-color: #e60012;
    background: #FEE2E2;
  }
`;

const EstimatedCount = styled.div`
  background: #e60012;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 1.125rem;

  span {
    font-size: 1.75rem;
    font-weight: 700;
    display: block;
    margin: 0.5rem 0;
  }
`;

// Filter Bar
const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  min-width: 150px;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #374151;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 300px;
`;

const FilterSearchInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #374151;
  background-color: #ffffff;
  outline: none;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }

  &::placeholder {
    color: #9ca3af;
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

// Pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: ${(props) => (props.active ? "#e60012" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #e60012;
    background: ${(props) => (props.active ? "#b8000e" : "#fee2e2")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0.5rem;
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

  // Segment Filters
  const [segmentFilter, setSegmentFilter] = useState({
    ageGroups: [], // ["ALL", "TEEN", "TWENTIES", "THIRTIES", "FORTIES", "FIFTIES", "OVER_SIXTY"]
    genders: [], // ["ALL", "MALE", "FEMALE"]
    regions: [], // ["ALL", "SEOUL", "BUSAN", "DAEGU", "INCHEON", "GWANGJU", "DAEJEON", "ULSAN", "GYEONGGI", "SEJONG", "CHUNGCHEONG", "JEOLLA", "GYEONGSANG", "JEJU"]
    membershipLevels: [], // ["ALL", "VVIP", "VIP", "GOLD", "SILVER", "WHITE", "BASIC"]
    recencyPeriods: [], // ["ALL", "BEFORE_1M", "1M_TO_6M", "6M_TO_1Y", "1Y_TO_2Y", "2Y_TO_3Y", "OVER_3Y"]
  });

  // Tone & Manner
  const [toneManners, setToneManners] = useState([]);
  const [toneLoading, setToneLoading] = useState(false);

  // Campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  // Products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Generated Messages
  const [generatedMessages, setGeneratedMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Filters
  const [campaignTypeFilter, setCampaignTypeFilter] = useState("all");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("all");
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selections
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedTones, setSelectedTones] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Estimated customer count
  const [estimatedCount, setEstimatedCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  const steps = [
    { num: 1, title: "세그먼트 선택" },
    { num: 2, title: "캠페인 선택" },
    { num: 3, title: "상품 선택" },
    { num: 4, title: "톤 선택" },
    { num: 5, title: "메시지 생성 및 선택" },
  ];

  // Tone & Manner 데이터 로드 (Step 4 진입 시)
  useEffect(() => {
    const fetchToneManners = async () => {
      if (currentStep === 4 && toneManners.length === 0 && !toneLoading) {
        try {
          setToneLoading(true);
          const response = await toneMannerAPI.getToneManners();
          if (response.data.success) {
            setToneManners(response.data.data.toneManners || []);
          }
        } catch (error) {
          console.error("Tone & Manner 데이터 로드 실패:", error);
          console.warn(
            "톤앤매너 데이터를 불러올 수 없습니다. Step 4에서 에러 메시지가 표시됩니다."
          );
        } finally {
          setToneLoading(false);
        }
      }
    };

    fetchToneManners();
  }, [currentStep, toneManners.length, toneLoading]);

  // 캠페인 데이터 로드
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setCampaignsLoading(true);
        const response = await campaignsAPI.getCampaigns();
        if (response.data.success) {
          const campaignList = response.data.data.content || [];
          setCampaigns(
            campaignList.map((campaign) => ({
              id: campaign.campaignId,
              name: campaign.name,
              description: campaign.description,
              type: campaign.type,
              status: campaign.status,
              icon: getCampaignIcon(campaign.type),
            }))
          );
        }
      } catch (error) {
        console.error("캠페인 데이터 로드 실패:", error);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // 상품 데이터 로드
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await productsAPI.getProducts({
          page: 0,
          size: 1000,
        });
        if (response.data.success) {
          const productList = response.data.data.content || [];
          const mappedProducts = productList.map((product) => ({
            id: product.productId,
            name: product.name,
            description: `${product.category || '기타'} / ${product.price ? product.price.toLocaleString() + '원' : '가격 미정'}`,
            category: product.category || '기타',
            price: product.price || 0,
            discountRate: product.discountRate,
            stockStatus: product.stockStatus,
          }));

          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("상품 데이터 로드 실패:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 세그먼트 필터 변경 시 고객 수 계산
  useEffect(() => {
    const fetchCustomerCount = async () => {
      // 필터가 하나라도 설정되어 있으면 API 호출
      const hasFilter =
        segmentFilter.ageGroups.length > 0 ||
        segmentFilter.genders.length > 0 ||
        segmentFilter.regions.length > 0 ||
        segmentFilter.membershipLevels.length > 0 ||
        segmentFilter.recencyPeriods.length > 0;

      if (!hasFilter) {
        setEstimatedCount(0);
        return;
      }

      try {
        setCountLoading(true);

        // API 요청 데이터 구성 (백엔드 형식에 맞춤)
        const requestData = {};

        // 연령대 - 백엔드는 ageRange: { min, max } 형식을 기대
        const ageGroups = segmentFilter.ageGroups.filter(g => g !== "ALL");
        if (ageGroups.length > 0) {
          // 선택된 연령대를 min/max 범위로 변환
          const ageMap = {
            TEEN: { min: 10, max: 19 },
            TWENTIES: { min: 20, max: 29 },
            THIRTIES: { min: 30, max: 39 },
            FORTIES: { min: 40, max: 49 },
            FIFTIES: { min: 50, max: 59 },
            OVER_SIXTY: { min: 60, max: 100 },
          };

          // 선택된 연령대들 중 최소/최대 범위 계산
          let minAge = 100, maxAge = 0;
          ageGroups.forEach(group => {
            if (ageMap[group]) {
              minAge = Math.min(minAge, ageMap[group].min);
              maxAge = Math.max(maxAge, ageMap[group].max);
            }
          });

          if (minAge <= maxAge) {
            requestData.ageRange = { min: minAge, max: maxAge };
          }
        }

        // 성별 - 백엔드는 gender: "MALE" 또는 "FEMALE" 단일 값을 기대
        const genders = segmentFilter.genders.filter(g => g !== "ALL");
        if (genders.length === 1) {
          // 하나만 선택된 경우
          requestData.gender = genders[0];
        } else if (genders.length > 1) {
          // 여러 개 선택된 경우 - 백엔드가 지원하지 않으므로 전송하지 않음
          // 또는 첫 번째 값만 전송
          // requestData.gender = genders[0];
        }

        // 지역 - 백엔드는 regions: ["SEOUL", "GYEONGGI"] 배열 형식을 기대
        const regions = segmentFilter.regions.filter(r => r !== "ALL");
        if (regions.length > 0) {
          requestData.regions = regions;
        }

        // 멤버십 등급 - 백엔드는 membershipLevel: "GOLD" 단일 값을 기대
        const membershipLevels = segmentFilter.membershipLevels.filter(l => l !== "ALL");
        if (membershipLevels.length === 1) {
          requestData.membershipLevel = membershipLevels[0];
        } else if (membershipLevels.length > 1) {
          // 여러 개 선택된 경우 - 첫 번째 값만 전송
          // requestData.membershipLevel = membershipLevels[0];
        }

        // 최근 구매일 - 백엔드는 recencyMaxDays: 600 숫자 값을 기대
        const recencyPeriods = segmentFilter.recencyPeriods.filter(p => p !== "ALL");
        if (recencyPeriods.length > 0) {
          // 선택된 기간을 일수로 변환
          const periodMap = {
            BEFORE_1M: 30,
            "1M_TO_6M": 180,
            "6M_TO_1Y": 365,
            "1Y_TO_2Y": 730,
            "2Y_TO_3Y": 1095,
            OVER_3Y: 3650,
          };

          // 선택된 기간들 중 최대값 사용
          let maxDays = 0;
          recencyPeriods.forEach(period => {
            if (periodMap[period]) {
              maxDays = Math.max(maxDays, periodMap[period]);
            }
          });

          if (maxDays > 0) {
            requestData.recencyMaxDays = maxDays;
          }
        }

        console.log("고객 수 계산 API 요청 데이터:", requestData);
        console.log("원본 segmentFilter:", segmentFilter);

        const response = await segmentsAPI.getSegmentCustomerCount(requestData);
        console.log("고객 수 계산 API 응답:", response.data);

        if (response.data.success) {
          const count = response.data.data.totalCount || 0;
          console.log("설정될 예상 타겟 수:", count);
          setEstimatedCount(count);
        } else {
          console.error("API 응답 실패:", response.data);
          setEstimatedCount(0);
        }
      } catch (error) {
        console.error("고객 수 계산 실패:", error);
        console.error("에러 상세:", error.response?.data);
        toast.error("고객 수 계산 중 오류가 발생했습니다.");
        setEstimatedCount(0);
      } finally {
        setCountLoading(false);
      }
    };

    fetchCustomerCount();
  }, [segmentFilter]);

  // 캠페인 타입에 따른 아이콘 반환
  const getCampaignIcon = (type) => {
    const iconMap = {
      업셀링: "fa-arrow-up",
      크로스셀: "fa-exchange-alt",
      유지: "fa-user-check",
      신규가입: "fa-gift",
      프로모션: "fa-bullhorn",
    };
    return iconMap[type] || "fa-bullhorn";
  };

  // 캠페인 필터링
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const typeMatch = campaignTypeFilter === "all" || campaign.type === campaignTypeFilter;
      const statusMatch = campaignStatusFilter === "all" || campaign.status === campaignStatusFilter;
      const searchMatch = campaignSearchTerm === "" ||
        campaign.name.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(campaignSearchTerm.toLowerCase());
      return typeMatch && statusMatch && searchMatch;
    });
  }, [campaigns, campaignTypeFilter, campaignStatusFilter, campaignSearchTerm]);

  // 상품 필터링
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = productCategoryFilter === "all" || product.category === productCategoryFilter;
      const searchMatch = productSearchTerm === "" ||
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(productSearchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, productCategoryFilter, productSearchTerm]);

  // 캠페인 타입 목록
  const campaignTypes = useMemo(() => {
    return Array.from(new Set(campaigns.map((c) => c.type).filter(Boolean)));
  }, [campaigns]);

  // 캠페인 상태 목록
  const campaignStatuses = useMemo(() => {
    return Array.from(new Set(campaigns.map((c) => c.status).filter(Boolean)));
  }, [campaigns]);

  // 상품 카테고리 목록
  const productCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  }, [products]);

  // 페이지네이션된 상품 목록
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // 총 페이지 수
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // 필터 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [productCategoryFilter, productSearchTerm]);

  // 체크박스 토글 핸들러
  const handleAgeGroupToggle = (ageGroup) => {
    setSegmentFilter((prev) => {
      let ageGroups = [...prev.ageGroups];
      if (ageGroup === "ALL") {
        ageGroups = ageGroups.includes("ALL") ? [] : ["ALL"];
      } else {
        ageGroups = ageGroups.filter(g => g !== "ALL");
        if (ageGroups.includes(ageGroup)) {
          ageGroups = ageGroups.filter((g) => g !== ageGroup);
        } else {
          ageGroups.push(ageGroup);
        }
      }
      return { ...prev, ageGroups };
    });
  };

  const handleGenderToggle = (gender) => {
    setSegmentFilter((prev) => {
      let genders = [...prev.genders];
      if (gender === "ALL") {
        genders = genders.includes("ALL") ? [] : ["ALL"];
      } else {
        genders = genders.filter(g => g !== "ALL");
        if (genders.includes(gender)) {
          genders = genders.filter((g) => g !== gender);
        } else {
          genders.push(gender);
        }
      }
      return { ...prev, genders };
    });
  };

  const handleRegionToggle = (region) => {
    setSegmentFilter((prev) => {
      let regions = [...prev.regions];
      if (region === "ALL") {
        regions = regions.includes("ALL") ? [] : ["ALL"];
      } else {
        regions = regions.filter(r => r !== "ALL");
        if (regions.includes(region)) {
          regions = regions.filter((r) => r !== region);
        } else {
          regions.push(region);
        }
      }
      return { ...prev, regions };
    });
  };

  const handleMembershipLevelToggle = (level) => {
    setSegmentFilter((prev) => {
      let membershipLevels = [...prev.membershipLevels];
      if (level === "ALL") {
        membershipLevels = membershipLevels.includes("ALL") ? [] : ["ALL"];
      } else {
        membershipLevels = membershipLevels.filter(l => l !== "ALL");
        if (membershipLevels.includes(level)) {
          membershipLevels = membershipLevels.filter((l) => l !== level);
        } else {
          membershipLevels.push(level);
        }
      }
      return { ...prev, membershipLevels };
    });
  };

  const handleRecencyPeriodToggle = (period) => {
    setSegmentFilter((prev) => {
      let recencyPeriods = [...prev.recencyPeriods];
      if (period === "ALL") {
        recencyPeriods = recencyPeriods.includes("ALL") ? [] : ["ALL"];
      } else {
        recencyPeriods = recencyPeriods.filter(p => p !== "ALL");
        if (recencyPeriods.includes(period)) {
          recencyPeriods = recencyPeriods.filter((p) => p !== period);
        } else {
          recencyPeriods.push(period);
        }
      }
      return { ...prev, recencyPeriods };
    });
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 3) {
          toast.warning("최대 3개까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, productId];
      }
    });
  };

  const handleToneToggle = (toneId) => {
    setSelectedTones((prev) => {
      if (prev.includes(toneId)) {
        return prev.filter((id) => id !== toneId);
      } else {
        if (prev.length >= 3) {
          toast.warning("최대 3개까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, toneId];
      }
    });
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      if (currentStep === 4) {
        // 로딩 시작하고 Step 5로 이동
        setCurrentStep(currentStep + 1);
        await generateMessages();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // AI 메시지 생성
  const generateMessages = async () => {
    if (!selectedCampaign || selectedProducts.length === 0 || selectedTones.length === 0) {
      return;
    }

    try {
      setMessagesLoading(true);

      // 선택된 톤만 필터링
      const selectedToneObjects = toneManners.filter((tone) => selectedTones.includes(tone.toneId));

      // API 요청 데이터 구성 (백엔드 형식에 맞춤)
      const segmentFilterData = {};

      // 연령대 - 백엔드는 ageRange: { min, max } 형식을 기대
      const ageGroups = segmentFilter.ageGroups.filter(g => g !== "ALL");
      if (ageGroups.length > 0) {
        const ageMap = {
          TEEN: { min: 10, max: 19 },
          TWENTIES: { min: 20, max: 29 },
          THIRTIES: { min: 30, max: 39 },
          FORTIES: { min: 40, max: 49 },
          FIFTIES: { min: 50, max: 59 },
          OVER_SIXTY: { min: 60, max: 100 },
        };

        let minAge = 100, maxAge = 0;
        ageGroups.forEach(group => {
          if (ageMap[group]) {
            minAge = Math.min(minAge, ageMap[group].min);
            maxAge = Math.max(maxAge, ageMap[group].max);
          }
        });

        if (minAge <= maxAge) {
          segmentFilterData.ageRange = { min: minAge, max: maxAge };
        }
      }

      // 성별 - 백엔드는 gender: "MALE" 또는 "FEMALE" 단일 값을 기대
      const genders = segmentFilter.genders.filter(g => g !== "ALL");
      if (genders.length === 1) {
        segmentFilterData.gender = genders[0];
      }

      // 지역 - 백엔드는 regions: ["SEOUL", "GYEONGGI"] 배열 형식을 기대
      const regions = segmentFilter.regions.filter(r => r !== "ALL");
      if (regions.length > 0) {
        segmentFilterData.regions = regions;
      }

      // 멤버십 등급 - 백엔드는 membershipLevel: "GOLD" 단일 값을 기대
      const membershipLevels = segmentFilter.membershipLevels.filter(l => l !== "ALL");
      if (membershipLevels.length === 1) {
        segmentFilterData.membershipLevel = membershipLevels[0];
      }

      // 최근 구매일 - 백엔드는 recencyMaxDays: 600 숫자 값을 기대
      const recencyPeriods = segmentFilter.recencyPeriods.filter(p => p !== "ALL");
      if (recencyPeriods.length > 0) {
        const periodMap = {
          BEFORE_1M: 30,
          "1M_TO_6M": 180,
          "6M_TO_1Y": 365,
          "1Y_TO_2Y": 730,
          "2Y_TO_3Y": 1095,
          OVER_3Y: 3650,
        };

        let maxDays = 0;
        recencyPeriods.forEach(period => {
          if (periodMap[period]) {
            maxDays = Math.max(maxDays, periodMap[period]);
          }
        });

        if (maxDays > 0) {
          segmentFilterData.recencyMaxDays = maxDays;
        }
      }

      // 선택된 톤에 대해서만 메시지 생성 (첫 번째 선택된 상품 사용)
      const messagePromises = selectedToneObjects.map(async (tone) => {
        const requestData = {
          segmentFilter: segmentFilterData,
          campaignId: selectedCampaign,
          productId: selectedProducts[0], // 첫 번째 선택 상품 사용
          toneId: tone.toneId,
          additionalContext: `${selectedProducts.length}개 상품 선택됨`,
        };

        const response = await messagesAPI.generateSegmentMessage(requestData);

        if (response.data.success) {
          // 생성된 모든 메시지 버전(3개)을 반환
          const messages = response.data.data.messages;
          return {
            toneId: tone.toneId,
            toneName: tone.toneName,
            description: tone.description,
            icon: getIconForTone(tone.toneName),
            versions: messages.map((msg) => ({
              id: msg.messageId,
              version: msg.version,
              content: msg.content,
              charCount: msg.characterCount,
              estimatedCost: msg.estimatedCost,
            })),
          };
        }
        return null;
      });

      const messages = await Promise.all(messagePromises);
      const validMessages = messages.filter((msg) => msg !== null);
      setGeneratedMessages(validMessages);

      if (validMessages.length === 0) {
        toast.error("메시지 생성에 실패했습니다. 백엔드 서버의 /executor/messages/generate/segment API를 확인해주세요.");
      } else {
        toast.success(`${validMessages.length}개의 톤으로 메시지가 생성되었습니다.`);
      }
    } catch (error) {
      console.error("메시지 생성 실패:", error);
      toast.error(`메시지 생성 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCopyMessage = async () => {
    if (!selectedMessage) {
      toast.error("복사할 메시지를 선택해주세요.");
      return;
    }

    // 선택된 메시지 찾기
    let selectedContent = "";
    for (const toneGroup of generatedMessages) {
      const version = toneGroup.versions.find((v) => v.id === selectedMessage);
      if (version) {
        selectedContent = version.content;
        break;
      }
    }

    if (!selectedContent) {
      toast.error("선택된 메시지를 찾을 수 없습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedContent);
      toast.success("메시지가 클립보드에 복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
      toast.error("메시지 복사에 실패했습니다.");
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      // 필터가 하나라도 설정되어 있고 estimatedCount > 0
      const hasFilter =
        segmentFilter.ageGroups.length > 0 ||
        segmentFilter.genders.length > 0 ||
        segmentFilter.regions.length > 0 ||
        segmentFilter.membershipLevels.length > 0 ||
        segmentFilter.recencyPeriods.length > 0;
      return hasFilter && estimatedCount > 0;
    }
    if (currentStep === 2) return selectedCampaign !== null;
    if (currentStep === 3) return selectedProducts.length > 0;
    if (currentStep === 4) return selectedTones.length > 0;
    if (currentStep === 5) return selectedMessage !== null;
    return false;
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Tone에 맞는 아이콘 반환
  const getIconForTone = (toneName) => {
    const iconMap = {
      친근한: "fa-smile",
      공손한: "fa-user-tie",
      유머러스한: "fa-laugh",
      전문적인: "fa-briefcase",
      긴급한: "fa-bolt",
    };
    return iconMap[toneName] || "fa-comment";
  };

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
              <i className="fas fa-filter"></i>
              타겟 세그먼트 선택
            </SectionTitle>
            <FilterGrid>
              {/* Age Group */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-birthday-cake"></i>
                  연령대
                </FilterTitle>
                <CheckboxGroup>
                  {[
                    { value: "ALL", label: "전체" },
                    { value: "TEEN", label: "10대" },
                    { value: "TWENTIES", label: "20대" },
                    { value: "THIRTIES", label: "30대" },
                    { value: "FORTIES", label: "40대" },
                    { value: "FIFTIES", label: "50대" },
                    { value: "OVER_SIXTY", label: "60대 이상" },
                  ].map((age) => (
                    <CheckboxLabel
                      key={age.value}
                      checked={segmentFilter.ageGroups.includes(age.value)}
                      onClick={() => handleAgeGroupToggle(age.value)}
                    >
                      <input
                        type="checkbox"
                        checked={segmentFilter.ageGroups.includes(age.value)}
                        onChange={() => {}}
                      />
                      {age.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              {/* Gender */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-venus-mars"></i>
                  성별
                </FilterTitle>
                <CheckboxGroup>
                  {[
                    { value: "ALL", label: "전체" },
                    { value: "MALE", label: "남자" },
                    { value: "FEMALE", label: "여자" },
                  ].map((gender) => (
                    <CheckboxLabel
                      key={gender.value}
                      checked={segmentFilter.genders.includes(gender.value)}
                      onClick={() => handleGenderToggle(gender.value)}
                    >
                      <input
                        type="checkbox"
                        checked={segmentFilter.genders.includes(gender.value)}
                        onChange={() => {}}
                      />
                      {gender.label}
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
                  {[
                    { value: "ALL", label: "전체" },
                    { value: "SEOUL", label: "서울" },
                    { value: "BUSAN", label: "부산" },
                    { value: "DAEGU", label: "대구" },
                    { value: "INCHEON", label: "인천" },
                    { value: "GWANGJU", label: "광주" },
                    { value: "DAEJEON", label: "대전" },
                    { value: "ULSAN", label: "울산" },
                    { value: "GYEONGGI", label: "경기도" },
                    { value: "SEJONG", label: "세종" },
                    { value: "CHUNGCHEONG", label: "충청도" },
                    { value: "JEOLLA", label: "전라도" },
                    { value: "GYEONGSANG", label: "경상도" },
                    { value: "JEJU", label: "제주도" },
                  ].map((region) => (
                    <CheckboxLabel
                      key={region.value}
                      checked={segmentFilter.regions.includes(region.value)}
                      onClick={() => handleRegionToggle(region.value)}
                    >
                      <input
                        type="checkbox"
                        checked={segmentFilter.regions.includes(region.value)}
                        onChange={() => {}}
                      />
                      {region.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              {/* Membership Level */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-crown"></i>
                  멤버십 등급
                </FilterTitle>
                <CheckboxGroup>
                  {[
                    { value: "ALL", label: "전체" },
                    { value: "VVIP", label: "VVIP" },
                    { value: "VIP", label: "VIP" },
                    { value: "GOLD", label: "GOLD" },
                    { value: "SILVER", label: "SILVER" },
                    { value: "WHITE", label: "WHITE" },
                    { value: "BASIC", label: "BASIC" },
                  ].map((level) => (
                    <CheckboxLabel
                      key={level.value}
                      checked={segmentFilter.membershipLevels.includes(level.value)}
                      onClick={() => handleMembershipLevelToggle(level.value)}
                    >
                      <input
                        type="checkbox"
                        checked={segmentFilter.membershipLevels.includes(level.value)}
                        onChange={() => {}}
                      />
                      {level.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              {/* Recency Period */}
              <FilterGroup>
                <FilterTitle>
                  <i className="fas fa-calendar-alt"></i>
                  최근 구매일
                </FilterTitle>
                <CheckboxGroup>
                  {[
                    { value: "ALL", label: "전체" },
                    { value: "BEFORE_1M", label: "1개월 이전" },
                    { value: "1M_TO_6M", label: "1개월 이상 ~ 6개월 이전" },
                    { value: "6M_TO_1Y", label: "6개월 이상 ~ 1년 이하" },
                    { value: "1Y_TO_2Y", label: "1년 이상 ~ 2년 이하" },
                    { value: "2Y_TO_3Y", label: "2년 이상 ~ 3년 이하" },
                    { value: "OVER_3Y", label: "3년 이상" },
                  ].map((period) => (
                    <CheckboxLabel
                      key={period.value}
                      checked={segmentFilter.recencyPeriods.includes(period.value)}
                      onClick={() => handleRecencyPeriodToggle(period.value)}
                    >
                      <input
                        type="checkbox"
                        checked={segmentFilter.recencyPeriods.includes(period.value)}
                        onChange={() => {}}
                      />
                      {period.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FilterGroup>
            </FilterGrid>

            <EstimatedCount>
              {countLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> 계산 중...
                </>
              ) : (
                <>
                  예상 타겟
                  <span>{estimatedCount.toLocaleString()}</span>
                  명
                </>
              )}
            </EstimatedCount>
          </FilterSection>
        </StepContent>

        {/* Step 2: Campaign Selection */}
        <StepContent active={currentStep === 2}>
          <SectionTitle>
            <i className="fas fa-bullhorn"></i>
            캠페인 선택
          </SectionTitle>
          <FilterBar>
            <FilterSelect
              value={campaignTypeFilter}
              onChange={(e) => setCampaignTypeFilter(e.target.value)}
            >
              <option value="all">모든 타입</option>
              {campaignTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={campaignStatusFilter}
              onChange={(e) => setCampaignStatusFilter(e.target.value)}
            >
              <option value="all">모든 상태</option>
              {campaignStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </FilterSelect>
            <SearchBox>
              <FilterSearchInput
                type="text"
                placeholder="캠페인 검색..."
                value={campaignSearchTerm}
                onChange={(e) => setCampaignSearchTerm(e.target.value)}
              />
            </SearchBox>
          </FilterBar>
          <CardGrid>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
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
              ))
            ) : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                <i className="fas fa-search" style={{ fontSize: "2rem", marginBottom: "1rem", display: "block" }}></i>
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </CardGrid>
        </StepContent>

        {/* Step 3: Product Selection */}
        <StepContent active={currentStep === 3}>
          <SectionTitle>
            <i className="fas fa-box"></i>
            상품 선택 (최대 3개)
          </SectionTitle>
          <FilterBar>
            <FilterSelect
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
            >
              <option value="all">모든 카테고리</option>
              {productCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
            <SearchBox>
              <FilterSearchInput
                type="text"
                placeholder="상품 검색..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
              />
            </SearchBox>
          </FilterBar>
          <ProductList>
            {filteredProducts.length > 0 ? (
              paginatedProducts.map((product) => (
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
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                <i className="fas fa-search" style={{ fontSize: "2rem", marginBottom: "1rem", display: "block" }}></i>
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </ProductList>
          {filteredProducts.length > 0 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </PaginationButton>
              <PageInfo>
                {currentPage} / {totalPages} 페이지 (총 {filteredProducts.length}개)
              </PageInfo>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </PaginationButton>
            </PaginationContainer>
          )}
        </StepContent>

        {/* Step 4: Tone Selection */}
        <StepContent active={currentStep === 4}>
          <SectionTitle>
            <i className="fas fa-comments"></i>
            톤 선택 (최대 3개)
          </SectionTitle>
          {toneLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#E60012" }}></i>
              <p style={{ marginTop: "1rem", color: "#6b7280" }}>톤 데이터를 불러오는 중...</p>
            </div>
          ) : toneManners.length > 0 ? (
            <CardGrid>
              {toneManners.map((tone) => (
                <Card
                  key={tone.toneId}
                  selected={selectedTones.includes(tone.toneId)}
                  onClick={() => handleToneToggle(tone.toneId)}
                >
                  <CardHeader>
                    <CardIcon className={`fas ${getIconForTone(tone.toneName)}`}></CardIcon>
                  </CardHeader>
                  <CardTitle>{tone.toneName}</CardTitle>
                  <CardDescription>{tone.description}</CardDescription>
                  {selectedTones.includes(tone.toneId) && (
                    <div style={{
                      marginTop: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#E60012",
                      textAlign: "center"
                    }}>
                      ✓ 선택됨
                    </div>
                  )}
                </Card>
              ))}
            </CardGrid>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <i className="fas fa-exclamation-circle" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
              <p>톤앤매너 데이터를 불러올 수 없습니다. 백엔드 서버를 확인해주세요.</p>
            </div>
          )}
        </StepContent>

        {/* Step 5: Message Generation & Selection */}
        <StepContent active={currentStep === 5}>
          <SectionTitle>
            <i className="fas fa-magic"></i>
            메시지 생성 및 선택
          </SectionTitle>
          {messagesLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#E60012" }}></i>
              <p style={{ marginTop: "1rem", color: "#6b7280" }}>AI가 메시지를 생성하고 있습니다...</p>
            </div>
          ) : generatedMessages.length > 0 ? (
            <div>
              {generatedMessages.map((toneGroup) => (
                <div key={toneGroup.toneId} style={{ marginBottom: "2rem" }}>
                  <ToneHeader style={{ marginBottom: "1rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px" }}>
                    <ToneIcon className={`fas ${toneGroup.icon}`}></ToneIcon>
                    <ToneInfo>
                      <ToneName>{toneGroup.toneName}</ToneName>
                      <ToneSubtitle>{toneGroup.description}</ToneSubtitle>
                    </ToneInfo>
                  </ToneHeader>
                  <ToneMessageGrid>
                    {toneGroup.versions.map((version) => (
                      <ToneMessageCard
                        key={version.id}
                        selected={selectedMessage === version.id}
                        onClick={() => setSelectedMessage(version.id)}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                          paddingBottom: "0.5rem",
                          borderBottom: "1px solid #e5e7eb"
                        }}>
                          <span style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#6b7280"
                          }}>
                            버전 {version.version}
                          </span>
                          {selectedMessage === version.id && (
                            <span style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color: "#E60012",
                              background: "#FEE2E2",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px"
                            }}>
                              선택됨
                            </span>
                          )}
                        </div>
                        <MessageContent>{version.content}</MessageContent>
                        <MessageMeta>
                          <span>{version.charCount}자 </span>
                        </MessageMeta>
                      </ToneMessageCard>
                    ))}
                  </ToneMessageGrid>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <i className="fas fa-exclamation-circle" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
              <p>메시지를 생성할 수 없습니다. 이전 단계를 확인해주세요.</p>
            </div>
          )}
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
          {currentStep < 5 ? (
            <PrimaryButton onClick={handleNext} disabled={!canProceed()}>
              다음
              <i
                className="fas fa-arrow-right"
                style={{ marginLeft: "0.5rem" }}
              ></i>
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleCopyMessage} disabled={!canProceed()}>
              <i
                className="fas fa-copy"
                style={{ marginRight: "0.5rem" }}
              ></i>
              복사하기
            </PrimaryButton>
          )}
        </ButtonGroup>
      </Container>
    </Layout>
  );
};

export default UserMsgSeg;
