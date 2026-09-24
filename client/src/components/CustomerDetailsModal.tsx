import { useEffect, useState } from "react";
import {
  getCustomerById,
  type CustomerDetail,
} from "../services/customerService";
import type { Order } from "../services/orderService";

interface CustomerDetailsModalProps {
  show: boolean;
  customerId: string | null;
  onClose: () => void;
}

const CustomerDetailsModal = ({
  show,
  customerId,
  onClose,
}: CustomerDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show || !customerId) {
      setCustomer(null);
      setOrders([]);
      setError("");
      return;
    }

    const loadCustomerData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getCustomerById(customerId);
        setCustomer(data.customer);
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("Failed to load customer details:", err);
        setError(
          err?.response?.data?.message || "Failed to load customer details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [show, customerId]);

  if (!show) return null;

  const getInitials = (name?: string) => {
    if (!name) return "C";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          opacity: 1,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 1050,
        }}
      />

      {/* Modal Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              className="modal-header px-4 py-3"
              style={{
                backgroundColor: "#1f2428",
                color: "#fff",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#495057",
                    fontSize: "1.1rem",
                    letterSpacing: "1px",
                  }}
                >
                  {getInitials(customer?.name)}
                </div>
                <div>
                  <h5 className="modal-title fw-bold mb-0 text-white">
                    {customer?.name || "Customer Details"}
                  </h5>
                  <small className="text-white-50">
                    Member since{" "}
                    {customer?.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            {/* Modal Body */}
            <div
              className="modal-body px-4 py-3"
              style={{
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
              }}
            >
              {loading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border"
                    style={{ color: "#1f2428" }}
                    role="status"
                  />
                  <p className="text-muted mt-3 mb-0">
                    Loading customer profile...
                  </p>
                </div>
              ) : error ? (
                <div className="alert alert-danger mb-0">
                  <i className="bi bi-exclamation-triangle me-2" />
                  {error}
                </div>
              ) : customer ? (
                <div className="d-flex flex-column gap-3">
                  {/* METRICS ROW */}
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                        <small className="text-muted fw-semibold">
                          Total Orders
                        </small>
                        <h4 className="fw-bold mb-0 mt-1" style={{ color: "#1f2428" }}>
                          {customer.metrics.totalOrders}
                        </h4>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                        <small className="text-muted fw-semibold">
                          Total Spent
                        </small>
                        <h4 className="fw-bold mb-0 mt-1 text-success">
                          ₹{customer.metrics.totalSpent.toLocaleString("en-IN")}
                        </h4>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                        <small className="text-muted fw-semibold">
                          Avg Order Value
                        </small>
                        <h4 className="fw-bold mb-0 mt-1" style={{ color: "#1f2428" }}>
                          ₹{customer.metrics.avgOrderValue.toLocaleString("en-IN")}
                        </h4>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                        <small className="text-muted fw-semibold">
                          Delivered Orders
                        </small>
                        <h4 className="fw-bold mb-0 mt-1 text-primary">
                          {customer.metrics.deliveredOrders}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* CONTACT & SHIPPING INFO */}
                  <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                    <h6 className="fw-bold mb-3" style={{ color: "#1f2428" }}>
                      <i className="bi bi-person-lines-fill me-2" />
                      Contact & Address Information
                    </h6>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="bi bi-envelope text-muted" />
                          <span className="fw-semibold">Email:</span>
                          <span className="text-muted">{customer.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-telephone text-muted" />
                          <span className="fw-semibold">Phone:</span>
                          <span className="text-muted">{customer.phone || "-"}</span>
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-geo-alt text-muted mt-1" />
                          <div>
                            <span className="fw-semibold d-block">
                              Shipping Address:
                            </span>
                            {customer.address ? (
                              <small className="text-muted">
                                {customer.address.fullName && (
                                  <>
                                    {customer.address.fullName}
                                    <br />
                                  </>
                                )}
                                {customer.address.addressLine},{" "}
                                {customer.address.city}, {customer.address.state} -{" "}
                                {customer.address.pincode}
                              </small>
                            ) : (
                              <small className="text-muted">
                                No address on file
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ORDER HISTORY */}
                  <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                    <div className="card-header bg-white border-0 pt-3 pb-2 px-3 d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-0" style={{ color: "#1f2428" }}>
                        <i className="bi bi-clock-history me-2" />
                        Order History ({orders.length})
                      </h6>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-bag-x fs-2 text-muted" />
                        <p className="text-muted mt-2 mb-0 small">
                          This customer hasn't placed any orders yet.
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="px-3 py-2 small">Order ID</th>
                              <th className="py-2 small">Date</th>
                              <th className="py-2 small">Items</th>
                              <th className="py-2 small">Total</th>
                              <th className="py-2 small">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td className="px-3">
                                  <span className="fw-semibold">
                                    #{order._id.slice(-6).toUpperCase()}
                                  </span>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {new Date(order.createdAt).toLocaleDateString(
                                      "en-IN"
                                    )}
                                  </small>
                                </td>
                                <td>
                                  <div className="d-flex flex-column gap-1">
                                    {order.items?.map((item, idx) => (
                                      <div
                                        key={item.product?._id || idx}
                                        className="d-flex align-items-center gap-2"
                                      >
                                        <img
                                          src={
                                            item.product?.image ||
                                            "/placeholder-product.png"
                                          }
                                          alt={item.product?.name || "Product"}
                                          width={30}
                                          height={30}
                                          className="rounded border"
                                          style={{ objectFit: "cover" }}
                                        />
                                        <small className="fw-medium text-truncate" style={{ maxWidth: "160px" }}>
                                          {item.product?.name || "Product"}
                                        </small>
                                        <small className="text-muted">
                                          x{item.quantity}
                                        </small>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="fw-semibold">
                                  ₹{Number(order.totalAmount || 0).toLocaleString(
                                    "en-IN"
                                  )}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      order.status === "pending"
                                        ? "text-bg-warning"
                                        : order.status === "confirmed"
                                        ? "text-bg-info"
                                        : order.status === "shipped"
                                        ? "text-bg-primary"
                                        : order.status === "delivered"
                                        ? "text-bg-success"
                                        : "text-bg-danger"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer px-4 py-2 bg-white border-top">
              <button
                type="button"
                className="btn btn-secondary px-4 btn-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailsModal;
