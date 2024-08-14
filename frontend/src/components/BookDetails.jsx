import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import QuantityPopup from './QuantityPopup';
import { GlassMagnifier } from 'react-image-magnifiers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart, FaTruck, FaLock, FaHeadset } from 'react-icons/fa';

const BookDetails = ({ books, updateCart }) => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const selectedBook = books.find(book => book.id.toString() === id);
      if (selectedBook) {
        setBook(selectedBook);
      }
      setLoading(false);
    };
    fetchBook();
  }, [id, books]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
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

  if (!book) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
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

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'book');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'book' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Formats the date as YYYY-MM-DD
  };

  const handleBankDetailsClick = () => {
    setShowBankDetails(true);
  };

  const handleClosePopup = () => {
    setShowBankDetails(false);
  };

  return (
    <div className="container book-details mt-5">
      <Helmet>
        <meta property="og:title" content={book.title} />
        <meta property="og:description" content={book.description} />
        <meta property="og:image" content={book.images[selectedImage]} />
        <meta property="og:url" content={`https://karateonline.lk/books/${id}`} />
      </Helmet>
      <div className="row book-details-container">
        <div className="col-md-5 d-flex flex-column align-items-center">
          <div className="image-container mb-3">
            <GlassMagnifier
              imageSrc={book.images[selectedImage]}
              imageAlt={book.title}
              magnifierSize="50%"
              magnifierBorderSize={2}
              magnifierBorderColor="rgba(255, 255, 255, 0.5)"
              magnifierOffsetX={0}
              magnifierOffsetY={0}
              magnifierZoom={2}
              style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
            />
          </div>
          <div className="image-thumbnails d-flex justify-content-center">
            {book.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Book ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
                onClick={() => handleImageClick(index)}
                style={styles.thumbnail}
              />
            ))}
          </div>
        </div>
        <div className="col-md-7">
          <div className="book-info p-4">
            <h2 className="book-title">{book.title}</h2>
            <h4><strong>Price:</strong> LKR {book.price}</h4>
            {/* <p><strong>Stock:</strong> {book.stock > 0 ? 'In Stock' : 'Out of Stock'}</p> */}
            {book.preorder === 1 && (
              <p>
                {/* <strong>Available from:</strong> {new Date(book.preorder_date).toLocaleDateString()}  */}
                <p><b>Pre-Orders available on Bank Deposit</b></p>
                <button className="btn btn-primary" onClick={handleBankDetailsClick}>Show Bank Details</button>
              </p>
            )}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
              <div className="icons mb-3 mb-md-0">
                <FaShoppingCart className="icon" title="Shopping Cart" />
                <FaTruck className="icon" title="Fast Delivery" />
                <FaLock className="icon" title="Secure" />
                <FaHeadset className="icon" title="24/7 Customer Support" />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsPopupOpen(true)}
                disabled={book.stock === 0}
                style={{ cursor: book.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className="book-specifications mt-4 p-4">
            <h5 className="specifications-header">Product Specifications</h5>
            <p><strong>Book Description:</strong> {book.description || 'No description available for this product.'}</p>
            <div className="row">
              <div className="col-md-6">
                <p><strong>ISBN-13:</strong> {book.isbn13}</p>
                <p><strong>Language:</strong> {book.language}</p>
                <p><strong>Binding:</strong> {book.binding}</p>
                <p><strong>Author:</strong> {book.author}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Publishing Date:</strong> {formatDate(book.publishing_date)}</p>
                <p><strong>Product Edition:</strong> {book.product_edition}</p>
                <p><strong>Product Weight:</strong> {book.weight} Kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br><br></br><br></br><br></br>

      {isPopupOpen && (
        <QuantityPopup
          item={book}
          onClose={() => setIsPopupOpen(false)}
          onAddToCart={addToCart}
        />
      )}

      {showBankDetails && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Bank Details:</h3>
            <p>Bank Name: Sampath Bank</p>
            <p>Bank Branch: Kegalle</p>
            <p>Account Name: M.R.E.C. GUNAWARDENA</p>
            <p>Account Number: 106457910600</p>
            <p>WhatsApp Number: 0743632710</p>
            <button className="btn btn-secondary" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}

      <style>
        {`
          .book-details-container {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .image-container {
            width: 350px;
            height: auto;
            display: flex;
            justify-content: center;
          }
          .image-thumbnails {
            margin-top: 10px;
            display: flex;
            justify-content: center;
          }
          .thumbnail {
            width: 60px;
            height: 60px;
            margin: 5px;
            cursor: pointer;
            transition: transform 0.2s ease;
            border: 2px solid transparent;
            border-radius: 8px;
          }
          .thumbnail.selected {
            border: 2px solid #FFDE59;
          }
          .thumbnail:hover {
            transform: scale(1.1);
          }
          .book-info {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-top: 10px;
          }
          .book-title {
            font-size: 24px;
            color: #333;
          }
          .book-specifications {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-top: 10px;
          }
          .specifications-header {
            font-size: 20px;
            color: #333;
          }
          .icons {
            display: flex;
            gap: 10px;
          }
          .icon {
            font-size: 24px;
            color: #007bff;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .icon:hover {
            transform: scale(1.1);
          }
          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .popup-content {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .popup-content h3 {
            margin-bottom: 15px;
          }
          .popup-content p {
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  thumbnail: {
    width: '60px',
    height: '60px',
    margin: '5px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    border: '2px solid transparent',
    borderRadius: '8px',
  }
};

export default BookDetails;
