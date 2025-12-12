import styles from "./Settings.module.css";
import React, { useEffect, useState } from "react";
import ShiftForm from "../../../components/Forms/Shift/ShiftForm";
import { getShifts, getUsers } from "../../../utils/API";
import toast from "react-hot-toast";
import { toAMPM } from "../../../utils/Helpers";
import UserForm from "../../../components/Forms/User/UserForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleXmark,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [adding, setAdding] = useState({
    shift: false,
    user: false,
  });

  useEffect(() => {
    const get = async () => {
      const got = await getShifts();
      if (!got.success) {
        toast.error(got.message);
        return;
      }
      setShifts(got.shifts);
    };
    get();
  }, []);
  useEffect(() => {
    const get = async () => {
      const got = await getUsers();
      if (!got.success) {
        toast.error(got.message);
        return;
      }
      setUsers(got.users);
    };
    get();
  }, []);

  const handleUpdateShift = (newShift) => {
    setShifts((prev) => [...prev, newShift]);
  };
  const handleUpdateUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.shiftSettings}>
        <FontAwesomeIcon
          icon={adding.shift ? faCircleXmark : faCirclePlus}
          className={adding.shift ? styles.naw : styles.yaw}
          onClick={() => setAdding((prev) => ({ ...prev, shift: !prev.shift }))}
        />
        {adding.shift && (
          <div className={styles.addShiftContainer}>
            <ShiftForm onCreateShift={handleUpdateShift} />
          </div>
        )}
        <div className={styles.shiftItems}>
          <h3>Shifts</h3>
          {shifts
            .filter((s) => s.id !== 9999 && s.id !== 9998)
            .map((shift, index) => (
              <div key={index}>
                <p>{shift.title}</p>
                <p>
                  Start Time: <span>{toAMPM(shift.start_time)}</span>
                </p>
                <p>
                  End Time: <span>{toAMPM(shift.end_time)}</span>
                </p>
                <FontAwesomeIcon
                  icon={faDeleteLeft}
                  className={styles.deleteButton}
                />
              </div>
            ))}
        </div>
      </div>
      <div className={styles.userSettings}>
        <FontAwesomeIcon
          icon={adding.user ? faCircleXmark : faCirclePlus}
          className={adding.user ? styles.naw : styles.yaw}
          onClick={() => setAdding((prev) => ({ ...prev, user: !prev.user }))}
        />
        {adding.user && (
          <div className={styles.addUserContainer}>
            <UserForm onNewUser={handleUpdateUser} />
          </div>
        )}
        <div className={styles.userItems}>
          <h3>Users</h3>
          {users.map((user, index) => (
            <div key={index}>
              <p>{user.first_name}</p>
              <p>{user.email}</p>
              <FontAwesomeIcon
                icon={faDeleteLeft}
                className={styles.deleteButton}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
