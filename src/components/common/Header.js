import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: ${props => props.sidebarCollapsed ? '60px' : '250px'};
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  z-index: 99;
  transition: left 0.3s ease-in-out;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSizes.xl};
  cursor: pointer;
  color: #4a5568;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    color: ${props => props.theme.colors.primary};
  }
`;

const Breadcrumb = styled.nav`
  color: #718096;
  font-size: ${props => props.theme.fontSizes.sm};
  
  & span {
    margin: 0 ${props => props.theme.spacing.xs};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-radius: 8px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const UserDetails = styled.div`
  text-align: left;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const UserRole = styled.div`
  color: #718096;
  font-size: ${props => props.theme.fontSizes.xs};
`;

const LogoutButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c53030;
    transform: translateY(-1px);
  }
`;

const Header = ({ sidebarCollapsed, onToggleSidebar, currentPage }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    return user?.name ? user.name.charAt(0) : 'U';
  };

  return (
    <HeaderContainer sidebarCollapsed={sidebarCollapsed}>
      <HeaderLeft>
        <ToggleButton onClick={onToggleSidebar}>
          {sidebarCollapsed ? '→' : '←'}
        </ToggleButton>
        <Breadcrumb>
          <span>홈</span>
          {currentPage && (<>
            <span></span>
            <span>{currentPage}</span>
          </>)}
        </Breadcrumb>
      </HeaderLeft>
      <HeaderRight>
        <UserInfo>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserDetails>
            <UserName>{user?.name || '사용자'}</UserName>
            <UserRole>{user?.role === 'admin' ? '관리자' : '일반 사용자'}</UserRole>
          </UserDetails>
        </UserInfo>
        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;