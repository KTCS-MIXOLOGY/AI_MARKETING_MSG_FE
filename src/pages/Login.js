// src/pages/Login.js (예시 경로)

import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #2d2d2d;
  padding: 2rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 470px;
  margin: 0 auto;
  background: #ffffff;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
`;

const RedHeader = styled.div`
  background: #e60012;
  padding: 2rem 2rem 2.5rem;
  text-align: center;
  color: #ffffff;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;

  i {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  margin: 0;
`;

const FormContainer = styled.div`
  padding: 2rem 2.5rem;
`;

const Form = styled.form`
  margin-bottom: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
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
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e60012;
    background: #ffffff;
    box-shadow: 0 0 0 1px rgba(230, 0, 18, 0.12);
  }

  &::placeholder {
    color: #b3b3b3;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 6px;
  background: #e60012;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;

  &:hover:not(:disabled) {
    background: #c50010;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 0.875rem;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  color: #999999;
  font-size: 0.875rem;
`;

const LinkGroup = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #666666;
  margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: #e60012;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
`;

/* ▼ 데모 계정 박스 – 두 번째 디자인 느낌 */

const DemoInfo = styled.div`
  background: #f8f8f8;
  border-radius: 12px;
  padding: 1.25rem 1.25rem 1.4rem;
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
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #333333;

  & + & {
    margin-top: 0.55rem;
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
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #666666;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease;

  i {
    font-size: 0.8rem;
  }

  &:hover {
    background: #f2f2f2;
    color: #e60012;
  }
`;

/* ▲ 여기까지 데모 계정 스타일 */

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "아이디를 입력해주세요.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData);
      if (!result.success) {
        setErrors({ submit: result.error || "로그인에 실패했습니다." });
      }
    } catch (error) {
      setErrors({ submit: "로그인에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  // 데모 계정 바로 로그인
  const handleQuickLogin = async (username, password) => {
    setFormData({ username, password });
    setErrors({});
    setLoading(true);
    try {
      const result = await login({ username, password });
      if (!result.success) {
        setErrors({ submit: result.error || "로그인에 실패했습니다." });
      }
    } catch (error) {
      setErrors({ submit: "로그인에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <RedHeader>
          <Logo>
            <i className="fas fa-comments" />
            KT
          </Logo>
          <Subtitle>AI 마케팅 메시지 생성 시스템</Subtitle>
        </RedHeader>

        <FormContainer>
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">
                아이디 <span className="required">*</span>
              </Label>
              <StyledInput
                id="username"
                name="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">
                비밀번호 <span className="required">*</span>
              </Label>
              <StyledInput
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={loading}
              />
            </FormGroup>

            <LoginButton type="submit" disabled={loading}>
              <i className="fas fa-arrow-right" />
              {loading ? "로그인 중..." : "로그인"}
            </LoginButton>
          </Form>

          <Divider>또는</Divider>

          <LinkGroup>
            계정이 없으신가요? <StyledLink to="/register">회원가입</StyledLink>
          </LinkGroup>

          {/* 데모 계정 블록 */}
          <DemoInfo>
            <DemoTitle>
              <i className="fas fa-info-circle" />
              데모 계정 정보
            </DemoTitle>

            <DemoRow>
              <DemoText>
                <strong>관리자:</strong>
                <span>admin / admin123</span>
              </DemoText>
              <QuickIconButton
                type="button"
                onClick={() => handleQuickLogin("admin", "admin123")}
                aria-label="관리자 계정으로 바로 로그인"
              >
                <i className="far fa-copy" />
                <span>바로 로그인</span>
              </QuickIconButton>
            </DemoRow>

            <DemoRow>
              <DemoText>
                <strong>실행자:</strong>
                <span>user / user123</span>
              </DemoText>
              <QuickIconButton
                type="button"
                onClick={() => handleQuickLogin("user", "user123")}
                aria-label="실행자 계정으로 바로 로그인"
              >
                <i className="far fa-copy" />
                <span>바로 로그인</span>
              </QuickIconButton>
            </DemoRow>
          </DemoInfo>
        </FormContainer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
