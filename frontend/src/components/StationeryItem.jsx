import React from 'react';
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
      <style jsx>{`
        .book-card {
          transition: transform 0.2s;
          border-radius: 8px;
        }

        .book-card:hover {
          transform: scale(1.05);
        }

        .book-image {
          height: 300px; /* Adjust height as needed */
          object-fit: cover;
          width: 100%;
        }

        .card-body {
          text-align: center;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: bold;
        }

        .card-subtitle {
          font-size: 1rem;
          color: #6c757d;
        }

        .text-warning {
          color: #ffc107 !important;
        }

        .text-danger {
          color: #dc3545 !important;
        }

        .price-slider {
          margin-top: 20px;
        }

        .price-slider .rc-slider {
          margin-bottom: 20px;
        }

        .price-slider .d-flex {
          justify-content: space-between;
        }

        .list-group-item {
          transition: background-color 0.3s ease, font-weight 0.3s ease;
        }

        .list-group-item:hover {
          background-color: #f8f9fa;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default StationeryItem;
