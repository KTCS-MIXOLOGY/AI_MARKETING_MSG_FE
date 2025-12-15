import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Loading from "../components/common/Loading";
import { customersAPI } from "../services/api";

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const Select = styled.select`
  min-width: 140px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
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
  cursor: pointer;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.variant === "primary" ? "#E60012" : "#f3f4f6"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#4b5563")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#B8000E" : "#e5e7eb"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f9fafb;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
  white-space: nowrap;
`;

const MembershipBadge = styled.span`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 700;
  background: ${(props) => {
    switch (props.level?.toUpperCase()) {
      case "VVIP":
        return "#DC2626"; // 빨간색 (연간 이용금액 200만원 이상)
      case "VIP":
        return "#1F2937"; // 검은색 (연간 이용금액 100만원 이상)
      case "GOLD":
        return "#92400E"; // 골드 브라운 (연간 이용금액 60만원 이상)
      case "SILVER":
        return "#6B7280"; // 회색 (연간 이용금액 40만원 이상)
      case "WHITE":
        return "#FFFFFF"; // 흰색 (연간 이용금액 20만원 이상)
      case "BASIC":
        return "#E5E7EB"; // 밝은 회색 일반 (연간 이용금액 20만원 미만)
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

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "active":
        return "#D1F2D8";
      case "dormant":
        return "#FADADD";
      case "reserved":
        return "#D6E9F8";
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "active":
        return "#2E7D32";
      case "dormant":
        return "#C2185B";
      case "reserved":
        return "#1565C0";
      default:
        return "#4B5563";
    }
  }};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: #e60012;
  color: white;
  border: 1px solid #e60012;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    font-size: 0.75rem;
  }

  &:hover {
    background: #b8000e;
    border-color: #b8000e;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(230, 0, 18, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
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

/* --- 페이지네이션 --- */

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  min-width: 38px;
  height: 38px;
  padding: 0 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.active ? "#e60012" : "#e5e7eb")};
  background: ${(props) => (props.active ? "#e60012" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#4b5563")};
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? "#b8000e" : "#f9fafb")};
    border-color: ${(props) => (props.active ? "#b8000e" : "#d1d5db")};
  }

  i {
    font-size: 0.75rem;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0.5rem;
`;

/* --- 모달 --- */

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
  padding: 0.65rem 2rem;
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

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailFullRow = styled.div`
  grid-column: 1 / -1;
`;

const ReadonlyField = styled.div`
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  font-size: 0.9375rem;
  color: #111827;
  display: flex;
  align-items: center;
  line-height: 1.5;
`;

const NameButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: #111827;
  cursor: pointer;
  text-align: left;
  width: 100%;

  &:hover {
    color: #e60012;
  }

  &:focus-visible {
    outline: 2px solid rgba(230, 0, 18, 0.4);
    outline-offset: 2px;
  }
`;

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

const UserCustomers = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 전체 고객 목록
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 검색 상태
  const [searchType, setSearchType] = useState("NAME");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // 상세 모달 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 페이지 로드 시 전체 고객 조회
  useEffect(() => {
    fetchAllCustomers();
  }, []);

  // 검색 실행 시 페이지를 0으로 리셋
  useEffect(() => {
    setCurrentPage(0);
  }, [allCustomers]);

  const fetchAllCustomers = async () => {
    try {
      setLoading(true);

      // NAME 타입으로 빈 문자열 검색하여 전체 목록 조회
      const response = await customersAPI.searchCustomers("NAME", "");

      if (response.data && response.data.success) {
        const responseData = response.data.data;
        const customerList = responseData.customers || [];

        const mappedCustomers = customerList.map((customer) => ({
          id: customer.customerId,
          name: anonymizeName(customer.name) || "-",
          email: customer.email || "-",
          phone: customer.phoneNumber || "-",
          membershipLevel: customer.membershipLevel || "-",
        }));

        setAllCustomers(mappedCustomers);
      }
    } catch (error) {
      console.error("고객 목록 조회 실패:", error);
      const errorMessage =
        error.response?.data?.message || "고객 목록을 불러오는데 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // 검색어가 비어있으면 전체 목록 조회
      fetchAllCustomers();
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      const response = await customersAPI.searchCustomers(searchType, searchTerm);

      if (response.data && response.data.success) {
        const responseData = response.data.data;
        const customerList = responseData.customers || [];

        const mappedCustomers = customerList.map((customer) => ({
          id: customer.customerId,
          name: anonymizeName(customer.name) || "-",
          email: customer.email || "-",
          phone: customer.phoneNumber || "-",
          membershipLevel: customer.membershipLevel || "-",
        }));

        setAllCustomers(mappedCustomers);
      }
    } catch (error) {
      console.error("고객 검색 실패:", error);
      const errorMessage =
        error.response?.data?.message || "고객 검색에 실패했습니다.";
      toast.error(errorMessage);
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchType("NAME");
    setHasSearched(false);
    setCurrentPage(0);
    fetchAllCustomers();
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  // 페이지네이션 적용
  const paginatedCustomers = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return allCustomers.slice(start, end);
  }, [allCustomers, currentPage]);

  const totalElements = allCustomers.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const getStatusLabel = (status) => {
    if (status === "active") return "진행중";
    if (status === "reserved") return "예약됨";
    if (status === "dormant") return "종료";
    return status;
  };

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
          <PageTitle>고객 정보 조회</PageTitle>
        </PageHeader>

        {loading ? (
          <Loading />
        ) : (
          <>
            <SearchBar>
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="NAME">고객명</option>
                <option value="ID">고객 ID</option>
                <option value="PHONE">전화번호</option>
              </Select>
              <SearchInput
                type="text"
                placeholder={`${
                  searchType === "NAME"
                    ? "고객명"
                    : searchType === "ID"
                    ? "고객 ID"
                    : "전화번호"
                }로 검색`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button variant="primary" onClick={handleSearch}>
                검색
              </Button>
              <Button onClick={handleReset}>초기화</Button>
            </SearchBar>

            <TableContainer>
              <Table>
                <Thead>
                  <tr>
                    <Th>고객 ID</Th>
                    <Th>고객명</Th>
                    <Th>전화번호</Th>
                    <Th>멤버십 레벨</Th>
                    <Th style={{ width: "180px" }}>관리</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map((customer) => (
                      <Tr key={customer.id}>
                        <Td>{customer.id}</Td>
                        <Td>
                          <NameButton
                            type="button"
                            onClick={() => handleCustomerClick(customer)}
                          >
                            {customer.name}
                          </NameButton>
                        </Td>
                        <Td>{customer.phone}</Td>
                        <Td>
                          <MembershipBadge level={customer.membershipLevel}>
                            <i className="fas fa-trophy"></i>
                            {customer.membershipLevel}
                          </MembershipBadge>
                        </Td>
                        <Td>
                          <ActionButton
                            onClick={() => navigate(`/customer/${customer.id}`)}
                          >
                            <i className="fas fa-eye"></i>
                            상세보기
                          </ActionButton>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <tr>
                      <Td colSpan={5}>
                        <EmptyState>
                          <EmptyIcon className="fas fa-search" />
                          <EmptyText>
                            {hasSearched
                              ? "검색 결과가 없습니다."
                              : "고객 데이터가 없습니다."}
                          </EmptyText>
                        </EmptyState>
                      </Td>
                    </tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <PaginationContainer>
                <PageButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <i className="fas fa-chevron-left"></i>
                </PageButton>

                {getPageNumbers().map((pageNum) => (
                  <PageButton
                    key={pageNum}
                    active={pageNum === currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum + 1}
                  </PageButton>
                ))}

                <PageButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </PageButton>

                <PageInfo>
                  {totalElements > 0 && (
                    <>
                      {totalElements}개 중 {currentPage * pageSize + 1}-
                      {Math.min((currentPage + 1) * pageSize, totalElements)}
                    </>
                  )}
                </PageInfo>
              </PaginationContainer>
            )}
          </>
        )}
      </Container>

      {isDetailOpen && selectedCustomer && (
        <ModalOverlay onClick={() => setIsDetailOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>고객 상세 정보</ModalTitle>
              <CloseButton
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedCustomer(null);
                }}
              >
                &times;
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <DetailGrid>
                <FormRow>
                  <Label>고객 ID</Label>
                  <ReadonlyField>{selectedCustomer.id}</ReadonlyField>
                </FormRow>

                <FormRow>
                  <Label>고객명</Label>
                  <ReadonlyField>{selectedCustomer.name}</ReadonlyField>
                </FormRow>
              </DetailGrid>

              <DetailGrid>
                <FormRow>
                  <Label>이메일</Label>
                  <ReadonlyField>{selectedCustomer.email}</ReadonlyField>
                </FormRow>

                <FormRow>
                  <Label>전화번호</Label>
                  <ReadonlyField>{selectedCustomer.phone}</ReadonlyField>
                </FormRow>
              </DetailGrid>

              <DetailFullRow>
                <FormRow>
                  <Label>멤버십 레벨</Label>
                  <ReadonlyField>
                    <MembershipBadge level={selectedCustomer.membershipLevel}>
                      <i className="fas fa-trophy"></i>
                      {selectedCustomer.membershipLevel}
                    </MembershipBadge>
                  </ReadonlyField>
                </FormRow>
              </DetailFullRow>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default UserCustomers;
