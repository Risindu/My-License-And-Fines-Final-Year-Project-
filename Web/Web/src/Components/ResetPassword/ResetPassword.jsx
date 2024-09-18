import React, { useState } from 'react';
import './ResetPassword.css';
import axios from 'axios';

export const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/api/reset-password', { email, newPassword });
            setMessage(response.data.message || 'Password reset successful!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className='reset-password-container'>
            <div className='reset-password-header'>
                <div className="reset-password-text">Reset Password</div>
                <div className="reset-password-underline"></div>
            </div>

            <form className="reset-password-inputs" onSubmit={handleSubmit}>
                <div className="reset-password-input">
                    <input 
                        type="email" 
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="reset-password-input">
                    <input 
                        type="password" 
                        placeholder='Enter new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="reset-password-submit">Reset Password</button>
            </form>

            {message && <div className="reset-password-message">{message}</div>}
        </div>
    );
};

export default ResetPassword;
