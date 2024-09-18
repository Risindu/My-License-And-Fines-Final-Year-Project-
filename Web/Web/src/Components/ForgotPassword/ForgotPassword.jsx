import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ForgotPassword.css';
import axios from 'axios';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/api/forgot-password', { email });
            setMessage(response.data.message || 'Success! Check your email for instructions.');
            navigate('/reset-password'); // Navigate to reset password page
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className='forgot-password-container'>
            <div className='forgot-password-header'>
                <div className="forgot-password-text">Forgot Password</div>
                <div className="forgot-password-underline"></div>
            </div>

            <form className="forgot-password-inputs" onSubmit={handleSubmit}>
                <div className="forgot-password-input">
                    <input 
                        type="email" 
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" className="forgot-password-submit">Send Reset Link</button>
            </form>

            {message && <div className="forgot-password-message">{message}</div>}
        </div>
    );
};

export default ForgotPassword;
