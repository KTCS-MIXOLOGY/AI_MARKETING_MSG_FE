import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import Loading from '../components/common/Loading';

const MessageContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const StepContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: ${props => props.theme.spacing.md};
`;

const StepTitle = styled.h3`
  margin: 0;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[600]};
`;

const StepContent = styled.div`
  margin-left: 56px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const CustomerInfo = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CustomerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CustomerName = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.xl};
`;

const CustomerDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
`;

const DetailLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.8;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DetailValue = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
`;

const MessageOption = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const MessageContent = styled.div`
  font-size: ${props => props.theme.fontSizes.md};
  line-height: 1.6;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[600]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl};
`;

const GeneratedMessage = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  position: relative;
`;

const MessageText = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.md};
  line-height: 1.5;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const CharCounter = styled.div`
  text-align: right;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.warning ? props.theme.colors.danger : props.theme.colors.gray[600]};
  margin-top: ${props => props.theme.spacing.xs};
`;

const MessageIndividual = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: 고객 검색
  const [searchType, setSearchType] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Step 2: 캠페인 선택
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Step 3: 상품 선택
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Step 4: 톤앤매너
  const [tone, setTone] = useState('');
  
  // Step 5: 생성된 메시지
  const [generatedMessages, setGeneratedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Step 6: 메시지 수정
  const [editingMessage, setEditingMessage] = useState('');

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'messages', label: '메시지 관리', icon: '💬' },
    { id: 'campaigns', label: '캠페인', icon: '📢' },
    { id: 'customers', label: '고객 관리', icon: '👥' },
    { id: 'analytics', label: '분석', icon: '📈' },
  ];

  const searchTypeOptions = [
    { value: 'id', label: '고객 ID' },
    { value: 'phone', label: '전화번호' },
  ];

  // 임시 고객 데이터
  const mockCustomers = [
    {
      id: 'CUST001',
      name: '김철수',
      phone: '010-1234-5678',
      age: 32,
      gender: 'male',
      region: '서울',
      membership: 'gold',
      plan: '5G 프리미엄',
      device: '갤럭시 S23',
      joinDate: '2022-03-15',
      contractEnd: '2025-03-14',
      monthlyData: '15.2GB',
      recentPurchase: '2024-01-10',
    },
    {
      id: 'CUST002',
      name: '이영희',
      phone: '010-8765-4321',
      age: 28,
      gender: 'female',
      region: '경기',
      membership: 'platinum',
      plan: 'LTE 베이직',
      device: '아이폰 14',
      joinDate: '2021-08-20',
      contractEnd: '2024-08-19',
      monthlyData: '8.7GB',
      recentPurchase: '2024-01-05',
    },
  ];

  const campaignOptions = [
    {
      id: 1,
      name: '갤럭시 S23 사전예약 캠페인',
      type: '신규 고객 유치',
      description: '최신 갤럭시 시리즈 사전예약 고객 대상',
      status: 'active',
    },
    {
      id: 2,
      name: '5G 요금제 업그레이드',
      type: '기존 고객 유지',
      description: '기존 4G 요금제 사용자 대상 5G 업그레이드',
      status: 'active',
    },
    {
      id: 3,
      name: 'IoT 가정용 상품 소개',
      type: '업셀링',
      description: 'IoT 제품 관심 고객 대상 홍보',
      status: 'active',
    },
  ];

  const productOptions = [
    {
      id: 1,
      name: '갤럭시 S23 Ultra',
      category: '스마트폰',
      price: 1299000,
      discount: 10,
      benefits: ['최신 프로세서', '고화질 카메라', 'S펜 포함'],
    },
    {
      id: 2,
      name: '아이폰 14 Pro',
      category: '스마트폰',
      price: 1399000,
      discount: 5,
      benefits: ['A16 칩', '프로 카메라 시스템', '다이나믹 아일랜드'],
    },
    {
      id: 3,
      name: '5G 프리미엄 요금제',
      category: '요금제',
      price: 100000,
      discount: 20,
      benefits: ['무제한 데이터', '프리미엄 부가서비스', '우선 고객지원'],
    },
  ];

  const toneOptions = [
    { value: 'formal', label: '격식있는 (Formal)' },
    { value: 'friendly', label: '친근한 (Friendly)' },
    { value: 'casual', label: '캐주얼한 (Casual)' },
    { value: 'professional', label: '전문적인 (Professional)' },
  ];

  const handleMenuClick = (menuId) => {
    if (menuId === 'dashboard') {
      navigate('/dashboard');
    }
  };

  const searchCustomer = () => {
    if (!searchValue.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      // 검색 로직 - 실제로는 API 호출
      const foundCustomer = mockCustomers.find(customer => {
        if (searchType === 'id') {
          return customer.id.toLowerCase().includes(searchValue.toLowerCase());
        } else {
          return customer.phone.includes(searchValue);
        }
      });
      
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer);
        setCurrentStep(2);
      } else {
        alert('고객을 찾을 수 없습니다.');
      }
      setLoading(false);
    }, 1000);
  };

  const selectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setCurrentStep(3);
  };

  const toggleProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, product]);
    }
  };

  const selectTone = (toneValue) => {
    setTone(toneValue);
  };

  const generateMessages = () => {
    // AI 메시지 생성 로직 - API 호출
    setLoading(true);
    setTimeout(() => {
      const customerName = selectedCustomer.name;
      const messages = [
        {
          id: 1,
          content: `${customerName} 고객님, 안녕하세요! ${selectedCampaign.name} 특별 혜택을 준비했습니다. ${selectedProducts.map(p => p.name).join(', ')} 제품으로 특별한 경험을 선사합니다.`,
          tone: 'formal',
          charCount: 95,
        },
        {
          id: 2,
          content: `>${customerName}<님, ${selectedCampaign.name}이 시작되었어요! ${selectedProducts.map(p => p.name).join(', ')} 제품들이 특별한 가격으로 준비되어 있어요.`,
          tone: 'friendly',
          charCount: 78,
        },
        {
          id: 3,
          content: `>${customerName}<님! ${selectedCampaign.name} 놓치지 마세요! ${selectedProducts.map(p => p.name).join(', ')} 지금 바로 확인하세요!`,
          tone: 'casual',
          charCount: 68,
        },
      ];
      setGeneratedMessages(messages);
      setLoading(false);
      setCurrentStep(5);
    }, 3000);
  };

  const selectMessage = (message) => {
    setSelectedMessage(message);
    setEditingMessage(message.content);
    setCurrentStep(6);
  };

  const handleMessageEdit = (content) => {
    setEditingMessage(content);
  };

  const saveMessage = () => {
    // 메시지 저장 로직 - API 호출
    alert('메시지가 저장되었습니다!');
    navigate('/dashboard');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editingMessage);
    alert('클립보드에 복사되었습니다!');
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (loading) {
    return <Loading fullScreen text="AI 메시지 생성 중..." />;
  }

  return (
    <Layout
      sidebar={
        <Sidebar
          menuItems={menuItems}
          activeMenu="messages"
          onMenuClick={handleMenuClick}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      }
      header={
        <Header
          user={user}
          onLogout={logout}
          sidebarCollapsed={sidebarCollapsed}
          breadcrumbs={[
            { label: '대시보드', href: '/dashboard' },
            { label: '개별 고객 메시지 생성', active: true }
          ]}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      <MessageContainer>
        <h2>개별 고객 메시지 생성</h2>
        <p className="text-muted mb-4">특정 고객을 위한 1:1 맞춤형 마케팅 메시지를 생성합니다.</p>

        <ProgressBar 
          percentage={(currentStep / 6) * 100} 
          label={`단계 ${currentStep} / 6`}
          variant="primary"
        />

        {/* Step 1: 고객 검색 */}
        <StepContainer>
          <StepHeader>
            <StepNumber active={currentStep >= 1}>1</StepNumber>
            <StepTitle active={currentStep >= 1}>고객 검색</StepTitle>
          </StepHeader>
          
          {currentStep >= 1 && (
            <StepContent>
              <SearchContainer>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  options={searchTypeOptions}
                  style={{ width: '150px' }}
                />
                <SearchInput
                  placeholder={searchType === 'id' ? '고객 ID를 입력하세요' : '전화번호를 입력하세요'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
                />
                <Button variant="primary" onClick={searchCustomer}>검색</Button>
              </SearchContainer>
            </StepContent>
          )}
        </StepContainer>

        {/* Step 2: 고객 정보 확인 */}
        {currentStep >= 2 && selectedCustomer && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 2}>2</StepNumber>
              <StepTitle active={currentStep >= 2}>고객 정보 확인</StepTitle>
            </StepHeader>
            
            <StepContent>
              <CustomerInfo>
                <CustomerHeader>
                  <CustomerName>{selectedCustomer.name} 고객님</CustomerName>
                  <Badge variant="primary">{selectedCustomer.membership.toUpperCase()}</Badge>
                </CustomerHeader>
                
                <CustomerDetails>
                  <DetailItem>
                    <DetailLabel>나이</DetailLabel>
                    <DetailValue>{selectedCustomer.age}세</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>성별</DetailLabel>
                    <DetailValue>{selectedCustomer.gender === 'male' ? '남성' : '여성'}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>지역</DetailLabel>
                    <DetailValue>{selectedCustomer.region}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>요금제</DetailLabel>
                    <DetailValue>{selectedCustomer.plan}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>단말기</DetailLabel>
                    <DetailValue>{selectedCustomer.device}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>가입일</DetailLabel>
                    <DetailValue>{selectedCustomer.joinDate}</DetailValue>
                  </DetailItem>
                </CustomerDetails>
              </CustomerInfo>
              
              {currentStep === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <Button variant="primary" onClick={nextStep}>다음 단계로</Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 3: 캠페인 선택 */}
        {currentStep >= 3 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 3}>3</StepNumber>
              <StepTitle active={currentStep >= 3}>캠페인 선택</StepTitle>
            </StepHeader>
            
            <StepContent>
              {campaignOptions.map((campaign) => (
                <Card
                  key={campaign.id}
                  hover
                  onClick={() => selectCampaign(campaign)}
                  style={{
                    border: selectedCampaign?.id === campaign.id ? '2px solid #0066cc' : '1px solid #dee2e6',
                    cursor: 'pointer'
                  }}
                >
                  <h4>{campaign.name}</h4>
                  <p style={{ color: '#6c757d', marginBottom: '8px' }}>{campaign.description}</p>
                  <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                    {campaign.type}
                  </Badge>
                </Card>
              ))}
              
              {currentStep === 3 && selectedCampaign && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button variant="primary" onClick={nextStep}>다음 단계로</Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 4: 상품 선택 */}
        {currentStep >= 4 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 4}>4</StepNumber>
              <StepTitle active={currentStep >= 4}>상품 선택</StepTitle>
            </StepHeader>
            
            <StepContent>
              {productOptions.map((product) => (
                <Card
                  key={product.id}
                  hover
                  onClick={() => toggleProduct(product)}
                  style={{
                    border: selectedProducts.find(p => p.id === product.id) ? '2px solid #0066cc' : '1px solid #dee2e6',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  <h4>{product.name}</h4>
                  <p style={{ color: '#6c757d', marginBottom: '8px' }}>{product.category} • ₩{product.price.toLocaleString()}</p>
                  <div style={{ marginBottom: '8px' }}>
                    {product.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" style={{ marginRight: '4px' }}>{benefit}</Badge>
                    ))}
                  </div>
                  <Badge variant={product.discount > 0 ? 'danger' : 'primary'}>
                    {product.discount > 0 ? `${product.discount}% 할인` : '일반가'}
                  </Badge>
                </Card>
              ))}
              
              {currentStep === 4 && selectedProducts.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button variant="primary" onClick={nextStep}>다음 단계로</Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 4: 톤앤매너 선택 */}
        {currentStep >= 5 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 5}>5</StepNumber>
              <StepTitle active={currentStep >= 5}>톤앤매너 선택</StepTitle>
            </StepHeader>
            
            <StepContent>
              {toneOptions.map((option) => (
                <Card
                  key={option.value}
                  hover
                  onClick={() => selectTone(option.value)}
                  style={{
                    border: tone === option.value ? '2px solid #0066cc' : '1px solid #dee2e6',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    padding: '24px'
                  }}
                >
                  <h4 style={{ marginBottom: '8px' }}>{option.label}</h4>
                  <p style={{ color: '#6c757d', margin: 0 }}>
                    {option.value === 'formal' && '격식있고 정중한 메시지'}
                    {option.value === 'friendly' && '친근하고 따뜻한 메시지'}
                    {option.value === 'casual' && '편안하고 캐주얼한 메시지'}
                    {option.value === 'professional' && '전문적이고 신뢰있는 메시지'}
                  </p>
                </Card>
              ))}
              
              {currentStep === 5 && tone && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button variant="primary" onClick={generateMessages}>AI 메시지 생성</Button>
                </div>
              )}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 5: 생성된 메시지 선택 */}
        {currentStep >= 5 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 5}>5</StepNumber>
              <StepTitle active={currentStep >= 5}>메시지 선택</StepTitle>
            </StepHeader>
            
            <StepContent>
              {generatedMessages.map((message) => (
                <MessageOption
                  key={message.id}
                  selected={selectedMessage?.id === message.id}
                  onClick={() => selectMessage(message)}
                >
                  <MessageContent>{message.content}</MessageContent>
                  <MessageMeta>
                    <span>톤: {message.tone} • 글자 수: {message.charCount}자</span>
                    <Badge 
                      variant={message.charCount <= 90 ? 'success' : 'warning'}
                    >
                      {message.charCount <= 90 ? 'SMS 적합' : 'SMS 초과'}
                    </Badge>
                  </MessageMeta>
                </MessageOption>
              ))}
            </StepContent>
          </StepContainer>
        )}

        {/* Step 6: 메시지 수정 */}
        {currentStep >= 6 && (
          <StepContainer>
            <StepHeader>
              <StepNumber active={currentStep >= 6}>6</StepNumber>
              <StepTitle active={currentStep >= 6}>메시지 수정</StepTitle>
            </StepHeader>
            
            <StepContent>
              <GeneratedMessage>
                <MessageText
                  value={editingMessage}
                  onChange={(e) => handleMessageEdit(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                />
                <CharCounter warning={editingMessage.length > 90}>
                  {editingMessage.length} / 90자 (SMS 기준)
                </CharCounter>
              </GeneratedMessage>
              
              <ActionButtons>
                <Button variant="secondary" onClick={copyToClipboard}>📋 복사</Button>
                <Button variant="primary" onClick={saveMessage}>💾 저장</Button>
              </ActionButtons>
            </StepContent>
          </StepContainer>
        )}

      </MessageContainer>
    </Layout>
  );
};

export default MessageIndividual;