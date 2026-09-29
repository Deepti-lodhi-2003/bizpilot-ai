import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../services/authService";

const CustomerProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    password: "", // Only for sending updates
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const userData = data.user || data;
        setUser({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          avatar: userData.avatar || "",
          password: "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const { updateProfile } = await import("../services/authService");
      
      const payload: any = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
      };
      if (user.password) {
        payload.password = user.password;
      }
      
      await updateProfile(payload);
      alert("Profile updated successfully!");
      setIsEditing(false);
      setUser(prev => ({...prev, password: ""})); 
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">My Profile</h2>
      </div>

      {loading && <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
      <div className="row g-4">
        {/* Left Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-dark text-white">
            <div className="card-body p-4 text-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="rounded-circle mx-auto mb-3 shadow object-fit-cover border border-secondary"
                  style={{ width: "100px", height: "100px" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                  style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h4 className="fw-bold mb-1 text-white">{user.name}</h4>
              <p className="text-white-50 mb-4">Customer</p>

              <div className="list-group list-group-flush text-start">
                <Link to="/customer-profile" className="list-group-item list-group-item-action bg-dark text-white d-flex align-items-center py-3 border-0 rounded-3 mb-1" style={{ background: '#30363b' }}>
                  <i className="bi bi-person me-3 fs-5"></i>
                  <span className="fw-medium">Account Info</span>
                </Link>
                <Link to="/myorders" className="list-group-item list-group-item-action bg-dark text-white-50 d-flex align-items-center py-3 border-0 rounded-3 mb-1">
                  <i className="bi bi-box-seam me-3 fs-5 text-white-50"></i>
                  <span className="fw-medium text-white-50">My Orders</span>
                </Link>
                <button 
                  className="list-group-item list-group-item-action bg-dark text-danger d-flex align-items-center py-3 border-0 rounded-3"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                  }}
                >
                  <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                  <span className="fw-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center flex-nowrap gap-2">
              <h5 className="mb-0 fw-bold text-truncate" style={{ minWidth: 0 }}>Account Information</h5>
              <button
                className={`btn btn-sm ${isEditing ? 'btn-danger' : 'btn-dark'} rounded-pill px-4 py-2 text-nowrap flex-shrink-0`}
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil'} me-1 d-none d-sm-inline-block`}></i>
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium small text-uppercase">Full Name</label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${!isEditing ? 'bg-light border-0' : ''}`}
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium small text-uppercase">Email Address</label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${!isEditing ? 'bg-light border-0' : ''}`}
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium small text-uppercase">Phone Number</label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${!isEditing ? 'bg-light border-0' : ''}`}
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium small text-uppercase">Profile Image URL</label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${!isEditing ? 'bg-light border-0' : ''}`}
                      name="avatar"
                      placeholder="https://..."
                      value={user.avatar}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted fw-medium small text-uppercase">New Password</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${!isEditing ? 'bg-light border-0' : ''}`}
                      name="password"
                      placeholder="Leave blank to keep current"
                      value={user.password}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted fw-medium small text-uppercase">Shipping Address</label>
                    <textarea
                      className={`form-control form-control-lg ${!isEditing ? 'bg-light border-0' : ''}`}
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="col-12 mt-4 pt-2 border-top">
                      <button type="submit" className="btn btn-dark btn-lg rounded-pill px-5" disabled={updateLoading}>
                        {updateLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default CustomerProfile;
