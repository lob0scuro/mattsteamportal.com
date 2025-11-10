import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/Helpers";
import { SERVER } from "../../utils/Variables";
import ScheduleDisplay from "../../components/ScheduleDisplay";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/read/get_posts/${selectedCategory}/${page}/5`
        );
        const data = await response.json();
        if (data.posts.length === 0) {
          setPosts([]);
        } else {
          setPosts(data.posts);
          setCurrentPage(data.page);
          setTotalPages(data.total_pages);
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
      <ScheduleDisplay />
      <div className={styles.postBoardContainer}>
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
              <FontAwesomeIcon icon={faSquarePlus} />
            </Link>
          )}
        </div>
        <div className={styles.pageControls}>
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <ul className={styles.postBoard}>
          {posts?.length === 0 ? (
            <li className={styles.noPost}>No posts to show</li>
          ) : (
            posts?.map(
              ({ id, title, created_at, username, file_path, category }) => (
                <li key={id} onClick={() => handlePostClick(id)}>
                  <div>
                    <h3>{title}</h3>
                    <p className={styles.postDate}>{formatDate(created_at)}</p>
                    <p className={styles.postAuthor}>{username}</p>
                  </div>
                  <div>
                    {file_path && (
                      <img
                        className={styles.postImage}
                        src={`${SERVER}${file_path}`}
                        alt=""
                      />
                    )}
                  </div>
                  <small
                    className={clsx(
                      styles.categoryTag,
                      category === "schedule" && styles.schedulePost,
                      category === "memo" && styles.memoPost,
                      category === "notice" && styles.noticePost
                    )}
                  >
                    {category}
                  </small>
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
