import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

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

const NewSegmentButton = styled.button`
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.9375rem;
  background: #e60012;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 16px rgba(230, 0, 18, 0.25);
  transition: all 0.15s ease;

  &:hover {
    background: #b8000e;
    transform: translateY(-1px);
  }

  i {
    font-size: 0.95rem;
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

/* 작업 아이콘 */

const ActionsCell = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: ${(props) =>
    props.variant === "danger" ? "none" : "1px solid #e5e7eb"};
  background: ${(props) =>
    props.variant === "danger" ? "#e60012" : "#ffffff"};
  color: ${(props) => (props.variant === "danger" ? "#ffffff" : "#4b5563")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(15, 23, 42, 0.12);
    transform: translateY(-1px);
    background: ${(props) =>
      props.variant === "danger" ? "#b8000e" : "#f9fafb"};
  }

  i {
    font-size: 0.9rem;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSegment, setNewSegment] = useState({
    name: "",
    criteria: "",
    description: "",
    customerCount: "",
  });

  // Mock segment data
  const segments = [
    {
      id: 1,
      name: "VIP 고객",
      criteria: "연간 구매액 500만원 이상",
      customerCount: 1250,
      description: "고액 구매 고객 대상 서비스",
      createdBy: "CRM팀",
      createdAt: "2024-10-01",
      lastUsed: "2024-11-10",
    },
    {
      id: 2,
      name: "신규 가입자",
      criteria: "최근 30일 이내 가입",
      customerCount: 3450,
      description: "신규 고객 대상 환영 이벤트",
      createdBy: "마케팅팀",
      createdAt: "2024-09-15",
      lastUsed: "2024-11-08",
    },
    {
      id: 3,
      name: "휴면 고객",
      criteria: "최근 90일 간 로그인 없음",
      customerCount: 2890,
      description: "재활성화를 위한 타겟 캠페인",
      createdBy: "고객경험팀",
      createdAt: "2024-08-20",
      lastUsed: "2024-10-25",
    },
    {
      id: 4,
      name: "20대 여성",
      criteria: "나이 20-29세, 여성",
      customerCount: 5670,
      description: "젊은 여성 고객층 타겟팅",
      createdBy: "마케팅팀",
      createdAt: "2024-09-01",
      lastUsed: "2024-11-09",
    },
  ];

  const creators = [...new Set(segments.map((s) => s.createdBy))];

  const filteredSegments = segments.filter((s) => {
    const creatorOk = creatorFilter === "all" || s.createdBy === creatorFilter;

    let sizeOk = true;
    if (sizeFilter === "small") {
      sizeOk = s.customerCount < 2000;
    } else if (sizeFilter === "medium") {
      sizeOk = s.customerCount >= 2000 && s.customerCount <= 4000;
    } else if (sizeFilter === "large") {
      sizeOk = s.customerCount > 4000;
    }

    return creatorOk && sizeOk;
  });

  const handleOpenModal = () => {
    setNewSegment({
      name: "",
      criteria: "",
      description: "",
      customerCount: "",
    });
    setIsModalOpen(true);
  };

  const handleCreateSegment = () => {
    console.log("새 세그먼트 생성:", newSegment);
    alert("세그먼트가 생성되었습니다. (Mock)");
    setIsModalOpen(false);
  };

  const handleEditSegment = (segment) => {
    console.log("편집 클릭:", segment);
    alert(`'${segment.name}' 세그먼트 편집 기능은 추후 연결 예정입니다.`);
  };

  const handleDeleteSegment = (segment) => {
    if (window.confirm(`'${segment.name}' 세그먼트를 삭제하시겠습니까?`)) {
      console.log("삭제:", segment);
      alert("세그먼트 삭제 요청이 처리되었습니다. (Mock)");
    }
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

        {/* 필터 + 새 세그먼트 버튼 */}
        <FilterBar>
          <FilterGroup>
            <Select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
            >
              <option value="all">전체 생성자</option>
              {creators.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">전체 고객 수</option>
              <option value="small">2,000명 미만</option>
              <option value="medium">2,000 ~ 4,000명</option>
              <option value="large">4,000명 이상</option>
            </Select>
          </FilterGroup>

          <NewSegmentButton type="button" onClick={handleOpenModal}>
            <i className="fas fa-plus" />
            세그먼트 생성
          </NewSegmentButton>
        </FilterBar>

        {/* 테이블 */}
        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th>세그먼트명</Th>
                <Th>기준</Th>
                <Th>고객수</Th>
                <Th>설명</Th>
                <Th>생성자</Th>
                <Th>생성일</Th>
                <Th>최근 사용</Th>
                <Th>작업</Th>
              </tr>
            </Thead>
            <Tbody>
              {filteredSegments.map((segment) => (
                <Tr key={segment.id}>
                  <Td>
                    <SegmentBadge>{segment.name}</SegmentBadge>
                  </Td>
                  <Td>{segment.criteria}</Td>
                  <Td>
                    <CountBadge>
                      {segment.customerCount.toLocaleString()}
                    </CountBadge>
                  </Td>
                  <Td>{segment.description}</Td>
                  <Td>{segment.createdBy}</Td>
                  <Td>{segment.createdAt}</Td>
                  <Td>{segment.lastUsed}</Td>
                  <Td>
                    <ActionsCell>
                      <IconButton
                        type="button"
                        onClick={() => handleEditSegment(segment)}
                      >
                        <i className="fas fa-pen" />
                      </IconButton>
                      <IconButton
                        type="button"
                        variant="danger"
                        onClick={() => handleDeleteSegment(segment)}
                      >
                        <i className="fas fa-trash" />
                      </IconButton>
                    </ActionsCell>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>

      {/* 세그먼트 생성 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>세그먼트 생성</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalFormGroup>
                <ModalLabel>세그먼트명</ModalLabel>
                <ModalInput
                  type="text"
                  value={newSegment.name}
                  onChange={(e) =>
                    setNewSegment((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="예: VIP 고객, 신규 가입자"
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>선정 기준</ModalLabel>
                <ModalInput
                  type="text"
                  value={newSegment.criteria}
                  onChange={(e) =>
                    setNewSegment((prev) => ({
                      ...prev,
                      criteria: e.target.value,
                    }))
                  }
                  placeholder="예: 연간 구매액 500만원 이상"
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>설명</ModalLabel>
                <ModalTextarea
                  value={newSegment.description}
                  onChange={(e) =>
                    setNewSegment((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="세그먼트 활용 목적과 특징을 간단히 적어주세요."
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>예상 고객 수 (선택)</ModalLabel>
                <ModalInput
                  type="number"
                  value={newSegment.customerCount}
                  onChange={(e) =>
                    setNewSegment((prev) => ({
                      ...prev,
                      customerCount: e.target.value,
                    }))
                  }
                  placeholder="예상 고객 수를 입력하세요"
                />
              </ModalFormGroup>

              <ModalButtonRow>
                <ModalSecondaryButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </ModalSecondaryButton>
                <ModalPrimaryButton type="button" onClick={handleCreateSegment}>
                  세그먼트 생성
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
