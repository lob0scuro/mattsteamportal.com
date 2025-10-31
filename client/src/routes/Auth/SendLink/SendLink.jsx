import styles from "./SendLink.module.css";
import React, { use, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SendLink = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirm(`Send email to ${email}?`)) return;

    const response = await fetch("/api/auth/invite_link", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, is_admin: isAdmin }),
    });
    const data = await response.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    setEmail("");
    navigate("/");
  };

  return (
    <div className={styles.inviteContainer}>
      <h1>Invite New Team Member</h1>
      <p>Enter the email below to send an invite link to a new employee</p>
      <form className={styles.inviteForm} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter employee email...."
        />
        <label className={styles.adminCheck}>
          Make Admin:
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendLink;
