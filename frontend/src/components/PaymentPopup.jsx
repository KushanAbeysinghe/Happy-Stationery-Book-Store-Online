import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPopup.css';
import QRImage from './QR.png'; // Make sure the image path is correct

const PaymentPopup = ({ orderId, subtotal, bankDetails, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/'); // Navigate to the home page
  };

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
        <div style={{ textAlign: 'center' }}>
          <img src={QRImage} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <p>Thank you! Come back again.</p>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default PaymentPopup;
