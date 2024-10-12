import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Predict = () => {
  const [numSubjects, setNumSubjects] = useState(0);
  const [currentData, setCurrentData] = useState({});
  const [result, setResult] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNumSubjectsChange = (event) => {
    const value = Number(event.target.value); // Get the number of subjects from the dropdown
    setNumSubjects(value);
    setCurrentData({}); // Reset current data when number of subjects changes
  };

  const handleVal = (subjectIndex, cieType) => (event) => {
    const newValue = event.target.value;
    setCurrentData((prevState) => ({
      ...prevState,
      [`Subject ${subjectIndex + 1}`]: {
        ...(prevState[`Subject ${subjectIndex + 1}`] || {}),
        [cieType]: newValue,
      },
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data to send to the backend
    const dataToSend = {
        semester: "Current Semester", // Specify the current semester
        subjects: currentData,
    };
    localStorage.setItem("currentsem", JSON.stringify(dataToSend.subjects));
    console.log(dataToSend.subjects)
    // Send data to the /predict endpoint
    axios
      .post("http://localhost:5000/predict", dataToSend)
      .then((response) => {
        const predictedMarks = response.data.predicted_end_sem_marks;
        console.log(predictedMarks);

        // Store predicted marks in local storage
        localStorage.setItem('predictedMarks', JSON.stringify(predictedMarks));
        navigate('/result')
      })
      .catch((error) => console.error(error));
};


  return (
    <Container sx={{ mt: 4, maxWidth: "sm" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
        Enter Current Semester Data
      </Typography>

      <Select
        value={numSubjects}
        onChange={handleNumSubjectsChange}
        displayEmpty
        fullWidth
        sx={{ mb: 2, bgcolor: theme.palette.background.default, borderRadius: 1, boxShadow: 2 }}
      >
        <MenuItem value="" disabled>
          Select Number of Subjects
        </MenuItem>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <MenuItem key={num} value={num}>
            {num}
          </MenuItem>
        ))}
      </Select>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 4, padding: 2, boxShadow: 2, bgcolor: theme.palette.background.paper }}>
          <CardContent>
            {[...Array(numSubjects)].map((_, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>Subject {idx + 1}</Typography>
                {[1, 2, 3].map((cieNum) => (
                  <TextField
                    key={cieNum}
                    type="number"
                    min="0"
                    max="100"
                    variant="outlined"
                    onBlur={handleVal(idx, `CIE ${cieNum}`)}
                    placeholder={`CIE ${cieNum}`}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            ))}
          </CardContent>
        </Card>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ bgcolor: theme.palette.secondary.main, '&:hover': { bgcolor: theme.palette.secondary.dark } }}>
          Predict Marks
        </Button>
      </form>

      {result && (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: theme.palette.success.main }}>
          Predicted End Semester Mark: {result}
        </Typography>
      )}
    </Container>
  );
};

export default Predict;
