import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Otp.css';

function Otp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Fetch OTP from server once the component mounts
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/otp')
            .then((response) => {
                setGeneratedOtp(response.data);  // OTP from backend
                console.log("Generated OTP from server:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching OTP:", error);
                setErrorMessage("Failed to fetch OTP. Please try again.");
            });
    }, []);

    // Handle OTP input change
    const handleOtpChange = (e, index) => {
        const { value } = e.target;

        // Allow only numeric input and ensure one digit per box
        if (/^[0-9]$/.test(value) || value === "") {
            let otpCopy = [...otp];
            otpCopy[index] = value;
            setOtp(otpCopy);

            // Focus next input if digit is entered, else focus the current box if backspacing
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            } else if (!value && index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
            }
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const userOtp = otp.join("");

        console.log("Entered OTP:", userOtp);
        console.log("Generated OTP:", generatedOtp);

        if (Number(userOtp )=== generatedOtp) {
            alert('Account Created Successfully');
            navigate('/landingpage');
        } else {
            setErrorMessage('Invalid OTP. Please try again.');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="otp-body">
            <div className="otp-container">
                <div className="otp-left">
                    <div className="otp-overlay">
                        <h1>Final Steps</h1>
                        <p>Enter the OTP sent to your email to complete the process.</p>
                    </div>
                </div>

                <div className="otp-right">
                    <div className="otp-form-container">
                        <header>
                            <i className="bx bxs-check-shield"></i>
                        </header>
                        <h3>Enter OTP</h3>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="otp-input-field">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onFocus={(e) => e.target.select()}
                                        required
                                    />
                                ))}
                            </div>
                            <button
                                className="otp-submit-btn"
                                type="submit"
                                disabled={isSubmitting || otp.includes("")}
                            >
                                {isSubmitting ? "Verifying..." : "Verify"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Otp;
