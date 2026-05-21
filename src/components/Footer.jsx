import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const linksSection = [
        {
            heading: 'Collections',
            links: [
                { label: 'Dental Instruments', url: '/shop' },
                { label: 'Veterinary Instruments', url: '/shop' },
                { label: 'Surgical Instruments', url: '/shop' },
                { label: 'Single Use Instruments', url: '/shop' }
            ]
        },
        {
            heading: 'Company',
            links: [
                { label: 'Our Story', url: '/about' },
                { label: 'Contact Support', url: '/contact' }
            ]
        },
        {
            heading: 'Legal Standards',
            links: [
                { label: 'Terms & Conditions', url: '/terms' },
                { label: 'Privacy Policy', url: '/privacy' },
                { label: 'Refund Policy', url: '/refund' }
            ]
        }
    ];

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <h2 className="footer-logo">The Metal Strips</h2>
                    <p className="footer-tagline">Premium clinical, dental, and veterinary grade instruments crafted to the highest quality standards.</p>
                    <div className="social-links">
                        <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                        <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                    </div>
                </div>

                {linksSection.map((col, idx) => (
                    <div className="footer-links-group" key={idx}>
                        <h3 className="footer-heading">{col.heading}</h3>
                        <ul className="footer-links">
                            {col.links.map((link, lidx) => (
                                <li key={lidx}>
                                    {link.url.startsWith('http') || link.url.startsWith('mailto') ? (
                                        <a href={link.url}>{link.label}</a>
                                    ) : (
                                        <NavLink to={link.url}>{link.label}</NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="footer-bottom container">
                <p>© {currentYear} The Metal Strips. All rights reserved. CE & ISO 13485 Certified.</p>
            </div>
        </footer>
    );
};

export default Footer;
