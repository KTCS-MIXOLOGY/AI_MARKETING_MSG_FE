import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
  color: #4a5568;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const StyledInput = styled.input`
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
  
  &:disabled {
    background-color: #f7fafc;
    border-color: #e2e8f0;
    cursor: not-allowed;
    color: #a0aec0;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  ${props => props.error && `
    border-color: ${props.theme.colors.danger};
    &:focus {
      border-color: ${props.theme.colors.danger};
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
  `}
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.danger};
  font-weight: 500;
`;

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  disabled, 
  required,
  ...props 
}) => {
  return (
    <InputContainer>
      {label && (
        <Label>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </Label>
      )}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        required={required}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;