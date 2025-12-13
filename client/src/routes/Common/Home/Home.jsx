import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import {
  getWorkWeekFromDate,
  WEEKDAY,
  formatDate,
  parseLocalDate,
  toAMPM,
  convertDateFromStr,
} from "../../../utils/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCheckToSlot,
  faGears,
  faPeopleGroup,
  faSignsPost,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const start = formatDate(currentWeek[0]);
    const end = formatDate(currentWeek[currentWeek.length - 1]);
    const scheduleGet = async () => {
      const res = await fetch(
        `/api/read/user_schedule/${user.id}?start_date=${start}&end_date=${end}`
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }
      setSchedule(data.schedule);
    };
    scheduleGet();
  }, [user, currentWeek]);

  const goto = (path) => {
    navigate(path);
  };

  const getWeekdayHeader = (shiftDateStr) => {
    const dateObj = parseLocalDate(shiftDateStr);

    const index = currentWeek.findIndex(
      (d) =>
        d.getFullYear() === dateObj.getFullYear() &&
        d.getMonth() === dateObj.getMonth() &&
        d.getDate() === dateObj.getDate()
    );

    if (index === -1) return "";

    return WEEKDAY[index];
  };

  return (
    <div className={styles.userHomeContainer}>
      <div className={styles.userHomeHeader}>
        <h1>
          {user.first_name} {user.last_name}
        </h1>
        <div className={styles.userNavi}>
          {/* <FontAwesomeIcon icon={faCalendarDay} /> */}
          <FontAwesomeIcon icon={faSignsPost} />
          <FontAwesomeIcon icon={faPeopleGroup} />
          <FontAwesomeIcon
            icon={faUserClock}
            onClick={() => goto("/time-off-request")}
          />
          {user.role === "admin" && (
            <>
              <FontAwesomeIcon
                icon={faGears}
                onClick={() => goto("/settings")}
              />
              <FontAwesomeIcon
                icon={faCalendarDays}
                onClick={() => goto("/scheduler")}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles.currentWeekSchedule}>
        {schedule.map(
          (
            { id, location, note, shift, shift_date, shift_id, user },
            index
          ) => (
            <div key={index} className={styles.dayOfWeek}>
              <h3>
                {getWeekdayHeader(shift_date)}{" "}
                <small>{convertDateFromStr(shift_date)}</small>
              </h3>
              <div>
                <p>
                  {shift_id !== 9999
                    ? `${toAMPM(shift.start_time)} - ${toAMPM(shift.end_time)}`
                    : shift.title}
                </p>
                {note && <p className={styles.shiftNote}>{note}</p>}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
