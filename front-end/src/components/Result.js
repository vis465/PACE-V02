import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import "./Home.css";
import "./Result.css";
import logo from "./logo.jpg";

import { useNavigate } from 'react-router-dom';

class Navbar extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  }
  
  render() {
    return (
      <nav>
        <img src={logo} alt="logo" />
        <div>
          <ul id="navbar" className={this.state.clicked ? "active" : ""}>
            <li><a href="/home" className='active'>Home</a></li>
            <li><a href="index.html">History</a></li>
            <li><a href="/chatbot">Chatbot</a></li>
            <li><a href="/register">Logout</a></li>
          </ul>
        </div>
        <div id="mobile" onClick={this.handleClick}>
          <i id='bar' className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
      </nav>
    );
  }
}

class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMarks: {},
      predictedMarks: {},
      series: [],
      options: {
        chart: {
          type: 'bar',
          height: 350,
        },
        xaxis: {
          categories: []
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'flat',
            columnWidth: '55%',
          },
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            }
          }
        }
      },
    };
  }
  

  getGrade = (mark) => {
    if (mark >= 90) return 'O';
    if (mark >= 80) return 'A+';
    if (mark >= 70) return 'A';
    if (mark >= 60) return 'B+';
    if (mark >= 50) return 'B';
    if (mark >= 40) return 'C';
    return 'U';
  };

  componentDidMount() {
    const currentMarksString = localStorage.getItem('currentsem');
    const predictedMarksString = localStorage.getItem('predictedMarks');

    const currentMarks = currentMarksString ? JSON.parse(currentMarksString) : {};
    const predictedMarks = predictedMarksString ? JSON.parse(predictedMarksString) : {};

    console.log("Current Marks from localStorage:", currentMarks);
    console.log("Predicted Marks from localStorage:", predictedMarks);

    this.setState({ currentMarks, predictedMarks }, this.updateChartData);
  }

  updateChartData = () => {
    const { predictedMarks } = this.state;
    const subjects = Object.keys(predictedMarks);
    const grades = subjects.map(subject => this.getGrade(parseFloat(predictedMarks[subject])));

    const seriesData = [
      {
        name: 'Predicted Grades',
        data: grades.map(grade => this.gradeToNumeric(grade)),
      },
    ];

    this.setState({
      options: {
        ...this.state.options,
        yaxis: {
          labels: {
            formatter: function (value) {
              return this.numericToGrade(value);
            }.bind(this),
          },
        },
        xaxis: {
          categories: subjects,
        },
      },
      series: seriesData,
    });
  };

  gradeToNumeric = (grade) => {
    switch (grade) {
      case 'O': return 90;
      case 'A+': return 80;
      case 'A': return 70;
      case 'B+': return 60;
      case 'B': return 50;
      case 'C': return 40;
      case 'U': return 30;
      default: return 0;
    }
  };

  numericToGrade = (value) => {
    if (value >= 90) return 'O';
    if (value >= 80) return 'A+';
    if (value >= 70) return 'A';
    if (value >= 60) return 'B+';
    if (value >= 50) return 'B';
    if (value >= 40) return 'C';
    return 'U';
  };

  downloadPDF = () => {
    window.print(); // Trigger print dialog
  }

  render() {
    const { currentMarks, predictedMarks } = this.state;

    return (
      <>
        <h3 style={{ color: "white", alignContent: "centre" }}>Here is your predicted marks!</h3>
        <div id="chart" className='barchart' align="center">
          <Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
        </div>

        <div className="table-container" style={{ padding: '20px' }}>
          <table className='table table-bordered marks-table'>
            <thead>
              <tr>
                <th style={{color:"black"}}>Subject</th>
                <th style={{color:"black"}}>Current CIE Marks</th>
                <th style={{color:"black"}}>Predicted Semester Mark</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(currentMarks).map((subject, index) => (
                <tr key={index}>
                  <td>{subject}</td>
                  <td>
                    {Object.values(currentMarks[subject]).map((cieMark, idx) => (
                      <span key={idx}>{cieMark}{idx < Object.values(currentMarks[subject]).length - 1 ? ', ' : ''}</span>
                    ))}
                  </td>
                  <td>{this.getGrade(predictedMarks[subject])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button onClick={this.downloadPDF} className='btn btn-primary'>Download PDF</button>
          
          <button style={{marginLeft:"20px"}} className='btn btn-secondary'>back</button>
          
        </div>
      </>
    );
  }
}

export default Result;
