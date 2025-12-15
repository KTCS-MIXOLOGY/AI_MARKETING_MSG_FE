import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { usersAPI, extractPageData } from "../services/api";

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

/* 상단 헤더 */

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

/* 필터 바 */

const FilterBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
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

/* 테이블 */

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
  padding: 1.25rem 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
  white-space: nowrap;
`;

const ClickableTd = styled(Td)`
  cursor: pointer;
  color: #e60012;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

/* 상태 뱃지 */

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "#D1F2D8"; // 초록 - 승인 완료
      case "PENDING":
        return "#FEF3C7"; // 노랑 - 승인 대기
      case "REJECTED":
        return "#FEE2E2"; // 빨강 - 승인 거부
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "#065F46"; // 초록
      case "PENDING":
        return "#92400E"; // 노랑
      case "REJECTED":
        return "#991B1B"; // 빨강
      default:
        return "#4B5563";
    }
  }};
`;

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.role === "ADMIN" ? "#fee2e2" : "#dbeafe")};
  color: ${(props) => (props.role === "ADMIN" ? "#991b1b" : "#1e40af")};
`;

/* 빈 상태 */

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

/* 액션 버튼 */

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => props.bgColor || "#f3f4f6"};
  color: ${(props) => props.color || "#374151"};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

/* 상세 모달 */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 0.9375rem;
  color: #1a1a1a;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.7rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => props.bgColor || "#f3f4f6"};
  color: ${(props) => props.color || "#374151"};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 1rem;
`;

/* 확인 모달 */
const ConfirmModalOverlay = styled(ModalOverlay)`
  z-index: 1100;
`;

const ConfirmModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ConfirmModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ConfirmModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const ConfirmModalBody = styled.div`
  padding: 1.5rem;
`;

const ConfirmModalMessage = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const ConfirmModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

/* 페이지네이션 */
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

// 이름 익명화 함수: 성만 남기고 나머지는 *로 마스킹
const anonymizeName = (fullName) => {
  if (!fullName || fullName.length < 2) return fullName;
  const surname = fullName[0]; // 첫 글자 (성)
  const givenNameLength = fullName.length - 1;
  const masked = "*".repeat(givenNameLength);
  return surname + masked;
};

const AdminUsers = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // 페이지당 10개씩 표시

  // 확인 모달 상태
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "확인",
    confirmColor: "#10b981"
  });

  // 사용자 목록 조회
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      const data = extractPageData(response);

      // Backend 응답 구조에 따라 처리
      const userList = data?.content || data?.data || data || [];
      setUsers(userList);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "사용자 목록을 불러오는데 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const departments = Array.from(
    new Set(users.map((u) => u.department).filter(Boolean))
  );

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "승인 완료";
      case "PENDING":
        return "승인 대기";
      case "REJECTED":
        return "승인 거부";
      default:
        return status;
    }
  };

  const getRoleText = (role) => {
    return role === "ADMIN" ? "관리자" : "사용자";
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const statusOk =
        statusFilter === "all" ? true : user.status === statusFilter;
      const deptOk =
        deptFilter === "all" ? true : user.department === deptFilter;
      return statusOk && deptOk;
    });
  }, [users, statusFilter, deptFilter]);

  // 페이지네이션된 사용자
  const paginatedUsers = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 0;

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 페이지 번호 생성
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

  // 필터 변경 시 페이지를 0으로 리셋
  useEffect(() => {
    setCurrentPage(0);
  }, [statusFilter, deptFilter]);

  // 사용자 상세 조회
  const openDetailModal = async (user) => {
    try {
      setLoading(true);
      const response = await usersAPI.getUser(user.userId || user.id);
      const data = extractPageData(response);

      // Backend 응답 구조에 따라 처리
      const userDetail = data?.data || data || user;

      setSelectedUser(userDetail);
      setIsDetailModalOpen(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "사용자 상세 정보를 불러오는데 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to fetch user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  // 확인 모달 열기
  const openConfirmModal = (title, message, onConfirm, confirmText = "확인", confirmColor = "#10b981") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      confirmColor
    });
  };

  // 확인 모달 닫기
  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      confirmText: "확인",
      confirmColor: "#10b981"
    });
  };

  // 사용자 승인
  const handleApprove = async (userId, userRole, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    openConfirmModal(
      "사용자 승인",
      "이 사용자를 승인하시겠습니까?",
      async () => {
        try {
          // userRole이 없으면 기본값으로 "EXECUTOR" 사용
          const role = userRole || "EXECUTOR";
          await usersAPI.approveUser(userId, role);
          toast.success("사용자가 승인되었습니다.");
          closeDetailModal();
          await fetchUsers(); // 목록 새로고침
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "사용자 승인에 실패했습니다.";
          toast.error(errorMessage);
          console.error("Failed to approve user:", error);
        } finally {
          closeConfirmModal();
        }
      },
      "승인",
      "#10b981"
    );
  };

  // 사용자 삭제
  const handleDelete = async (userId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    openConfirmModal(
      "사용자 삭제",
      "이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      async () => {
        try {
          await usersAPI.deleteUser(userId);
          toast.success("사용자가 삭제되었습니다.");
          closeDetailModal();
          await fetchUsers(); // 목록 새로고침
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "사용자 삭제에 실패했습니다.";
          toast.error(errorMessage);
          console.error("Failed to delete user:", error);
        } finally {
          closeConfirmModal();
        }
      },
      "삭제",
      "#ef4444"
    );
  };

  // 사용자 승인 거부/취소
  const handleReject = async (userId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // 현재 사용자 상태 확인
    const user = users.find(u => (u.userId || u.id) === userId) || selectedUser;
    const isApproved = user?.status === "APPROVED";
    const userRole = user?.role || "EXECUTOR";

    const title = isApproved ? "사용자 승인 취소" : "사용자 승인 거부";
    const message = isApproved
      ? "이 사용자의 승인을 취소하시겠습니까? 사용자는 더 이상 시스템에 접근할 수 없습니다."
      : "이 사용자의 승인을 거부하시겠습니까?";
    const successMessage = isApproved ? "사용자 승인이 취소되었습니다." : "사용자 승인이 거부되었습니다.";

    openConfirmModal(
      title,
      message,
      async () => {
        try {
          await usersAPI.rejectUser(userId, userRole);
          toast.success(successMessage);
          closeDetailModal();
          await fetchUsers();
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "승인 거부/취소에 실패했습니다.";
          toast.error(errorMessage);
          console.error("Failed to reject user:", error);
        } finally {
          closeConfirmModal();
        }
      },
      isApproved ? "승인 취소" : "거부",
      "#ef4444"
    );
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="users"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <PageTitle>회원 관리</PageTitle>
        </PageHeader>

        {/* 상태 / 부서 필터 */}
        <FilterBar>
          <FilterGroup>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="APPROVED">승인 완료</option>
              <option value="PENDING">승인 대기</option>
              <option value="REJECTED">승인 거부</option>
            </Select>

            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="all">전체 부서</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </FilterGroup>
        </FilterBar>

        {loading && (
          <LoadingSpinner>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: "0.5rem" }}></i>
            불러오는 중...
          </LoadingSpinner>
        )}

        {!loading && (
          <TableContainer>
            <Table>
              <Thead>
                <tr>
                  <Th>이름</Th>
                  <Th>이메일</Th>
                  <Th>계정 유형</Th>
                  <Th>부서</Th>
                  <Th>가입일</Th>
                  {/* <Th>마지막 로그인</Th> */}
                  <Th>최근 메시지 생성일</Th>
                  <Th>상태</Th>
                  <Th>관리</Th>
                </tr>
              </Thead>
              <Tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <Tr key={user.userId || user.id}>
                      <ClickableTd onClick={() => openDetailModal(user)}>
                        {anonymizeName(user.name || user.username)}
                      </ClickableTd>
                      <Td>{user.email}</Td>
                      <Td>
                        <RoleBadge role={user.role}>
                          {getRoleText(user.role)}
                        </RoleBadge>
                      </Td>
                      <Td>{user.department || "-"}</Td>
                      <Td>{user.joinDate || user.createdAt?.split("T")[0] || "-"}</Td>
                      {/* <Td>{user.lastLogin?.split("T")[0] || "-"}</Td> */}
                      <Td>{user.lastSentAt?.split("T")[0] || "-"}</Td>
                      <Td>
                        <StatusBadge status={user.status}>
                          {getStatusText(user.status)}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <ActionButtons>
                          {user.status === "PENDING" && (
                            <>
                              <IconButton
                                bgColor="#d1fae5"
                                color="#065f46"
                                onClick={(e) => handleApprove(user.userId || user.id, user.role, e)}
                                title="승인"
                              >
                                <i className="fas fa-check"></i>
                              </IconButton>
                              <IconButton
                                bgColor="#fee2e2"
                                color="#991b1b"
                                onClick={(e) => handleReject(user.userId || user.id, e)}
                                title="거부"
                              >
                                <i className="fas fa-times"></i>
                              </IconButton>
                            </>
                          )}
                          {user.status === "APPROVED" && (
                            <>
                              <IconButton
                                bgColor="#fef3c7"
                                color="#92400e"
                                onClick={(e) => handleReject(user.userId || user.id, e)}
                                title="승인 취소"
                              >
                                <i className="fas fa-ban"></i>
                              </IconButton>
                              <IconButton
                                bgColor="#fee2e2"
                                color="#991b1b"
                                onClick={(e) => handleDelete(user.userId || user.id, e)}
                                title="삭제"
                              >
                                <i className="fas fa-trash"></i>
                              </IconButton>
                            </>
                          )}
                          {user.status === "REJECTED" && (
                            <>
                              <IconButton
                                bgColor="#d1fae5"
                                color="#065f46"
                                onClick={(e) => handleApprove(user.userId || user.id, user.role, e)}
                                title="승인"
                              >
                                <i className="fas fa-check"></i>
                              </IconButton>
                              <IconButton
                                bgColor="#fee2e2"
                                color="#991b1b"
                                onClick={(e) => handleDelete(user.userId || user.id, e)}
                                title="삭제"
                              >
                                <i className="fas fa-trash"></i>
                              </IconButton>
                            </>
                          )}
                        </ActionButtons>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <tr>
                    <Td colSpan={9}>
                      <EmptyState>
                        <EmptyIcon className="fas fa-search" />
                        <EmptyText>조건에 맞는 회원이 없습니다.</EmptyText>
                      </EmptyState>
                    </Td>
                  </tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {/* 페이지네이션 */}
        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
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
              {filteredUsers.length > 0 && (
                <>
                  {currentPage * pageSize + 1}-
                  {Math.min((currentPage + 1) * pageSize, filteredUsers.length)} / {filteredUsers.length}
                </>
              )}
            </PageInfo>
          </PaginationContainer>
        )}

        {/* 사용자 상세 모달 */}
        {isDetailModalOpen && selectedUser && (
          <ModalOverlay onClick={closeDetailModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>회원 상세 정보</ModalTitle>
                <CloseButton onClick={closeDetailModal}>×</CloseButton>
              </ModalHeader>

              <ModalBody>
                <FormRow>
                  <Label>이름</Label>
                  <Value>{anonymizeName(selectedUser.name || selectedUser.username)}</Value>
                </FormRow>

                <FormRow>
                  <Label>아이디</Label>
                  <Value>{selectedUser.username}</Value>
                </FormRow>

                <FormRow>
                  <Label>이메일</Label>
                  <Value>{selectedUser.email}</Value>
                </FormRow>

                <FormRow>
                  <Label>계정 유형</Label>
                  <Value>
                    <span
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        background: selectedUser.role === "ADMIN" ? "#fee2e2" : "#dbeafe",
                        color: selectedUser.role === "ADMIN" ? "#991b1b" : "#1e40af",
                      }}
                    >
                      {selectedUser.role === "ADMIN" ? "관리자" : "사용자"}
                    </span>
                  </Value>
                </FormRow>

                <FormRow>
                  <Label>부서</Label>
                  <Value>{selectedUser.department || "-"}</Value>
                </FormRow>

                <FormRow>
                  <Label>가입일</Label>
                  <Value>{selectedUser.joinDate || selectedUser.createdAt?.split("T")[0] || "-"}</Value>
                </FormRow>

                {/*  <FormRow>
                  <Label>마지막 로그인</Label>
                  <Value>
                    {selectedUser.lastLogin ? (
                      <div>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                          {new Date(selectedUser.lastLogin).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          {new Date(selectedUser.lastLogin).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </Value>
                </FormRow>  */}

                <FormRow>
                  <Label>최근 발송일</Label>
                  <Value>{selectedUser.lastSentAt?.split("T")[0] || "-"}</Value>
                </FormRow>

                <FormRow>
                  <Label>상태</Label>
                  <Value>
                    <StatusBadge status={selectedUser.status}>
                      {getStatusText(selectedUser.status)}
                    </StatusBadge>
                  </Value>
                </FormRow>
              </ModalBody>

              <ModalFooter>
                {selectedUser.status === "PENDING" && (
                  <>
                    <Button
                      bgColor="#10b981"
                      color="white"
                      onClick={(e) => handleApprove(selectedUser.userId || selectedUser.id, selectedUser.role, e)}
                    >
                      <i className="fas fa-check" style={{ marginRight: "0.5rem" }}></i>
                      승인
                    </Button>
                    <Button
                      bgColor="#ef4444"
                      color="white"
                      onClick={(e) => handleReject(selectedUser.userId || selectedUser.id, e)}
                    >
                      <i className="fas fa-times" style={{ marginRight: "0.5rem" }}></i>
                      거부
                    </Button>
                  </>
                )}
                {selectedUser.status === "APPROVED" && (
                  <>
                    <Button
                      bgColor="#f59e0b"
                      color="white"
                      onClick={(e) => handleReject(selectedUser.userId || selectedUser.id, e)}
                    >
                      <i className="fas fa-ban" style={{ marginRight: "0.5rem" }}></i>
                      승인 취소
                    </Button>
                    <Button
                      bgColor="#ef4444"
                      color="white"
                      onClick={(e) => handleDelete(selectedUser.userId || selectedUser.id, e)}
                    >
                      <i className="fas fa-trash" style={{ marginRight: "0.5rem" }}></i>
                      삭제
                    </Button>
                  </>
                )}
                {selectedUser.status === "REJECTED" && (
                  <>
                    <Button
                      bgColor="#10b981"
                      color="white"
                      onClick={(e) => handleApprove(selectedUser.userId || selectedUser.id, selectedUser.role, e)}
                    >
                      <i className="fas fa-check" style={{ marginRight: "0.5rem" }}></i>
                      승인
                    </Button>
                    <Button
                      bgColor="#ef4444"
                      color="white"
                      onClick={(e) => handleDelete(selectedUser.userId || selectedUser.id, e)}
                    >
                      <i className="fas fa-trash" style={{ marginRight: "0.5rem" }}></i>
                      삭제
                    </Button>
                  </>
                )}
                <Button bgColor="#f3f4f6" color="#374151" onClick={closeDetailModal}>
                  닫기
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* 확인 모달 */}
        {confirmModal.isOpen && (
          <ConfirmModalOverlay onClick={closeConfirmModal}>
            <ConfirmModalContent onClick={(e) => e.stopPropagation()}>
              <ConfirmModalHeader>
                <ConfirmModalTitle>{confirmModal.title}</ConfirmModalTitle>
              </ConfirmModalHeader>

              <ConfirmModalBody>
                <ConfirmModalMessage>{confirmModal.message}</ConfirmModalMessage>
              </ConfirmModalBody>

              <ConfirmModalFooter>
                <Button
                  bgColor="#f3f4f6"
                  color="#374151"
                  onClick={closeConfirmModal}
                >
                  취소
                </Button>
                <Button
                  bgColor={confirmModal.confirmColor}
                  color="white"
                  onClick={confirmModal.onConfirm}
                >
                  {confirmModal.confirmText}
                </Button>
              </ConfirmModalFooter>
            </ConfirmModalContent>
          </ConfirmModalOverlay>
        )}
      </Container>
    </Layout>
  );
};

export default AdminUsers;
