// import React, { useState } from 'react';
// import QuantityPopup from './QuantityPopup';
// import './BookStore.css'; // Ensure this path is correct

// const Book = ({ book }) => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(0);

//   const addToCart = (item, quantity) => {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'book');
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.push({ ...item, quantity, type: 'book' });
//     }
//     localStorage.setItem('cart', JSON.stringify(cart));
//     alert('Book added to cart');
//   };

//   const handleImageClick = (index) => {
//     setSelectedImage(index);
//   };

//   return (
//     <div className="book-item">
//       <h3>{book.title}</h3>
//       {book.images && book.images.length > 0 && (
//         <div className="image-gallery">
//           <img src={book.images[selectedImage]} alt={book.title} style={{ width: '200px', height: 'auto' }} />
//           <div className="image-thumbnails">
//             {book.images.map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 alt={`Book ${index + 1}`}
//                 className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
//                 onClick={() => handleImageClick(index)}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//       <p>Author: {book.author}</p>
//       <p>Price: LKR {book.price}</p>
//       <p>
//         Stock: {book.stock > 0 ? (
//           book.stock
//         ) : book.preorder ? (
//           <>
//             Out of stock (Available on: {new Date(book.preorder_date).toLocaleDateString()})
//           </>
//         ) : (
//           'Out of stock'
//         )}
//       </p>
//       {book.stock > 0 && (
//         <button onClick={() => setIsPopupOpen(true)}>Add to Cart</button>
//       )}
//       {isPopupOpen && (
//         <div className="popup-overlay">
//           <QuantityPopup
//             item={book}
//             onClose={() => setIsPopupOpen(false)}
//             onAddToCart={addToCart}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Book;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './BookStore.css'; // Ensure this path is correct
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Book = ({ book }) => {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     navigate(`/books/${book.id}`);
//   };

//   return (
//     <div className="card book-card h-100" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
//       {book.images && book.images.length > 0 && (
//         <img src={book.images[0]} alt={book.title} className="card-img-top book-image" />
//       )}
//       <div className="card-body">
//         <h5 className="card-title">{book.title}</h5>
//         <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
//         <div className="book-rating">
//           <span className="text-warning">&#9733; &#9733; &#9733; &#9733; &#9734;</span>
//           <span className="text-muted"> (120 Review)</span>
//         </div>
//         <h5 className="text-danger">${book.price}</h5>
//       </div>
//     </div>
//   );
// };

// export default Book;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookStore.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';

const Book = ({ book }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="card book-card h-100" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
      {book.images && book.images.length > 0 && (
        <img src={book.images[0]} alt={book.title} className="card-img-top book-image" />
      )}
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
        <div className="book-rating">
          <span className="text-warning">&#9733; &#9733; &#9733; &#9733; &#9734;</span>
          <span className="text-muted"> (120 Review)</span>
        </div>
        <h5 className="text-danger">LKR {book.price}</h5>
        <p className="text-muted">
          {book.stock > 0 ? (
            <span className="text-success">In Stock</span>
          ) : (
            book.preorder ? (
              <span className="text-warning">
                Out of stock (Available on: {new Date(book.preorder_date).toLocaleDateString()})
              </span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )
          )}
        </p>
      </div>
    </div>
  );
};

export default Book;
