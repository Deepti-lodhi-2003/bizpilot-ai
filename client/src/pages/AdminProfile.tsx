import { useState, useEffect } from "react";

import { getProfile } from "../services/authService";

const AdminProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    address: "",
    avatar: "",
    password: "", // Only for sending updates
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const userData = data.user || data;
        setUser({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "",
          phone: userData.phone || "",
          address: userData.address || "",
          avatar: userData.avatar || "",
          password: "",
          createdAt: userData.createdAt || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      // We import updateProfile from authService
      // wait, I need to make sure I import it at the top
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
      setUser(prev => ({ ...prev, password: "" })); // clear password
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="container-fluid animate__animated animate__fadeIn">
      {/* <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Admin Profile</h2>
      </div> */}

      {loading && <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row">
          {/* Left Column: Profile Card */}
          <div className="col-12 col-xl-4 mb-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <div className="card-body p-4 text-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="rounded-circle mx-auto mb-3 shadow object-fit-cover"
                    style={{ width: "120px", height: "120px" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                    style={{ width: "120px", height: "120px", fontSize: "2.5rem" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h4 className="fw-bold mb-1">{user.name}</h4>
                <p className="text-muted mb-3 text-capitalize">{user.role}</p>

                <div className="d-flex justify-content-center gap-2 mb-4">
                  <span className="badge bg-dark text-light px-3 py-2 rounded-pill">
                    Active
                  </span>
                  <span className="badge bg-dark-subtle text-dark px-3 py-2 rounded-pill">
                    Verified
                  </span>
                </div>

                {/* <button 
                className="btn btn-danger w-100 rounded-pill mb-3"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/login";
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button> */}

                <hr className="my-4" />

                <div className="text-start">
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Email Address</small>
                    <p className="mb-0 fw-medium d-flex align-items-center">
                      <i className="bi bi-envelope text-dark me-2"></i>
                      {user.email}
                    </p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Phone Number</small>
                    <p className="mb-0 fw-medium d-flex align-items-center">
                      <i className="bi bi-telephone text-dark me-2"></i>
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-1">Location / Address</small>
                    <p className="mb-0 fw-medium d-flex align-items-center">
                      <i className="bi bi-geo-alt text-dark me-2"></i>
                      {user.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="col-12 col-xl-8 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center flex-nowrap gap-2">
              <h5 className="mb-0 fw-bold text-truncate" style={{ minWidth: 0 }}>Personal Information</h5>
              <button
                className={`btn btn-sm ${isEditing ? 'btn-danger' : 'btn-dark'} rounded-pill px-3 text-nowrap flex-shrink-0`}
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className={`bi ${isEditing ? 'bi-x-circle' : 'bi-pencil'} me-1 d-none d-sm-inline-block`}></i>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Full Name</label>
                      <input
                        type="text"
                        className="form-control form-control-md bg-light"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-md bg-light"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Phone Number</label>
                      <input
                        type="text"
                        className="form-control form-control-md bg-light"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Address</label>
                      <input
                        type="text"
                        className="form-control form-control-md bg-light"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Profile Image URL</label>
                      <input
                        type="text"
                        className="form-control form-control-md bg-light"
                        name="avatar"
                        placeholder="https://..."
                        value={user.avatar}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">New Password</label>
                      <input
                        type="password"
                        className="form-control form-control-md bg-light"
                        name="password"
                        placeholder="Leave blank to keep current"
                        value={user.password}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label fw-medium">Role</label>
                      <input
                        type="text"
                        className="form-control form-control-md bg-light text-capitalize"
                        name="role"
                        value={user.role}
                        disabled
                      />
                      <small className="text-muted mt-1 d-block">Role cannot be changed.</small>
                    </div>

                    {isEditing && (
                      <div className="col-12 mt-4 text-end">
                        <button type="submit" className="btn btn-dark btn-lg rounded-pill px-4" disabled={updateLoading}>
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

export default AdminProfile;
