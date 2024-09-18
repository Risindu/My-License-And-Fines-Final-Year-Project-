import React, { useState, useEffect } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import id_icon from '../Assets/id.png';
import location_icon from '../Assets/location.png';
const config = require('../../config/config');


export const LoginSignup = () => {
    const [action, setAction] = useState('Sign Up');
    const [formData, setFormData] = useState({
        division_id: '',
        division_name: '',
        email: '',
        location: '',
        password: '',
        api_key: process.env.REACT_APP_API_KEY // API key is set in .env
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        // Check if a token exists
        const token = localStorage.getItem('token');
        if (token) {
            // Start session timeout timer
            const timer = setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/'); // Redirect to login on session timeout
            }, 15 * 60 * 1000); // 15 minutes in milliseconds

            // Clear timeout if user interacts with the page
            const resetTimer = () => clearTimeout(timer);
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keydown', resetTimer);

            // Clean up event listeners on component unmount
            return () => {
                clearTimeout(timer);
                window.removeEventListener('mousemove', resetTimer);
                window.removeEventListener('keydown', resetTimer);
            };
        } else {
            // Redirect to login if no token
            navigate('/');
        }
    }, [navigate]); // Runs on component mount to check token status

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const url = action === 'Sign Up' 
            ? `${config.apiBaseUrl}/division/signup`
            : `${config.apiBaseUrl}/division/login`;
    
        try {
            const response = await axios.post(url, formData);
            setMessage(response.data.message || 'Success!');
    
            if (action === 'Login') {
                // Store token in local storage
                localStorage.setItem('token', response.data.token);
    
                // Navigate to dashboard and pass division_name as state
                navigate('/dashboard', { state: { division_name: response.data.division_name } });
            } else {
                setAction('Login'); // Switch to login view on signup success
            }
        } catch (err) {
            // Display specific error messages sent from the server
            setMessage(err.response?.data?.message || 'An error occurred.');
        }
    };
    
    

    return (
        <div className='container'>
            <div className='header'>
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            <form className="inputs" onSubmit={handleSubmit}>
                {action === "Login" ? (
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder='Email' 
                            value={formData.email}
                            onChange={handleChange} 
                        />
                    </div>
                ) : (
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input 
                            type="text" 
                            name="division_name" 
                            placeholder='Division Name' 
                            value={formData.division_name}
                            onChange={handleChange} 
                        />
                    </div>
                )}
                {action === "Login" ? null : (
                    <div className="input">
                        <img src={id_icon} alt="" />
                        <input 
                            type="text" 
                            name="division_id" 
                            placeholder='Division ID' 
                            value={formData.division_id}
                            onChange={handleChange} 
                        />
                    </div>
                )}

                {action === "Login" ? null : (
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder='Email' 
                            value={formData.email}
                            onChange={handleChange} 
                        />
                    </div>
                )}
                {action === "Login" ? null : (
                    <div className="input">
                        <img src={location_icon} alt="" />
                        <input 
                            type="text" 
                            name="location" 
                            placeholder='Location' 
                            value={formData.location}
                            onChange={handleChange} 
                        />
                    </div>
                )}
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder='Password' 
                        value={formData.password}
                        onChange={handleChange} 
                    />
                </div>

                {action === "Sign Up" ? null : (
                    <div 
                        className="forgot-password" 
                        onClick={() => navigate('/forgot-password')} // Navigate to forgot password
                    >
                        Lost Password? <span>Click Here!</span>
                    </div>
                )}

                <button type="submit" className="submit-bt">{action}</button>
            </form>

            {message && <div className="message">{message}</div>}

            <div className="submit-containers">
                <div 
                    className={action === 'Login' ? "submit gray" : "submit"} 
                    onClick={() => setAction("Sign Up")}
                >
                    Sign Up
                </div>
                <div 
                    className={action === 'Sign Up' ? "submit gray" : "submit"} 
                    onClick={() => setAction("Login")}
                >
                    Login
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
