import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import Loading from "../components/common/Loading";
import { productsAPI } from "../services/api";

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

/* 상단 제목 */

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
`;

/* 필터 바 */

const FilterBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  flex-wrap: wrap;
`;
const RightGroup  = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  min-width: 180px;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #374151;
  background-color: #ffffff;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 10px 6px;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

/* 카드 그리드 */

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem 1.5rem 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  ${(props) =>
    props.onClick &&
    `
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(230, 0, 18, 0.15);
      border-color: #e60012;
    }
  `}
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #fff4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e60012;
  box-shadow: 0 6px 18px rgba(230, 0, 18, 0.2);

  i {
    font-size: 1.2rem;
  }
`;

const StockBadge = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: ${(props) => {
    if (props.status === "IN_STOCK") return "#d1fae5";
    if (props.status === "LIMITED") return "#fef3c7";
    if (props.status === "OUT_OF_STOCK") return "#fee2e2";
    return "#f3f4f6";
  }};
  color: ${(props) => {
    if (props.status === "IN_STOCK") return "#065f46";
    if (props.status === "LIMITED") return "#92400e";
    if (props.status === "OUT_OF_STOCK") return "#991b1b";
    return "#374151";
  }};
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
`;

const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const PriceText = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: #e60012;
`;

const DiscountBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: #fee2e2;
  color: #b91c1c;
`;

const BenefitList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const BenefitTag = styled.span`
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: #f3f4f6;
  color: #4b5563;
`;

/* 카드 하단 버튼 */

const CardBottomRow = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const InfoText = styled.span`
  margin-top: 0.8rem;
  font-size: 0.8rem;
  color: #9ca3af;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.i`
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 10px;
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

const SearchButton = styled.button`
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  border: none;
  background: #4b5563;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #374151;
  }

  i {
    font-size: 0.875rem;
  }
`;

const NewProductButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: #e60012;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.15s ease;

  &:hover {
    background: #b8000e;
  }

  i {
    font-size: 0.875rem;
  }
`;

const CategoryCardStyled = styled(ProductCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 2px solid #e5e7eb;
  min-height: 160px;
  justify-content: space-between;
  padding: 1rem;

  &:hover {
    background: linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%);
  }
`;

const CategoryIconBox = styled(IconBox)`
  width: 45px;
  height: 45px;
  margin: 0 auto 0.75rem;

  i {
    font-size: 1.4rem;
  }
`;

const CategoryName = styled(CardTitle)`
  text-align: center;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
`;

const CategoryCount = styled(CardSubtitle)`
  text-align: center;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0;
`;

/* 모달 스타일 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  width: 640px;
  max-width: 90vw;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
  color: #9ca3af;

  &:hover {
    color: #4b5563;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem 2rem 2rem;
  overflow-y: auto;
`;

const FormRow = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #374151;
`;

const RequiredMark = styled.span`
  color: #e60012;
  margin-left: 0.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #111827;
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

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 10px 6px;
  cursor: pointer;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

const ModalSubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 8px;
  border: none;
  background: #e60012;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #b8000e;
  }

  i {
    margin-right: 0.5rem;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.variant === "danger" ? "#ef4444" : "#d1d5db")};
  background: ${(props) => (props.variant === "danger" ? "#ef4444" : "#ffffff")};
  color: ${(props) => (props.variant === "danger" ? "#ffffff" : "#4b5563")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => (props.variant === "danger" ? "#dc2626" : "#f9fafb")};
    border-color: ${(props) => (props.variant === "danger" ? "#dc2626" : "#9ca3af")};
  }

  i {
    margin-right: 0.375rem;
  }
`;

// Backend StockStatus 매핑
const STOCK_STATUS_MAP = {
  IN_STOCK: "재고 있음",
  OUT_OF_STOCK: "품절",
  LIMITED: "한정 수량",
};

// 아이콘 매핑 (카테고리별)
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

const AdminProducts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // null이면 카테고리 선택 화면
  const [stockFilter, setStockFilter] = useState("all");

  // 상품 목록 상태
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 검색 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountRate: "",
    benefits: "",
    stockStatus: "IN_STOCK",
  });

  // 초기 로드 시 전체 상품 조회
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts({
        page: 0,
        size: 1000,
      });

      if (response.data && response.data.success) {
        const pageData = response.data.data;
        const productList = pageData.content || [];

        const mappedProducts = productList.map((product) => ({
          id: product.productId,
          name: product.name,
          category: product.category || "기타",
          stockStatus: product.stockStatus,
          price: parseFloat(product.price) || 0,
          discountPercent: parseFloat(product.discountRate) || 0,
          benefits: product.benefits || "",
          icon: getCategoryIcon(product.category),
        }));

        setAllProducts(mappedProducts);
      }
    } catch (error) {
      console.error("상품 조회 실패:", error);
      const errorMessage =
        error.response?.data?.message || "상품 목록을 불러오는데 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      discountRate: "",
      benefits: "",
      stockStatus: "IN_STOCK",
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    // 선택된 카테고리가 있으면 자동으로 설정
    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        category: selectedCategory,
      }));
    }
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "",
      price: product.price.toString(),
      discountRate: product.discountPercent.toString(),
      benefits: product.benefits || "",
      stockStatus: product.stockStatus || "IN_STOCK",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const product = allProducts.find((p) => p.id === id);

    if (!product) {
      toast.error("상품을 찾을 수 없습니다.");
      return;
    }

    // OUT_OF_STOCK 상태만 삭제 가능
    if (product.stockStatus !== "OUT_OF_STOCK") {
      toast.error("품절 상태인 상품만 삭제할 수 있습니다. 먼저 품절로 변경해주세요.");
      return;
    }

    if (!window.confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await productsAPI.deleteProduct(id);

      if (response.data && response.data.success) {
        toast.success("상품이 삭제되었습니다.");
        fetchProducts();
      }
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      const errorMessage = error.response?.data?.message || "상품 삭제에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      // Backend API 형식으로 데이터 준비
      const productData = {
        name: formData.name,
        category: formData.category || null,
        price: parseFloat(formData.price),
        discountRate: formData.discountRate ? parseFloat(formData.discountRate) : 0,
        benefits: formData.benefits || null,
        stockStatus: formData.stockStatus,
      };

      if (editingProduct) {
        // 상품 수정
        const response = await productsAPI.updateProduct(editingProduct.id, productData);

        if (response.data && response.data.success) {
          toast.success("상품이 수정되었습니다.");
          fetchProducts();
        }
      } else {
        // 상품 생성
        const response = await productsAPI.createProduct(productData);

        if (response.data && response.data.success) {
          toast.success("상품이 생성되었습니다.");
          fetchProducts();
        }
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("상품 저장 실패:", error);
      const errorMessage = error.response?.data?.message || "상품 저장에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  const getStockStatusText = (status) => {
    return STOCK_STATUS_MAP[status] || status;
  };

  // 카테고리별 상품 개수 계산
  const categoryStats = useMemo(() => {
    const stats = {};
    allProducts.forEach((product) => {
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
  }, [allProducts]);

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  // 필터링 - 선택된 카테고리 또는 검색 모드의 상품 표시
  const filteredProducts = useMemo(() => {
    if (isSearchMode) {
      // 검색 모드: 재고 필터만 적용
      return allProducts.filter((product) => {
        const stockOk =
          stockFilter === "all" ? true : product.stockStatus === stockFilter;
        return stockOk;
      });
    }

    if (!selectedCategory) return [];

    // 카테고리 모드: 카테고리 + 재고 필터 적용
    return allProducts.filter((product) => {
      const catOk = product.category === selectedCategory;
      const stockOk =
        stockFilter === "all" ? true : product.stockStatus === stockFilter;
      return catOk && stockOk;
    });
  }, [allProducts, selectedCategory, stockFilter, isSearchMode]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setStockFilter("all"); // 카테고리 변경 시 재고 필터 초기화
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setStockFilter("all");
    setIsSearchMode(false);
    setSearchKeyword("");
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const response = await productsAPI.searchProducts(searchKeyword.trim(), {
        page: 0,
        size: 1000,
      });

      if (response.data && response.data.success) {
        const pageData = response.data.data;
        const productList = pageData.content || [];

        let mappedProducts = productList.map((product) => ({
          id: product.productId,
          name: product.name,
          category: product.category || "기타",
          stockStatus: product.stockStatus,
          price: parseFloat(product.price) || 0,
          discountPercent: parseFloat(product.discountRate) || 0,
          benefits: product.benefits || "",
          icon: getCategoryIcon(product.category),
        }));

        // 카테고리가 선택된 경우 해당 카테고리 내에서만 필터링
        if (selectedCategory) {
          mappedProducts = mappedProducts.filter(
            (product) => product.category === selectedCategory
          );
        }

        setAllProducts(mappedProducts);
        setIsSearchMode(true);

        if (mappedProducts.length === 0) {
          toast.info(
            selectedCategory
              ? `${selectedCategory} 카테고리에서 검색 결과가 없습니다.`
              : "검색 결과가 없습니다."
          );
        } else {
          toast.success(`${mappedProducts.length}개의 상품을 찾았습니다.`);
        }
      }
    } catch (error) {
      console.error("상품 검색 실패:", error);
      const errorMessage =
        error.response?.data?.message || "상품 검색에 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsSearchMode(false);
    fetchProducts();
  };

  const openDetailModal = async (product) => {
    try {
      setLoading(true);
      // 상세 정보 API 호출
      const response = await productsAPI.getProduct(product.id);

      if (response.data && response.data.success) {
        const productDetail = response.data.data;

        // 상세 정보로 업데이트
        const detailedProduct = {
          id: productDetail.productId,
          name: productDetail.name,
          category: productDetail.category || "기타",
          stockStatus: productDetail.stockStatus,
          price: parseFloat(productDetail.price) || 0,
          discountPercent: parseFloat(productDetail.discountRate) || 0,
          benefits: productDetail.benefits || "",
          icon: getCategoryIcon(productDetail.category),
        };

        setSelectedProduct(detailedProduct);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("상품 상세 조회 실패:", error);
      const errorMessage =
        error.response?.data?.message || "상품 상세 정보를 불러오는데 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setIsDetailModalOpen(false);
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="products"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <PageTitle>
            {selectedCategory || isSearchMode ? (
              <>
                <button
                  onClick={handleBackToCategories}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "0.75rem",
                    color: "#6b7280",
                    fontSize: "1.5rem",
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                {isSearchMode ? `검색 결과: "${searchKeyword}"` : `${selectedCategory} 상품`}
              </>
            ) : (
              "상품 관리"
            )}
          </PageTitle>
        </PageHeader>

        {loading ? (
          <Loading />
        ) : selectedCategory || isSearchMode ? (
          <>
            {/* 상품 목록 화면 */}
            <FilterBar>
              <LeftGroup>
                <SearchBox>
                  <SearchInput
                    type="text"
                    placeholder={
                      selectedCategory
                        ? `${selectedCategory} 카테고리에서 검색...`
                        : "상품명으로 검색..."
                    }
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <SearchButton onClick={handleSearch}>
                    <i className="fas fa-search"></i>
                    검색
                  </SearchButton>
                  {isSearchMode && (
                    <SearchButton onClick={handleClearSearch} style={{ background: "#6b7280" }}>
                      <i className="fas fa-times"></i>
                      초기화
                    </SearchButton>
                  )}
                </SearchBox>
              </LeftGroup>
              <RightGroup>
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="all">전체 재고</option>
                  <option value="IN_STOCK">{STOCK_STATUS_MAP.IN_STOCK}</option>
                  <option value="OUT_OF_STOCK">{STOCK_STATUS_MAP.OUT_OF_STOCK}</option>
                  <option value="LIMITED">{STOCK_STATUS_MAP.LIMITED}</option>
                </Select>
                <NewProductButton onClick={openCreateModal}>
                  <i className="fas fa-plus"></i>상품 생성
                </NewProductButton>
              </RightGroup>
            </FilterBar>

            {filteredProducts.length > 0 ? (
              <ProductGrid>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id}>
                    <CardTopRow>
                      <IconBox>
                        <i className={`fas ${product.icon}`} />
                      </IconBox>
                      <StockBadge status={product.stockStatus}>
                        {getStockStatusText(product.stockStatus)}
                      </StockBadge>
                    </CardTopRow>

                    <CardTitle
                      onClick={() => openDetailModal(product)}
                      style={{ cursor: "pointer", color: "#111827" }}
                      onMouseEnter={(e) => (e.target.style.color = "#e60012")}
                      onMouseLeave={(e) => (e.target.style.color = "#111827")}
                    >
                      {product.name}
                    </CardTitle>
                    <CardSubtitle>{product.category}</CardSubtitle>

                    <PriceRow>
                      <PriceText>
                        ₩{product.price.toLocaleString("ko-KR")}
                      </PriceText>
                      <DiscountBadge>{product.discountPercent}% 할인</DiscountBadge>
                    </PriceRow>

                    <BenefitList>
                      {product.benefits && product.benefits.split(",").map((b, idx) => (
                        <BenefitTag key={idx}>{b.trim()}</BenefitTag>
                      ))}
                    </BenefitList>

                    <CardActions>
                      <ActionButton onClick={() => openEditModal(product)}>
                        <i className="fas fa-pen"></i>수정
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        <i className="fas fa-trash"></i>삭제
                      </ActionButton>
                    </CardActions>
                  </ProductCard>
                ))}
              </ProductGrid>
            ) : (
              <EmptyState>
                <EmptyIcon className="fas fa-search" />
                <EmptyText>조건에 맞는 상품이 없습니다.</EmptyText>
              </EmptyState>
            )}
          </>
        ) : (
          <>
            {/* 카테고리 선택 화면 */}
            <CategoryGrid>
              {categories.map((category) => (
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

            {categories.length === 0 && (
              <EmptyState>
                <EmptyIcon className="fas fa-box-open" />
                <EmptyText>등록된 상품이 없습니다.</EmptyText>
              </EmptyState>
            )}
          </>
        )}
      </Container>

      {/* 상품 상세 모달 */}
      {isDetailModalOpen && selectedProduct && (
        <ModalOverlay onClick={closeDetailModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>상품 상세 정보</ModalTitle>
              <CloseButton type="button" onClick={closeDetailModal}>
                &times;
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                <IconBox style={{ marginRight: "1rem" }}>
                  <i className={`fas ${selectedProduct.icon}`} />
                </IconBox>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.5rem", fontWeight: "700", color: "#111827" }}>
                    {selectedProduct.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                    {selectedProduct.category}
                  </p>
                </div>
                <span
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    background: selectedProduct.stockStatus === "IN_STOCK" ? "#d1fae5" : selectedProduct.stockStatus === "LIMITED" ? "#fef3c7" : "#fee2e2",
                    color: selectedProduct.stockStatus === "IN_STOCK" ? "#065f46" : selectedProduct.stockStatus === "LIMITED" ? "#92400e" : "#991b1b",
                  }}
                >
                  {getStockStatusText(selectedProduct.stockStatus)}
                </span>
              </div>

              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
                <FormRow>
                  <Label>가격 정보</Label>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "800", color: "#e60012" }}>
                      ₩{selectedProduct.price.toLocaleString("ko-KR")}
                    </span>
                    <span
                      style={{
                        padding: "0.3rem 0.8rem",
                        borderRadius: "999px",
                        fontSize: "0.875rem",
                        fontWeight: "700",
                        background: "#fee2e2",
                        color: "#b91c1c",
                      }}
                    >
                      {selectedProduct.discountPercent}% 할인
                    </span>
                  </div>
                </FormRow>

                {selectedProduct.benefits && (
                  <FormRow>
                    <Label>혜택 내용</Label>
                    <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {selectedProduct.benefits.split(",").map((benefit, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            fontSize: "0.975rem",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            width: "100%"
                          }}
                        >
                          {benefit.trim()}
                        </span>
                      ))}
                    </div>
                  </FormRow>
                )}

                <FormRow style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => {
                      closeDetailModal();
                      openEditModal(selectedProduct);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#374151",
                      fontSize: "0.9375rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#f9fafb";
                      e.target.style.borderColor = "#9ca3af";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#ffffff";
                      e.target.style.borderColor = "#d1d5db";
                    }}
                  >
                    <i className="fas fa-pen" style={{ marginRight: "0.5rem" }}></i>
                    수정
                  </button>
                  <button
                    onClick={() => {
                      closeDetailModal();
                      handleDelete(selectedProduct.id);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "1px solid #ef4444",
                      background: "#ef4444",
                      color: "#ffffff",
                      fontSize: "0.9375rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#dc2626";
                      e.target.style.borderColor = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#ef4444";
                      e.target.style.borderColor = "#ef4444";
                    }}
                  >
                    <i className="fas fa-trash" style={{ marginRight: "0.5rem" }}></i>
                    삭제
                  </button>
                </FormRow>
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 생성/수정 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingProduct ? "상품 수정" : "새 상품 생성"}
              </ModalTitle>
              <CloseButton
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                &times;
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormRow>
                  <Label>
                    상품명<RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="상품명을 입력하세요"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </FormRow>

                <FormRow>
                  <Label>카테고리</Label>
                  <Input
                    type="text"
                    name="category"
                    placeholder="카테고리를 입력하세요"
                    value={formData.category}
                    onChange={handleFormChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>
                    가격<RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    type="number"
                    name="price"
                    placeholder="가격을 입력하세요"
                    value={formData.price}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </FormRow>

                <FormRow>
                  <Label>할인율 (%)</Label>
                  <Input
                    type="number"
                    name="discountRate"
                    placeholder="할인율을 입력하세요"
                    value={formData.discountRate}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </FormRow>

                <FormRow>
                  <Label>혜택 내용</Label>
                  <Textarea
                    name="benefits"
                    placeholder="혜택 내용을 입력하세요 (쉼표로 구분)"
                    value={formData.benefits}
                    onChange={handleFormChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>
                    재고 상태<RequiredMark>*</RequiredMark>
                  </Label>
                  <SelectField
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleFormChange}
                  >
                    <option value="IN_STOCK">재고 있음</option>
                    <option value="OUT_OF_STOCK">품절</option>
                    <option value="LIMITED">한정 수량</option>
                  </SelectField>
                </FormRow>

                <FormRow style={{ marginTop: "1.75rem" }}>
                  <ModalSubmitButton type="submit">
                    <i className={`fas ${editingProduct ? "fa-save" : "fa-plus"}`}></i>
                    {editingProduct ? "수정" : "생성"}
                  </ModalSubmitButton>
                </FormRow>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default AdminProducts;
