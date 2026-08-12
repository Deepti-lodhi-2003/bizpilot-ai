import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import CustomerFooter from "../components/customer/CustomerFooter";

const CustomerLayout = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="customer-layout">
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top custom-navbar ${
          scrolled ? "is-scrolled" : ""
        }`}
      >
        <div className="container">
          {/* Brand */}
          <NavLink to="/" className="navbar-brand d-flex align-items-center fw-bold">
            <div className="brand-icon d-flex align-items-center justify-content-center rounded-3 me-2">
              <i className="bi bi-bar-chart-fill text-white"></i>
            </div>
            <span>BizPilot</span>
          </NavLink>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler custom-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#customerNavbar"
            aria-controls="customerNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="customerNavbar">
            {/* Navigation */}
            <ul className="navbar-nav mx-auto gap-lg-1 mt-3 mt-lg-0">
              {/* Home */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `nav-link nav-link-custom px-3 py-2 rounded-pill ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <i className="bi bi-house me-2"></i>
                  Home
                </NavLink>
              </li>

              {/* Shop */}
              <li className="nav-item">
                <NavLink
                  to="/shop"
                  className={({ isActive }) =>
                    `nav-link nav-link-custom px-3 py-2 rounded-pill ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <i className="bi bi-shop me-2"></i>
                  Shop
                </NavLink>
              </li>

              {/* My Orders */}
              <li className="nav-item">
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `nav-link nav-link-custom px-3 py-2 rounded-pill ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <i className="bi bi-box-seam me-2"></i>
                  My Orders
                </NavLink>
              </li>
            </ul>

            {/* Right Side */}
            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              {/* Cart */}
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `navbar-cart ${isActive ? "navbar-cart-active" : ""}`
                }
              >
                <i className="bi bi-bag"></i>
                <span>Cart</span>
              </NavLink>

              {/* Login */}
              <NavLink to="/login" className="navbar-login">
                <i className="bi bi-person me-2"></i>
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <CustomerFooter />

      <style>
        {`
          /* ==============================
             NAVBAR — transparent to solid
          ============================== */

          .custom-navbar {
            background: transparent;
            box-shadow: none;
            padding-top: 16px;
            padding-bottom: 16px;
            transition: background-color 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease;
          }

          .custom-navbar.is-scrolled {
            background: rgba(31, 36, 40, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
            padding-top: 10px;
            padding-bottom: 10px;
          }

          @keyframes navDropIn {
            from { opacity: 0; transform: translateY(-16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* ==============================
             BRAND
          ============================== */

          .brand-icon {
            width: 38px;
            height: 38px;
            background-color: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease;
          }

          .navbar-brand:hover .brand-icon {
            transform: rotate(-8deg) scale(1.08);
            background-color: rgba(255, 255, 255, 0.24);
          }

          /* ==============================
             NAV LINKS
          ============================== */

          .nav-link-custom {
            position: relative;
            color: rgba(255, 255, 255, 0.85) !important;
            transition: background-color 0.25s ease, color 0.25s ease;
          }

          .nav-link-custom:hover {
            background-color: rgba(255, 255, 255, 0.12);
            color: #fff !important;
          }

          .nav-link-custom.active {
            background-color: #fff;
            color: #1f2428 !important;
            font-weight: 600;
          }

          /* ==============================
             CART / LOGIN
          ============================== */

          .navbar-cart,
          .navbar-login {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 9px 18px;
            border-radius: 999px;
            font-size: 0.9rem;
            text-decoration: none;
            transition: transform 0.2s ease, background-color 0.25s ease, box-shadow 0.25s ease;
          }

          .navbar-cart {
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.28);
            background-color: rgba(255, 255, 255, 0.06);
          }

          .navbar-cart:hover {
            background-color: rgba(255, 255, 255, 0.16);
            transform: translateY(-2px);
          }

          .navbar-cart-active {
            background-color: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
          }

          .navbar-login {
            color: #1f2428;
            background-color: #fff;
            font-weight: 600;
          }

          .navbar-login:hover {
            background-color: #f1f1f1;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.45);
          }

          /* ==============================
             MOBILE TOGGLER
          ============================== */

          .custom-toggler {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 7px 10px;
            transition: background-color 0.25s ease;
          }

          .custom-toggler:hover {
            background-color: rgba(255, 255, 255, 0.18);
          }

          .custom-toggler:focus {
            box-shadow: none;
          }

          @media (max-width: 991px) {
            .custom-navbar:not(.is-scrolled) .navbar-collapse {
              background: rgba(31, 36, 40, 0.92);
              backdrop-filter: blur(10px);
              border-radius: 12px;
              padding: 12px;
              margin-top: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerLayout;