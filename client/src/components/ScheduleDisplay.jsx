import styles from "./ScheduleDisplay.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SERVER } from "../utils/Variables";

const ScheduleDisplay = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const response = await fetch("/api/read/get_schedules");
      const data = await response.json();
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      if (data.schedules.length === 0) {
        toast.success(data.message);
      }
      setSchedules(data.schedules);
    };
    fetchSchedules();
  }, []);
  return (
    <>
      <h3 className={styles.thisWeeksSchedule}>This weeks Schedule</h3>
      <div className={styles.scheduleDisplayContainer}>
        {schedules?.length === 3 ? (
          schedules?.map(({ id, title, file_path }) => (
            <div
              key={id}
              className={styles.scheduleContainer}
              onClick={() => window.open(`${SERVER}${file_path}`, "_blank")}
            >
              <h4>{title}</h4>
              <img
                src={`${SERVER}${file_path}`}
                alt="Employee Schedule"
                className={styles.scheduleImage}
              />
              <p className={styles.expandButton}>**click to expand</p>
            </div>
          ))
        ) : (
          <p className={styles.noSchedulesYet}>
            [Schedules for this week <br />
            have not been finalized yet...]
          </p>
        )}
      </div>
    </>
  );
};

export default ScheduleDisplay;
