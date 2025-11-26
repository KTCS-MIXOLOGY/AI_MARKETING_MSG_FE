import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MessageSegment from "./pages/UserMsgSeg";
import MessageIndividual from "./pages/UserMsgIndiv";
import Message from "./pages/UserMessage";
import Customers from "./pages/UserCustomers";
import Campaigns from "./pages/UserCampaigns";
import Products from "./pages/UserProducts";
import Settings from "./pages/UserSettings";
import Customer360 from "./pages/UserCustomerList";
import UserHistory from "./pages/UserHistory";
import AdminUsers from "./pages/AdminUsers";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminProducts from "./pages/AdminProducts";
import AdminSegments from "./pages/AdminSegments";
import AdminMessages from "./pages/AdminMessages";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { theme, GlobalStyles } from "./styles/theme";

function App() {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard onMenuClick={handleMenuClick} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard onMenuClick={handleMenuClick} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute adminOnly>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/campaigns"
            element={
              <PrivateRoute adminOnly>
                <AdminCampaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute adminOnly>
                <AdminProducts />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/segments"
            element={
              <PrivateRoute adminOnly>
                <AdminSegments />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <PrivateRoute adminOnly>
                <AdminMessages />
              </PrivateRoute>
            }
          />
          <Route
            path="/message/segment"
            element={
              <PrivateRoute>
                <MessageSegment />
              </PrivateRoute>
            }
          />
          <Route
            path="/message/individual"
            element={
              <PrivateRoute>
                <MessageIndividual />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/message"
            element={
              <PrivateRoute>
                <Message />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <PrivateRoute>
                <Campaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <UserHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/:id"
            element={
              <PrivateRoute>
                <Customer360 />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
