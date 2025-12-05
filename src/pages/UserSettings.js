import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/common/Layout";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { usersAPI } from "../services/api";

const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const SettingsTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.875rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "#E60012" : "#737373")};
  border-bottom: 2px solid
    ${(props) => (props.active ? "#E60012" : "transparent")};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #e60012;
  }

  i {
    margin-right: 0.5rem;
  }
`;

const TabContent = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};
`;

const SettingsSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #171717;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #e60012;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #171717;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9375rem;
  background: ${(props) => (props.disabled ? "#F5F5F5" : "#FAFAFA")};
  color: ${(props) => (props.disabled ? "#A3A3A3" : "#171717")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #e60012;
    background: #ffffff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.variant === "primary" ? "#E60012" : "#F5F5F5"};
  color: ${(props) => (props.variant === "primary" ? "#FFFFFF" : "#171717")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#C50010" : "#E5E5E5"};
  }

  i {
    margin-right: 0.5rem;
  }
`;

const InfoCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #737373;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 0.9375rem;
  color: #171717;
  font-weight: 600;
`;

const HelpContent = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 1.25rem;
  font-size: 0.875rem;
  color: #525252;
  line-height: 1.7;
  margin-bottom: 1.5rem;

  strong {
    color: #e60012;
    font-weight: 600;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e60012;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  i {
    font-size: 1.5rem;
    color: #e60012;
    margin-bottom: 0.75rem;
    display: block;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #171717;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.8125rem;
    color: #737373;
    margin: 0;
    line-height: 1.5;
  }
`;

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 사용자 상세 정보 조회
  useEffect(() => {
    if (user?.userId) {
      fetchUserDetail();
    }
  }, [user?.userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUser(user.userId);

      if (response?.data?.success && response?.data?.data) {
        const userData = response.data.data;
        setUserDetail(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          department: userData.department || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "사용자 정보를 불러오는데 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to fetch user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
      };

      const response = await usersAPI.updateUser(user.userId, updateData);

      if (response?.data?.success) {
        toast.success("프로필이 성공적으로 저장되었습니다.");
        await fetchUserDetail(); // 최신 정보 다시 가져오기
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "프로필 저장에 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to update profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("현재 비밀번호와 새 비밀번호를 입력해주세요.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // TODO: 비밀번호 변경 API가 백엔드에 구현되면 연결
      // await authAPI.changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });

      toast.info("비밀번호 변경 기능은 준비 중입니다.");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      toast.error(errorMessage);
      console.error("Failed to change password:", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeMenu="settings"
        />
      }
      header={<Header />}
    >
      <SettingsContainer>
        <SettingsTabs>
          <Tab
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            개인 정보
          </Tab>
          <Tab
            active={activeTab === "help"}
            onClick={() => setActiveTab("help")}
          >
            도움말
          </Tab>
        </SettingsTabs>

        {/* 개인 정보 탭 */}
        <TabContent active={activeTab === "profile"}>
          <SettingsSection>
            <SectionTitle>
              <i className="fas fa-user-circle"></i>
              사용자 정보
            </SectionTitle>

            {loading ? (
              <InfoCard>
                <p style={{ textAlign: "center", color: "#737373" }}>
                  로딩 중...
                </p>
              </InfoCard>
            ) : userDetail ? (
              <InfoCard>
                <InfoRow>
                  <InfoLabel>사용자명</InfoLabel>
                  <InfoValue>{userDetail.username || "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>이름</InfoLabel>
                  <InfoValue>{userDetail.name || "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>이메일</InfoLabel>
                  <InfoValue>{userDetail.email || "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>전화번호</InfoLabel>
                  <InfoValue>{userDetail.phone || "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>부서</InfoLabel>
                  <InfoValue>{userDetail.department || "-"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>역할</InfoLabel>
                  <InfoValue>
                    {userDetail.role === "ADMIN" ? "관리자" : userDetail.role === "EXECUTOR" ? "실행자" : userDetail.role}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>상태</InfoLabel>
                  <InfoValue>
                    {userDetail.status === "APPROVED" ? "승인됨" : userDetail.status === "PENDING" ? "대기중" : userDetail.status === "REJECTED" ? "거부됨" : userDetail.status}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>가입일</InfoLabel>
                  <InfoValue>{userDetail.createdAt?.split("T")[0] || "-"}</InfoValue>
                </InfoRow>
              </InfoCard>
            ) : (
              <InfoCard>
                <p style={{ textAlign: "center", color: "#737373" }}>
                  사용자 정보를 불러올 수 없습니다.
                </p>
              </InfoCard>
            )}
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>
              <i className="fas fa-edit"></i>
              프로필 수정
            </SectionTitle>

            <FormGroup>
              <FormLabel>이름</FormLabel>
              <FormInput
                type="text"
                name="name"
                value={formData.name}
                disabled
                placeholder="이름은 수정할 수 없습니다"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>이메일</FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>전화번호 (010-1234-5678 형식)</FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="010-1234-5678"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>부서</FormLabel>
              <FormInput
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="부서명을 입력하세요"
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                취소
              </Button>
              <Button variant="primary" onClick={handleSaveProfile}>
                <i className="fas fa-save"></i>
                저장
              </Button>
            </ButtonGroup>
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>
              <i className="fas fa-lock"></i>
              비밀번호 변경
            </SectionTitle>

            <FormGroup>
              <FormLabel>현재 비밀번호</FormLabel>
              <FormInput
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="현재 비밀번호"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>새 비밀번호</FormLabel>
              <FormInput
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="새 비밀번호 (6자 이상)"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>새 비밀번호 확인</FormLabel>
              <FormInput
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="새 비밀번호 확인"
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }))
                }
              >
                취소
              </Button>
              <Button variant="primary" onClick={handleChangePassword}>
                <i className="fas fa-key"></i>
                비밀번호 변경
              </Button>
            </ButtonGroup>
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>
              <i className="fas fa-sign-out-alt"></i>
              계정 관리
            </SectionTitle>

            <p
              style={{
                marginBottom: "1rem",
                color: "#737373",
                fontSize: "0.875rem",
              }}
            >
              로그아웃하면 현재 세션이 종료됩니다.
            </p>

            <Button variant="primary" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              로그아웃
            </Button>
          </SettingsSection>
        </TabContent>

        {/* 도움말 탭 */}
        <TabContent active={activeTab === "help"}>
          <SettingsSection>
            <SectionTitle>
              <i className="fas fa-lightbulb"></i>
              페이지별 기능 안내
            </SectionTitle>

            <FeatureGrid>
              <FeatureCard>
                <i className="fas fa-home"></i>
                <h4>홈</h4>
                <p>
                  대시보드에서 생성한 메시지 수, 발송 완료 수, 활성 캠페인, 평균
                  전환율 등 주요 통계를 한눈에 확인할 수 있습니다.
                </p>
              </FeatureCard>

              <FeatureCard>
                <i className="fas fa-magic"></i>
                <h4>메시지 생성</h4>
                <p>
                  세그먼트 기반 대량 발송 또는 개인별 맞춤 메시지를 AI로 자동
                  생성하고 발송할 수 있습니다.
                </p>
              </FeatureCard>

              <FeatureCard>
                <i className="fas fa-user-circle"></i>
                <h4>고객 정보 조회</h4>
                <p>
                  고객 ID로 검색하여 기본 정보, 구매 이력, 행동 패턴 등 상세한
                  고객 정보를 확인할 수 있습니다.
                </p>
              </FeatureCard>

              <FeatureCard>
                <i className="fas fa-history"></i>
                <h4>발송 이력</h4>
                <p>
                  발송한 메시지의 전체 이력을 조회하고 상태별(발송
                  완료/실패/대기) 필터링이 가능합니다.
                </p>
              </FeatureCard>

              <FeatureCard>
                <i className="fas fa-bullhorn"></i>
                <h4>캠페인 조회</h4>
                <p>
                  현재 진행 중인 모든 캠페인을 조회하고 상태, 유형별로
                  필터링하여 확인할 수 있습니다.
                </p>
              </FeatureCard>

              <FeatureCard>
                <i className="fas fa-box"></i>
                <h4>상품 조회</h4>
                <p>
                  추천 가능한 모든 상품을 카테고리, 상태별로 조회하고 상세
                  정보를 확인할 수 있습니다.
                </p>
              </FeatureCard>

              <FeatureCard>
                <i className="fas fa-cog"></i>
                <h4>설정</h4>
                <p>
                  개인 정보 수정, 비밀번호 변경, 시스템 사용 가이드 및 고객 지원
                  정보를 확인할 수 있습니다.
                </p>
              </FeatureCard>
            </FeatureGrid>
          </SettingsSection>
        </TabContent>
      </SettingsContainer>
    </Layout>
  );
};

export default UserSettings;
