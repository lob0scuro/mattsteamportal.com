import styles from "./ReviewBoard.module.css";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

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

  return <div>Review</div>;
};

export default Review;
