import { useEffect, useMemo, useState } from "react";
import {
  getAllCustomers,
  getCustomerStats,
  type Customer,
  type CustomerStats,
} from "../services/customerService";
import CustomerDetailsModal from "../components/CustomerDetailsModal";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("spent"); // 'spent' | 'orders' | 'newest' | 'name'

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ======================================
  // LOAD DATA
  // ======================================
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [customersData, statsData] = await Promise.all([
        getAllCustomers(),
        getCustomerStats(),
      ]);

      setCustomers(Array.isArray(customersData) ? customersData : []);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err: any) {
      console.error("Failed to fetch customers data:", err);
      setError(
        err?.response?.data?.message || "Failed to load customers data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ======================================
  // FILTER & SORT
  // ======================================
  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const result = customers.filter((customer) => {
      const name = customer.name?.toLowerCase() || "";
      const email = customer.email?.toLowerCase() || "";
      const phone = customer.phone?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText);

      const matchesStatus =
        selectedStatus === "All" ||
        customer.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "spent") {
        return b.totalSpent - a.totalSpent;
      }
      if (sortBy === "orders") {
        return b.totalOrders - a.totalOrders;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [customers, search, selectedStatus, sortBy]);

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowModal(true);
  };

  const getInitials = (name?: string) => {
    if (!name) return "C";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#1f2428" }}
          role="status"
        />
        <p className="text-muted mt-3 mb-0">Loading customers...</p>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================
  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-circle me-2" />
        {error}
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================
  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <div
          className="text-uppercase fw-semibold small text-secondary mb-1"
          style={{ letterSpacing: "1.5px" }}
        >
          CRM
        </div>
        <h2 className="fw-bold mb-1" style={{ color: "#1f2428" }}>
          Customers
        </h2>
        <p className="text-muted mb-0">
          Manage customer relationships, track order histories and lifetime spending.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="row g-4 mb-4">
        {/* TOTAL CUSTOMERS */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Total Customers</p>
                <h3 className="fw-bold mb-0">{stats.totalCustomers}</h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "46px",
                  height: "46px",
                  backgroundColor: "#343a40",
                  color: "#fff",
                }}
              >
                <i className="bi bi-people fs-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE CUSTOMERS */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Active Customers</p>
                <h3 className="fw-bold mb-0">{stats.activeCustomers}</h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "46px",
                  height: "46px",
                  backgroundColor: "#198754",
                  color: "#fff",
                }}
              >
                <i className="bi bi-person-check fs-5" />
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Total Orders</p>
                <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "46px",
                  height: "46px",
                  backgroundColor: "#304b57",
                  color: "#8ed8f0",
                }}
              >
                <i className="bi bi-bag-check fs-5" />
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL REVENUE */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Total Spending</p>
                <h3 className="fw-bold mb-0 text-success">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "46px",
                  height: "46px",
                  backgroundColor: "#5a4a22",
                  color: "#ffc107",
                }}
              >
                <i className="bi bi-currency-rupee fs-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER + SORT BAR */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            {/* SEARCH */}
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by customer name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* STATUS FILTER */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* SORT BY */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="spent">Sort: Highest Spending</option>
                <option value="orders">Sort: Most Orders</option>
                <option value="newest">Sort: Newest First</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <span className="text-muted small">
          Showing {filteredCustomers.length} of {customers.length} customers
        </span>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                {["Customer", "Contact & City", "Orders", "Total Spent", "Status", "Joined", "Action"].map(
                  (heading, index) => (
                    <th
                      key={heading}
                      className={index === 0 ? "px-4 py-3" : "py-3"}
                      style={{
                        backgroundColor: "#495057",
                        color: "#fff",
                        borderColor: "#5c636a",
                      }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <i className="bi bi-people fs-2 text-muted" />
                    <p className="text-muted mt-2 mb-0">No customers found.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    {/* CUSTOMER NAME + AVATAR */}
                    <td className="px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm flex-shrink-0"
                          style={{
                            width: "38px",
                            height: "38px",
                            backgroundColor: "#495057",
                            fontSize: "0.85rem",
                          }}
                        >
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">
                            {customer.name}
                          </div>
                          <small className="text-muted">{customer.email}</small>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT & CITY */}
                    <td>
                      <div>
                        <span className="text-dark small d-block">
                          {customer.phone !== "-" ? customer.phone : "No Phone"}
                        </span>
                        <small className="text-muted">
                          {customer.city !== "-" ? `${customer.city}, ${customer.state}` : "-"}
                        </small>
                      </div>
                    </td>

                    {/* ORDERS */}
                    <td>
                      <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                        {customer.totalOrders} {customer.totalOrders === 1 ? "Order" : "Orders"}
                      </span>
                    </td>

                    {/* TOTAL SPENT */}
                    <td className="fw-semibold text-success">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`badge ${
                          customer.status === "active"
                            ? "text-bg-success"
                            : "text-bg-secondary"
                        }`}
                      >
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* JOINED */}
                    <td>
                      <small className="text-muted">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </small>
                    </td>

                    {/* ACTION */}
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-dark d-flex align-items-center gap-1"
                        title="View Customer Details"
                        onClick={() => handleViewCustomer(customer._id)}
                      >
                        <i className="bi bi-eye" />
                        <span className="d-none d-lg-inline">Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAILS MODAL */}
      <CustomerDetailsModal
        show={showModal}
        customerId={selectedCustomerId}
        onClose={() => {
          setShowModal(false);
          setSelectedCustomerId(null);
        }}
      />
    </div>
  );
};

export default Customers;