import React, { useState } from 'react';
import './BookStore.css';
import QuantityPopup from './QuantityPopup';

const Book = ({ book }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const addToCart = (book, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === book.id && item.type === 'book');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...book, quantity, type: 'book' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Book added to cart');
  };

  return (
    <div className="book-item">
      <h3>{book.title}</h3>
      {book.image && <img src={book.image} alt={book.title} style={{ width: '200px', height: 'auto' }} />}
      <p>Author: {book.author}</p>
      <p>Price: ${book.price}</p>
      <p>Stock: {book.stock > 0 ? book.stock : 'Out of stock'}</p>
      {book.stock > 0 && (
        <button onClick={() => setIsPopupOpen(true)}>Add to Cart</button>
      )}
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

export default Book;
