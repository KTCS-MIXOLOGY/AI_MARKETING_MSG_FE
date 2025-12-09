import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { customersAPI, toneMannerAPI, campaignsAPI, productsAPI, messagesAPI } from "../services/api";

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

// Customer Search Box
const CustomerSearchBox = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
`;

const SearchInputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SearchTypeSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #e60012;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;

  &:focus {
    outline: none;
    border-color: #e60012;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #e60012;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #b8000e;
  }

  i {
    margin-right: 0.5rem;
  }
`;

const CustomerInfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #e60012;
  display: ${(props) => (props.show ? "block" : "none")};
  animation: ${(props) => (props.show ? "fadeIn 0.3s ease" : "none")};
`;

const CustomerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CustomerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e60012 0%, #b8000e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const CustomerMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  gap: 1rem;
`;

const CustomerStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e60012;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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

// Category Grid (UserProducts.js 스타일 참고)
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const CategoryCardStyled = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 2px solid #e5e7eb;
  min-height: 160px;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%);
  }
`;

const CategoryIconBox = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 14px;
  background: #fff4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e60012;
  box-shadow: 0 6px 18px rgba(230, 0, 18, 0.2);
  margin: 0 auto 0.75rem;

  i {
    font-size: 1.4rem;
  }
`;

const CategoryName = styled.h3`
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.3rem;
`;

const CategoryCount = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0;
`;

const BackToCategoriesButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.75rem;
  color: #6b7280;
  font-size: 1.5rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: #e60012;
  }

  i {
    font-size: 1.5rem;
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

const UserMsgIndiv = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Customer search
  const [searchType, setSearchType] = useState("PHONE");
  const [searchValue, setSearchValue] = useState("");
  const [customerFound, setCustomerFound] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

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

  // Product Category View State
  const [selectedProductCategory, setSelectedProductCategory] = useState(null); // null이면 카테고리 선택 화면

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selections
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedTones, setSelectedTones] = useState([]); // 선택된 톤 목록 (최대 3개)
  const [selectedMessage, setSelectedMessage] = useState(null);

  const steps = [
    { num: 1, title: "고객 검색" },
    { num: 2, title: "캠페인 선택" },
    { num: 3, title: "상품 선택" },
    { num: 4, title: "톤 선택" },
    { num: 5, title: "메시지 생성 및 선택" },
  ];

  // Tone & Manner 데이터 로드 (Step 4 진입 시)
  useEffect(() => {
    const fetchToneManners = async () => {
      // Step 4에 진입했고, 아직 데이터를 로드하지 않은 경우에만 호출
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

          console.log("로드된 상품 데이터:", mappedProducts);
          console.log("카테고리 목록:", Array.from(new Set(mappedProducts.map(p => p.category))));

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

  // 상품 필터링 (선택된 카테고리 기반)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 선택된 카테고리가 있으면 해당 카테고리만 표시
      const categoryMatch = selectedProductCategory
        ? product.category === selectedProductCategory
        : (productCategoryFilter === "all" || product.category === productCategoryFilter);

      const searchMatch = productSearchTerm === "" ||
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(productSearchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, selectedProductCategory, productCategoryFilter, productSearchTerm]);

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

  // 카테고리 아이콘 매핑 (UserProducts.js와 동일)
  const getCategoryIcon = (category) => {
    const iconMap = {
      모바일: "fa-mobile-alt",
      충전식: "fa-battery-three-quarters",
      인터넷: "fa-wifi",
      TV: "fa-tv",
      집전화: "fa-phone",
      "인터넷+TV 결합": "fa-link",
      "안심 서비스": "fa-shield-alt",
      생활편의: "fa-home",
      "TV 다시보기": "fa-history",
      "영화/시리즈": "fa-film",
      "키즈/에듀": "fa-child",
      "스포츠/라이프": "fa-futbol",
      데이터: "fa-database",
      "OTT / 미디어": "fa-play-circle",
      통화편의: "fa-phone-volume",
      문자편의: "fa-sms",
      "보안/안심": "fa-lock",
      "단말케어(보험)": "fa-hospital",
      금융결제: "fa-credit-card",
    };
    return iconMap[category] || "fa-box";
  };

  // 카테고리별 상품 개수 계산
  const categoryStats = useMemo(() => {
    const stats = {};
    products.forEach((product) => {
      const category = product.category;
      if (!stats[category]) {
        stats[category] = {
          count: 0,
          icon: getCategoryIcon(category),
        };
      }
      stats[category].count += 1;
    });
    return stats;
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

  // 이름 익명화 함수 (첫 글자만 표시, 나머지는 *)
  const anonymizeName = (name) => {
    if (!name) return "";
    if (name.length === 1) return name;
    return name.charAt(0) + "*".repeat(name.length - 1);
  };

  const handleSearchCustomer = async () => {
    if (!searchValue.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    try {
      setSearchLoading(true);
      const response = await customersAPI.searchCustomers(searchType, searchValue);

      if (response.data.success && response.data.data.customers.length > 0) {
        const customer = response.data.data.customers[0];
        setCustomerInfo({
          id: customer.customerId,
          name: customer.name, // 원본 이름 저장 (API 호출용)
          displayName: anonymizeName(customer.name), // 화면 표시용 익명화된 이름
          phone: customer.phoneNumber,
          email: customer.email,
          membershipLevel: customer.membershipLevel,
        });
        setCustomerFound(true);
        toast.success("고객 정보를 찾았습니다.");
      } else {
        toast.error("고객을 찾을 수 없습니다.");
        setCustomerFound(false);
        setCustomerInfo(null);
      }
    } catch (error) {
      console.error("고객 검색 실패:", error);
      toast.error("고객 검색 중 오류가 발생했습니다.");
      setCustomerFound(false);
      setCustomerInfo(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // 카테고리 선택 핸들러
  const handleCategoryClick = (category) => {
    setSelectedProductCategory(category);
    setProductCategoryFilter("all"); // 카테고리 변경 시 필터 초기화
    setCurrentPage(1);
  };

  // 카테고리 목록으로 돌아가기
  const handleBackToCategories = () => {
    setSelectedProductCategory(null);
    setProductCategoryFilter("all");
    setProductSearchTerm("");
    setCurrentPage(1);
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
      // Step 4에서 Step 5로 이동 시 메시지 생성 API 호출
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
    if (!customerInfo || !selectedCampaign || selectedProducts.length === 0 || selectedTones.length === 0) {
      return;
    }

    try {
      setMessagesLoading(true);

      // 선택된 톤만 필터링
      const selectedToneObjects = toneManners.filter((tone) => selectedTones.includes(tone.toneId));

      // 선택된 톤에 대해서만 메시지 생성 (첫 번째 선택된 상품 사용)
      const messagePromises = selectedToneObjects.map(async (tone) => {
        const requestData = {
          customerId: customerInfo.id,
          campaignId: selectedCampaign,
          productId: selectedProducts[0], // 첫 번째 선택 상품 사용
          toneId: tone.toneId,
          additionalContext: `${selectedProducts.length}개 상품 선택됨`,
        };

        const response = await messagesAPI.generateIndividualMessage(requestData);

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
              conversion: `${(15 + Math.random() * 10).toFixed(1)}%`, // Mock conversion
            })),
          };
        }
        return null;
      });

      const messages = await Promise.all(messagePromises);
      const validMessages = messages.filter((msg) => msg !== null);
      setGeneratedMessages(validMessages);

      if (validMessages.length === 0) {
        toast.error("메시지 생성에 실패했습니다. 백엔드 서버의 /executor/messages/generate/individual API를 확인해주세요.");
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
    if (currentStep === 1) return customerFound;
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
                className="fas fa-user-circle"
                style={{ marginRight: "0.5rem", color: "#E60012" }}
              ></i>
              개인 메시지 생성
            </PageTitle>
            <PageDescription>
              특정 고객을 검색하고 AI가 개인화된 1:1 메시지를 생성합니다.
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

        {/* Step 1: Customer Search */}
        <StepContent active={currentStep === 1}>
          <SectionTitle>
            <i className="fas fa-search"></i>
            고객 검색
          </SectionTitle>
          <CustomerSearchBox>
            <SearchInputGroup>
              <SearchTypeSelect
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="PHONE">전화번호</option>
                <option value="ID">고객 ID</option>
                <option value="NAME">이름</option>
              </SearchTypeSelect>
              <SearchInput
                type="text"
                placeholder={
                  searchType === "PHONE"
                    ? "전화번호를 입력하세요 (예: 010-1234-5678)"
                    : searchType === "ID"
                    ? "고객 ID를 입력하세요 (예: CUST001)"
                    : "고객 이름을 입력하세요"
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchCustomer();
                  }
                }}
              />
              <SearchButton onClick={handleSearchCustomer} disabled={searchLoading}>
                <i className="fas fa-search"></i>
                {searchLoading ? "검색 중..." : "검색"}
              </SearchButton>
            </SearchInputGroup>

            <CustomerInfoCard show={customerFound}>
              {customerInfo && (
                <>
                  <CustomerHeader>
                    <CustomerAvatar>
                      {customerInfo.displayName ? customerInfo.displayName.charAt(0) : customerInfo.name.charAt(0)}
                    </CustomerAvatar>
                    <CustomerDetails>
                      <CustomerName>{customerInfo.displayName || customerInfo.name}</CustomerName>
                      <CustomerMeta>
                        <span>
                          <i className="fas fa-phone"></i> {customerInfo.phone}
                        </span>
                        <span>
                          <i className="fas fa-envelope"></i>{" "}
                          {customerInfo.email}
                        </span>
                      </CustomerMeta>
                    </CustomerDetails>
                  </CustomerHeader>

                  <CustomerStats>
                    <StatItem>
                      <StatValue>{customerInfo.id}</StatValue>
                      <StatLabel>고객 ID</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>{customerInfo.membershipLevel}</StatValue>
                      <StatLabel>멤버십 등급</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>
                        <i className="fas fa-check-circle" style={{ color: "#10b981" }}></i>
                      </StatValue>
                      <StatLabel>확인됨</StatLabel>
                    </StatItem>
                  </CustomerStats>
                </>
              )}
            </CustomerInfoCard>
          </CustomerSearchBox>
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
            {selectedProductCategory && (
              <BackToCategoriesButton onClick={handleBackToCategories}>
                <i className="fas fa-arrow-left"></i>
              </BackToCategoriesButton>
            )}
            <i className="fas fa-box"></i>
            {selectedProductCategory ? `${selectedProductCategory} 상품 선택 (최대 3개)` : '상품 카테고리 선택'}
          </SectionTitle>

          {!selectedProductCategory ? (
            /* 카테고리 선택 화면 */
            <CategoryGrid>
              {productCategories.map((category) => (
                <CategoryCardStyled
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div>
                    <CategoryIconBox>
                      <i className={`fas ${categoryStats[category]?.icon || "fa-box"}`} />
                    </CategoryIconBox>
                    <CategoryName>{category}</CategoryName>
                    <CategoryCount>
                      {categoryStats[category]?.count || 0}개 상품
                    </CategoryCount>
                  </div>

                  <div style={{ textAlign: "center", padding: "0.5rem 0", borderTop: "1px solid #e5e7eb", marginTop: "0.5rem" }}>
                    <i className="fas fa-arrow-right" style={{ color: "#e60012", fontSize: "0.9rem" }}></i>
                  </div>
                </CategoryCardStyled>
              ))}
            </CategoryGrid>
          ) : (
            /* 상품 목록 화면 */
            <>
              <FilterBar>
                <FilterSelect
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5개씩 보기</option>
                  <option value={10}>10개씩 보기</option>
                  <option value={20}>20개씩 보기</option>
                  <option value={50}>50개씩 보기</option>
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
            </>
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
                          {/* <span>예상 전환율: {version.conversion}</span> */}
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

export default UserMsgIndiv;
