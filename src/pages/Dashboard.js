import React, { useState } from 'react';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UploadQuestionPaper from './UploadQuestionPaper';

const DashboardPage = () => {
    const [selectedPage, setSelectedPage] = useState('Welcome');

    const pages = [
        { name: 'Welcome', component: <Dashboard /> },
        { name: 'Identify Cognitive Level', component: <RegisterPage /> },
        { name: 'Enter Marks', component: <LoginPage /> },
        { name: 'Analyze Performance', component: <LoginPage /> },
        { name: 'Question Paper classification', component: <RegisterPage /> },
        { name: 'Upload Question Paper', component: <UploadQuestionPaper /> },
    ];

    const handlePageChange = (pageName) => {
        setSelectedPage(pageName);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="navigation-container">
                <h2 className="navigation-title">Navigation</h2>
                <ul className="page-list">
                    {pages.map((page) => (
                        page.component && (
                            <li key={page.name} className="page-item">
                                <button className="page-button" onClick={() => handlePageChange(page.name)}>
                                    {page.name}
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            </div>
            <div className="page-content">
                {pages.map((page) => page.name === selectedPage && <div key={page.name} className="content">{page.component}</div>)}
            </div>
        </div>
    );
};

export default DashboardPage;
