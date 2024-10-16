import React from 'react';

const About = () => {
  return (
    <div style={{color:'white'}}>
    <div className="App">
      <header>
        <h1>Semester Grade Predictor</h1>
      </header>

      <main>
        {/* Purpose Section */}
        <section>
          <h2>Purpose</h2>
          <p>
            The Semester Grade Predictor application aims to help students forecast their future semester grades based on their performance in previous semesters' internal assessments and final marks. This tool provides an approximate estimation, enabling students to understand their academic standing and identify areas that may require improvement.
          </p>
        </section>

        {/* Target Audience Section */}
        <section>
          <h2>Target Audience</h2>
          <p>
            This application is primarily designed for:
          </p>
          <ul>
            <li>Students seeking insights into their academic performance.</li>
            <li>Educators and academic advisors monitoring student progress.</li>
            <li>Educational institutions aiming to provide analytical tools for student success.</li>
          </ul>
        </section>

        {/* Features Section */}
        <section>
          <h2>Features</h2>
          
            <li>Input previous semesters' internal marks and final semester marks.</li>
            <li>Predict future semester grades based on historical data.</li>
            <li>Visual representation of predicted grades for easy understanding.</li>
            <li>User-friendly interface for seamless navigation and data entry.</li>
            <li>Secure data handling to protect student information.</li>
          
        </section>

        {/* Benefits Section */}
        <section>
          <h2>Benefits</h2>
          
            <li>Provides students with a clear projection of their academic performance.</li>
            <li>Helps identify strengths and areas needing improvement.</li>
            <li>Facilitates proactive academic planning and goal setting.</li>
            <li>Enhances communication between students and educators regarding performance.</li>
            <li>Supports institutions in monitoring and supporting student success.</li>
          
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Semester Grade Predictor. All rights reserved.</p>
      </footer>
    </div>
    </div>
  );
};

export default About;
