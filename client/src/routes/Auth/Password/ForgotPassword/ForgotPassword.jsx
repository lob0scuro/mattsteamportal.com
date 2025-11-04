import styles from "./ForgotPassword.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/request_password_reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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
    <div className={styles.requestResetContainer}>
      <h1>Request a password reset</h1>
      <form className={styles.requestResetForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Request Password Reset</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
