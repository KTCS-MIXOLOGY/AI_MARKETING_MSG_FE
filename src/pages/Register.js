import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Select from "../components/common/Select";

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #2d2d2d;
  padding: 2rem;
`;

const RegisterCard = styled(Card)`
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

const RegisterButton = styled(Button)`
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

const SuccessMessage = styled.div`
  background: #d1fae5;
  color: #059669;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  border: 1px solid #a7f3d0;
`;

const RoleSelection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
`;

const RoleCard = styled.div`
  padding: 0.5rem;
  border: 1.5px solid ${(props) => (props.selected ? "#E60012" : "#E0E0E0")};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  background: ${(props) => (props.selected ? "#FEE2E2" : "#FAFAFA")};

  &:hover {
    border-color: #e60012;
    background: ${(props) => (props.selected ? "#FEE2E2" : "#FFFFFF")};
  }
`;

const RoleTitle = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.8125rem;
  margin-bottom: 0.125rem;
`;

const RoleDesc = styled.div`
  font-size: 0.6875rem;
  color: #999999;
  line-height: 1.2;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "EXECUTOR",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "아이디를 입력해주세요.";
    } else if (formData.username.length < 4 || formData.username.length > 50) {
      newErrors.username = "아이디는 4~50자 사이여야 합니다.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "비밀번호는 8자 이상, 영문 소문자, 숫자, 특수문자를 포함해야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }

    if (formData.phone && !/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "전화번호 형식이 올바르지 않습니다. (010-XXXX-XXXX)";
    }

    if (!formData.department.trim()) {
      newErrors.department = "부서를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Backend API 요청에 맞는 형식으로 데이터 준비
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || null,
        department: formData.department,
        role: formData.role,
      };

      const result = await register(registerData);
      if (result.success) {
        setIsSuccess(true);
        // AuthContext에서 이미 navigate 처리하므로 여기서는 제거
      } else {
        setErrors({ submit: result.error || "회원가입에 실패했습니다." });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "회원가입에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };


  if (isSuccess) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <RedHeader>
            <Logo>
              <i className="fas fa-check-circle"></i>
              KT
            </Logo>
            <Subtitle>회원가입이 완료되었습니다</Subtitle>
          </RedHeader>
          <FormContainer>
            <SuccessMessage>
              회원가입이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.
              <br />
              2초 후 로그인 페이지로 이동합니다.
            </SuccessMessage>
          </FormContainer>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RedHeader>
          <Logo>
            <i className="fas fa-user-plus"></i>
            KT
          </Logo>
          <Subtitle>AI 마케팅 메시지 생성 시스템</Subtitle>
        </RedHeader>

        <FormContainer>
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                역할 선택 <span className="required">*</span>
              </Label>
              <RoleSelection>
                <RoleCard
                  selected={formData.role === "ADMIN"}
                  onClick={() => handleRoleSelect("ADMIN")}
                >
                  <RoleTitle>관리자</RoleTitle>
                  <RoleDesc>캠페인, 상품, 권한 관리</RoleDesc>
                </RoleCard>
                <RoleCard
                  selected={formData.role === "EXECUTOR"}
                  onClick={() => handleRoleSelect("EXECUTOR")}
                >
                  <RoleTitle>실행자</RoleTitle>
                  <RoleDesc>메시지 생성 및 발송</RoleDesc>
                </RoleCard>
              </RoleSelection>
            </FormGroup>

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
              <Label htmlFor="name">
                이름 <span className="required">*</span>
              </Label>
              <StyledInput
                id="name"
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
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

            <FormGroup>
              <Label htmlFor="confirmPassword">
                비밀번호 확인 <span className="required">*</span>
              </Label>
              <StyledInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">
                이메일 <span className="required">*</span>
              </Label>
              <StyledInput
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">전화번호</Label>
              <StyledInput
                id="phone"
                name="phone"
                type="text"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="department">
                부서 <span className="required">*</span>
              </Label>
              <StyledInput
                id="department"
                name="department"
                type="text"
                placeholder="부서명을 입력하세요"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                disabled={loading}
              />
            </FormGroup>

            <RegisterButton type="submit" disabled={loading}>
              <i className="fas fa-user-plus"></i>
              {loading ? "회원가입 중..." : "회원가입"}
            </RegisterButton>
          </Form>

          <Divider>또는</Divider>

          <LinkGroup>
            이미 계정이 있으신가요? <StyledLink to="/login">로그인</StyledLink>
          </LinkGroup>
        </FormContainer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
