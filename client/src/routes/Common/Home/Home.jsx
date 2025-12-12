import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { getWorkWeekFromDate, WEEKDAY } from "../../../utils/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCheckToSlot,
  faGears,
  faSignsPost,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));

  useEffect(() => {
    console.log(currentWeek);
  }, []);

  const goto = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.userHomeContainer}>
      <div className={styles.userHomeHeader}>
        <h1>
          {user.first_name} {user.last_name}
        </h1>
        <div className={styles.userNavi}>
          <FontAwesomeIcon icon={faUserClock} />
          <FontAwesomeIcon icon={faSignsPost} />
          {user.role === "admin" && <FontAwesomeIcon icon={faGears} />}
        </div>
      </div>
      <div className={styles.currentWeekSchedule}>
        {currentWeek.map((day, index) => {
          return (
            <div className={styles.weekday} key={index}>
              <h3>{WEEKDAY[day.getDay() - 1]}</h3>
              <p>{day.toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
