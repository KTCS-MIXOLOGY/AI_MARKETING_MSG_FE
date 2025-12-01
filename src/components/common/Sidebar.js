import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SidebarContainer = styled.div`
  width: 260px;
  background: #1a1a1a;
  color: #ffffff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e60012;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  i {
    font-size: 1.75rem;
  }
`;

const Navigation = styled.nav`
  padding: 1rem 0;
`;

const NavItem = styled.div`
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  color: ${(props) => (props.active ? "#FFFFFF" : "#D4D4D4")};
  transition: all 0.3s ease;
  cursor: pointer;
  background: ${(props) => (props.active ? "#E60012" : "transparent")};
  border-left: ${(props) =>
    props.active ? "4px solid #FFFFFF" : "4px solid transparent"};

  &:hover {
    background: ${(props) =>
      props.active ? "#E60012" : "rgba(255, 255, 255, 0.05)"};
    color: #ffffff;
  }

  i {
    font-size: 1.125rem;
    width: 20px;
    text-align: center;
  }

  span {
    font-size: 0.9375rem;
    font-weight: 500;
  }
`;

const Sidebar = ({ activeMenu }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    {
      id: "dashboard",
      label: "홈",
      icon: "fa-home",
      path: "/admin",
    },
    {
      id: "campaigns",
      label: "캠페인 관리",
      icon: "fa-bullhorn",
      path: "/admin/campaigns",
    },
    {
      id: "products",
      label: "상품 관리",
      icon: "fa-box",
      path: "/admin/products",
    },
    {
      id: "segments",
      label: "세그먼트 관리",
      icon: "fa-users",
      path: "/admin/segments",
    },
    {
      id: "users",
      label: "실행자 관리",
      icon: "fa-user-cog",
      path: "/admin/users",
    },
    {
      id: "logs",
      label: "로그 관리",
      icon: "fa-chart-line",
      path: "/admin/messages",
    },
    {
      id: "settings",
      label: "설정",
      icon: "fa-cog",
      path: "/admin/settings",
    },
  ];

  const userMenuItems = [
    {
      id: "dashboard",
      label: "홈",
      icon: "fa-home",
      path: "/dashboard",
    },
    {
      id: "message",
      label: "메시지 생성",
      icon: "fa-magic",
      path: "/message",
    },
    {
      id: "customer-view",
      label: "고객 360도 뷰",
      icon: "fa-user-circle",
      path: "/customers",
    },
    {
      id: "history",
      label: "생성 이력",
      icon: "fa-history",
      path: "/history",
    },
    {
      id: "campaigns",
      label: "캠페인 조회",
      icon: "fa-bullhorn",
      path: "/campaigns",
    },
    {
      id: "products",
      label: "상품 조회",
      icon: "fa-box",
      path: "/products",
    },
    {
      id: "settings",
      label: "설정",
      icon: "fa-cog",
      path: "/settings",
    },
  ];

  const getMenuItems = () => {
    return user?.role === "admin" ? adminMenuItems : userMenuItems;
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLogoText = () => {
    return user?.role === "admin" ? "KT Admin" : "KT User";
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <i className="fas fa-comments"></i>
          <span>{getLogoText()}</span>
        </Logo>
      </SidebarHeader>

      <Navigation>
        {getMenuItems().map((item) => (
          <NavItem
            key={item.id}
            active={isActive(item.path)}
            onClick={() => handleMenuClick(item.path)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavItem>
        ))}
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;
