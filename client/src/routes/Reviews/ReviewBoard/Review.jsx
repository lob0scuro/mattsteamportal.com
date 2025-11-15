import styles from "./ReviewBoard.module.css";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "../../../utils/Helpers";

const Review = () => {
  const [review, setReview] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/reviews/get_review/${id}`);
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setReview(data.review);
      } catch (error) {
        setReview({});
        console.error("[ERROR]: ", error);
        toast.error(error.message);
      }
    };

    fetchReview();
  }, [id]);

  if (!review) return <h1>No Review selected</h1>;

  return (
    <div className={styles.reviewCard}>
      <div>
        <h3>[ Name ]</h3>
        <p>{review.name}</p>
      </div>
      <div>
        <h3>[ Email ]</h3>
        <p>{review.email}</p>
      </div>
      <div>
        <h3>[ Appliance ]</h3>
        <p>{review.appliance}</p>
      </div>
      <div>
        <h3>[ Sales Associate ]</h3>
        <p>{review.sales_associate}</p>
      </div>
      <div>
        <h3>[ Review ]</h3>
        <p>{review.review}</p>
        <small>{formatDate(review.created_on)}</small>
      </div>
      <Link to={"/review-board"} className={styles.backToReviewsLink}>
        Back to Reviews
      </Link>
    </div>
  );
};

export default Review;
