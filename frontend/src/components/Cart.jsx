import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer'; // Make sure to import your Footer component

const Cart = ({ cart, updateCart }) => {
  const navigate = useNavigate();
  const [stockWarning, setStockWarning] = useState({});

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

  const handleCheckout = () => {
    let isValid = true;
    const warning = {};

    cart.forEach(item => {
      if (item.quantity > item.stock) {
        warning[item.id] = `Only ${item.stock} in stock`;
        isValid = false;
      }
    });

    setStockWarning(warning);

    if (isValid) {
      navigate('/checkout');
    }
  };

  return (
    <div className="wrapper">
      <div className="content">
        <div className="container mt-5" style={styles.container}>
          <h2 className="text-center mb-4" style={styles.cartTitle}>My Shopping Cart</h2>
          {cart.length > 0 ? (
            <>
              <table className="table table-hover" style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={styles.tableCell}>Description</th>
                    <th style={styles.tableCell}>Actions</th>
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
                      <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                        <div style={styles.quantityControls} className="d-flex align-items-center">
                          <button style={styles.quantityButton} className="btn btn-outline-primary btn-sm" onClick={() => decreaseQuantity(item.id)}>-</button>
                          <span style={styles.quantityText} className="mx-2">{item.quantity}</span>
                          <button style={styles.quantityButton} className="btn btn-outline-primary btn-sm" onClick={() => increaseQuantity(item.id)}>+</button>
                        </div>
                        <button style={styles.removeButton} className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Remove</button>
                        <span style={styles.itemPrice}> LKR {item.price}</span>
                        {stockWarning[item.id] && (
                          <span style={styles.stockWarning}> ({stockWarning[item.id]})</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={styles.totalContainer} className="d-flex justify-content-start">
                <div style={styles.totalText} className="text-left">
                  <h5>Subtotal: LKR {total.toFixed(2)}</h5>
                  <h5>Total: LKR {total.toFixed(2)}</h5>
                  <button style={styles.checkoutButton} className="btn btn-primary mt-3" onClick={handleCheckout}>Checkout</button>
                </div>
              </div>
              <br /><br /><br /><br /><br /><br /><br />
            </>
          ) : (
            <div>
              <p>Your cart is empty</p>
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            </div>
          )}
          <style jsx>{`
            @media (max-width: 768px) {
              .table th, .table td {
                display: block;
                width: 100%;
                text-align: center;
              }
              .table thead {
                display: none;
              }
              .table tr {
                margin-bottom: 1rem;
                display: block;
                border-bottom: 2px solid #dee2e6;
              }
              .table-hover tbody tr:hover {
                background-color: #f5f5f5;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

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
  tableHead: {
    backgroundColor: '#f8f9fa'
  },
  tableCell: {
    padding: '0.75rem',
    verticalAlign: 'middle',
    borderTop: '1px solid #dee2e6'
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    padding: '0.25rem 0.5rem',
    borderRadius: '5px'
  },
  quantityText: {
    margin: '0 0.5rem'
  },
  removeButton: {
    padding: '0.25rem 0.5rem',
    color: '#ffffff',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  itemPrice: {
    marginLeft: '10px'
  },
  stockWarning: {
    color: 'red',
    marginLeft: '10px'
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '1rem'
  },
  totalText: {
    textAlign: 'left'
  },
  checkoutButton: {
    marginTop: '1rem',
    borderRadius: '5px'
  }
};

export default Cart;
