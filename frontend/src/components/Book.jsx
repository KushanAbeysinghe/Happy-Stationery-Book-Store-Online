
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Book = ({ book }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div 
      className="card book-card h-100" 
      onClick={handleNavigate} 
      style={{ 
        cursor: 'pointer', 
        borderRadius: '8px', 
        transition: 'transform 0.2s',
        paddingTop: '10px'  // Adds gap on the top of the card
      }}
    >
      {book.images && book.images.length > 0 && (
        <img 
          src={book.images[0]} 
          alt={book.title} 
          style={{ 
            width: '100%', 
            height: 'auto', 
            objectFit: 'contain', 
            maxHeight: '200px', // Increase the height to make the image larger
            marginTop: '10px' // Adds gap on the top of the image
          }} 
        />
      )}
      <div className="card-body text-center">
        <h5 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1rem', color: '#6c757d' }}>{book.author}</h6>
        <div className="book-rating" style={{ marginTop: '5px' }}>
          <span className="text-warning" style={{ color: '#ffc107 !important' }}>&#9733; &#9733; &#9733; &#9733; &#9734;</span>
          {/* <span className="text-muted"> (120 Review)</span> */}
        </div>
        <h5 className="text-danger" style={{ color: '#dc3545 !important' }}>LKR {book.price}</h5>
        <p className="text-muted">
          {book.stock > 0 ? (
            <span className="text-success" style={{ color: '#28a745 !important' }}>In Stock</span>
          ) : (
            book.preorder ? (
              <span className="text-warning" style={{ color: '#ffc107 !important' }}>
                Out of stock (Available on: {new Date(book.preorder_date).toLocaleDateString()}) <b><p> Pre-Order </p> </b>

              </span>
            ) : (
              <span className="text-danger" style={{ color: '#dc3545 !important' }}>Out of Stock</span>
            )
          )}
        </p>
      </div>
    </div>
  );
};

export default Book;
