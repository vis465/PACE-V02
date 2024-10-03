import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select as MuiSelect,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import logo from "./logo.jpg";
import { useNavigate } from "react-router-dom";

// Navbar component styled with Material UI
const NavbarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  "& img": {
    width: 50,
    height: 50,
  },
}));

const Navbar = () => {
  return (
    <NavbarContainer>
      <img src={logo} alt="logo" />
    </NavbarContainer>
  );
};

const Predict = () => {
  const [semester, setSemester] = useState("");
  const [state, setState] = useState({
    category: "",
    marks: {},
  });
  const [currentCard, setCurrentCard] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/receive", state.marks)
      .then((response) => {
        localStorage.setItem("sem_mark", response.data);
        navigate("/result");
      })
      .catch((error) => console.log(error));
  };

  const handleVal = (subjectIndex, cieType) => (event) => {
    const newValue = event.target.value;
    setState((prevState) => ({
      ...prevState,
      marks: {
        ...prevState.marks,
        [`Semester ${semester}`]: {
          ...prevState.marks[`Semester ${semester}`],
          [cieType]: {
            ...(prevState.marks[`Semester ${semester}`]?.[cieType] || {}),
            [`Subject ${subjectIndex + 1}`]: newValue,
          },
        },
      },
    }));
  };

  const handleChange = (event) => {
    const numSubjects = parseInt(event.target.value, 10);
    const newMarks = {};
    for (let i = 0; i < numSubjects; i++) {
      newMarks[`Subject ${i + 1}`] = {};
    }
    setState((prevState) => ({
      ...prevState,
      category: event.target.value,
      marks: {
        ...prevState.marks,
        [`Semester ${semester}`]: newMarks,
      },
    }));
  };

  const handleNext = () => {
    if (currentCard < 2) {
      setCurrentCard(currentCard + 1);
    }
  };

  const handleBack = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <Container sx={{ mt: 4, maxWidth: 'sm' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Predict Your Marks
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mb: 4, width: '10%' }}
        >
          BACK
        </Button>

        <form onSubmit={handleSubmit}>
          {/* Semester Selection */}
          {currentCard === 0 && (
            <Card sx={{ mb: 4, padding: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" align="center">
                  Select Current Semester
                </Typography>
                <MuiSelect
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  displayEmpty
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>Select Semester</MenuItem>
                  {[5, 6, 7, 8].map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      Semester {sem}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </CardContent>
            </Card>
          )}

          {/* Number of Subjects Selection */}
          {currentCard === 1 && (
            <Card sx={{ mb: 4, padding: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" align="center">
                  Select Number of Subjects
                </Typography>
                <MuiSelect
                  value={state.category}
                  onChange={handleChange}
                  displayEmpty
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>Select Number of Subjects</MenuItem>
                  {[...Array(3)].map((_, idx) => (
                    <MenuItem key={idx} value={idx + 4}>
                      {idx + 4}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </CardContent>
            </Card>
          )}

          {/* CIE Marks Entry */}
          {currentCard === 2 && (
            <Card sx={{ mb: 4, padding: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" align="center">
                  Enter CIE Marks for Semester {semester}
                </Typography>
                {state.category && [...Array(parseInt(state.category)).keys()].map((index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography>Subject {index + 1}</Typography>
                    {[1, 2, 3].map((cieNum) => (
                      <TextField
                        key={cieNum}
                        type="number"
                        min="0"
                        max="100"
                        variant="outlined"
                        onBlur={handleVal(index, `CIE ${cieNum}`)}
                        placeholder={`CIE ${cieNum}`}
                        fullWidth
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          mb: 1,
                        }}
                      />
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={handleBack} disabled={currentCard === 0}>
              Previous
            </Button>
            {currentCard < 2 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 4 }}>
                Submit
              </Button>
            )}
          </Box>
        </form>
      </Container>
    </>
  );
};

export default Predict;
