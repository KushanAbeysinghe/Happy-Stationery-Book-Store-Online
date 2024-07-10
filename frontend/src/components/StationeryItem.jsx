import React from 'react';
import './BookStore.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';

const StationeryItem = ({ item, onAddToCart }) => {
  return (
    <div className="card book-card h-100">
      {item.image && (
        <img src={item.image} alt={item.title} className="card-img-top book-image" />
      )}
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text">Price: LKR {item.price}</p>
        <p className="card-text">Stock: {item.stock > 0 ? item.stock : 'Out of stock'}</p>
        {item.stock > 0 && (
          <button className="btn btn-success" onClick={() => onAddToCart(item)}>Add to Cart</button>
        )}
      </div>
    </div>
  );
};

export default StationeryItem;
