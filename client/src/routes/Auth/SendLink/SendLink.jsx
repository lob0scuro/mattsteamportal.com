import styles from "./SendLink.module.css";
import React, { useState } from "react";

const SendLink = () => {
  const [email, setEmail] = useState("");
  return (
    <div className={styles.inviteContainer}>
      <h1>Invite New Team Member</h1>
      <p>Enter the email below to send an invite link to a new employee</p>
      <form className={styles.inviteForm}>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter employee email...."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendLink;
