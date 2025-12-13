import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { messagesAPI, usersAPI, segmentsAPI, campaignsAPI } from "../services/api";

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

/* 필터 영역 */
const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  min-width: 180px;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  font-size: 0.9375rem;
  color: #374151;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  background-size: 10px 6px;

  &:focus {
    border-color: #e60012;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.1);
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
  padding: 1.2rem 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
`;

/* 뱃지 스타일 */
const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  background: ${(p) => {
    switch (p.status) {
      case "completed":
        return "#D1F2D8";
      case "processing":
        return "#D6E9F8";
      case "failed":
        return "#FADADD";
      default:
        return "#F3F4F6";
    }
  }};
  color: ${(p) => {
    switch (p.status) {
      case "completed":
        return "#2E7D32";
      case "processing":
        return "#1565C0";
      case "failed":
        return "#C2185B";
      default:
        return "#4B5563";
    }
  }};
`;

/* 자세히 보기 버튼 */
const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  }
`;

/* 모달 */
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
  width: 520px;
  max-width: 90vw;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.1rem;
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
  padding: 1.25rem 1.75rem 1.5rem;
  overflow-y: auto;
`;

const ModalMeta = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const ModalText = styled.p`
  font-size: 0.9375rem;
  color: #111827;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
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

const AdminMessages = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  // 메시지 목록 불러오기
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);

      const response = await messagesAPI.getAdminMessages({ page: 1, size: 100 });

      if (response.data.success) {
        const data = response.data.data;
        // Admin API는 content 배열로 반환
        const messageList = data.content || data.messages || [];

        // 병렬로 추가 정보 가져오기
        const formattedMessages = await Promise.all(
          messageList.map(async (msg) => {
            let targetName = "-";
            let creatorName = "-";
            let campaignName = "-";

            // 생성자 정보 가져오기
            if (msg.createdBy) {
              try {
                const userResponse = await usersAPI.getUser(msg.createdBy);
                console.log(`사용자 ${msg.createdBy} 응답:`, userResponse);

                // 다양한 응답 구조 처리
                let userData = null;
                if (userResponse.data?.success) {
                  userData = userResponse.data.data;
                } else if (userResponse.data) {
                  userData = userResponse.data;
                } else {
                  userData = userResponse;
                }

                creatorName = userData?.name || userData?.username || `사용자 ID: ${msg.createdBy}`;
              } catch (error) {
                console.error(`사용자 ${msg.createdBy} 조회 실패:`, error);
                console.error('에러 상세:', error.response?.data);
                creatorName = `사용자 ID: ${msg.createdBy}`;
              }
            }

            // 세그먼트/고객 정보 가져오기
            if (msg.messageType === "SEGMENT" && msg.segmentId) {
              try {
                const segmentResponse = await segmentsAPI.getSegment(msg.segmentId);
                console.log(`세그먼트 ${msg.segmentId} 응답:`, segmentResponse);

                // 다양한 응답 구조 처리
                let segmentData = null;
                if (segmentResponse.data?.success) {
                  segmentData = segmentResponse.data.data;
                } else if (segmentResponse.data) {
                  segmentData = segmentResponse.data;
                } else {
                  segmentData = segmentResponse;
                }

                // 세그먼트 이름 추출
                targetName = segmentData?.segmentName ||
                             segmentData?.name ||
                             segmentData?.description ||
                             `세그먼트 ID: ${msg.segmentId}`;
              } catch (error) {
                console.error(`세그먼트 ${msg.segmentId} 조회 실패:`, error);
                console.error('에러 상세:', error.response?.data);
                targetName = `세그먼트 ID: ${msg.segmentId}`;
              }
            } else if (msg.messageType === "INDIVIDUAL" && msg.customerId) {
              // 개인 메시지는 간단하게 "개인 고객"으로 표시
              targetName = "개인 고객";
            }

            // 캠페인 정보 가져오기
            if (msg.campaignId) {
              try {
                const campaignResponse = await campaignsAPI.getCampaign(msg.campaignId);
                console.log(`캠페인 ${msg.campaignId} 응답:`, campaignResponse);

                // 다양한 응답 구조 처리
                let campaignData = null;
                if (campaignResponse.data?.success) {
                  campaignData = campaignResponse.data.data;
                } else if (campaignResponse.data) {
                  campaignData = campaignResponse.data;
                } else {
                  campaignData = campaignResponse;
                }

                campaignName = campaignData?.name || campaignData?.campaignName || `캠페인 ID: ${msg.campaignId}`;
              } catch (error) {
                console.error(`캠페인 ${msg.campaignId} 조회 실패:`, error);
                console.error('에러 상세:', error.response?.data);
                campaignName = `캠페인 ID: ${msg.campaignId}`;
              }
            }

            // 실패 상태 판단: status 필드 또는 content 필드 중 하나라도 실패를 나타내면 실패
            const isFailed =
              msg.status === "FAILED" ||
              msg.contentPreview === "메시지 생성 실패" ||
              msg.summary === "메시지 생성 실패" ||
              msg.messageContent === "메시지 생성 실패";

            console.log(`[AdminMessages] 메시지 ${msg.messageId} 실패 여부:`, isFailed, {
              contentPreview: msg.contentPreview,
              summary: msg.summary,
              messageContent: msg.messageContent,
              status: msg.status
            });

            return {
              id: msg.messageId,
              type: msg.messageType === "SEGMENT" ? "segment" : "individual",
              target: targetName,
              content: msg.summary || msg.contentPreview || msg.messageContent || "",
              status: isFailed ? "failed" : "completed",
              createdBy: creatorName,
              createdAt: msg.createdAt ? formatDateTime(msg.createdAt) : "-",
              processedCount: msg.processedCount || 1,
              successCount: msg.successCount || (isFailed ? 0 : 1),
              campaign: campaignName,
              fullContent: msg.messageContent || msg.summary || "",
              tone: msg.tone,
              version: msg.messageVersion,
              charCount: msg.characterCount,
            };
          })
        );

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("메시지 목록 조회 실패:", error);
      toast.error("메시지 목록을 불러오는데 실패했습니다.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 날짜 포맷 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(/\. /g, "-").replace(/\./g, "");
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const typeOk = typeFilter === "all" || m.type === typeFilter;
      const statusOk = statusFilter === "all" || m.status === statusFilter;
      const creatorOk = creatorFilter === "all" || m.createdBy === creatorFilter;
      return typeOk && statusOk && creatorOk;
    });
  }, [messages, typeFilter, statusFilter, creatorFilter]);

  // 페이지네이션된 메시지
  const paginatedMessages = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredMessages.slice(start, end);
  }, [filteredMessages, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMessages.length / pageSize) || 0;

  const creators = [...new Set(messages.map((m) => m.createdBy).filter(Boolean))];

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
  }, [typeFilter, statusFilter, creatorFilter]);

  // 메시지 상세 보기
  const handleViewMessage = async (message) => {
    try {
      setModalLoading(true);
      setSelectedMessage(message); // 먼저 기본 정보 표시

      // 전체 메시지 내용 가져오기
      const response = await messagesAPI.getAdminMessage(message.id);

      if (response.data.success) {
        const fullMessageData = response.data.data;

        // 전체 메시지 내용으로 업데이트
        setSelectedMessage({
          ...message,
          fullContent: fullMessageData.messageContent || fullMessageData.summary || message.fullContent,
          tone: fullMessageData.tone || message.tone,
          version: fullMessageData.messageVersion || message.version,
          charCount: fullMessageData.characterCount || message.charCount,
        });
      }
    } catch (error) {
      console.error("메시지 상세 조회 실패:", error);
      // 에러가 발생해도 기존 데이터는 표시
      toast.error("메시지 전체 내용을 불러오는데 실패했습니다.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="messages"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <PageTitle>메시지 로그 관리</PageTitle>
        </PageHeader>

        {/* 필터 */}
        <FilterBar>
          <FilterSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">전체 유형</option>
            <option value="segment">세그먼트</option>
            <option value="individual">개인</option>
          </FilterSelect>

          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="completed">완료</option>
            <option value="processing">처리중</option>
            <option value="failed">실패</option>
          </FilterSelect>

          <FilterSelect
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          >
            <option value="all">전체 생성자</option>
            {creators.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </FilterSelect>
        </FilterBar>

        {/* 테이블 */}
        <TableContainer>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: "0.5rem", fontSize: "1.5rem" }}></i>
              <div style={{ marginTop: "1rem" }}>불러오는 중...</div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
              <i className="fas fa-inbox" style={{ fontSize: "3rem", marginBottom: "1rem", display: "block" }}></i>
              <div style={{ fontSize: "1rem", color: "#6b7280" }}>조건에 맞는 메시지가 없습니다.</div>
            </div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>유형</Th>
                  <Th>대상</Th>
                  <Th>상태</Th>
                  <Th>생성자</Th>
                  <Th>생성일</Th>
                  <Th>내용</Th>
                </tr>
              </Thead>

              <Tbody>
                {paginatedMessages.map((msg) => (
                  <Tr key={msg.id}>
                    <Td>{msg.type === "segment" ? "세그먼트" : "개인"}</Td>
                    <Td>{msg.target}</Td>
                    <Td>
                      <StatusBadge status={msg.status}>
                        {msg.status === "completed"
                          ? "완료"
                          : msg.status === "processing"
                          ? "처리중"
                          : "실패"}
                      </StatusBadge>
                    </Td>
                    <Td>{msg.createdBy}</Td>
                    <Td>{msg.createdAt}</Td>
                    <Td>
                      <ViewButton
                        type="button"
                        onClick={() => handleViewMessage(msg)}
                      >
                        자세히 보기
                      </ViewButton>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>

        {/* 페이지네이션 */}
        {!loading && filteredMessages.length > 0 && totalPages > 1 && (
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
              {filteredMessages.length > 0 && (
                <>
                  {currentPage * pageSize + 1}-
                  {Math.min((currentPage + 1) * pageSize, filteredMessages.length)} / {filteredMessages.length}
                </>
              )}
            </PageInfo>
          </PaginationContainer>
        )}
      </Container>

      {selectedMessage && (
        <ModalOverlay onClick={() => setSelectedMessage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>메시지 상세</ModalTitle>
              <CloseButton onClick={() => setSelectedMessage(null)}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalMeta>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>유형:</strong> {selectedMessage.type === "segment" ? "세그먼트" : "개인"}
                  {selectedMessage.campaign && (
                    <span style={{ marginLeft: "1rem" }}>
                      <strong>캠페인:</strong> {selectedMessage.campaign}
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>대상:</strong> {selectedMessage.target}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>생성자:</strong> {selectedMessage.createdBy} | <strong>생성일:</strong> {selectedMessage.createdAt}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>톤앤매너:</strong> {selectedMessage.tone || "-"} | <strong>버전:</strong> {selectedMessage.version || "-"} | <strong>글자수:</strong> {selectedMessage.charCount || 0}자
                </div>
                <div>
                  <strong>상태:</strong>{" "}
                  <StatusBadge status={selectedMessage.status}>
                    {selectedMessage.status === "completed"
                      ? "완료"
                      : selectedMessage.status === "processing"
                      ? "처리중"
                      : "실패"}
                  </StatusBadge>
                  {/* <span style={{ marginLeft: "1rem" }}>
                    <strong>처리수:</strong> {selectedMessage.processedCount} | <strong>성공수:</strong> {selectedMessage.successCount}
                  </span> */}
                </div>
              </ModalMeta>
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px" }}>
                <strong style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>메시지 내용:</strong>
                <ModalText>{selectedMessage.fullContent || selectedMessage.content}</ModalText>
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default AdminMessages;
