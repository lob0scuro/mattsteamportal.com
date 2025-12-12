import styles from "./Settings.module.css";
import React, { useState } from "react";
import ShiftForm from "../../../components/Forms/Shift/ShiftForm";

const Settings = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  return (
    <div className={styles.settingsContainer}>
      <h2>Settings</h2>
      <div className={styles.settingsItems}>
        <div className={styles.shiftSettings}>
          <div className={styles.addShiftContainer}>
            <ShiftForm />
          </div>
          <div className={styles.shiftItems}>
            {shifts.map((shift, index) => (
              <p key={index}>{shift.title}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
