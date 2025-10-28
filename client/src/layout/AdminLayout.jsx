import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <p>Loading...</p>;
  if (!user.is_admin)
    return (
      <>
        <h2>Admin Panel</h2>
        <p>Unauthorized Access</p>
        <button onClick={() => navigate("/")}>Return Home</button>
      </>
    );
  return <Outlet />;
};

export default AdminLayout;
