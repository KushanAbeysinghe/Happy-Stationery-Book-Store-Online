import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Cart</h2>
      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.title} - ${item.price} x {item.quantity}
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
