import React, { useState, useEffect } from 'react';
import { Tab, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put('/orders/status', { id, status });
      setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
      alert(`Order ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
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
                </>
              )}
            </div>
          )}
        </Card.Footer>
      </Card>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  return (
    <Container className="mt-5">
      <Tab.Container defaultActiveKey="orders" onSelect={(key) => navigate(`/admin/${key}`)}>
        <Nav variant="pills" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders">Orders</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="stock">Stock</Nav.Link>
          </Nav.Item>
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

export default AdminOrders;
