import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.collapsed ? '60px' : '250px'};
  background: white;
  border-right: 1px solid #e2e8f0;
  transition: width 0.3s ease-in-out;
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid #e2e8f0;
  min-height: 70px;
  background: #f8fafc;
`;

const Logo = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity 0.3s ease-in-out;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSizes.lg};
  color: #4a5568;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #edf2f7;
    color: ${props => props.theme.colors.primary};
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
`;

const NavItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #4a5568;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: #f7fafc;
    color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.active && `
    background: #ebf8ff;
    color: ${props.theme.colors.primary};
    border-left: 3px solid ${props.theme.colors.primary};
  `}
`;

const NavIcon = styled.span`
  margin-right: ${props => props.theme.spacing.sm};
  width: 20px;
  text-align: center;
  font-size: ${props => props.theme.fontSizes.md};
`;

const NavText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity 0.3s ease-in-out;
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.xs};
  margin-right: ${props => props.theme.spacing.sm};
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: ${props => props.theme.fontSizes.sm};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity 0.3s ease-in-out;
`;

const Sidebar = ({ collapsed, onToggle, activeMenu }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊', path: '/dashboard' },
    { id: 'customers', label: '고객관리', icon: '👥', path: '/customers' },
    { id: 'messages', label: '메시지 생성', icon: '✉️', path: '/message' },
    { id: 'campaigns', label: '캠페인', icon: '📢', path: '/campaigns' },
    { id: 'products', label: '상품', icon: '📦', path: '/products' },
    { id: 'settings', label: '설정', icon: '⚙️', path: '/settings' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊', path: '/admin' },
    { id: 'users', label: '회원관리', icon: '👥', path: '/admin/users' },
    { id: 'campaigns', label: '캠페인관리', icon: '📢', path: '/admin/campaigns' },
    { id: 'products', label: '상품관리', icon: '📦', path: '/admin/products' },
    { id: 'segments', label: '세그먼트관리', icon: '🎯', path: '/admin/segments' },
    { id: 'messages', label: '메시지로그', icon: '📝', path: '/admin/messages' },
  ];

  const getUserInitials = () => {
    return user?.name ? user.name.charAt(0) : 'U';
  };

  const getMenuItems = () => {
    return user?.role === 'admin' ? adminMenuItems : menuItems;
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader>
        <Logo collapsed={collapsed}>
          KT CS
        </Logo>
        <ToggleButton onClick={onToggle}>
          {collapsed ? '→' : '←'}
        </ToggleButton>
      </SidebarHeader>
      
      <Navigation>
        {getMenuItems().map(item => (
          <NavItem key={item.id}>
            <NavLink
              active={activeMenu === item.id}
              onClick={() => handleMenuClick(item.path)}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavText collapsed={collapsed}>{item.label}</NavText>
            </NavLink>
          </NavItem>
        ))}
      </Navigation>
      
      <SidebarFooter>
        <UserInfo>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserName collapsed={collapsed}>{user?.name || '사용자'}</UserName>
        </UserInfo>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;