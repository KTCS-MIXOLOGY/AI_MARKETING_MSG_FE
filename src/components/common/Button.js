import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
  background-color: ${props => {
    if (props.variant === 'primary') return props.theme.colors.primary;
    if (props.variant === 'secondary') return '#f7fafc';
    if (props.variant === 'success') return props.theme.colors.success;
    if (props.variant === 'danger') return props.theme.colors.danger;
    return props.theme.colors.primary;
  }};
  color: ${props => {
    if (props.variant === 'primary' || props.variant === 'success' || props.variant === 'danger') {
      return 'white';
    }
    return '#4a5568';
  }};
  border: ${props => {
    if (props.variant === 'secondary') return '1px solid #e2e8f0';
    return 'none';
  }};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    opacity: 1;
    
    ${props => props.variant === 'secondary' && `
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    `}
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Button = ({ children, variant = 'primary', onClick, disabled, type = 'button', ...props }) => {
  return (
    <ButtonContainer
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </ButtonContainer>
  );
};

export default Button;