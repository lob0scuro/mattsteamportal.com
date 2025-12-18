import toast from "react-hot-toast";
import styles from "./ForgotPassword.module.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);

  const submitResetRequest = async () => {
    if (!confirm("Send reset link?")) return;
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
      toast.success("Request sent!");
      setResponseMessage(data.message);
    } catch (error) {
      console.error("[FORGOT PASSWORD ERROR]: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.forgotBlock}>
      <h2>Enter your email below to request a reset link</h2>
      <div>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={submitResetRequest}>Submit</button>
      </div>
      {responseMessage && (
        <>
          <p className={styles.responseMessage}>{responseMessage}</p>
          <Link to="/login" className={styles.backToLogin}>
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
