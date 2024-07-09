import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CheckoutPopup from './PaymentPopup'; // Import the new popup component

const Checkout = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [total, setTotal] = useState(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [city, setCity] = useState(user.city || '');
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
        city,
        postalCode,
        province,
        district,
        area,
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

      // Fetch bank details
      const bankResponse = await api.get('/orders/bank-details');
      setBankDetails(bankResponse.data);

      // Show the popup
      setIsPopupOpen(true);

      // Clear the form fields
      setName('');
      setAddress('');
      setEmail('');
      setPhone('');
      setCity('');
      setPostalCode('');
      setProvince('');
      setDistrict('');
      setArea('');
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <select value={province} onChange={(e) => setProvince(e.target.value)} required>
          <option value="">Select Province</option>
          {provinces.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
          <option value="">Select District</option>
          {filteredDistricts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={area} onChange={(e) => setArea(e.target.value)} required>
          <option value="">Select Area</option>
          {filteredAreas.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <h3>Total: LKR {total.toFixed(2)}</h3>
        <h3>Delivery Fee: LKR {deliveryFee.toFixed(2)}</h3>
        <h3>Subtotal: LKR {(total + deliveryFee).toFixed(2)}</h3>
        <button type="submit">Place Order</button>
      </form>
      {isPopupOpen && (
        <CheckoutPopup
          orderId={orderId}
          subtotal={(total + deliveryFee).toFixed(2)}
          bankDetails={bankDetails}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
