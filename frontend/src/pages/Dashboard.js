import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UploadQuestionPaper from './UploadQuestionPaper';

const DashboardPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultUserType = queryParams.get('type') || 'faculty';
    const [userType, setUserType] = useState(defaultUserType);
    const [selectedPage, setSelectedPage] = useState('Welcome');

    useEffect(() => {
        // Set user type from URL parameter if available
        const type = queryParams.get('type');
        if (type) {
            setUserType(type);
        }
    }, [queryParams]);

    const handlePageChange = (pageName) => {
        setSelectedPage(pageName);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="navigation-container">
                <h2 className="navigation-title">Navigation</h2>
                <ul className="page-list">
                    {userType === 'faculty' && (
                        <>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Welcome')}>Welcome</button>
                            </li>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Identify Cognitive Level')}>Identify Cognitive Level</button>
                            </li>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Enter Marks')}>Enter Marks</button>
                            </li>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Analyze Performance')}>Analyze Performance</button>
                            </li>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Question Paper classification')}>Question Paper classification</button>
                            </li>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Upload Question Paper')}>Upload Question Paper</button>
                            </li>
                        </>
                    )}
                    {userType === 'student' && (
                        <>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Analyze Performance')}>Analyze Performance</button>
                            </li>
                            <li className="page-item">
                                <button className="page-button" onClick={() => handlePageChange('Question Paper classification')}>Question Paper classification</button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <div className="page-content">
                {/* Render selected page component */}
                {selectedPage === 'Welcome' && <Dashboard />}
                {selectedPage === 'Identify Cognitive Level' && <RegisterPage />}
                {selectedPage === 'Enter Marks' && <LoginPage />}
                {selectedPage === 'Analyze Performance' && <LoginPage />}
                {selectedPage === 'Question Paper classification' && <RegisterPage />}
                {selectedPage === 'Upload Question Paper' && <UploadQuestionPaper />}
            </div>
        </div>
    );
};

export default DashboardPage;
