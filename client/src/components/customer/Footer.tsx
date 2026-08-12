import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#080a0c",
        color: "#fff",
        borderTop: "1px solid #202428",
      }}
    >
      <div className="container py-5">

        <div className="row g-5">

          {/* Brand */}
          <div className="col-lg-4">
            <NavLink
              to="/"
              className="text-decoration-none text-white"
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: "#252a2f",
                  }}
                >
                  <i className="bi bi-bar-chart-fill" />
                </div>

                <span className="fs-5 fw-bold">
                  BizPilot
                </span>
              </div>
            </NavLink>

            <p
              className="small"
              style={{
                color: "#777e84",
                maxWidth: "340px",
                lineHeight: "1.7",
              }}
            >
              A simple and modern shopping experience
              designed to help you discover quality products
              with ease.
            </p>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-outline-light btn-sm rounded-circle">
                <i className="bi bi-instagram" />
              </button>

              <button className="btn btn-outline-light btn-sm rounded-circle">
                <i className="bi bi-facebook" />
              </button>

              <button className="btn btn-outline-light btn-sm rounded-circle">
                <i className="bi bi-twitter-x" />
              </button>

              <button className="btn btn-outline-light btn-sm rounded-circle">
                <i className="bi bi-linkedin" />
              </button>
            </div>
          </div>

          {/* Shop */}
          <div className="col-6 col-lg-2">
            <h6 className="fw-bold mb-3">
              Shop
            </h6>

            <ul className="list-unstyled small">
              <li className="mb-2">
                <NavLink
                  to="/shop"
                  className="text-decoration-none text-secondary"
                >
                  All Products
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/shop"
                  className="text-decoration-none text-secondary"
                >
                  Categories
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/cart"
                  className="text-decoration-none text-secondary"
                >
                  Cart
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-lg-2">
            <h6 className="fw-bold mb-3">
              Account
            </h6>

            <ul className="list-unstyled small">
              <li className="mb-2">
                <NavLink
                  to="/profile"
                  className="text-decoration-none text-secondary"
                >
                  Profile
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/orders"
                  className="text-decoration-none text-secondary"
                >
                  My Orders
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/cart"
                  className="text-decoration-none text-secondary"
                >
                  My Cart
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <h6 className="fw-bold mb-3">
              Get in touch
            </h6>

            <p className="small text-secondary mb-2">
              <i className="bi bi-envelope me-2" />
              support@bizpilot.com
            </p>

            <p className="small text-secondary mb-2">
              <i className="bi bi-telephone me-2" />
              +91 98765 43210
            </p>

            <p className="small text-secondary">
              <i className="bi bi-geo-alt me-2" />
              India
            </p>
          </div>

        </div>

        <hr
          className="my-4"
          style={{ borderColor: "#252a2f" }}
        />

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
          <small className="text-secondary">
            © {new Date().getFullYear()} BizPilot. All rights reserved.
          </small>

          <small className="text-secondary">
            Built with care.
          </small>
        </div>

      </div>
    </footer>
  );
};

export default Footer;