import styles from "./ResetPassword.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/auth/reset_password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <div className={styles.resetPasswordContainer}>
      <h1>Reset Password Below</h1>
      <form className={styles.resetForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
