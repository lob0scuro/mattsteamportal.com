import styles from "./ReviewForm.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ReviewForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    appliance: "",
    sales_associate: "",
    review: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reviews/send_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      navigate("/thank-you");
    } catch (error) {
      console.error("[ERROR]:: ", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={styles.reviewTitle}>
        <h1>Thank you for choosing Matt&apos;s Appliances!</h1>
        <h3>
          We appreciate your business and would like to ask for your feedback to
          help improve the customer service we provide to our community.
        </h3>
      </div>
      <div className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div>
            <label for="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.whichAppliance}>
            <label for="appliance">Which appliance did you come in for?</label>
            <select
              name="appliance"
              id="appliance"
              value={formData.appliance}
              onChange={handleChange}
            >
              <option value="">--Select Appliance--</option>
              <option value="refrigerator">Refrigerator</option>
              <option value="washer">Washer</option>
              <option value="dryer">Dryer</option>
              <option value="range">Oven/Range</option>
              <option value="dishwasher">Dishwasher</option>
              <option value="window_unit">A/C Window Unit</option>
              <option value="microwave">Microwave</option>
              <option value="water_heater">Water Heater</option>
              <option value="part">Parts</option>
              <option value="service">Service</option>
            </select>
          </div>
          <div className={styles.whichAssociate}>
            <label for="sales_associate">
              Who did you speak with when you came in the store?
            </label>
            <select
              name="sales_associate"
              id="sales_associate"
              value={formData.sales_associate}
              onChange={handleChange}
            >
              <option value="">--Select an Associate--</option>
              <option value="anthony_lubin">Anthony Lubin</option>
              <option value="jerry_ames">Jerry Ames</option>
              <option value="brandon_carona">Brandon Carona</option>
              <option value="nacoby_hayes">Na'Coby Hayes</option>
              <option value="andrew_domingues">Andrew Domingues</option>
              <option value="chase_warden">Chase Warden</option>
              <option value="irving_bush">Irving Bush</option>
              <option value="chris_pace">Chris Pace</option>
              <option value="unsure">Unsure</option>
            </select>
          </div>
          <div>
            <label for="review">Comments</label>
            <textarea name="review" id="review"></textarea>
          </div>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
