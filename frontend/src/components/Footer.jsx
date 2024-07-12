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
          <p>&copy; 2024 Happy Store | All Rights Reserved | Digitally crafted by Inofinity Labs</p>
        </div>
      </div>
      <style>
        {`
          .footer {
            background-color: #000;
            color: #fff;
            padding: 40px 0;
          }
          .footer .logo img {
            max-width: 150px;
          }
          .footer h5 {
            color: #FFDE59;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .footer a {
            color: #fff;
            text-decoration: none;
          }
          .footer a:hover {
            color: #FFDE59;
          }
          .footer .social-icons a {
            color: #fff;
            margin-right: 10px;
          }
          .footer .social-icons a:hover {
            color: #FFDE59;
          }
          .footer .footer-bottom {
            border-top: 1px solid #333;
            padding-top: 10px;
            margin-top: 30px;
            text-align: center;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
