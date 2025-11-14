import { useNavigate } from "react-router-dom";
import styles from "./ReviewBoard.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/Helpers";

const ReviewBoard = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews/get_reviews");
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        if (data.reviews.length === 0) {
          setReviews([]);
          toast.success("no reviews");
        }
        setReviews(data.reviews);
      } catch (error) {
        console.log("[ERROR]: ", error);
        toast.error(error.message);
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <h1 className={styles.reviewHeader}>Reviews</h1>
      <ul className={styles.reviewBoard}>
        {reviews.map(
          ({
            id,
            name,
            email,
            appliance,
            sales_associate,
            review,
            created_on,
          }) => (
            <li key={id}>
              <h3>{name}</h3>
              <p>{review}</p>
              <small>{formatDate(created_on)}</small>
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default ReviewBoard;
