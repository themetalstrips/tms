import React from 'react';
import './LegalPage.css';

const Privacy = () => {
    return (
        <div className="legal-page section-padding animate-fade-in">
            <div className="container">
                <div className="legal-content">
                    <h1 className="section-title">Privacy <span>Policy</span></h1>
                    <p>Your privacy is important to us. This policy explains how we handle your data.</p>

                    <h2>Data Collection</h2>
                    <p>We collect information you provide when placing an order, such as your name, shipping address, and email.</p>

                    <h2>How We Use Data</h2>
                    <p>Personal information is used solely to process your orders for the Kintsugi Knife and to communicate about your purchase.</p>

                    <h2>Security</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order.</p>

                    <h2>Third Parties</h2>
                    <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except for the purpose of shipping and payment processing.</p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
