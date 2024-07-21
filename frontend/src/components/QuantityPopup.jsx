import React, { useState } from 'react';

const QuantityPopup = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{item.title}</h2>
        <p>Price: LKR {item.price}</p>
        <p>Stock: {item.stock >= 1 ? 'In Stock' : 'Out of Stock'}</p>
        <div className="quantity-selector">
          <button className="quantity-button" onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-button" onClick={incrementQuantity} disabled={quantity >= item.stock}>+</button>
        </div>
        <div className="popup-buttons">
          <button className="btn btn-primary" onClick={handleAddToCart} disabled={item.stock < 1}>Add to Cart</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
      <style>
        {`
          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .popup-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 400px;
          }

          .popup-content h2 {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }

          .popup-content p {
            margin: 10px 0;
            font-size: 1.1rem;
          }

          .quantity-selector {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
          }

          .quantity-button {
            background: #f0f0f0;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 1.5rem;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin: 0 10px;
          }

          .quantity-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .quantity-display {
            font-size: 1.2rem;
            width: 30px;
            text-align: center;
          }

          .popup-buttons {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
          }

          .popup-buttons .btn {
            padding: 10px 20px;
            font-size: 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .popup-buttons .btn-primary {
            background-color: #007bff;
            color: white;
          }

          .popup-buttons .btn-secondary {
            background-color: #6c757d;
            color: white;
          }

          .popup-buttons .btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default QuantityPopup;
