import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCircleXmark,
  faMinus,
  faPlus,
  faSignsPost,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Post.module.css";
import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/Helpers";
import { SERVER } from "../../utils/Variables";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Post = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post_id } = useParams();
  const [post, setPost] = useState({});
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");

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

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const submitPost = await fetch(`/api/create/add_comment/${post_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });
      const data = await submitPost.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);

      setPost((prev) => ({
        ...prev,
        comments: prev.comments
          ? [data.comment, ...prev.comments]
          : [data.comment],
      }));

      setComment("");
      setCommenting(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error: ", error);
    }
  };

  const deleteComment = async (id) => {
    if (!confirm("Delete comment?")) return;
    try {
      const del = await fetch(`/api/delete/delete_comment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await del.json();
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments
          ? prev.comments.filter((comment) => comment.id !== id)
          : [],
      }));
    } catch (error) {
      toast.error(error.message);
      console.error("[ERROR]: ", error);
    }
  };

  return (
    <div className={styles.postPageContainer}>
      {user.is_admin && (
        <Link className={styles.createPostButton} to="/post-form">
          {" "}
          <FontAwesomeIcon icon={faSignsPost} />
          Create New Post
        </Link>
      )}
      <h1>{post.title}</h1>
      {post.file_path && (
        <div className={styles.postImageContainer}>
          {post.file_path && (
            <img src={`${SERVER}${post.file_path}`} alt="Post image" />
          )}
        </div>
      )}
      <p className={styles.postContentP}>{post.content}</p>
      <div className={styles.postPageFooter}>
        <p>
          {post.author?.first_name} {post.author?.last_name[0]}.
        </p>
        <small>{formatDate(post.created_at)}</small>
      </div>
      {user.is_admin && user.id === post.author_id && (
        <div className={styles.postControls}>
          <button onClick={() => navigate(`/edit-post/${post_id}`)}>
            Edit Post
          </button>
          <button onClick={handleDelete}>Delete Post</button>
        </div>
      )}
      <div className={styles.commentBox}>
        <div>
          <h4>Comments</h4>
          <button
            className={styles.addPostButton}
            onClick={() => setCommenting(!commenting)}
          >
            {commenting ? (
              <FontAwesomeIcon icon={faMinus} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
          </button>
        </div>
        <ul>
          {commenting && (
            <li>
              <form onSubmit={postComment} className={styles.commentForm}>
                <textarea
                  name="comment"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button type="submit">Post</button>
              </form>
            </li>
          )}
          {post.comments?.length > 0 ? (
            post.comments.map(
              ({ commenter, content, id, created_on, user_id }) => (
                <li key={id} className={styles.commentLine}>
                  <div className={styles.commentBody}>
                    <p>{content}</p>
                    {user.id === user_id && (
                      <button
                        onClick={() => deleteComment(id)}
                        className={styles.deletePost}
                      >
                        <FontAwesomeIcon icon={faCircleXmark} />
                      </button>
                    )}
                  </div>
                  <div className={styles.commentFooter}>
                    <p>{commenter.username}</p>
                    <p>{formatDate(created_on)}</p>
                  </div>
                </li>
              )
            )
          ) : (
            <li className={styles.noComments}>No comments on this post yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Post;
