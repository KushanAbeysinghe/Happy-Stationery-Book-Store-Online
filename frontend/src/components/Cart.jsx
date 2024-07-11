import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = ({ cart, updateCart }) => {
  const navigate = useNavigate();

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    updateCart(updatedCart);
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
    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > 1) {
        item.quantity -= 1;
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-5" style={styles.container}>
      <h2 className="text-center mb-4" style={styles.cartTitle}>My Shopping Cart</h2>
      {cart.length > 0 ? (
        <>
          <table className="table table-bordered" style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableCell}>Description</th>
                <th style={styles.tableCell}>Quantity</th>
                <th style={styles.tableCell}>Remove</th>
                <th style={styles.tableCell}>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td style={styles.tableCell}>
                    <img
                      src={item.type === 'book' ? (item.images ? item.images[0] : '') : item.image}
                      alt={item.title}
                      style={styles.itemImage}
                    />
                    {item.type === 'book' ? 'Book' : 'Stationery'}: {item.title}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.quantityControls} className="d-flex align-items-center">
                      <button style={styles.quantityButton} className="btn btn-outline-primary btn-sm" onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span style={styles.quantityText} className="mx-2">{item.quantity}</span>
                      <button style={styles.quantityButton} className="btn btn-outline-primary btn-sm" onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <button style={styles.removeButton} className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Remove</button>
                  </td>
                  <td style={styles.tableCell}>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.totalContainer} className="d-flex justify-content-end">
            <div style={styles.totalText} className="text-right">
              <h5>Subtotal: ${total.toFixed(2)}</h5>
              <h5>Total: ${total.toFixed(2)}</h5>
              <button style={styles.checkoutButton} className="btn btn-primary mt-3" onClick={() => navigate('/checkout')}>Checkout</button>
            </div>
          </div>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;

const styles = {
  container: {
    marginTop: '5rem'
  },
  cartTitle: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  table: {
    width: '100%',
    marginBottom: '1rem',
    color: '#212529',
    backgroundColor: 'transparent',
    borderCollapse: 'collapse'
  },
  tableBordered: {
    border: '1px solid #dee2e6'
  },
  tableHead: {
    backgroundColor: '#f8f9fa'
  },
  tableCell: {
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6'
  },
  itemImage: {
    width: '50px',
    height: 'auto',
    marginRight: '10px'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center'
  },
  quantityButton: {
    border: '1px solid #ced4da',
    padding: '0.25rem 0.5rem'
  },
  quantityText: {
    margin: '0 0.5rem'
  },
  removeButton: {
    padding: '0.25rem 0.5rem',
    color: '#ffffff',
    backgroundColor: '#dc3545',
    cursor: 'pointer'
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  totalText: {
    textAlign: 'right'
  },
  checkoutButton: {
    marginTop: '1rem'
  }
};
