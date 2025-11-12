import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.gray[50]};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '60px' : '250px'};
  padding-top: 70px;
  transition: margin-left 0.3s ease-in-out;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
  > *:first-child {
    margin-top: 0;
  }
`;

const Layout = ({ 
  children, 
  sidebarCollapsed, 
  sidebar,
  header,
  ...props 
}) => {
  return (
    <LayoutContainer {...props}>
      {sidebar}
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        {header}
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;