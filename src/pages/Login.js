import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ffffff;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

/* ===== 왼쪽 영역 (소개 섹션) ===== */

const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #e60012 0%, #b8000e 100%);
  padding: 3.5rem 3rem; /* ✅ 스크롤 방지용 축소 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 1024px) {
    padding: 3rem 2rem;
    min-height: 40vh;
  }
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 500px;
`;

const LeftLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  font-size: 1.75rem;
  font-weight: 700;

  i {
    font-size: 2rem;
  }
`;

const IntroTitle = styled.h1`
  font-size: 2.3rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const IntroSubtitle = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  opacity: 0.95;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.2rem;
    color: #ffffff;
  }
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const FeatureDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.55;
  word-break: keep-all; /* ✅ '다' 줄바꿈 방지 */
`;

/* ===== 오른쪽 영역 (로그인 폼) ===== */

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem; /* ✅ 스크롤 방지용 축소 */
  background: #fafafa;

  @media (max-width: 1024px) {
    padding: 3rem 2rem;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 470px;
  background: #ffffff;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
`;

const RedHeader = styled.div`
  background: #e60012;
  padding: 1.75rem 2rem 2rem; /* ✅ 축소 */
  text-align: center;
  color: #ffffff;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.6rem;

  i {
    font-size: 1.9rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  margin: 0;
`;

const FormContainer = styled.div`
  padding: 1.75rem 2.25rem 2rem; /* ✅ 축소 */
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 1.4rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  font-weight: 500;
  font-size: 0.875rem;

  span.required {
    color: #e60012;
    margin-left: 2px;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  font-size: 0.8rem;
  background: #fafafa;

  &:focus {
    outline: none;
    border-color: #e60012;
    background: #ffffff;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: 0.85rem;
  font-size: 0.93rem;
  font-weight: 600;
  border-radius: 6px;
  background: #e60012;
  border: none;
  color: white;
  margin-top: 1.2rem;

  &:hover:not(:disabled) {
    background: #c50010;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.3rem 0;
  color: #999999;
  font-size: 0.875rem;
`;

const LinkGroup = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #666666;
  margin-bottom: 1.2rem;
`;

const StyledLink = styled(Link)`
  color: #e60012;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

/* ===== 데모 계정 ===== */

const DemoInfo = styled.div`
  background: #f8f8f8;
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid #eeeeee;
`;

const DemoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333333;
  font-size: 0.9rem;
  margin-bottom: 0.9rem;

  i {
    font-size: 0.9rem;
    color: #666666;
  }
`;

const DemoRow = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.825rem;

  & + & {
    margin-top: 0.5rem;
  }
`;

const DemoText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  strong {
    font-weight: 600;
  }
`;

const QuickIconButton = styled.button`
  border: none;
  background: transparent;
  font-size: 0.75rem;
  color: #666666;
  cursor: pointer;

  &:hover {
    color: #e60012;
  }
`;

/* ================== 로직 ================== */

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.username.trim()) e.username = "아이디를 입력해주세요.";
    if (!formData.password.trim()) e.password = "비밀번호를 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData);
      if (result && !result.success) {
        setErrors({ submit: result.error || "로그인에 실패했습니다." });
      }
    } catch {
      setErrors({ submit: "로그인에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (username, password) => {
    setLoading(true);
    try {
      const result = await login({ username, password });
      if (result && !result.success) {
        setErrors({ submit: result.error || "로그인에 실패했습니다." });
      }
    } catch {
      setErrors({ submit: "로그인에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  /* ✅ 아이콘 = FontAwesome 클래스, 1번 설명 줄바꿈 해결 */
  const features = [
    {
      icon: "fas fa-wand-magic-sparkles",
      title: "AI 기반 메시지 생성",
      description:
        "고객 데이터를 분석하여 최적화된 마케팅 메시지를 자동으로 생성합니다",
    },
    {
      icon: "fas fa-chart-line",
      title: "실시간 성과 분석",
      description:
        "캠페인 성과를 실시간으로 모니터링하고 인사이트를 제공합니다",
    },
    {
      icon: "fas fa-users",
      title: "고객 세그먼트 관리",
      description:
        "다양한 조건으로 고객을 세그먼트화하여 타겟 마케팅을 수행합니다",
    },
  ];

  return (
    <LoginContainer>
      <LeftSection>
        <LeftContent>
          <LeftLogo>
            <i className="fas fa-comments" />
            메시지 믹솔로지 (mixology)
          </LeftLogo>

          <IntroTitle>
            AI 기반 <br /> 마케팅 메시지 <br /> 자동 생성 시스템
          </IntroTitle>

          <IntroSubtitle>
            고객 세그먼트와 캠페인을 선택하면 <br />
            AI가 최적화된 메시지를 생성합니다
          </IntroSubtitle>

          <FeatureList>
            {features.map((f, i) => (
              <FeatureItem key={i}>
                <FeatureIcon>
                  <i className={f.icon} />
                </FeatureIcon>
                <FeatureText>
                  <FeatureTitle>{f.title}</FeatureTitle>
                  <FeatureDescription>{f.description}</FeatureDescription>
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </LeftContent>
      </LeftSection>

      <RightSection>
        <LoginCard>
          <RedHeader>
            <Logo>
              <i className="fas fa-comments" />
              메시지 믹솔로지
            </Logo>
            <Subtitle>AI 마케팅 메시지 생성 시스템</Subtitle>
          </RedHeader>

          <FormContainer>
            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>아이디 *</Label>
                <StyledInput
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>비밀번호 *</Label>
                <StyledInput
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormGroup>

              <LoginButton type="submit" disabled={loading}>
                로그인
              </LoginButton>
            </Form>

            <Divider>또는</Divider>

            <LinkGroup>
              계정이 없으신가요?{" "}
              <StyledLink to="/register">회원가입</StyledLink>
            </LinkGroup>

            {/* <DemoInfo>
              <DemoTitle>
                <i className="fas fa-info-circle" />
                데모 계정 정보
              </DemoTitle>

              <DemoRow>
                <DemoText>
                  <strong>관리자:</strong>&nbsp;admin / admin123
                </DemoText>
                <QuickIconButton
                  onClick={() => handleQuickLogin("admin", "admin123")}
                >
                  바로 로그인
                </QuickIconButton>
              </DemoRow>

              <DemoRow>
                <DemoText>
                  <strong>실행자:</strong>&nbsp;user / user123
                </DemoText>
                <QuickIconButton
                  onClick={() => handleQuickLogin("user", "user123")}
                >
                  바로 로그인
                </QuickIconButton>
              </DemoRow>
            </DemoInfo> */}
          </FormContainer>
        </LoginCard>
      </RightSection>
    </LoginContainer>
  );
};

export default Login;
