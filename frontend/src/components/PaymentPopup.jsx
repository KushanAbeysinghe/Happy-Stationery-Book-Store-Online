import React from 'react';
import './PaymentPopup.css';

const PaymentPopup = ({ orderId, subtotal, bankDetails, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Payment Information</h2>
        <p>Order ID: {orderId}</p>
        <p>Please Pay: LKR {subtotal} to Processed</p>
        <h3>Bank Details:</h3>
        <p>Bank Name: {bankDetails.bank_name}</p>
        <p>Bank Branch: {bankDetails.bank_branch}</p>
        <p>Account Name: {bankDetails.account_name}</p>
        <p>Account Number: {bankDetails.account_number}</p>
        <p>Please pay the amount and WhatsApp the receipt to the following number: {bankDetails.whatsapp_number}</p>
        <p>Thank you! Come back again.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PaymentPopup;
