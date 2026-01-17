import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-camera-retro fa-2x text-purple me-2"></i>
              <h5 className="fw-bold mb-0 text-gradient">DardderdOR Gallery</h5>
            </div>
            <p className="text-light mb-3 opacity-75">
              Temukan keindahan dalam setiap momen. Platform galeri foto terbaik untuk berbagi 
              dan mengeksplorasi karya visual yang menginspirasi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold text-purple mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-home me-2"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-images me-2"></i>Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-info-circle me-2"></i>About
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-envelope me-2"></i>Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold text-purple mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/gallery?category=nature" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-tree me-2"></i>Parfume Fresh
                </a>
              </li>
              <li className="mb-2">
                <a href="/gallery?category=portrait" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-user me-2"></i>Parfum Sweet
                </a>
              </li>
              <li className="mb-2">
                <a href="/gallery?category=urban" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-city me-2"></i>Parfum Timur Tengah
                </a>
              </li>
              <li className="mb-2">
                <a href="/gallery?category=art" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-palette me-2"></i>Versatile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="fw-bold text-purple mb-3">Contact Info</h6>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-map-marker-alt text-purple me-3"></i>
                <span className="text-light opacity-75">DardderdOR Gallery Parfume</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-phone text-purple me-3"></i>
                <span className="text-light opacity-75">+62 895-3266-79840</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-envelope text-purple me-3"></i>
                <span className="text-light opacity-75">info@dardderdor.com</span>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-light opacity-75">
              &copy; {currentYear} <span className="text-gradient fw-bold">DardderdOR Gallery</span>. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="footer-links">
              <a href="/privacy" className="text-light text-decoration-none me-3 footer-link">
                Privacy Policy
              </a>
              <a href="/terms" className="text-light text-decoration-none me-3 footer-link">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-light text-decoration-none footer-link">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;