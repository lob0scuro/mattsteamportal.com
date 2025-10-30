import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Post.module.css";
import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/Helpers";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate();
  const { post_id } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/read/get_post/${post_id}`);
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        setPost({});
      }
      console.log(data.post);
      setPost(data.post);
    };
    fetchPost();
  }, [post_id]);

  const handleDelete = async () => {
    if (!confirm("Delete Post?")) return;

    try {
      const response = await fetch(`/api/delete/delete_post/${post_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }
      toast.success("Post has been deleted");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error("[ERROR]:: ", error);
    }
  };

  return (
    <div className={styles.postPageContainer}>
      <Link className={styles.createPostButton}>
        {" "}
        <FontAwesomeIcon icon={faSignsPost} />
        Create New Post
      </Link>
      <h1>{post.title}</h1>
      {post.file_path && (
        <div className={styles.postImageContainer}>
          {post.file_path && (
            <img
              src={`http://127.0.0.1:8000/${post.file_path}`}
              alt="Post image"
            />
          )}
        </div>
      )}
      <p className={styles.postContentP}>{post.content}</p>
      <div className={styles.postPageFooter}>
        <p>{post.author}</p>
        <small>{formatDate(post.created_at)}</small>
      </div>
      <div className={styles.postControls}>
        <button onClick={() => navigate(`/edit-post/${post_id}`)}>
          Edit Post
        </button>
        <button onClick={handleDelete}>Delete Post</button>
      </div>
    </div>
  );
};

export default Post;
