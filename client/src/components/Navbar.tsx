import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [user, setUser] = useState({ name: "User", role: "Admin", avatar: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        const userData = data.user || data;
        if (userData) {
          setUser({
            name: userData.name || "User",
            role: userData.role || "Admin",
            avatar: userData.avatar || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile for navbar", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="navbar-custom px-3 px-md-4 py-2">
      <div className="d-flex justify-content-between align-items-center w-100">

        {/* LEFT SIDE */}
        <div className="d-flex align-items-center gap-2">

          {/* Mobile Menu */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <i className="bi bi-list"></i>
          </button>

          <div>
            <h5 className="mb-0">Dashboard</h5>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-2 gap-md-3">

          {/* <button
            type="button"
            className="btn btn-light position-relative"
          >
            <i className="bi bi-bell"></i>

            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button> */}

          {/* User Profile Component */}
          {location.pathname === "/admin-profile" ? (
            <button
              type="button"
              className="btn d-flex align-items-center gap-2 border-0"
              style={{ boxShadow: "none" }}
              onClick={() => navigate("/dashboard")}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="rounded-circle shadow-sm object-fit-cover"
                  style={{ width: "40px", height: "40px" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: "40px", height: "40px" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-start d-none d-sm-block">
                <strong className="d-block text-dark">{user.name}</strong>
                <small className="text-muted text-capitalize">{user.role}</small>
              </div>
            </button>
          ) : (
            <div className="dropdown">
              <button
                type="button"
                className="btn d-flex align-items-center gap-2 border-0"
                style={{ boxShadow: "none" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="rounded-circle shadow-sm object-fit-cover"
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-start d-none d-sm-block">
                  <strong className="d-block text-dark">{user.name}</strong>
                  <small className="text-muted text-capitalize">{user.role}</small>
                </div>
              </button>

              <ul className={`dropdown-menu dropdown-menu-end shadow border-0 ${dropdownOpen ? 'show' : ''}`} style={{ position: 'absolute', right: 0 }}>
                <li>
                  <Link to="/admin-profile" className="dropdown-item py-2" onClick={() => setDropdownOpen(false)}>
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item py-2 text-danger"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      window.location.href = "/login";
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;