interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
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

            {/* <small className="text-muted d-none d-sm-block">
              Welcome back to BizPilot AI
            </small> */}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-2 gap-md-3">

          {/* Notification */}
          <button
            type="button"
            className="btn btn-light position-relative"
          >
            <i className="bi bi-bell"></i>

            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button>

          {/* User */}
          <div className="dropdown">

            <button
              type="button"
              className="btn d-flex align-items-center gap-2 border-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                D
              </div>

              <div className="text-start d-none d-sm-block">
                <strong className="d-block">Deepti</strong>
                <small className="text-muted">Owner</small>
              </div>

              <i className="bi bi-chevron-down d-none d-sm-block"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </button>
              </li>

              <li>
                <button className="dropdown-item">
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </button>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button className="dropdown-item text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;