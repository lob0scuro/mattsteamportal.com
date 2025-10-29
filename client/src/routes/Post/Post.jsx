import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./Post.module.css";
import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/Helpers";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Post = () => {
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

  return (
    <div className={styles.postPageContainer}>
      <h1>{post.title}</h1>
      {post.file_path && (
        <div className={styles.postImageContainer}>
          {post.file_path.toLowerCase().endsWith(".pdf") ? (
            <>
              <embed
                src={`http://127.0.0.1:8000/${post.file_path}`}
                type="application/pdf"
                width={"100%"}
                height={"500px"}
              />
              <a
                href={`http://127.0.0.1:8000/${post.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> open PDF in
                new tab
              </a>
            </>
          ) : (
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
    </div>
  );
};

export default Post;
