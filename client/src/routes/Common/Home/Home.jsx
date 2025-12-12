import styles from "./Home.module.css";
import React from "react";
import { useAuth } from "../../../Context/AuthContext";
const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>
        {user.first_name} {user.last_name}
      </h1>
      <div>
        <button>View Schedule</button>
        <button>Portal</button>
      </div>
    </div>
  );
};

export default Home;
