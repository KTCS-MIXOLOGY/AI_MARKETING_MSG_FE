import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Select from '../components/common/Select';

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8fafc;
  padding: ${props => props.theme.spacing.lg};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
`;

const Logo = styled.div`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: #1a202c;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #718096;
  margin-bottom: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.md};
`;

const Form = styled.form`
  text-align: left;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: #4a5568;
  font-weight: 500;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: ${props => props.theme.fontSizes.md};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const StyledSelect = styled(Select)`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: ${props => props.theme.fontSizes.md};
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const RegisterButton = styled(Button)`
  width: 100%;
  padding: 12px;
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: 600;
  border-radius: 8px;
  margin-top: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkGroup = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.sm};
  color: #718096;
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid #feb2b2;
`;

const SuccessMessage = styled.div`
  background: #c6f6d5;
  color: #22543d;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid #9ae6b4;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    department: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요.';
    }
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    }
    if (!formData.department.trim()) {
      newErrors.department = '부서를 선택해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          // 회원가입 성공 시 로그인 페이지로 이동
          window.location.href = '/login';
        }, 2000);
      } else {
        setErrors({ submit: result.error || '회원가입에 실패했습니다.' });
      }
    } catch (error) {
      setErrors({ submit: '회원가입에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { value: '', label: '부서를 선택하세요' },
    { value: '마케팅팀', label: '마케팅팀' },
    { value: '영업팀', label: '영업팀' },
    { value: '고객관리팀', label: '고객관리팀' },
    { value: '관리팀', label: '관리팀' },
    { value: '기술팀', label: '기술팀' },
  ];

  if (isSuccess) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <Logo>KT CS</Logo>
          <Title>회원가입 완료</Title>
          <SuccessMessage>
            회원가입이 성공적으로 완료되었습니다! 2초 후 로그인 페이지로 이동합니다.
          </SuccessMessage>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>KT CS</Logo>
        <Title>회원가입</Title>
        <Subtitle>KT CS 마케팅 시스템 계정을 만드세요</Subtitle>

        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="username">아이디 *</Label>
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
              <Label htmlFor="name">이름 *</Label>
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
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="password">비밀번호 *</Label>
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
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
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
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="email">이메일 *</Label>
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
            <Label htmlFor="department">부서 *</Label>
            <StyledSelect
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              disabled={loading}
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </StyledSelect>
          </FormGroup>
          
          <RegisterButton type="submit" disabled={loading}>
            {loading ? '회원가입 중...' : '회원가입'}
          </RegisterButton>
        </Form>
        
        <LinkGroup>
          이미 계정이 있으신가요? <StyledLink to="/login">로그인</StyledLink>
        </LinkGroup>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;