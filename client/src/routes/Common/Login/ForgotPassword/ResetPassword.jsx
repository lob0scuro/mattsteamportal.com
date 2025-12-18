import styles from "./ResetPassword.module.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitNewPassword = async () => {
    if (!confirm("Submit new password?")) return;
    try {
      const response = await fetch(`/api/auth/reset_password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirm: confirmPassword }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success("Password has been reset!");
      navigate("/login");
    } catch (error) {
      console.error("[RESET PASSWORD ERROR]: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.resetBlock}>
      <h2>Reset Password</h2>
      <form className={styles.newPasswordForm}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={submitNewPassword}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
