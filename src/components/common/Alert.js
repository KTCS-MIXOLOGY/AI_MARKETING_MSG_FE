import React from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#cce7ff';
      case 'secondary':
        return props.theme.colors.gray[100];
      case 'success':
        return '#d4edda';
      case 'danger':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      case 'info':
        return '#d1ecf1';
      default:
        return props.theme.colors.gray[100];
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#004085';
      case 'secondary':
        return props.theme.colors.gray[700];
      case 'success':
        return '#155724';
      case 'danger':
        return '#721c24';
      case 'warning':
        return '#856404';
      case 'info':
        return '#0c5460';
      default:
        return props.theme.colors.gray[700];
    }
  }};
  
  border-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#b8daff';
      case 'secondary':
        return props.theme.colors.gray[300];
      case 'success':
        return '#c3e6cb';
      case 'danger':
        return '#f5c6cb';
      case 'warning':
        return '#ffeaa7';
      case 'info':
        return '#bee5eb';
      default:
        return props.theme.colors.gray[300];
    }
  }};
`;

const AlertTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: 600;
`;

const AlertContent = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
`;

const Alert = ({ 
  children, 
  variant = 'secondary', 
  title,
  dismissible = false,
  onClose,
  ...props 
}) => {
  return (
    <AlertContainer variant={variant} {...props}>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertContent>{children}</AlertContent>
      {dismissible && (
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: '0.5'
          }}
        >
          &times;
        </button>
      )}
    </AlertContainer>
  );
};

export default Alert;