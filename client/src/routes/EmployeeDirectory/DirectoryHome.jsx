import styles from "./DirectoryHome.module.css";
import { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable";
import { cell } from "../../utils/Helpers";

const SCHEMA = [
  { val: "all", label: "All" },
  { val: "owner", label: "Owners" },
  { val: "sales", label: "Sales" },
  { val: "service", label: "Service" },
  { val: "cleaner", label: "Cleaners" },
  { val: "driver", label: "Drivers" },
  { val: "technician", label: "Technicians" },
  { val: "other", label: "Other" },
];

const Home = () => {
  const [employees, setEmployees] = useState({});
  const [department, setDepartment] = useState(null);
  const [isActive, setIsActive] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("/api/read/employee_directory");
      const data = await res.json();
      setEmployees(data.employees);

      const allEmployees = [
        ...data.employees.owner,
        ...data.employees.sales,
        ...data.employees.service,
        ...data.employees.cleaner,
        ...data.employees.driver,
        ...data.employees.technician.fridges,
        ...data.employees.technician.washers,
        ...data.employees.technician["dryers-ranges"],
        ...data.employees.other,
      ];
      setDepartment(allEmployees);
    };

    fetchEmployees();
  }, []);

  const handleClick = (dpt, index) => {
    if (dpt === "all") {
      // Flatten all employees again
      const allEmployees = [
        ...employees.owner,
        ...employees.sales,
        ...employees.service,
        ...employees.cleaner,
        ...employees.driver,
        ...employees.technician.fridges,
        ...employees.technician.washers,
        ...employees.technician["dryers-ranges"],
        ...employees.other,
      ];
      setDepartment(allEmployees);
    } else if (dpt === "technician") {
      // Combine all technicians into one array
      const techEmployees = [
        ...employees.technician.fridges,
        ...employees.technician.washers,
        ...employees.technician["dryers-ranges"],
      ];
      setDepartment(techEmployees);
    } else {
      setDepartment(employees[dpt]);
    }
    setIsActive(index);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeButtonBlock}>
        {SCHEMA.map(({ val, label }, index) => (
          <button
            key={index}
            onClick={() => handleClick(val, index)}
            className={isActive === index ? styles.activeButton : ""}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.mobilePicker}>
        <select
          value={department}
          onChange={(e) => {
            if (e.target.value === "technician") {
              const techs = [
                ...employees.technician.fridges,
                ...employees.technician.washers,
                ...employees.technician["dryers-ranges"],
              ];
              setDepartment(techs);
            } else if (e.target.value === "all") {
              const allEmployees = [
                ...employees.owner,
                ...employees.sales,
                ...employees.service,
                ...employees.cleaner,
                ...employees.driver,
                ...employees.technician.fridges,
                ...employees.technician.washers,
                ...employees.technician["dryers-ranges"],
                ...employees.other,
              ];
              setDepartment(allEmployees);
            } else {
              setDepartment(employees[e.target.value]);
            }
          }}
        >
          <option value="">--Select Department--</option>
          {SCHEMA.map(({ val, label }, index) => (
            <option key={index} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {department ? (
        <EmployeeTable employees={department} />
      ) : (
        <p style={{ flex: "3", minWidth: "500px" }}>Select Department</p>
      )}
    </div>
  );
};

export default Home;
