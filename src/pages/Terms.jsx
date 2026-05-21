import React from 'react';
import './LegalPage.css';

const Terms = () => {
    return (
        <div className="legal-page section-padding animate-fade-in">
            <div className="container">
                <div className="legal-content">
                    <h1 className="section-title">Terms & <span>Conditions</span></h1>
                    <p>Welcome to The Metal Strips. By accessing our website, you agree to these terms.</p>

                    <h2>1. Use of Website</h2>
                    <p>This website is provided for your personal and non-commercial use. You may not use this site for any illegal or unauthorized purpose.</p>

                    <h2>2. Intellectual Property</h2>
                    <p>All content on this site, including images of the Kintsugi Knife, text, and logos, is the property of OfficialUM1 LLC and protected by international copyright laws.</p>

                    <h2>3. Product Information</h2>
                    <p>We attempt to be as accurate as possible with our product descriptions for the Kintsugi Knife editions (Silver, Gold, Blue). However, we do not warrant that product descriptions are error-free.</p>

                    <h2>4. Limitation of Liability</h2>
                    <p>OfficialUM1 LLC shall not be liable for any direct, indirect, or incidental damages resulting from the use or inability to use our products.</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
