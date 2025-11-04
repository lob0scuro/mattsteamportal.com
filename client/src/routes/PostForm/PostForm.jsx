import styles from "./PostForm.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
    schedule_week: "",
  });

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

    if (file) inputs.append("upload", file);
    if (formData.schedule_week)
      inputs.append("schedule_week", formData.schedule_week);
    try {
      const response = await fetch("/api/create/create_post", {
        method: "POST",
        credentials: "include",
        body: inputs,
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setFormData({
        category: "",
        title: "",
        content: "",
        schedule_week: "",
      });
      setFile(null);
      setSelectedImage(null);
      navigate(`/post/${data.post_id}`);
    } catch (error) {
      console.error("Error: ", error);
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
            required
          >
            <option value="">--Select Category--</option>
            <option value="notice">Notice</option>
            <option value="memo">Memo</option>
            <option value="schedule">Schedule</option>
          </select>
        </div>
        {formData.category === "schedule" && (
          <div>
            <label htmlFor="schedule_week">Week Of</label>
            <input
              type="date"
              name="schedule_week"
              id="schedule_week"
              value={formData.schedule_week}
              onChange={(e) => {
                const selected = new Date(e.target.value);
                const day = selected.getUTCDay();
                if (day !== 1) {
                  toast.error("Please select a Monday");
                  setFormData({ ...formData, schedule_week: "" });
                  return;
                }
                handleChange(e);
              }}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="title">
            {formData.category === "schedule" ? "Team" : "Title"}
          </label>
          {formData.category === "schedule" ? (
            <select
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
            >
              <option value="">--select team---</option>
              <option value="Sales">Sales</option>
              <option value="Cleaners">Cleaners</option>
              <option value="Techs">Techs</option>
            </select>
          ) : (
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          )}
        </div>

        <div>
          <label htmlFor="upload" className={styles.imageLabel}>
            Upload Image
          </label>
          <input
            type="file"
            name="upload"
            id="upload"
            accept="image/*, application/pdf"
            onChange={handleFileChange}
          />
        </div>
        {selectedImage && (
          <div className={styles.imageContainer}>
            <button
              type="button"
              className={styles.deleteImagePreview}
              onClick={() => setSelectedImage(null)}
            >
              X
            </button>
            {file.type === "application/pdf" ? (
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

export default PostForm;
