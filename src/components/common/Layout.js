import React from "react";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.gray[50]};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${(props) => (props.sidebarCollapsed ? "60px" : "250px")};
  padding-top: 0; /* 헤더를 ContentWrapper 안으로 옮겼으니 0으로 */
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: ${(props) => props.theme.spacing.lg};

  > *:first-child {
    margin-top: 0; /* 첫 요소(헤더)에 위쪽 마진이 있으면 제거 */
  }
`;

const Layout = ({ children, sidebarCollapsed, sidebar, header, ...props }) => {
  return (
    <LayoutContainer {...props}>
      {sidebar}
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <ContentWrapper>
          {header}
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
