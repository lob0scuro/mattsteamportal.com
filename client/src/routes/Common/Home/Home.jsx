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
  MONTH_NAMES,
} from "../../../utils/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCalendarDay,
  faCalendarWeek,
  faCheckToSlot,
  faForwardStep,
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

  const getWeekHeader = () => {
    const start = currentWeek[0];
    const end = currentWeek[currentWeek.length - 1];
    const startMonth = MONTH_NAMES[start.getMonth()];
    const endMonth = MONTH_NAMES[end.getMonth()];
    return startMonth === endMonth
      ? `${startMonth} ${start.getDate()} - ${end.getDate()}`
      : `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
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

  // Helper: Build Mon-Sat week from a Monday
  const buildWeekFromMonday = (monday) => {
    const week = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      week.push(d);
    }
    return week;
  };

  //
  // WEEK CONTROLS
  //
  const goPrev = () => {
    const prevMonday = new Date(currentWeek[0]);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setCurrentWeek(buildWeekFromMonday(prevMonday));
  };

  const goToday = () => {
    setCurrentWeek(getWorkWeekFromDate(today));
  };

  const goNext = () => {
    const nextMonday = new Date(currentWeek[0]);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentWeek(buildWeekFromMonday(nextMonday));
  };

  return (
    <div className={styles.userHomeContainer}>
      <div className={styles.userHomeHeader}>
        <div className={styles.userNavi}>
          <FontAwesomeIcon icon={faSignsPost} onClick={() => goto("/posts")} />
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
        <h1>
          {user.first_name} {user.last_name}
        </h1>
        <div className={styles.switcher}>
          <button onClick={goPrev}>
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>
          <button onClick={goToday}>
            <FontAwesomeIcon icon={faCalendarWeek} />
          </button>
          <button onClick={goNext}>
            <FontAwesomeIcon icon={faForwardStep} />
          </button>
        </div>
      </div>
      <div className={styles.currentWeekSchedule}>
        <p className={styles.dateHeader}>
          <small>{getWeekHeader()}</small>
        </p>
        {schedule.length !== 0 ? (
          schedule.map(
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
                      ? `${toAMPM(shift.start_time)} - ${toAMPM(
                          shift.end_time
                        )}`
                      : shift.title}
                  </p>
                  {note && <p className={styles.shiftNote}>{note}</p>}
                </div>
              </div>
            )
          )
        ) : (
          <h2
            style={{
              textAlign: "center",
              alignSelf: "center",
              color: "darkred",
              padding: "1rem",
            }}
          >
            Schedule not set
          </h2>
        )}
      </div>
    </div>
  );
};

export default Home;
