import { Link } from "react-router-dom";

const CustomerFooter = () => {
  return (
    <footer className="customer-footer">

      <div className="container">

        <div className="row g-5">

          <div className="col-lg-5">

            <div className="footer-brand">
              <div className="footer-logo">
                <i className="bi bi-bar-chart-fill" />
              </div>

              <span>BizPilot</span>
            </div>

            <p className="footer-description">
              A smarter way to discover products,
              manage orders and enjoy a better
              shopping experience.
            </p>

            <div className="footer-socials">
              <a href="#">
                <i className="bi bi-instagram" />
              </a>

              <a href="#">
                <i className="bi bi-facebook" />
              </a>

              <a href="#">
                <i className="bi bi-twitter-x" />
              </a>

              <a href="#">
                <i className="bi bi-linkedin" />
              </a>
            </div>

          </div>

          <div className="col-6 col-lg-2">

            <h6>SHOP</h6>

            <Link to="/shop">All Products</Link>
            <Link to="/shop">Categories</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>

          </div>

          <div className="col-6 col-lg-2">

            <h6>ACCOUNT</h6>

            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/orders">Orders</Link>

          </div>

          <div className="col-lg-3">

            <h6>CONTACT</h6>

            <p>
              <i className="bi bi-envelope me-2" />
              hello@bizpilot.com
            </p>

            <p>
              <i className="bi bi-headset me-2" />
              24/7 Customer Support
            </p>

          </div>

        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} BizPilot.
            All rights reserved.
          </span>

          <span>
            Made with <i className="bi bi-heart-fill" /> for
            better shopping.
          </span>
        </div>

      </div>

    </footer>
  );
};

export default CustomerFooter;