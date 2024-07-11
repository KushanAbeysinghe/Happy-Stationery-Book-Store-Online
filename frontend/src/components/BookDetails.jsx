import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuantityPopup from './QuantityPopup';
import './BookDetails.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';

const BookDetails = ({ books, updateCart }) => {
  const { id } = useParams();
  const book = books.find(book => book.id.toString() === id);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'book');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'book' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
  };

  return (
    <div className="container book-details">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>Back</button>
      <div className="row">
        <div className="col-md-4">
          <img src={book.images[selectedImage]} alt={book.title} className="img-fluid" />
          <div className="image-thumbnails mt-2">
            {book.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Book ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </div>
        <div className="col-md-8">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Price:</strong> LKR {book.price}</p>
          <p><strong>Stock:</strong> {book.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          {book.stock === 0 && book.preorder && (
            <p><strong>Available from:</strong> {new Date(book.preorder_date).toLocaleDateString()}</p>
          )}
          {/* <p><strong>Publisher:</strong> {book.publisher}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>ISBN 13:</strong> {book.isbn13}</p> */}
          <div className="d-flex">
            <button
              className="btn btn-primary mr-2"
              onClick={() => setIsPopupOpen(true)}
              disabled={book.stock === 0}
              style={{ cursor: book.stock === 0 ? 'not-allowed' : 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <QuantityPopup
          item={book}
          onClose={() => setIsPopupOpen(false)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default BookDetails;
