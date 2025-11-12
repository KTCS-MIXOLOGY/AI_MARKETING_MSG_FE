import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary;
      case 'secondary':
        return props.theme.colors.gray[200];
      case 'success':
        return props.theme.colors.success;
      case 'danger':
        return props.theme.colors.danger;
      case 'warning':
        return props.theme.colors.warning;
      case 'info':
        return props.theme.colors.info;
      default:
        return props.theme.colors.gray[200];
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary':
      case 'success':
      case 'danger':
      case 'info':
        return props.theme.colors.white;
      case 'warning':
        return props.theme.colors.gray[800];
      default:
        return props.theme.colors.gray[700];
    }
  }};
`;

const Badge = ({ children, variant = 'secondary', ...props }) => {
  return (
    <BadgeContainer variant={variant} {...props}>
      {children}
    </BadgeContainer>
  );
};

export default Badge;