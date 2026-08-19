import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import CustomerFooter from "../components/customer/CustomerFooter";
import { getCart } from "../services/cartService";

const CustomerLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // =========================
  // LOAD CART COUNT
  // =========================
  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      // Login nahi hai
      if (!token) {
        setCartCount(0);
        return;
      }

      const cart = await getCart();

      // Total quantity calculate
      const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to load cart count:", error);
      setCartCount(0);
    }
  };

  // =========================
  // SCROLL + INITIAL CART
  // =========================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // Page load par cart count
    loadCartCount();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // LISTEN FOR CART CHANGES
  // =========================
  useEffect(() => {
    const handleCartUpdated = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  return (
    <div className="customer-layout">
      {/* ==============================
          NAVBAR
      ============================== */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top custom-navbar ${
          scrolled ? "is-scrolled" : ""
        }`}
      >
        <div className="container">
          {/* Brand */}
          <NavLink
            to="/"
            className="navbar-brand d-flex align-items-center fw-bold"
          >
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
              {/* =========================
                  CART
              ========================= */}
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `navbar-cart position-relative ${
                    isActive ? "navbar-cart-active" : ""
                  }`
                }
              >
                <i className="bi bi-bag"></i>

                <span>Cart</span>

                {/* Cart Count */}
                {cartCount > 0 && (
                  <span className="cart-count-badge">
                    {cartCount}
                  </span>
                )}
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
             NAVBAR
          ============================== */

          .custom-navbar {
            background: transparent;
            box-shadow: none;
            padding-top: 16px;
            padding-bottom: 16px;
            transition:
              background-color 0.35s ease,
              box-shadow 0.35s ease,
              padding 0.35s ease;
          }

          .custom-navbar.is-scrolled {
            background: rgba(31, 36, 40, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
            padding-top: 10px;
            padding-bottom: 10px;
          }

          /* ==============================
             BRAND
          ============================== */

          .brand-icon {
            width: 38px;
            height: 38px;
            background-color: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition:
              transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              background-color 0.25s ease;
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
            transition:
              background-color 0.25s ease,
              color 0.25s ease;
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
            transition:
              transform 0.2s ease,
              background-color 0.25s ease,
              box-shadow 0.25s ease;
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

          /* ==============================
             CART COUNT BADGE
          ============================== */

          .cart-count-badge {
            min-width: 21px;
            height: 21px;
            padding: 0 6px;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            background-color: #fff;
            color: #1f2428;

            border-radius: 999px;

            font-size: 0.7rem;
            font-weight: 700;
            line-height: 1;

            margin-left: 2px;

            animation: cartBadgePop 0.25s ease;
          }

          @keyframes cartBadgePop {
            0% {
              transform: scale(0.7);
              opacity: 0;
            }

            70% {
              transform: scale(1.12);
              opacity: 1;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* ==============================
             LOGIN
          ============================== */

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

          /* ==============================
             MOBILE
          ============================== */

          @media (max-width: 991px) {
            .custom-navbar:not(.is-scrolled) .navbar-collapse {
              background: rgba(31, 36, 40, 0.92);
              backdrop-filter: blur(10px);
              border-radius: 12px;
              padding: 12px;
              margin-top: 10px;
            }

            .navbar-cart,
            .navbar-login {
              justify-content: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerLayout;