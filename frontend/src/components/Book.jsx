
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookStore.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';

const Book = ({ book }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="card book-card h-100" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
      {book.images && book.images.length > 0 && (
        <img src={book.images[0]} alt={book.title} className="card-img-top book-image" />
      )}
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
        <div className="book-rating">
          <span className="text-warning">&#9733; &#9733; &#9733; &#9733; &#9734;</span>
          <span className="text-muted"> (120 Review)</span>
        </div>
        <h5 className="text-danger">LKR {book.price}</h5>
        <p className="text-muted">
          {book.stock > 0 ? (
            <span className="text-success">In Stock</span>
          ) : (
            book.preorder ? (
              <span className="text-warning">
                Out of stock (Available on: {new Date(book.preorder_date).toLocaleDateString()})
              </span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )
          )}
        </p>
      </div>
    </div>
  );
};

export default Book;
