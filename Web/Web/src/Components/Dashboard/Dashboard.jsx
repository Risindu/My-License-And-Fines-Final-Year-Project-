import React from 'react';
import './Dashboard.css';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const { division_name } = location.state || {}; // Safely access division_name

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {division_name && <p>Division: {division_name}</p>}
        </div>
    );
};
export default Dashboard;
