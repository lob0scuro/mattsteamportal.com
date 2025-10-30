// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import Home from "./routes/Home/Home.jsx";
import Login from "./routes/Auth/Login/Login.jsx";
import Register from "./routes/Auth/Register/Register.jsx";
import PostForm from "./routes/PostForm/PostForm.jsx";
import Post from "./routes/Post/Post.jsx";
import EditPostForm from "./routes/PostForm/EditPostForm.jsx";
import SendLink from "./routes/Auth/SendLink/SendLink.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="post/:post_id" element={<Post />} />
          <Route element={<AdminLayout />}>
            <Route path="post-form" element={<PostForm />} />
            <Route path="edit-post/:post_id" element={<EditPostForm />} />
            <Route path="send-invite-link" element={<SendLink />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
