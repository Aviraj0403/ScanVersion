import React from "react";
import "./Footer.css"; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div
        className="footer-top"
        style={{
          backgroundImage: "url('/assets/images/footer/footer-illustration.png')",
        }}
      >
        <div className="container">
          <div className="footer-brand">
            <a href="#" className="logo">
              Br Tech<span className="span">.</span>
            </a>
            <p className="footer-text">
              Financial experts support or help you to find out which way you
              can raise your funds more.
            </p>
            <ul className="social-list">
              <li>
                <a href="#" className="social-link" aria-label="Facebook">
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
              </li>
              <li>
                <a href="#" className="social-link" aria-label="Twitter">
                  <ion-icon name="logo-twitter"></ion-icon>
                </a>
              </li>
              <li>
                <a href="#" className="social-link" aria-label="Instagram">
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
              </li>
              <li>
                <a href="#" className="social-link" aria-label="Pinterest">
                  <ion-icon name="logo-pinterest"></ion-icon>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-info">
            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Contact Info</p>
              </li>
              <li>
                <p className="footer-list-item">+91 6200594193</p>
              </li>
              <li>
                <p className="footer-list-item">aviraj@gmail.com.com</p>
              </li>
              <li>
                <address className="footer-list-item">
                       Dwarka , Delhi
                </address>
              </li>
            </ul>

            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Opening Hours</p>
              </li>
              <li>
                <p className="footer-list-item">Monday-Friday: 08:00-22:00</p>
              </li>
              <li>
                <p className="footer-list-item">Tuesday 4PM: Till Midnight</p>
              </li>
              <li>
                <p className="footer-list-item">Saturday: 10:00-16:00</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright-text">
            &copy; 2024 <a href="#" className="copyright-link">Br Tech</a> All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
