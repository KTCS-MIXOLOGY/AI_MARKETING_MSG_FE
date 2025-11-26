import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

      // 관리자 계정
      if (username === "admin" && password === "admin123") {
        const adminUser = {
          id: 1,
          username: "admin",
          name: "관리자",
          email: "admin@ktcs.com",
          role: "admin",
          department: "관리팀",
        };

        localStorage.setItem("token", "admin_token_123");
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
        navigate("/admin");
        return { success: true };
      }

      // 사용자 계정
      if (username === "user" && password === "user123") {
        const normalUser = {
          id: 2,
          username: "user01",
          name: "김철수",
          email: "user01@ktcs.com",
          role: "user",
          department: "마케팅팀",
        };

        localStorage.setItem("token", "user_token_456");
        localStorage.setItem("user", JSON.stringify(normalUser));
        setUser(normalUser);
        navigate("/dashboard");
        return { success: true };
      }

      // 로그인 실패
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    } catch (error) {
      toast.error(error.message || "로그인에 실패했습니다.");
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // 목업 회원가입 기능
      const { username, password, name, email, department } = userData;

      // 유효성 검사
      if (!username || !password || !name || !email || !department) {
        throw new Error("모든 필드를 입력해주세요.");
      }

      // 회원가입 성공 처리
      toast.success("회원가입이 완료되었습니다. 로그인해주세요.");

      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      return { success: true };
    } catch (error) {
      toast.error(error.message || "회원가입에 실패했습니다.");
      return { success: false, error: error.message };
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
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }

      const responseData = await response.json();
      localStorage.setItem("user", JSON.stringify(responseData.user));
      setUser(responseData.user);
      toast.success("프로필이 업데이트되었습니다.");

      return { success: true };
    } catch (error) {
      toast.error(error.message || "프로필 업데이트에 실패했습니다.");
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
