import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '8px'};
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary;
      case 'success':
        return props.theme.colors.success;
      case 'danger':
        return props.theme.colors.danger;
      case 'warning':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.primary;
    }
  }};
  width: ${props => props.percentage || 0}%;
  transition: width 0.3s ease-in-out;
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ProgressBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ProgressBar = ({ 
  percentage = 0, 
  label,
  variant = 'primary',
  height = '8px',
  showPercentage = true,
  ...props 
}) => {
  return (
    <div {...props}>
      {label && (
        <ProgressBarLabel>
          <span>{label}</span>
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </ProgressBarLabel>
      )}
      <ProgressBarContainer height={height}>
        <ProgressBarFill 
          percentage={Math.min(100, Math.max(0, percentage))}
          variant={variant}
        />
      </ProgressBarContainer>
    </div>
  );
};

export default ProgressBar;