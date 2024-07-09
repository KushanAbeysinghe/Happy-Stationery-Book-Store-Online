import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        if (item.quantity < item.stock) {
          item.quantity += 1;
        } else {
          alert('Insufficient stock');
        }
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > 1) {
        item.quantity -= 1;
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>
      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.type === 'book' ? 'Book' : 'Stationery'}: {item.title} - ${item.price} x {item.quantity}
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={() => navigate('/checkout')}>Checkout</button>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
