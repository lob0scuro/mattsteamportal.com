import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";
import LOGO from "../assets/matts-logo.png";

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
          <Link to={"/"}>
            <img src={LOGO} />
          </Link>
        </h1>
      </header>
      <div id="container">
        <Outlet />
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
      <footer>
        {user ? (
          <>
            <button onClick={logout}>LOGOUT</button>
            {user.is_admin && (
              <>
                <Link to={"/send-invite-link"} className="registration-link">
                  Send Registration Link
                </Link>
                <Link to={"/employee-directory"} className="registration-link">
                  Employee Directory
                </Link>
              </>
            )}
          </>
        ) : (
          <Link to={"request-password-reset"} className="registration-link">
            Forgot Password?
          </Link>
        )}

        <p>© 2025 Matt's Appliances</p>
      </footer>
    </>
  );
};

export default RootLayout;
