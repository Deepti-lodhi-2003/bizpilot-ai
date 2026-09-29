import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user || data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Header / Banner */}
            <div className="bg-primary bg-gradient p-5 text-center position-relative">
              <div className="position-absolute top-0 end-0 p-3">
                <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-success'} rounded-pill fs-6`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div 
                className="d-inline-flex justify-content-center align-items-center rounded-circle bg-white shadow-sm mb-3" 
                style={{ width: "100px", height: "100px", fontSize: "2.5rem", color: "var(--bs-primary)" }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-white mb-0 fw-bold">{user?.name}</h2>
              <p className="text-white-50 mb-0">{user?.email}</p>
            </div>
            
            {/* Body */}
            <div className="card-body p-4 p-md-5">
              <h4 className="mb-4 text-secondary">Profile Details</h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <label className="text-muted small mb-1 fw-bold">Full Name</label>
                    <p className="mb-0 fs-5">{user?.name}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <label className="text-muted small mb-1 fw-bold">Email Address</label>
                    <p className="mb-0 fs-5">{user?.email}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <label className="text-muted small mb-1 fw-bold">Role</label>
                    <p className="mb-0 fs-5 text-capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <label className="text-muted small mb-1 fw-bold">Account Created</label>
                    <p className="mb-0 fs-5">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 text-center">
                <button className="btn btn-outline-primary px-4 py-2 rounded-pill me-3" onClick={() => {}}>
                  <i className="bi bi-pencil-square me-2"></i>Edit Profile
                </button>
                <button className="btn btn-outline-danger px-4 py-2 rounded-pill" onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/login";
                }}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
