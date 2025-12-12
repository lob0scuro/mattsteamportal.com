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
import Home from "./routes/Common/Home/Home.jsx";
import Login from "./routes/Common/Login/Login.jsx";
import Register from "./routes/Common/Register/Register.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route element={<AdminLayout />}></Route>
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
