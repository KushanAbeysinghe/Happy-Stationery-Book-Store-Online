import React, { useState } from 'react';
import './BookStore.css';
import QuantityPopup from './QuantityPopup';

const StationeryItem = ({ item }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'stationery');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'stationery' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Stationery item added to cart');
  };

  return (
    <div className="book-item">
      <h3>{item.title}</h3>
      {item.image && <img src={item.image} alt={item.title} style={{ width: '200px', height: 'auto' }} />}
      <p>Price: ${item.price}</p>
      <p>Stock: {item.stock > 0 ? item.stock : 'Out of stock'}</p>
      {item.stock > 0 && (
        <button onClick={() => setIsPopupOpen(true)}>Add to Cart</button>
      )}
      {isPopupOpen && (
        <QuantityPopup
          item={item}
          onClose={() => setIsPopupOpen(false)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default StationeryItem;
