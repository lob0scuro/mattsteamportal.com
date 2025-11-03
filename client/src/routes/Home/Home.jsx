import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/Helpers";
import { SERVER } from "../../utils/Variables";
import ScheduleDisplay from "../../components/ScheduleDisplay";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/read/get_posts/${selectedCategory}/${page}/10`
        );
        const data = await response.json();
        if (data.posts.length === 0) {
          setPosts([]);
        } else {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occured when loading posts");
      }
    };
    fetchPosts();
  }, [page, selectedCategory]);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <>
      <div className={styles.postBoardContainer}>
        <ScheduleDisplay />
        <div className={styles.postBoardHeader}>
          <div style={{ width: "100%" }}>
            <p>View posts by category</p>
            <select
              name="category-select"
              id="category-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="schedule">Schedule</option>
              <option value="memo">Memo</option>
              <option value="notice">Notice</option>
            </select>
          </div>
          {user.is_admin && (
            <Link to={"/post-form"}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          )}
        </div>
        <ul className={styles.postBoard}>
          {posts?.length === 0 ? (
            <li className={styles.noPost}>No posts to show</li>
          ) : (
            posts?.map(
              ({
                id,
                title,
                content,
                created_at,
                category,
                author,
                username,
                file_path,
              }) => (
                <li key={id} onClick={() => handlePostClick(id)}>
                  <h3>{title}</h3>
                  <div>
                    <p>{content}</p>
                    {file_path && (
                      <img
                        className={styles.postImage}
                        src={`${SERVER}${file_path}`}
                        alt=""
                      />
                    )}
                  </div>
                  <p className={styles.postHomeFooter}>
                    <b>{username}</b>
                    <span>{formatDate(created_at)}</span>
                  </p>
                </li>
              )
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default Home;
