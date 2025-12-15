import styles from "./TeamSchedule.module.css";
import React, { useEffect, useState } from "react";
import { DEPARTMENTS } from "../../../../utils/Enums";
import {
  getWorkWeekFromDate,
  renderObjects,
  MONTH_NAMES,
  formatDate,
  convertDateFromStr,
  parseLocalDate,
  WEEKDAY,
  toAMPM,
} from "../../../../utils/Helpers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCalendarWeek,
  faChevronLeft,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";

const TeamSchedule = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDpt, setSelectedDpt] = useState(user.department);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const start = formatDate(currentWeek[0]);
    const end = formatDate(currentWeek[currentWeek.length - 1]);
    const scheduleGet = async () => {
      const res = await fetch(
        `/api/read/team_schedules/${selectedDpt}?start_date=${start}&end_date=${end}`
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }
      //   console.log(data.schedules);
      setSchedules(data.schedules);
    };
    scheduleGet();
  }, [user, currentWeek, selectedDpt]);

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
    <div className={styles.teamScheduleContainer}>
      <FontAwesomeIcon
        icon={faChevronLeft}
        onClick={() => navigate(-1 || "/")}
        className={styles.goBack}
      />
      <select
        name="selectedDpt"
        value={selectedDpt}
        onChange={(e) => setSelectedDpt(e.target.value)}
      >
        {renderObjects(DEPARTMENTS)}
      </select>
      <p className={styles.teamWeekHeader}>{getWeekHeader()}</p>
      <div className={styles.teamWeekNavi}>
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
      <div className={styles.scheduleList}>
        {schedules.map(({ user, schedules }, index) => (
          <div className={styles.scheduleItem} key={index}>
            <h4>{user.first_name}</h4>
            <div className={styles.userWeek}>
              {schedules.map(({ id, shift, shift_date }, sIndex) => (
                <div key={sIndex} className={styles.userDay}>
                  <p>{getWeekdayHeader(shift_date)}</p>
                  <p>
                    {toAMPM(shift.start_time)}-{toAMPM(shift.end_time)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSchedule;
