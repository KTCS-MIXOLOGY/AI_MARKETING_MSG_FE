import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { username, password } = credentials;

      // Backend API 호출
      const response = await authAPI.login({ username, password });

      if (response.data && response.data.success) {
        const { accessToken, user: userData } = response.data.data;

        // 토큰 및 사용자 정보 저장
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        toast.success(`${userData.name}님, 환영합니다!`);

        // 역할에 따라 리다이렉트 (Backend는 ADMIN, EXECUTOR 대문자로 반환)
        if (userData.role === "ADMIN") {
          navigate("/admin");
        } else if (userData.role === "EXECUTOR") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }

        return { success: true };
      } else {
        throw new Error(response.data?.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.data && response.data.success) {
        toast.success("회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.");

        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        return { success: true };
      } else {
        throw new Error(response.data?.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);

      if (response.data && response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("프로필이 업데이트되었습니다.");

        return { success: true };
      } else {
        throw new Error(response.data?.message || "프로필 업데이트에 실패했습니다.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN", // Backend는 대문자로 반환
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
