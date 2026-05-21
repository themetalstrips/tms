import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page animate-fade-in">
            <div className="container-narrow">
                <section className="about-hero">
                    <span className="section-label" style={{ justifyContent: 'center' }}>Our Story</span>
                    <h1>The Art of <em>Precision</em></h1>
                    <div className="gold-divider"></div>
                    <p>
                        Founded in the global capital of surgical metalwork, The Metal Strips represents the perfect marriage of generations-old metal forging with state-of-the-art medical engineering. We forge the clinical instruments that surgeons, dentists, and veterinarians rely on to execute lifesaving actions daily.
                    </p>
                </section>

                <section className="about-content">
                    <h2>Engineered for Complete <em>Safety</em></h2>
                    <p>
                        Every Metal Strips instrument begins its journey as a raw slab of premium German-grade austenitic and martensitic stainless steel. This specific alloy is trusted globally for its extraordinary tensile strength, edge retention, and superior corrosion resistance.
                    </p>
                    <p>
                        Through a meticulous 47-step forging process, each instrument is hand-shaped, heat-hardened to optimal HRC levels, and hand-polished to achieve a pristine passive surface layer. This ensures the steel resists pitting and degradation, even under repetitive autoclave sterilization cycles at 134°C.
                    </p>
                    <p>
                        From fine dissecting scissors equipped with Tungsten Carbide (TC) inserts for clean incisions to perfectly aligned dental extraction forceps, every piece is sculpted to perform flawlessly under high-pressure clinical scenarios.
                    </p>
                </section>

                <section className="about-content">
                    <h2>Calibrated to <em>Artistry</em></h2>
                    <p>
                        We believe that a high-end clinical instrument should feel like an extension of the practitioner's hand. That is why our master metal artisans individually inspect, tension, and calibrate every hinge, micro-serrated teeth, and joint.
                    </p>
                    <p>
                        This tactile feedback and weight balance give surgeons, dentists, and veterinary practitioners absolute confidence during sensitive operations, reducing hand fatigue and enhancing clinical outcomes.
                    </p>
                </section>

                <div className="about-values">
                    <div className="about-value-card">
                        <h3>ISO 13485 Standards</h3>
                        <p>Every batch of clinical steel is fully certified for quality, tensile strength, and clinical safety.</p>
                    </div>
                    <div className="about-value-card">
                        <h3>CE Approved Reusable</h3>
                        <p>All reusable instruments are certified for clinical use and engineered to sustain hundreds of autoclave runs.</p>
                    </div>
                    <div className="about-value-card">
                        <h3>Clinical Warranty</h3>
                        <p>We stand behind our medical metallurgy with a complete materials guarantee and professional B2B support.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
