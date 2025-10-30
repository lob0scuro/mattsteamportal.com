import styles from "./PostForm.module.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditPostForm = () => {
  const navigate = useNavigate();
  const { post_id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/read/get_post/${post_id}`);
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        console.log(data.post);
        setFormData({
          category: data.post.category,
          title: data.post.title,
          content: data.post.content,
        });

        if (data.post.file_path) {
          setFile(`http://127.0.0.1:8000/${data.post.file_path}`);
          setSelectedImage(`http://127.0.0.1:8000/${data.post.file_path}`);
        }
      } catch (error) {
        toast.error("Error fetching post");
        console.error(error);
      }
    };
    fetchPost();
  }, [post_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setSelectedImage(URL.createObjectURL(f));
    } else {
      setFile(null);
      setSelectedImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputs = new FormData();
    inputs.append("title", formData.title);
    inputs.append("category", formData.category);
    inputs.append("content", formData.content);

    if (file && file instanceof File) inputs.append("upload", file);

    try {
      const response = await fetch(`/api/update/update_post/${post_id}`, {
        method: "PATCH",
        credentials: "include",
        body: inputs,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Someting went wrong");
      }

      toast.success(data.message || "Post updated successfully!");
      navigate(`/post/${post_id}`);
    } catch (error) {
      console.error("[ERROR]:: ", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <h1>New Post</h1>
      <form onSubmit={handleSubmit} className={styles.postForm}>
        <div>
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">--Select Category--</option>
            <option value="notice">Notice</option>
            <option value="memo">Memo</option>
            <option value="schedule">Schedule</option>
          </select>
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="upload" className={styles.imageLabel}>
            Upload Image
          </label>
          <input
            type="file"
            name="upload"
            id="upload"
            accept="img/png, img/jpg, application/pdf"
            onChange={handleFileChange}
          />
        </div>
        {selectedImage && (
          <div className={styles.imageContainer}>
            <button
              type="button"
              className={styles.deleteImagePreview}
              onClick={() => {
                if (!confirm("Delete Image?")) return;
                setSelectedImage(null);
              }}
            >
              X
            </button>
            {file?.type === "application/pdf" ? (
              <embed
                src={selectedImage}
                type="application/pdf"
                width={"100%"}
                height={"auto"}
                className={styles.pdfPreview}
              />
            ) : (
              <img
                className={styles.imagePreview}
                src={selectedImage}
                alt="Image Preview"
              />
            )}
          </div>
        )}
        <div>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <button type="submit">Post</button>
        </div>
      </form>
    </>
  );
};
export default EditPostForm;
