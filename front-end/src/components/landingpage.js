import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import logo from "./logo.jpg";
import { useNavigate } from "react-router-dom";

// Styled Landing Page Container
const LandingContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  // backgroundColor: theme.palette.background.default,
}));

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center',backgroundColor:'#ffffff'
       }}>
        <img src={logo} alt="logo" style={{ width: '100px', marginBottom: '20px' }} />
        <Typography variant="h4" gutterBottom>
          Welcome to the Prediction Platform
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Choose an option below to get started:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/predict")}
            sx={{ borderRadius: 1, padding: 1.5 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/about")}
            sx={{ borderRadius: 1, padding: 1.5 }}
          >
            About the Platform
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/history")}
            sx={{ borderRadius: 1, padding: 1.5 }}
          >
            History
          </Button>
        </Box>
      </Paper>
    </LandingContainer>
  );
};

export default LandingPage;
