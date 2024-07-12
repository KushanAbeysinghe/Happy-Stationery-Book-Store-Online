import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CheckoutPopup from './PaymentPopup'; // Import the new popup component
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = ({ cart, updateCart }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [total, setTotal] = useState(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [postalCode, setPostalCode] = useState(user.postalCode || '');
  const [province, setProvince] = useState(user.province || '');
  const [district, setDistrict] = useState(user.district || '');
  const [area, setArea] = useState(user.area || '');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [bankDetails, setBankDetails] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // New state for payment method
  const navigate = useNavigate();

  useEffect(() => {
    if (total === 0) {
      navigate('/'); // Redirect to home page if total is zero
    }
  }, [total, navigate]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await api.get('/locations/provinces');
        setProvinces(response.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get('/locations/districts');
        setDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/locations/areas');
        setAreas(response.data);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    setFilteredDistricts(districts.filter(d => d.province_id === parseInt(province)));
    setDistrict('');
    setArea('');
  }, [province, districts]);

  useEffect(() => {
    setFilteredAreas(areas.filter(a => a.district_id === parseInt(district)));
    setArea('');
  }, [district, areas]);

  useEffect(() => {
    if (area) {
      const selectedArea = areas.find(a => a.id === parseInt(area));
      setDeliveryFee(parseFloat(selectedArea ? selectedArea.delivery_fee : 0));
    } else {
      setDeliveryFee(0);
    }
  }, [area, areas]);

  const handlePlaceOrder = async () => {
    try {
      const order = {
        userId: user.id,
        total: total + deliveryFee,
        name,
        address,
        email,
        phone,
        postalCode,
        province,
        district,
        area,
        paymentMethod, // Add the payment method to the order object
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          type: item.type
        }))
      };
      console.log("Order to be placed:", order); // Add this line to debug
      const response = await api.post('/orders', order);
      const { orderId } = response.data;
      setOrderId(orderId);

      // Fetch bank details if Bank Deposit is selected
      if (paymentMethod === 'Bank Deposit') {
        const bankResponse = await api.get('/orders/bank-details');
        setBankDetails(bankResponse.data);
      }

      // Show the popup for all payment methods
      setIsPopupOpen(true);

      // Clear the form fields and update cart
      setName('');
      setAddress('');
      setEmail('');
      setPhone('');
      setPostalCode('');
      setProvince('');
      setDistrict('');
      setArea('');
      localStorage.removeItem('cart');
      updateCart([]);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="checkout-form">
            <h4>Contact Details</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <h4>Shipping Address</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <select className="form-control" value={province} onChange={(e) => setProvince(e.target.value)} required>
                <option value="">Select Province</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)} required>
                <option value="">Select District</option>
                {filteredDistricts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select className="form-control" value={area} onChange={(e) => setArea(e.target.value)} required>
                <option value="">Select City</option>
                {filteredAreas.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
        <div className="col-md-5">
          <div className="order-summary p-3">
            <h4>Order Summary</h4>
            <ul className="list-group mb-3">
              {cart.map(item => (
                <li className="list-group-item d-flex justify-content-between lh-condensed" key={item.id}>
                  <div>
                    <h6 className="my-0">{item.title}</h6>
                    <small className="text-muted">{item.type === 'book' ? 'Book' : 'Stationery'}</small>
                  </div>
                  <span className="text-muted">LKR {item.price} x {item.quantity}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (LKR)</span>
                <strong>{total.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Delivery Fee (LKR)</span>
                <strong>{deliveryFee.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Subtotal (LKR)</span>
                <strong>{(total + deliveryFee).toFixed(2)}</strong>
              </li>
            </ul>
            <h4>Payment Method</h4>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="cod"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cod">Cash on Delivery (COD)</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="bankDeposit"
                name="paymentMethod"
                value="Bank Deposit"
                checked={paymentMethod === 'Bank Deposit'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="bankDeposit">Bank Deposit</label>
            </div>
            <button type="button" className="btn btn-primary mt-3" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
        
      </div>
      <br></br><br></br>
      <br></br><br></br>
      {isPopupOpen && (
        <CheckoutPopup
          orderId={orderId}
          subtotal={(total + deliveryFee).toFixed(2)}
          bankDetails={bankDetails}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
      <style>
        {`
          .checkout-form .form-group {
            margin-bottom: 1rem;
          }

          .order-summary {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: .25rem;
          }

          .list-group-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .form-check-input {
            margin-right: .5rem;
          }

          .form-check-label {
            margin-bottom: 0;
          }

          @media (max-width: 768px) {
            .order-summary .form-check {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }

            .order-summary .btn {
              width: 100%;
              margin-top: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Checkout;
