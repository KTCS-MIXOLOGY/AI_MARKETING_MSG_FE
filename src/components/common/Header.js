import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const HeaderContainer = styled.header`
  width: 100%;
  background: transparent;
  border-bottom: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 50px;
  margin-bottom: 1.4rem; /* 아래 콘텐츠와의 간격 */
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:hover .user-avatar {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(230, 0, 18, 0.4);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e60012 0%, #b8000e 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9375rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9375rem;
  color: #171717;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: #525252;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f5f5f5;
    color: #171717;
  }

  i {
    font-size: 0.875rem;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDisplayName = () => {
    if (!user) return "사용자";
    if (user.role === "ADMIN") return `${user.name} 관리자`;
    return `${user.name} 사용자`;
  };

  const getInitial = () => {
    if (!user) return "U";
    return user.name
      ? user.name.charAt(0)
      : user.role === "ADMIN"
      ? "관"
      : "실";
  };

  const handleUserInfoClick = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/settings");
    } else {
      navigate("/settings");
    }
  };

  return (
    <HeaderContainer>
      <HeaderRight>
        <UserInfo onClick={handleUserInfoClick}>
          <UserAvatar className="user-avatar">{getInitial()}</UserAvatar>
          <UserName>{getDisplayName()}</UserName>
        </UserInfo>

        <LogoutButton onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          로그아웃
        </LogoutButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
