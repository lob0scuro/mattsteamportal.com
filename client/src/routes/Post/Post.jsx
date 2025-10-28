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
      setPost(data.post);
    };
    fetchPost();
  }, []);

  return <div>{post.id}</div>;
};

export default Post;
