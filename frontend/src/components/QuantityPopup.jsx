import React, { useState } from 'react';

const QuantityPopup = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>{item.title}</h2>
        <p>Price: ${item.price}</p>
        <p>Stock: {item.stock}</p>
        <input
          type="number"
          min="1"
          max={item.stock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QuantityPopup;
