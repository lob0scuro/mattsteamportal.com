import styles from "./ShiftForm.module.css";
import React, { useState } from "react";

const ShiftForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" value={formData.title} />
      </div>
      <div>
        <label htmlFor="start_time">Start Time</label>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="end_time">End Time</label>
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default ShiftForm;
