import React, { useState } from 'react';

const QuantityPopup = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <div className="popup">
      <h3>Add {item.title} to Cart</h3>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default QuantityPopup;
