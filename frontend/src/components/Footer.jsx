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
            <p>TicketsMinistry is one of the fast-growing ticket marketplaces that includes events of music, sport, art, theatre, and more. It is capable to accommodate events of all types, sizes, and complexities with state-of-the-art technology.</p>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaWhatsapp /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaEnvelope /></a>
            </div>
          </div>
          <div className="col-md-3">
            <h5>Site Map</h5>
            <ul className="list-unstyled">
              <li><a href="/bookstore">Book Store</a></li>
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
              <li><a href="tel:+94777389172"><FaPhone /> +94777389172</a></li>
              <li><a href="tel:+94777371672"><FaPhone /> +94777371672</a></li>
              <li><a href="https://maps.google.com?q=No.192, Maladola Wattha, Kadawatha."><FaMapMarkerAlt /> No.192, Maladola Wattha, Kadawatha.</a></li>
              <li><a href="mailto:hello@ticketsministry.com"><FaEnvelope /> hello@ticketsministry.com</a></li>
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
        `}
      </style>
    </footer>
  );
};

export default Footer;
