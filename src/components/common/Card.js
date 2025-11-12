import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: ${props => props.padding || props.theme.spacing.lg};
  margin-bottom: ${props => props.marginBottom || props.theme.spacing.lg};
  transition: all 0.2s ease;
  
  ${props => props.hover && `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid #e2e8f0;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const CardContent = styled.div`
  color: #4a5568;
`;

const Card = ({ 
  title, 
  children, 
  headerAction, 
  padding, 
  marginBottom, 
  hover = false,
  ...props 
}) => {
  return (
    <CardContainer 
      padding={padding} 
      marginBottom={marginBottom}
      hover={hover}
      {...props}
    >
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {headerAction}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

export default Card;