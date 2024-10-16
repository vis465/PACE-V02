import React, { useState } from "react";
import {
  Box,
  Button,
  Card as MuiCard,
  Divider,
  FormControl,
  FormLabel,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled Card Component
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "500px",
  },
}));

const Register = () => {
  const [mail, setMail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [category, setCategory] = useState("");
  const [iden, setIden] = useState(""); // Staff ID for staff role
  const [hsm, setHsm] = useState("hide"); // To toggle visibility of Staff ID input
  const navigate = useNavigate();
  const theme = useTheme(); // Access MUI's theme

  const options = [
    { value: "stu", label: "Student/Parent" },
    { value: "sta", label: "Staff" },
  ];

  const handleChange = (selectedOption) => {
    setCategory(selectedOption.value);
    setHsm(selectedOption.value === "sta" ? "show" : "hide"); // Show Staff ID input if staff role is selected
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused
        ? theme.palette.primary.main
        : theme.palette.grey[400],
      boxShadow: state.isFocused
        ? `0 0 0 1px ${theme.palette.primary.main}`
        : "none",
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      borderRadius: theme.shape.borderRadius,
      minHeight: "56px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: theme.shape.borderRadius,
      marginTop: 0,
      boxShadow:
        "0px 4px 11px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme.palette.action.selected
        : state.isFocused
        ? theme.palette.action.hover
        : "white",
      color: theme.palette.text.primary,
      "&:active": {
        backgroundColor: theme.palette.action.selected,
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme.palette.text.disabled,
      fontSize: "1rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
      fontSize: "1rem",
    }),
    input: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
      fontSize: "1rem",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme.palette.text.disabled,
      "&:hover": {
        color: theme.palette.text.primary,
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.divider,
    }),
  };

  const register = async (e) => {
    e.preventDefault();

    // Basic Validation
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

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", userData);
      toast.success(`${category === "sta" ? "Staff" : "Student"} Registered Successfully`);
      navigate("/otp"); // Redirect to OTP verification or dashboard after successful registration
    } catch (error) {
      if (error.response && error.response.data.error === "Email already exists") {
        toast.error("Email already exists. Please login or use a different email.");
      } else {
        toast.error(`${category === "sta" ? "Staff" : "Student"} registration failed. Please try again.`);
      }
    }
  };

  return (
    <Card variant="outlined">
      <ToastContainer /> {/* Toast Container for Notifications */}
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", mb: 2 }}
      >
        Register
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Complete the form to register... It takes less than a minute
      </Typography>
      <Box
        component="form"
        onSubmit={register}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        {/* Email Field */}
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={!/\S+@\S+\.\S+/.test(mail)}
            helperText={!/\S+@\S+\.\S+/.test(mail) ? "Please enter a valid email address." : ""}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            color={!/\S+@\S+\.\S+/.test(mail) ? "error" : "primary"}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </FormControl>

        {/* Password Field */}
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            type="password"
            placeholder="Enter Password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl>
          <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
          <TextField
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            required
            fullWidth
            variant="outlined"
            value={cpwd}
            onChange={(e) => setCpwd(e.target.value)}
            error={cpwd && cpwd !== pwd}
            helperText={cpwd && cpwd !== pwd ? "Passwords do not match." : ""}
          />
        </FormControl>

        {/* Category Selection */}
        <FormControl fullWidth>
          <FormLabel htmlFor="category">Select Category</FormLabel>
          <Select
            id="category"
            options={options}
            placeholder="Select Category"
            onChange={handleChange}
            styles={customStyles} // Apply custom styles
            isSearchable={false}
            theme={(selectTheme) => ({
              ...selectTheme,
              colors: {
                ...selectTheme.colors,
                primary: theme.palette.primary.main,
                neutral0: theme.palette.background.paper,
                neutral5: theme.palette.divider,
                neutral10: theme.palette.text.primary,
                neutral20: theme.palette.text.disabled,
                neutral30: theme.palette.text.secondary,
                neutral40: theme.palette.text.primary,
                neutral50: theme.palette.text.secondary,
                neutral60: theme.palette.text.primary,
              },
            })}
          />
        </FormControl>

        {/* Staff ID Field (Conditional) */}
        {hsm === "show" && (
          <FormControl>
            <FormLabel htmlFor="staff-id">Staff ID</FormLabel>
            <TextField
              id="staff-id"
              type="text"
              placeholder="Staff ID"
              required={category === "sta"}
              fullWidth
              variant="outlined"
              value={iden}
              onChange={(e) => setIden(e.target.value)}
            />
          </FormControl>
        )}

        {/* Register Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>

        <Divider>or</Divider>

        {/* Social Registration Buttons */}
        

        {/* Link to Login */}
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Already have an account?{" "}
          <MuiLink component={Link} to="/login" variant="body2">
            Login
          </MuiLink>
        </Typography>
      </Box>
    </Card>
  );
};

export default Register;
