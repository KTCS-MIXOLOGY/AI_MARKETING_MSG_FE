import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8fafc;
  padding: ${props => props.theme.spacing.lg};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
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

const LoginButton = styled(Button)`
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

const DemoInfo = styled.div`
  background: #e6fffa;
  color: #234e52;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid #81e6d9;
  text-align: left;
`;

const DemoTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DemoItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.xs};
  &:last-child {
    margin-bottom: 0;
  }
`;

const QuickLogin = styled.div`
  display: flex;
  gap: 8px;
  margin-top: ${props => props.theme.spacing.md};
`;

const QuickButton = styled.button`
  flex: 1;
  padding: 8px;
  font-size: ${props => props.theme.fontSizes.xs};
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #edf2f7;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
        setErrors({ submit: result.error || '로그인에 실패했습니다.' });
      }
    } catch (error) {
      setErrors({ submit: '로그인에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>KT CS</Logo>
        <Title>마케팅 메시지 생성 시스템</Title>
        <Subtitle>AI 기반 개인화된 마케팅 메시지를 생성하세요</Subtitle>
        
        <DemoInfo>
          <DemoTitle>📝 테스트 계정</DemoTitle>
          <DemoItem><strong>관리자:</strong> admin / admin123</DemoItem>
          <DemoItem><strong>사용자:</strong> user01 / user123</DemoItem>
          <QuickLogin>
            <QuickButton type="button" onClick={() => quickLogin('admin', 'admin123')}>
              관리자로 바로 로그인
            </QuickButton>
            <QuickButton type="button" onClick={() => quickLogin('user01', 'user123')}>
              사용자로 바로 로그인
            </QuickButton>
          </QuickLogin>
        </DemoInfo>

        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">아이디</Label>
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
            <Label htmlFor="password">비밀번호</Label>
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
            {loading ? '로그인 중...' : '로그인'}
          </LoginButton>
        </Form>
        
        <LinkGroup>
          계정이 없으신가요? <StyledLink to="/register">회원가입</StyledLink>
        </LinkGroup>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;