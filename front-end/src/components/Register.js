import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // Import Toastify
import "react-toastify/dist/ReactToastify.css";  // Import Toastify CSS

const Register = () => {
  const [mail, setMail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [category, setCategory] = useState("");
  const [iden, setIden] = useState(""); // Staff ID for staff role
  const [hsm, setHsm] = useState("hide"); // To toggle visibility of Staff ID input
  const navigate = useNavigate();

  const options = [
    { value: "stu", label: "Student/Parent" },
    { value: "sta", label: "Staff" },
  ];

  const handleChange = (selectedOption) => {
    setCategory(selectedOption.value);
    setHsm(selectedOption.value === "sta" ? "show" : "hide"); // Show Staff ID input if staff role is selected
  };
  const register = (e) => {
    e.preventDefault();
  
    if (!mail || !pwd || !cpwd) {
      toast.error("Please fill in all fields");
      return;
    }
  
    if (cpwd !== pwd) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
  
    let userData = {
      umail: mail,
      upwd: pwd,
      role: category,
    };
  
    if (category === "sta" && !iden) {
      toast.error("Staff ID is required for staff registration");
      return;
    }
  
    if (category === "sta") {
      // Include staff ID for staff role
      userData = { ...userData, uid: iden };
    }
  
    // setLoading(true); // Show loading state
  
    axios
      .post("http://127.0.0.1:5000/register", userData)
      .then((response) => {
        toast.success(`${category === "sta" ? "Staff" : "Student"} Registered Successfully`);
        navigate("/landingpage"); // Redirect to dashboard after successful registration
      })
      .catch((error) => {
        if (error.response && error.response.data.error === "Email already exists") {
          toast.error("Email already exists. Please login or use a different email.");
        } else {
          toast.error(`${category === "sta" ? "Staff" : "Student"} registration failed. Please try again.`);
        }
      })
      .finally(() => {
        // setLoading(false); // Stop loading after request is complete
      });
  };

  return (
    <div className="box-form">
      <div className="left">
        <div className="overlay">
          <h2>Let's Register</h2>
          <p>Welcome to the registration page...</p>
          <span>
            <Link to="/login">
              <div>Login</div>
            </Link>
          </span>
        </div>
      </div>
      <div className="right">
        <h4>Register</h4>
        <p>Complete the form to register... It takes less than a minute</p>
        <form onSubmit={register}>
          <div className="inputs">
            <input
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setMail(e.target.value)}
              value={mail}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setCpwd(e.target.value)}
              value={cpwd}
              required
            />
            <div style={{ marginTop: "35px" }}>
              <Select
                options={options}
                placeholder="Select Category"
                onChange={handleChange}
                autoFocus
                required
              />
              {hsm === "show" && (
                <input
                  type="text"
                  placeholder="Staff ID"
                  onChange={(e) => setIden(e.target.value)}
                  value={iden}
                  required={category === "sta"} // Staff ID is required only for staff
                />
              )}
            </div>
          </div>
          <button style={{ marginTop: "30px" }} type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
