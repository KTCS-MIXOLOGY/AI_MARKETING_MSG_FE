import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { segmentsAPI } from "../services/api";

/* 컨테이너 & 헤더 */

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
  margin: 0;
`;

/* --- 필터 & 새 세그먼트 버튼 영역 (캠페인 페이지와 동일 구조) --- */

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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
  padding: 1.1rem 1rem;
  font-size: 0.9375rem;
  color: #1a1a1a;
  white-space: nowrap;
`;

const SegmentBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #e6fffa;
  color: #234e52;
`;

const CountBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #ebf8ff;
  color: #2c5282;
`;

/* 로딩 & 빈 상태 */

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 1rem;
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
  color: #9ca3af;
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
  width: 560px;
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
  padding: 1.25rem 1.75rem 1.75rem;
  overflow-y: auto;
`;

const ModalFormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const ModalLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.45rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
  background: #fafafa;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #e60012;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
  background: #fafafa;
  resize: vertical;
  box-sizing: border-box;
  line-height: 1.5;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e60012;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(230, 0, 18, 0.08);
  }
`;

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ModalSecondaryButton = styled.button`
  padding: 0.7rem 1.3rem;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const ModalPrimaryButton = styled.button`
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: #e60012;
  color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    background: #b8000e;
  }
`;

const AdminSegments = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 세그먼트 목록 조회
  useEffect(() => {
    fetchSegments();
  }, []);

  // 세그먼트명 자동 생성 함수
  const generateSegmentName = (segment) => {
    const parts = [];

    if (segment.gender) {
      parts.push(segment.gender === 'MALE' ? '남성' : segment.gender === 'FEMALE' ? '여성' : segment.gender);
    }

    if (segment.ageMin && segment.ageMax) {
      parts.push(`${segment.ageMin}-${segment.ageMax}세`);
    } else if (segment.ageMin) {
      parts.push(`${segment.ageMin}세 이상`);
    } else if (segment.ageMax) {
      parts.push(`${segment.ageMax}세 이하`);
    }

    if (segment.regions && segment.regions.length > 0) {
      if (segment.regions.length === 1) {
        parts.push(segment.regions[0]);
      } else {
        parts.push(`${segment.regions[0]} 외 ${segment.regions.length - 1}개`);
      }
    }

    if (segment.membershipLevel) {
      parts.push(segment.membershipLevel);
    }

    if (segment.recencyMaxDays) {
      parts.push(`최근${segment.recencyMaxDays}일`);
    }

    return parts.length > 0 ? parts.join('_') : `세그먼트_${segment.segmentId}`;
  };

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await segmentsAPI.getSegments();

      console.log("Segments API Response:", response);

      // Backend 응답: { success: true, data: { segments: [...], totalCount: N } }
      if (response?.data?.success && response?.data?.data?.segments) {
        // 세그먼트명이 없는 경우 자동 생성
        const segmentsWithNames = response.data.data.segments.map(segment => ({
          ...segment,
          segmentName: segment.segmentName || generateSegmentName(segment)
        }));
        setSegments(segmentsWithNames);
        console.log("Loaded segments:", segmentsWithNames);
      } else {
        console.warn("Unexpected response structure:", response);
        setSegments([]);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "세그먼트 목록을 불러오는데 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to fetch segments:", error);
      setSegments([]);
    } finally {
      setLoading(false);
    }
  };

  const membershipLevels = [...new Set(segments.map((s) => s.membershipLevel).filter(Boolean))];

  const filteredSegments = segments.filter((s) => {
    const membershipOk = creatorFilter === "all" || s.membershipLevel === creatorFilter;

    let sizeOk = true;
    if (sizeFilter === "small") {
      sizeOk = (s.targetCustomerCount || 0) < 10;
    } else if (sizeFilter === "medium") {
      sizeOk = (s.targetCustomerCount || 0) >= 10 && (s.targetCustomerCount || 0) <= 100;
    } else if (sizeFilter === "large") {
      sizeOk = (s.targetCustomerCount || 0) > 100;
    }

    return membershipOk && sizeOk;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredSegments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSegments = filteredSegments.slice(startIndex, endIndex);

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [creatorFilter, sizeFilter]);

  const openDetailModal = async (segment) => {
    try {
      setLoading(true);
      const response = await segmentsAPI.getSegment(segment.segmentId);

      if (response?.data?.success && response?.data?.data) {
        const segmentData = response.data.data;
        // 세그먼트명이 없는 경우 자동 생성
        setSelectedSegment({
          ...segmentData,
          segmentName: segmentData.segmentName || generateSegmentName(segmentData)
        });
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "세그먼트 상세 정보를 불러오는데 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to fetch segment detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedSegment(null);
    setIsDetailModalOpen(false);
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="segments"
        />
      }
      header={<Header />}
    >
      <Container>
        <PageHeader>
          <PageTitle>세그먼트 관리</PageTitle>
        </PageHeader>

        {/* 필터 */}
        <FilterBar>
          <FilterGroup>
            <Select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
            >
              <option value="all">전체 멤버십 등급</option>
              {membershipLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>

            <Select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">전체 고객 수</option>
              <option value="small">10명 미만</option>
              <option value="medium">10 ~ 100명</option>
              <option value="large">100명 이상</option>
            </Select>
          </FilterGroup>
        </FilterBar>

        {/* 로딩 상태 */}
        {loading && (
          <LoadingSpinner>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: "0.5rem" }}></i>
            불러오는 중...
          </LoadingSpinner>
        )}

        {/* 테이블 */}
        {!loading && (
          <TableContainer>
            <Table>
              <Thead>
                <tr>
                  <Th>세그먼트명</Th>
                  <Th>필터 조건</Th>
                  <Th>타겟 고객 수</Th>
                  <Th>활성 필터 수</Th>
                  <Th>생성일</Th>
                </tr>
              </Thead>
              <Tbody>
                {currentSegments.length > 0 ?
                  currentSegments.map((segment) => {
                    // 필터 조건 텍스트 생성
                    const criteria = [];
                    if (segment.ageMin && segment.ageMax) {
                      criteria.push(`연령 ${segment.ageMin}-${segment.ageMax}세`);
                    }
                    if (segment.gender) {
                      criteria.push(`성별 ${segment.gender === 'MALE' ? '남성' : segment.gender === 'FEMALE' ? '여성' : segment.gender}`);
                    }
                    if (segment.regions && segment.regions.length > 0) {
                      criteria.push(`지역 ${segment.regions.join(', ')}`);
                    }
                    if (segment.membershipLevel) {
                      criteria.push(`등급 ${segment.membershipLevel}`);
                    }

                    // 활성 필터 수 계산
                    let activeFilterCount = 0;
                    if (segment.ageMin || segment.ageMax) activeFilterCount++;
                    if (segment.gender) activeFilterCount++;
                    if (segment.regions && segment.regions.length > 0) activeFilterCount++;
                    if (segment.membershipLevel) activeFilterCount++;
                    if (segment.recencyMaxDays) activeFilterCount++;

                    const criteriaText = criteria.length > 0 ? criteria.join(', ') : '-';

                    return (
                      <Tr key={segment.segmentId} onClick={() => openDetailModal(segment)} style={{ cursor: 'pointer' }}>
                        <Td>
                          <SegmentBadge>{segment.segmentName}</SegmentBadge>
                        </Td>
                        <Td>{criteriaText}</Td>
                        <Td>
                          <CountBadge>
                            {(segment.targetCustomerCount || 0).toLocaleString()}명
                          </CountBadge>
                        </Td>
                        <Td>{activeFilterCount}개</Td>
                        <Td>{segment.createdAt?.split("T")[0] || "-"}</Td>
                      </Tr>
                    );
                  })
                  :
                  <tr>
                    <Td colSpan={5}>
                      <EmptyState>
                        <EmptyIcon className="fas fa-layer-group" />
                        <EmptyText>조건에 맞는 세그먼트가 없습니다.</EmptyText>
                      </EmptyState>
                    </Td>
                  </tr>
                }
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {/* 페이지네이션 */}
        {!loading && filteredSegments.length > 0 && (
          <PaginationContainer>
            <PageButton
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left" />
            </PageButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PageButton
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}

            <PageButton
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right" />
            </PageButton>

            <PageInfo>
              {filteredSegments.length}개 중 {startIndex + 1}-{Math.min(endIndex, filteredSegments.length)}
            </PageInfo>
          </PaginationContainer>
        )}
      </Container>

      {/* 세그먼트 상세 모달 */}
      {isDetailModalOpen && selectedSegment && (
        <ModalOverlay onClick={closeDetailModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>세그먼트 상세 정보</ModalTitle>
              <CloseButton onClick={closeDetailModal}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalFormGroup>
                <ModalLabel>세그먼트명</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.segmentName || ''}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>설명</ModalLabel>
                <ModalTextarea
                  value={selectedSegment.description || '설명이 없습니다.'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>연령 범위</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.ageMin && selectedSegment.ageMax
                    ? `${selectedSegment.ageMin}세 ~ ${selectedSegment.ageMax}세`
                    : '제한 없음'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>성별</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.gender
                    ? selectedSegment.gender === 'MALE' ? '남성' : selectedSegment.gender === 'FEMALE' ? '여성' : selectedSegment.gender
                    : '제한 없음'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>지역</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.regions && selectedSegment.regions.length > 0
                    ? selectedSegment.regions.join(', ')
                    : '제한 없음'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>멤버십 등급</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.membershipLevel || '제한 없음'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>최대 미구매 일수</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.recencyMaxDays ? `최근 ${selectedSegment.recencyMaxDays}일` : '제한 없음'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>타겟 고객 수</ModalLabel>
                <ModalInput
                  type="text"
                  value={`${(selectedSegment.targetCustomerCount || 0).toLocaleString()}명`}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>활성 필터 수</ModalLabel>
                <ModalInput
                  type="text"
                  value={`${selectedSegment.activeFilterCount || 0}개`}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>생성일</ModalLabel>
                <ModalInput
                  type="text"
                  value={selectedSegment.createdAt?.split("T")[0] || '-'}
                  readOnly
                  style={{ background: '#f9fafb', cursor: 'default' }}
                />
              </ModalFormGroup>

              <ModalButtonRow>
                <ModalPrimaryButton type="button" onClick={closeDetailModal}>
                  닫기
                </ModalPrimaryButton>
              </ModalButtonRow>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default AdminSegments;
