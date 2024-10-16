import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import './App.css';
import Register from "./components/Register";
import Login from "./components/Login";
import Otp from "./components/Otp";
import Predict from "./components/predict";
import Result from "./components/Result";
import Train from "./components/train";
import LandingPage from "./components/landingpage";
import About from "./components/About";
import SignInSide from "./components/sign-in-side/SignInSide"
import SignIn from './components/sign-in/SignIn'
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change this to your desired primary color
    },
    secondary: {
      main: '#dc004e', // Change this to your desired secondary color
      dark: '#9c0033', // Darker shade for hover effect
    },
    background: {
      default: '#f5f5f5', // Light background color
      paper: '#ffffff', // White background for cards
    },
    grey: {
      100: '#e0e0e0', // Light grey for subject boxes
    },
    success: {
      main: '#4caf50', // Green for success messages
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          
          <Route path="/landingpage" element={<LandingPage />} /> {/* Landing Page */}
          <Route path="/predict" element={<Predict />} /> {/* Prediction Page */}
          <Route path="/about" element={<About />} />  
          <Route path="/"  element={<Register />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignInSide />} />
          <Route path='/train' element={<Train />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/result" element={<Result />} />
          
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
