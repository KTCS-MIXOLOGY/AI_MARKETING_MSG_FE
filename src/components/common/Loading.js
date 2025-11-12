import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing['2xl']};
`;

const Spinner = styled.div`
  width: ${props => props.size === 'sm' ? '20px' : props.size === 'lg' ? '60px' : '40px'};
  height: ${props => props.size === 'sm' ? '20px' : props.size === 'lg' ? '60px' : '40px'};
  border: ${props => {
    const size = props.size === 'sm' ? '2px' : props.size === 'lg' ? '6px' : '4px';
    return `${size} solid ${props.theme.colors.gray[200]}`;
  }};
  border-top: ${props => {
    const size = props.size === 'sm' ? '2px' : props.size === 'lg' ? '6px' : '4px';
    return `${size} solid ${props.theme.colors.primary}`;
  }};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const Loading = ({ 
  text = '로딩 중...', 
  size = 'md', 
  showText = true,
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}>
        <LoadingContainer>
          <Spinner size={size} />
          {showText && <LoadingText>{text}</LoadingText>}
        </LoadingContainer>
      </div>
    );
  }

  return (
    <LoadingContainer>
      <Spinner size={size} />
      {showText && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default Loading;