import React from 'react';
import logo from './Logo.png'; // Adjust the path as necessary
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3 logo">
            <img src={logo} alt="Happy Store" />
            <p></p>
            <p className="justified-text">
              Welcome to Happy Store, your one-stop shop for all your book and stationery needs. From the latest bestsellers to essential office supplies, we have everything to keep you inspired and organized. Explore our wide range of products and discover the joy of shopping with Happy Store.
            </p>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61558947222960&mibextid=LQQJ4d"><FaFacebookF /></a>
              <a href="https://www.instagram.com/happy_stationery01?igsh=MW8xcW5nY2NhenhiYg=="><FaInstagram /></a>
              <a href="https://wa.me/message/G5LOKX4KZ5QXC1?src=qr"><FaWhatsapp /></a>
              {/* <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaEnvelope /></a> */}
            </div>
          </div>
          <div className="col-md-3">
            <h5>Site Map</h5>
            <ul className="list-unstyled">
              <li><a href="/">Book Store</a></li>
              <li><a href="/stationery">Stationery Store</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>FAQ</h5>
            <ul className="list-unstyled">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li><a href="tel:+94743632710"><FaPhone />+94743632710</a></li>
              <li><a href="tel:+94777371672"><FaWhatsapp />+94762512710</a></li>
              <li><a href=""><FaMapMarkerAlt /> No. 09, Lilian Avenue, Mount Lavinia</a></li>
              <li><a href="mailto:contact@happystationerynbooks.lk"><FaEnvelope /> contact@happystationerynbooks.lk</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Happy Store | All Rights Reserved | Concept, Design & Development By <a href="https://www.in4gen.com/" target="_blank" rel="noopener noreferrer">In4gen Solutions</a></p>
        </div>
      </div>
      <style>
        {`
          .footer {
            background-color: #FFDE59;
            color: #000;
            padding: 30px 0;
          }
          .footer .logo img {
            max-width: 200px;
          }
          .footer h5 {
            color: #000;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .footer a {
            color: #000;
            text-decoration: none;
          }
          .footer a:hover {
            color: #fff;
          }
          .footer .social-icons a {
            color: #000;
            margin-right: 10px;
          }
          .footer .social-icons a:hover {
            color: #fff;
          }
          .footer .footer-bottom {
            color: black;
            border-top: 1px solid #333;
            padding-top: 10px;
            margin-top: 20px;
            text-align: center;
          }
          .justified-text {
            text-align: justify;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
