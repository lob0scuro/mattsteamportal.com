import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/Helpers";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/read/get_posts/${page}/10`);
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
  }, [page]);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <>
      <div className={styles.postBoardContainer}>
        <div className={styles.postBoardHeader}>
          <h4>Recent Posts</h4>
          {user.is_admin && <Link to={"/post-form"}>+</Link>}
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
                file_path,
              }) => (
                <li key={id} onClick={() => handlePostClick(id)}>
                  <h3>{title}</h3>
                  <div>
                    <p>{content}</p>
                    {file_path && (
                      <>
                        {file_path.toLowerCase().endsWith(".pdf") ? (
                          <embed
                            src={`http://127.0.0.1:8000/${file_path}`}
                            type="application/pdf"
                            width={"100%"}
                            height={"300px"}
                          />
                        ) : (
                          <img
                            className={styles.postImage}
                            src={`http://127.0.0.1:8000/${file_path}`}
                            alt=""
                          />
                        )}
                      </>
                    )}
                  </div>
                  <p className={styles.postHomeFooter}>
                    <b>{author}</b>
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
