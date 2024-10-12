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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Predict = () => {
  const [semester, setSemester] = useState(""); // Current semester selected by user
  const [semData, setSemData] = useState({}); // Holds the marks data for previous semesters
  const [currentStep, setCurrentStep] = useState(0); // Track the current semester step
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/train", semData)
      .then((response) => {
        localStorage.setItem("sem_mark", response.data);
        navigate("/predict"); // Navigate to the results page after submission
      })
      .catch((error) => console.log(error));
  };

  const handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    setSemester(selectedSemester); // Set current semester
    setCurrentStep(1); // Move to the next step

    // Initialize semData for previous semesters only (1 to currentSemester - 1)
    const newSemData = {};
    for (let i = 1; i < selectedSemester; i++) {
      newSemData[`sem${i}`] = { subjects: 0, cieMarks: [], endSemMarks: [] };
    }
    setSemData(newSemData); // Update state with initialized data
  };

  const handleSubjectChange = (semester, value) => {
    const subjectCount = parseInt(value, 10);
    setSemData((prevData) => ({
      ...prevData,
      [semester]: {
        ...prevData[semester],
        subjects: subjectCount,
        cieMarks: Array(subjectCount).fill({ cie1: 0, cie2: 0, cie3: 0 }),
        endSemMarks: Array(subjectCount).fill(0),
      },
    }));
  };

  const handleCieMarksChange = (semester, subjectIndex, cieIndex, value) => {
    const updatedCieMarks = [...semData[semester].cieMarks];
    updatedCieMarks[subjectIndex][`cie${cieIndex + 1}`] = parseInt(value, 10);

    setSemData((prevData) => ({
      ...prevData,
      [semester]: { ...prevData[semester], cieMarks: updatedCieMarks },
    }));
  };

  const handleEndSemMarksChange = (semester, subjectIndex, value) => {
    const updatedEndSemMarks = [...semData[semester].endSemMarks];
    updatedEndSemMarks[subjectIndex] = parseInt(value, 10);

    setSemData((prevData) => ({
      ...prevData,
      [semester]: { ...prevData[semester], endSemMarks: updatedEndSemMarks },
    }));
  };

  const handleNextStep = () => {
    if (currentStep < semester - 1) setCurrentStep(currentStep + 1); // Limit next step to semester - 1
  };

  const handleBackStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "sm" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Predict Your Marks
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Current Semester */}
        {currentStep === 0 && (
          <Card sx={{ mb: 4, padding: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Select Current Semester
              </Typography>
              <MuiSelect
                value={semester}
                onChange={handleSemesterChange}
                displayEmpty
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Select Semester
                </MenuItem>
                {[5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </MuiSelect>
            </CardContent>
          </Card>
        )}

        {/* Step 2 to X: Input for each previous semester (CIE and End Semester) */}
        {currentStep > 0 && currentStep < semester && (
          <Card sx={{ mb: 4, padding: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Enter Details for Semester {currentStep}
              </Typography>

              {/* Number of Subjects */}
              <Typography>Select Number of Subjects</Typography>
              <MuiSelect
                value={semData[`sem${currentStep}`]?.subjects || 0}
                onChange={(e) =>
                  handleSubjectChange(`sem${currentStep}`, e.target.value)
                }
                displayEmpty
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Select Number of Subjects
                </MenuItem>
                {[3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </MuiSelect>

              {/* CIE and End Semester Marks Input */}
              {semData[`sem${currentStep}`]?.subjects > 0 &&
                [...Array(semData[`sem${currentStep}`].subjects)].map(
                  (_, subjectIndex) => (
                    <Box key={subjectIndex} sx={{ mb: 2 }}>
                      <Typography>Subject {subjectIndex + 1}</Typography>
                      {[1, 2, 3].map((cieNum) => (
                        <TextField
                          key={cieNum}
                          type="number"
                          min="0"
                          max="100"
                          variant="outlined"
                          onChange={(e) =>
                            handleCieMarksChange(
                              `sem${currentStep}`,
                              subjectIndex,
                              cieNum - 1,
                              e.target.value
                            )
                          }
                          placeholder={`CIE ${cieNum}`}
                          fullWidth
                          sx={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                            mb: 1,
                          }}
                        />
                      ))}

                      {/* End Semester Marks */}
                      <TextField
                        type="number"
                        min="0"
                        max="100"
                        variant="outlined"
                        onChange={(e) =>
                          handleEndSemMarksChange(
                            `sem${currentStep}`,
                            subjectIndex,
                            e.target.value
                          )
                        }
                        placeholder={`End Semester Marks`}
                        fullWidth
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          mb: 1,
                        }}
                      />
                    </Box>
                  )
                )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={handleBackStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < semester - 1 ? (
            <Button variant="contained" onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default Predict;
