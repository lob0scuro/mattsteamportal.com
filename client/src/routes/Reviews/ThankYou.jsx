import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./ReviewForm.module.css";
import React from "react";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

const ThankYou = () => {
  return (
    <div className={styles.thankYouBlock}>
      <h1>
        Thank you
        <br /> for your review!
      </h1>
      <div>
        <p>
          <FontAwesomeIcon icon={faGlobe} className={styles.linkIcon} />
          Click{" "}
          <a href="https://mattsappliancesla.com" target="_blank">
            here
          </a>{" "}
          to view our website{" "}
        </p>
        <p>
          <FontAwesomeIcon icon={faFacebook} className={styles.linkIcon} />
          Click{" "}
          <a
            href="https://www.facebook.com/mattsusedappliances"
            target="_blank"
          >
            here
          </a>{" "}
          to see our Facebook Page{" "}
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
