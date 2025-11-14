import { useNavigate } from "react-router-dom";
import styles from "./ReviewBoard.module.css";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

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
      <h1>Reviews</h1>
      <ul>
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
            <li key={id}>{review}</li>
          )
        )}
      </ul>
    </>
  );
};

export default ReviewBoard;
