import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

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

const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem 1.5rem 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
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
  color: #16a34a;
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

const AdminProducts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // 카드 UI용 목업 데이터
  const products = [
    {
      id: 1,
      name: "갤럭시 S24 울트라",
      category: "단말기",
      stockStatus: "재고 있음",
      icon: "fa-mobile-alt",
      description: "최신 AI 기능 탑재 프리미엄 스마트폰",
      price: 1590000,
      discountPercent: 20,
      benefits: ["설치비 면제", "보호필름 무료", "24개월 할부 무이자"],
    },
    {
      id: 2,
      name: "5G 프리미엄 요금제",
      category: "요금제",
      stockStatus: "가입 가능",
      icon: "fa-wifi",
      description: "데이터 무제한 + 부가서비스 포함",
      price: 80000,
      discountPercent: 25,
      benefits: ["넷플릭스 6개월 무료", "유튜브 프리미엄 3개월", "통화 무제한"],
    },
    {
      id: 3,
      name: "WiFi 6 공유기",
      category: "단말기",
      stockStatus: "재고 있음",
      icon: "fa-headphones-alt",
      description: "기가 인터넷 결합 시 공유기 무상 제공",
      price: 150000,
      discountPercent: 100,
      benefits: ["무료 설치", "A/S 2년 보증", "속도 보장"],
    },
    {
      id: 4,
      name: "갤럭시 버즈2 Pro",
      category: "액세서리",
      stockStatus: "재고 있음",
      icon: "fa-headphones",
      description: "스마트폰 구매 시 특가 제공",
      price: 289000,
      discountPercent: 30,
      benefits: ["노이즈 캔슬링", "무선 충전 지원"],
    },
    {
      id: 5,
      name: "5G 라이트 요금제",
      category: "요금제",
      stockStatus: "가입 가능",
      icon: "fa-signal",
      description: "합리적인 가격의 5G 요금제",
      price: 55000,
      discountPercent: 15,
      benefits: ["데이터 20GB", "음성 300분", "문자 무제한"],
    },
  ];

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((product) => {
    const catOk =
      categoryFilter === "all" ? true : product.category === categoryFilter;
    const stockOk =
      stockFilter === "all" ? true : product.stockStatus === stockFilter;
    return catOk && stockOk;
  });

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
          <PageTitle>상품 관리</PageTitle>
        </PageHeader>

        {/* 필터 영역 */}
        <FilterBar>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">전체 재고</option>
            <option value="재고 있음">재고 있음</option>
            <option value="가입 가능">가입 가능</option>
          </Select>
        </FilterBar>

        {/* 카드 리스트 */}
        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id}>
                <CardTopRow>
                  <IconBox>
                    <i className={`fas ${product.icon}`} />
                  </IconBox>
                  <StockBadge>{product.stockStatus}</StockBadge>
                </CardTopRow>

                <CardTitle>{product.name}</CardTitle>
                <CardSubtitle>{product.description}</CardSubtitle>

                <PriceRow>
                  <PriceText>
                    ₩{product.price.toLocaleString("ko-KR")}
                  </PriceText>
                  <DiscountBadge>{product.discountPercent}% 할인</DiscountBadge>
                </PriceRow>

                <BenefitList>
                  {product.benefits.map((b) => (
                    <BenefitTag key={b}>{b}</BenefitTag>
                  ))}
                </BenefitList>

                <CardBottomRow>
                  <InfoText>{product.category}</InfoText>
                </CardBottomRow>
              </ProductCard>
            ))}
          </ProductGrid>
        ) : (
          <EmptyState>
            <EmptyIcon className="fas fa-search" />
            <EmptyText>조건에 맞는 상품이 없습니다.</EmptyText>
          </EmptyState>
        )}
      </Container>
    </Layout>
  );
};

export default AdminProducts;
