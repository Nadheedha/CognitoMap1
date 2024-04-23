import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultUserType = queryParams.get('type') || 'faculty';
    const [userType, setUserType] = useState(defaultUserType);

    useEffect(() => {
        // Set user type from URL parameter if available
        const type = queryParams.get('type');
        if (type) {
            setUserType(type);
        }
    }, [queryParams]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="navigation-container">
            {userType === 'faculty' && (
                    <>
                {/* Two sections in a row */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div className="card">
                        <section className="page-section">
                            <h3 className="section-title">Welcome</h3>
                            <p className="section-description">Get started with the dashboard</p>
                            <button className="page-button" onClick={() => window.location.href='/'}>Go</button>
                        </section>
                    </div>
                    <div className="card">
                        <section className="page-section">
                            <h3 className="section-title">Identify Cognitive Level</h3>
                            <p className="section-description">Identify the cognitive levels of questions</p>
                            <button className="page-button" onClick={() => window.location.href='/identify-cognitive-level'}>Go</button>
                        </section>
                    </div>
                </div>
                {/* Two sections in a row */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div className="card">
                        <section className="page-section">
                            <h3 className="section-title">Enter Marks</h3>
                            <p className="section-description">Enter marks for students</p>
                            <button className="page-button" onClick={() => window.location.href='/enter-marks'}>Go</button>
                        </section>
                    </div>
                    <div className="card">
                        <section className="page-section">
                            <h3 className="section-title">Analyze Performance</h3>
                            <p className="section-description">Analyze student performance</p>
                            <button className="page-button" onClick={() => window.location.href='/analyze-performance'}>Go</button>
                        </section>
                    </div>
                </div>
                {/* Two sections in a row */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div className="card">
                        <section className="page-section">
                            <h3 className="section-title">Question Paper Classification</h3>
                            <p className="section-description">Classify question papers</p>
                            <button className="page-button" onClick={() => window.location.href='/qc'}>Go</button>
                        </section>
                    </div>
                    <div className="card">
                        <section className="page-section">
                            <h3 className="section-title">Upload Question Paper</h3>
                            <p className="section-description">Upload question papers</p>
                            <button className="page-button" onClick={() => window.location.href='/upload'}>Go</button>
                        </section>
                    </div>
                </div>
                </>
                )}
                {/* Student sections */}
                {userType === 'student' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                            <div className="card">
                                <section className="page-section">
                                    <h3 className="section-title">Analyze Performance</h3>
                                    <p className="section-description">Analyze your performance</p>
                                    <button className="page-button" onClick={() => window.location.href='/analyze-performance'}>Go</button>
                                </section>
                            </div>
                            <div className="card">
                                <section className="page-section">
                                    <h3 className="section-title">Question Paper Classification</h3>
                                    <p className="section-description">Classify question papers</p>
                                    <button className="page-button" onClick={() => window.location.href='/qc'}>Go</button>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;
