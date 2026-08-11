import { useEffect, useMemo, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "../services/orderService";
import OrderDetailsModal from "../components/OrderDetailsModal";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [showOrderDetails, setShowOrderDetails] =
    useState(false);

  // Get Orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllOrders();

        setOrders(data);
      } catch (error: any) {
        console.error("Failed to fetch orders:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Update Status
  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const updatedOrder =
        await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id
            ? {
              ...order,
              status: updatedOrder.status,
            }
            : order
        )
      );
    } catch (error: any) {
      console.error(
        "Update order status error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getAllowedStatuses = (
    currentStatus: OrderStatus
  ): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["pending", "confirmed", "cancelled"];

      case "confirmed":
        return ["confirmed", "shipped", "cancelled"];

      case "shipped":
        return ["shipped", "delivered"];

      case "delivered":
        return ["delivered"];

      case "cancelled":
        return ["cancelled"];

      default:
        return [currentStatus];
    }
  };

  // Search + Status Filter
  const filteredOrders = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        order.user.name
          .toLowerCase()
          .includes(searchText) ||
        order.user.email
          .toLowerCase()
          .includes(searchText) ||
        order.product.name
          .toLowerCase()
          .includes(searchText) ||
        order._id
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        selectedStatus === "All" ||
        order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, selectedStatus]);

  // Statistics
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  // const deliveredOrders = orders.filter(
  //   (order) => order.status === "delivered"
  // ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (total, order) =>
        total + order.totalAmount,
      0
    );

  // Loading
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#1f2428" }}
          role="status"
        />

        <p className="text-muted mt-3 mb-0">
          Loading orders...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-circle me-2" />
        {error}
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <div
          className="text-uppercase fw-semibold small text-secondary mb-1"
          style={{ letterSpacing: "1.5px" }}
        >
          Sales
        </div>

        <h2
          className="fw-bold mb-1"
          style={{ color: "#1f2428" }}
        >
          Orders
        </h2>

        <p className="text-muted mb-0">
          Manage and track customer orders.
        </p>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">

        {/* Total Orders */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">
                  Total Orders
                </p>

                <h3 className="fw-bold mb-0">
                  {totalOrders}
                </h3>
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
                <i className="bi bi-receipt fs-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">
                  Pending
                </p>

                <h3 className="fw-bold mb-0">
                  {pendingOrders}
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
                <i className="bi bi-clock-history fs-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmed */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">
                  Confirmed
                </p>

                <h3 className="fw-bold mb-0">
                  {confirmedOrders}
                </h3>
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
                <i className="bi bi-check-circle fs-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">
                  Revenue
                </p>

                <h3 className="fw-bold mb-0">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h3>
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
                <i className="bi bi-currency-rupee fs-5" />
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Search + Filter */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">

          <div className="row g-3">

            {/* Search */}
            <div className="col-12 col-md-8">
              <div className="input-group">

                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted" />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search customer, product or order ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
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

            {/* Status Filter */}
            <div className="col-12 col-md-4">

              <div
                className="position-relative"
              >
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Count */}
      <div className="mb-3">
        <span className="text-muted small">
          Showing {filteredOrders.length} of{" "}
          {orders.length} orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            {/* IMPORTANT:
                            Background directly on TH
                            because Bootstrap .table-light can override THEAD
                        */}
            <thead>
              <tr>

                <th
                  className="px-4 py-3"
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Order
                </th>

                <th
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Customer
                </th>

                <th
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Product
                </th>

                <th
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Qty
                </th>

                <th
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Total
                </th>

                <th
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    backgroundColor: "#495057",
                    color: "#fff",
                    borderColor: "#5c636a",
                  }}
                >
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-5"
                  >
                    <i className="bi bi-receipt fs-2 text-muted" />

                    <p className="text-muted mt-2 mb-0">
                      No orders found.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id}>

                    {/* Order */}
                    <td className="px-4">
                      <div className="fw-semibold">
                        #{order._id.slice(-6).toUpperCase()}
                      </div>

                      <small className="text-muted">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN")}
                      </small>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="fw-semibold">
                        {order.user.name}
                      </div>

                      <small className="text-muted">
                        {order.user.email}
                      </small>
                    </td>

                    {/* Product */}
                    <td>
                      {order.product.name}
                    </td>

                    {/* Quantity */}
                    <td>
                      {order.quantity}
                    </td>

                    {/* Total */}
                    <td className="fw-semibold">
                      ₹
                      {order.totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`badge ${order.status === "pending"
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

                    {/* Action */}
                    <td>
                      <div className="d-flex gap-2 align-items-center">

                        {/* Status Dropdown */}
                        <div
                          className="position-relative"
                          style={{ minWidth: "145px" }}
                        >
                          <select
                            className="form-select form-select-sm"
                            value={order.status}
                            disabled={
                              updatingOrderId === order._id
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value as OrderStatus
                              )
                            }
                            style={{
                              backgroundColor: "#343a40",
                              color: "#fff",
                              borderColor: "#495057",
                              paddingRight: "34px",
                              appearance: "auto",
                              WebkitAppearance: "menulist",
                            }}
                          >
                            {getAllowedStatuses(order.status).map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* View */}
                        <button
                          type="button"
                          className="btn btn-sm btn-dark"
                          title="View Order"
                          onClick={() =>
                            handleViewOrder(order)
                          }
                        >
                          <i className="bi bi-eye" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Order Details */}
      <OrderDetailsModal
        show={showOrderDetails}
        order={selectedOrder}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
      />

    </div>
  );
};

export default Orders;
