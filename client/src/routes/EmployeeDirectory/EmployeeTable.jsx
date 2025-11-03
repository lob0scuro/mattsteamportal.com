import styles from "./EmployeeTable.module.css";
import React from "react";
import { cell } from "../../utils/Helpers";

const EmployeeTable = ({ employees }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.employeeMainTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(({ name, email, phone_number }, index) => (
            <tr key={index}>
              <td
                style={{ fontWeight: "600" }}
                className={name ? "" : styles.missing}
              >
                {name || "[missing]"}
              </td>
              <td className={phone_number ? "" : styles.missing}>
                {phone_number
                  ? cell(phone_number)
                  : phone_number || "[missing]"}
              </td>
              <td className={email ? "" : styles.missing}>
                {email || "[missing]"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.sum}>Total: {employees?.length}</p>
    </div>
  );
};

export default EmployeeTable;
