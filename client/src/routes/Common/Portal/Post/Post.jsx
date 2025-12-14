import { useNavigate, useParams } from "react-router-dom";
import styles from "./Post.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignsPost } from "@fortawesome/free-solid-svg-icons";
import { convertDateFromStr } from "../../../../utils/Helpers";
import { useAuth } from "../../../../Context/AuthContext";

const Post = () => {
  const { id } = useParams();
  const { setLoading } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      const response = await fetch(`/api/read/post/${id}`);
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setPost(data.post);
    };

    getPost();
    setLoading(false);
  }, [id]);

  if (!post) return <h1>Post not found</h1>;

  return (
    <div className={styles.postContainer}>
      <FontAwesomeIcon
        icon={faSignsPost}
        onClick={() => navigate("/posts")}
        className={styles.postReturnTo}
      />
      <div className={styles.postContent}>
        {post.file_path && (
          <img
            src={`http://127.0.0.1:8000/${post.file_path}`}
            alt={post.file_path}
            className={styles.postImage}
          />
        )}
        <div>
          <h1>{post.title}</h1>
          <small>{convertDateFromStr(post.created_at)}</small>
        </div>
        <p>{post.content}</p>
      </div>
      <div className={styles.commentSection}>
        <h3>Comments</h3>
        <div className={styles.comments}>
          {post.comments.length !== 0 ? (
            post.comments.map(
              ({ id, content, created_at, commenter }, index) => (
                <div key={index} className={styles.comment}>
                  <p>{content}</p>
                  <div>
                    <small>{convertDateFromStr(created_at)}</small>
                    <p>{commenter.username}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className={styles.comment}>
              <p>No comments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
