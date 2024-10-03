import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import "./Home.css";
import "./Result.css";
import logo from "./logo.jpg";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

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
          <ul id="navbar" className={this.state.clicked ? "#navbar active" : "#navbar"}>
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
      series: [],


      options: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    };
  }
  componentDidMount() {
    const inputString = localStorage.getItem('sem_mark');
    const stringWithoutLastComma = inputString.slice(0, -1)
    const values = stringWithoutLastComma.split(',');
    const seriesData = values.map(value => parseFloat(value));
    this.setState({ series: seriesData});
    const numDataPoints = seriesData.length;
    const labels = Array.from({ length: numDataPoints }, (_, i) => `Subject ${i + 1}`);
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        labels: labels
      }
    }));
  }

  downloadPDF = () => {
    const doc = new jsPDF();
    const table = document.querySelector('.table');
    const chart = document.querySelector('.piechart');
    const canvas = document.createElement('canvas');
    canvas.width = table.offsetWidth;
    canvas.height = table.offsetHeight;
    const context = canvas.getContext('2d');
    html2canvas(table).then(canvas => {
      doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 10, 10, 180, 50);
      html2canvas(chart).then(canvas => {
        doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 10, 120, 150, 70);
        doc.save('result.pdf');
      });
    });
  }

  render() {
    return (
      <>
        <Navbar />
        <div id="chart" className='piechart' align="center">
          <Chart options={this.state.options} series={this.state.series} type="pie" width="400px" ref={(chart) => { this.chartRef = chart }} />
        </div>
        <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Predicted Mark</th>
                    </tr>
                  </thead>
                  <tbody>

                    {this.state.series.map((value, index) => (
                      <tr key={index}>
                        <td>{this.state.options.labels[index]}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>            
            </table>
                <button onClick={this.downloadPDF}>Download PDF</button>
            </>
        );
    }
}

export default Result;