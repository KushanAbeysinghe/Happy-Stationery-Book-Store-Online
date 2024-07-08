import React, { useState } from 'react';

const Book = ({ book }) => {
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...book, quantity });
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
        <>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            max={book.stock}
          />
          <button onClick={addToCart}>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default Book;
