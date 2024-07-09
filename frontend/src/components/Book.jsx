import React, { useState } from 'react';
import QuantityPopup from './QuantityPopup';
import './BookStore.css'; // Ensure this path is correct

const Book = ({ book }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'book');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'book' });
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
      <p>
        Stock: {book.stock > 0 ? (
          book.stock
        ) : book.preorder ? (
          `Out of stock (Available on: ${new Date(book.preorder_date).toLocaleDateString()})`
        ) : (
          'Out of stock'
        )}
      </p>
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
