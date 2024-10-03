import React, { useState, useEffect, Component } from 'react';
import './Chatbot.css';
import './Home.css';
import logo from './logo.jpg';

class Navbar extends Component {
  state = { clicked: false };
  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };
  render() {
    return (
      <nav>
        <img src={logo} alt="logo" />
        <div>
          <ul id="navbar" className={this.state.clicked ? '#navbar active' : '#navbar'}>
            <li>
              <a href="index.html" className="active">
                Home
              </a>
            </li>
            <li>
              <a href="index.html">History</a>
            </li>
            <li>
              <a href="index.html">Chatbot</a>
            </li>
            <li>
              <a href="index.html">Logout</a>
            </li>
          </ul>
        </div>
        <div id="mobile" onClick={this.handleClick}>
          <i id="bar" className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      </nav>
    );
  }
}

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const welcomeMessage = {
      type: 'bot',
      text: 'Welcome to the chatbot! Please select an option below:',
    };
    const radioButtonsMessage = {
      type: 'bot',
      radioButtons: [
        { label: 'Semester based prediction', value: 'semester' },
        { label: 'CIE based prediction', value: 'cie' },
      ],
    };
    setMessages([welcomeMessage, radioButtonsMessage]);
  }, []);

  const handleRadioButtonChange = (event) => {
    const value = event.target.value;
    let botMessage;
  
    if (value === "semester") {
      botMessage = {
        type: "bot",
        text:
          "You selected semester based prediction. Please enter your 7 semester marks:",
      };
    } else if (value === "cie") {
      botMessage = {
        type: "bot",
        text: "CIE based prediction is under progress , so choose Semester based prediction to use that feature",
      };
      // remove the existing messages and set the initial radio button input prompt
      setMessages([
        {
          type: "bot",
          text:
            "Welcome to the chatbot! Please select an option below:",
        },
        {
          type: "bot",
          radioButtons: [
            { label: "Semester based prediction", value: "semester" },
            { label: "CIE based prediction", value: "cie" },
          ],
        },
        botMessage,
      ]);
    }
  
    setMessages([...messages, botMessage]);
  };
  
  
  const extractNumbers = (text) => {
    const regex = /[+-]?\d+(\.\d+)?/g;
    const matches = text.match(regex);
    return matches ? matches.map(Number) : [];
  };
  
  const calculateAverage = (numbers) => {
    const sum = numbers.reduce((total, number) => total + number, 0);
    return sum / numbers.length;
  };
  
  const handleInput = () => {
    const numbers = extractNumbers(inputValue);
    const average = calculateAverage(numbers);
  
    const message = {
      type: 'bot',
      text: `Your average semester score is ${average.toFixed(2)}.`,
    };
  
    setMessages([...messages, message]);
    setInputValue('');
  };
  
  const handleInputKeyPress = event => {
    if (event.key === 'Enter') {
      handleInput();
    }
  };
  const sendMessage = async () => {
    if (inputValue.trim() === "") {
      return;
    }
  
    const message = {
      type: "user",
      text: inputValue,
    };
  
    if (messages.length === 2 && messages[1].radioButtons[0].value === "semester") {
      handleInput();
    } else {
      setMessages([...messages, message]);
      setMessages([...messages, message]); // add the user message to the state
      setInputValue("");
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chatbot-message ${message.type === 'bot' ? 'bot' : 'user'}`}
            >
              {message.text && <p>{message.text}</p>}
              {message.radioButtons && (
                <div>
                  {message.radioButtons.map((radioButton, index) => (
                   
                   <div key={index} className="radio-button">
                   <input
                     type="radio"
                     id={`radio-button-${index}`}
                     name="radio-button-group"
                     value={radioButton.value}
                     onChange={handleRadioButtonChange}
                   />
                   <label htmlFor={`radio-button-${index}`}>{radioButton.label}</label>
                 </div>
                 ))}
               </div>
             )}
           </div>
         ))}
       </div>
       <div className="chatbot-input">
         <input
           type="text"
           placeholder="Type your message here..."
           value={inputValue}
           onChange={event => setInputValue(event.target.value)}
           onKeyPress={handleInputKeyPress}
         />
         <button onClick={sendMessage}>Send</button>
       </div>
     </div>
   </>
);
};

export default Chatbot;   