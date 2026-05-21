import React from 'react';
import './LegalPage.css';

const Refund = () => {
    return (
        <div className="legal-page section-padding animate-fade-in">
            <div className="container">
                <div className="legal-content">
                    <h1 className="section-title">Refund <span>Policy</span></h1>
                    <p>We want you to be completely satisfied with your Kintsugi Knife purchase.</p>

                    <h2>Returns</h2>
                    <p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>

                    <h2>Refunds</h2>
                    <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.</p>

                    <h2>Shipping Costs</h2>
                    <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
                </div>
            </div>
        </div>
    );
};

export default Refund;
