import React, { useState, useEffect } from 'react';
import { Tab, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../components/Logo.png'; // Ensure the logo path is correct

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const sendEmail = (order) => {
    const emailParams = {
      to_email: order.email,
      order_id: order.id,
      order_message: 'Your order has been handed over to delivery. You will receive it in 3 - 5 working days. Thank you.',
    };

    emailjs.send(
      'karate_xi1rp8f',
      'paymentkarate_8yntqmm',
      emailParams,
      'J77cRRgneb4aLosQN'
    ).then((response) => {
      console.log('Email sent successfully:', response.status, response.text);
    }).catch((error) => {
      console.error('Failed to send email:', error);
    });
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put('/orders/status', { id, status });
      setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
      alert(`Order ${status}`);

      if (status === 'completed') {
        const order = orders.find(order => order.id === id);
        sendEmail(order);
        generatePDF(order);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const generatePDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 10, 10);
    doc.text(`User ID: ${order.user_id}`, 10, 20);
    doc.text(`Status: ${order.status}`, 10, 30);
    doc.text(`Order Date: ${new Date(order.order_date).toLocaleString()}`, 10, 40);

    doc.text('Customer Details:', 10, 50);
    doc.text(`Name: ${order.name}`, 10, 60);
    doc.text(`Address: ${order.address}`, 10, 70);
    doc.text(`Email: ${order.email}`, 10, 80);
    doc.text(`Phone: ${order.phone}`, 10, 90);

    doc.text('Location Details:', 10, 100);
    doc.text(`Postal Code: ${order.postal_code}`, 10, 110);
    doc.text(`Province: ${order.province_name}`, 10, 120);
    doc.text(`District: ${order.district_name}`, 10, 130);
    doc.text(`Area: ${order.area_name}`, 10, 140);

    doc.text('Cost Details:', 10, 150);
    const itemTotal = order.items ? order.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0) : 0;
    const shippingCost = parseFloat(order.delivery_fee || 0);
    const subtotal = itemTotal + shippingCost;
    doc.text(`Item Total: LKR ${itemTotal.toFixed(2)}`, 10, 160);
    doc.text(`Shipping Cost: LKR ${shippingCost.toFixed(2)}`, 10, 170);
    doc.text(`Subtotal: LKR ${subtotal.toFixed(2)}`, 10, 180);

    doc.text('Items:', 10, 190);
    let items = order.items.map(item => [
      item.book_id ? 'Book' : 'Stationery',
      item.title,
      item.book_id ? item.isbn13 : '',
      item.quantity,
      `LKR ${item.price}`
    ]);

    doc.autoTable({
      head: [['Type', 'Name', 'ISBN-13', 'Qty', 'Price']],
      body: items,
      startY: 200,
    });

    doc.save(`order_${order.id}.pdf`);
  };

  const generateShippingLabel = (order) => {
    getBase64Image(logo, (base64Image) => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Add logo
      doc.addImage(base64Image, 'PNG', 10, 10, 50, 20);

      doc.setFontSize(12);
      doc.text('FROM:', 10, 40);
      doc.text('Company Name', 10, 45);
      doc.text('Address Here', 10, 50);
      doc.text('City', 10, 55);

      doc.text('TO:', 150, 40);
      doc.text(`Name: ${order.name}`, 150, 45);
      doc.text(`Address: ${order.address}`, 150, 50);
      doc.text(`City: ${order.area_name}`, 150, 55);

      doc.text('Order No:', 10, 80);
      doc.setFontSize(16);
      doc.text(`${order.id}`, 10, 85);

      if (order.payment_method === 'Bank Deposit') {
        doc.text('Paid', 150, 85);
      } else if (order.payment_method === 'COD') {
        doc.text(`Subtotal: LKR ${order.subtotal}`, 150, 85);
      }

      doc.save(`shipping_label_${order.id}.pdf`);
    });
  };

  const calculateCompletedTotal = () => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    return completedOrders.reduce((sum, order) => {
      const itemTotal = order.items ? order.items.reduce((itemSum, item) => itemSum + (parseFloat(item.price) || 0) * item.quantity, 0) : 0;
      return sum + itemTotal;
    }, 0).toFixed(2);
  };

  const renderOrderCard = (order, includeActions) => {
    const itemTotal = order.items ? order.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0) : 0;
    const shippingCost = parseFloat(order.delivery_fee || 0);
    const subtotal = itemTotal + shippingCost;

    return (
      <Card className="mb-4 shadow-sm" key={order.id}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div><strong>Order ID:</strong> {order.id}</div>
          <div><strong>User ID:</strong> {order.user_id}</div>
          <div><strong>Status:</strong> <span className={`badge ${order.status === 'pending' ? 'bg-warning' : order.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>{order.status}</span></div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <h5>Cost Details</h5>
              <div><strong>Item Total:</strong> LKR {itemTotal.toFixed(2)}</div>
              <div><strong>Shipping Cost:</strong> LKR {shippingCost.toFixed(2)}</div>
              <div><strong>Subtotal:</strong> LKR {subtotal.toFixed(2)}</div>
            </Col>
            <Col md={4}>
              <h5>Customer Details</h5>
              <div><strong>Name:</strong> {order.name}</div>
              <div><strong>Address:</strong> {order.address}</div>
              <div><strong>Email:</strong> {order.email}</div>
              <div><strong>Phone:</strong> {order.phone}</div>
            </Col>
            <Col md={4}>
              <h5>Location Details</h5>
              <div><strong>Postal Code:</strong> {order.postal_code}</div>
              <div><strong>Province:</strong> {order.province_name}</div>
              <div><strong>District:</strong> {order.district_name}</div>
              <div><strong>Area:</strong> {order.area_name}</div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <h5>Items</h5>
              <div className="item-list">
                {order.items.map(item => (
                  <div key={item.id} className="item-box">
                    <div><strong>Type:</strong> {item.book_id ? 'Book' : 'Stationery'}</div>
                    <div><strong>Name:</strong> {item.title}</div>
                    {item.book_id && <div><strong>ISBN-13:</strong> {item.isbn13}</div>}
                    <div><strong>Qty:</strong> {item.quantity}</div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</div>
          <div><strong>Payment Method:</strong> {order.payment_method}</div>
          {includeActions && (
            <div>
              {order.status === 'pending' && (
                <>
                  <Button variant="success" size="sm" className="mr-2 mb-2" onClick={() => handleUpdateStatus(order.id, 'completed')}>Confirm</Button>
                  <Button variant="danger" size="sm" className="mb-2" onClick={() => handleUpdateStatus(order.id, 'rejected')}>Reject</Button>
                  {/* <Button variant="primary" size="sm" className="mr-2 mb-2" onClick={() => generateShippingLabel(order)}>Print Shipping Label</Button> */}
                </>
              )}
            </div>
          )}
        </Card.Footer>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100vh;
            padding-top: 20%;
          }
          .loading-spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #FFDE59;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1.5s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <Container className="mt-5">
      <Tab.Container defaultActiveKey="orders" onSelect={(key) => navigate(`/admin/${key}`)}>
        <Nav variant="pills" className="justify-content-between mb-4">
          <div className="d-flex">
            <Nav.Item>
              <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="orders">Orders</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stock">Stock</Nav.Link>
            </Nav.Item>
          </div>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Nav>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="orders">
                <h2>All Orders</h2>
                <h3>Total of Item Totals in Completed Orders: LKR {calculateCompletedTotal()}</h3>
                <div>
                  <h3>Pending Orders</h3>
                  {pendingOrders.map(order => renderOrderCard(order, true))}
                </div>
                <div>
                  <h3>Completed Orders</h3>
                  {completedOrders.map(order => renderOrderCard(order, false))}
                </div>
                <div>
                  <h3>Rejected Orders</h3>
                  {rejectedOrders.map(order => renderOrderCard(order, false))}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <style>
        {`
          .table th, .table td {
            padding: 8px;
            text-align: left;
          }
          .thead-dark th {
            background-color: #343a40;
            color: #fff;
          }
          .nav-pills .nav-link {
            margin: 0 5px;
          }
          .nav-pills .nav-link.active {
            background-color: #007bff;
          }
          .item-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .item-box {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            background-color: #f9f9f9;
            width: 150px;
            margin-bottom: 10px;
          }
          .item-box div {
            margin-bottom: 5px;
          }
          .card-header, .card-footer {
            background-color: #f8f9fa;
          }
          .badge.bg-warning {
            background-color: #ffc107;
          }
          .badge.bg-success {
            background-color: #28a745;
          }
          .badge.bg-danger {
            background-color: #dc3545;
          }
          .mr-2 {
            margin-right: 10px;
          }
          .mb-2 {
            margin-bottom: 10px;
          }
        `}
      </style>
    </Container>
  );
};

const getBase64Image = (img, callback) => {
  fetch(img)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onload = () => callback(reader.result);
      reader.readAsDataURL(blob);
    })
    .catch(error => console.error('Error fetching the image:', error));
};

export default AdminOrders;
