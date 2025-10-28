import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";

const RootLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    const response = await fetch("/api/auth/logout");
    const data = await response.json();
    if (data.success) {
      setUser(null);
      toast.success(data.message);
      navigate("/login");
    } else {
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <header>
        <h1>
          <Link to={"/"}>Matt's Team Portal</Link>
        </h1>
      </header>
      <div id="container">
        <Outlet />
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
      <footer>
        {user && <button onClick={logout}>LOGOUT</button>}
        <p>© 2025 Matt's Appliances</p>
      </footer>
    </>
  );
};

export default RootLayout;
