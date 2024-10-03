import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import './App.css';
import Register from "./components/Register";
import Login from "./components/Login";
import Otp from "./components/Otp";
import Predict from "./components/Home";
import Result from "./components/Result";
import Chatbot from "./components/Chatbot";
import LandingPage from "./components/landingpage"; // Import the new LandingPage component
// import About from "./components/About"; // Create this component
// import History from "./components/History"; // Create this component

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
          {/* <Route path="/about" element={<About />} /> {/* About Page */}
          {/* <Route path="/history" element={<History />} /> History Page */} 
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/result" element={<Result />} />
          <Route path="/chatbot" element={<Chatbot />} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
