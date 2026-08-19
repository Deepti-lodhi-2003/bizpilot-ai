import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

import type { Order } from "../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // ===============================
  // LOAD ORDERS
  // ===============================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getMyOrders();

      setOrders(data);
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ===============================
  // CANCEL ORDER
  // ===============================

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(id);

      const updatedOrder =
        await cancelOrder(id);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? updatedOrder
            : order
        )
      );
    } catch (error: any) {
      console.error(
        "Cancel order error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancelling(null);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#111315",
          color: "#ffffff",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{
              color: "#ffffff",
            }}
          />

          <p
            className="mt-3"
            style={{
              color: "#9ca1a7",
            }}
          >
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="py-5"
      style={{
        minHeight: "80vh",
        backgroundColor: "#111315",
        color: "#ffffff",
        paddingTop: "120px",
      }}
    >
      <div className="container py-lg-4">

        {/* HEADER */}

        <div className="mb-5">
          <span
            className="text-uppercase small fw-semibold"
            style={{
              letterSpacing: "2px",
              color: "#a8adb3",
            }}
          >
            Account
          </span>

          <h1
            className="display-5 fw-bold mt-2 mb-2"
          >
            My Orders
          </h1>

          <p
            className="mb-0"
            style={{
              color: "#9ca1a7",
            }}
          >
            Track and manage your orders.
          </p>
        </div>

        {/* EMPTY */}

        {orders.length === 0 ? (
          <div
            className="text-center rounded-4 p-5"
            style={{
              backgroundColor: "#1b1e21",
              border: "1px solid #34383d",
            }}
          >
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#292d31",
              }}
            >
              <i className="bi bi-box-seam fs-2" />
            </div>

            <h3 className="fw-bold">
              No orders yet
            </h3>

            <p
              style={{
                color: "#9ca1a7",
              }}
            >
              Your placed orders will appear here.
            </p>

            <Link
              to="/shop"
              className="btn btn-light rounded-pill px-4"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">

            {orders.map((order) => (
              <div
                className="col-12"
                key={order._id}
              >
                <div
                  className="rounded-4 p-4"
                  style={{
                    backgroundColor: "#1b1e21",
                    border:
                      "1px solid #34383d",
                  }}
                >
                  <div className="row align-items-center g-4">

                    {/* IMAGE */}

                    <div className="col-4 col-md-2">
                      <div
                        className="rounded-3 overflow-hidden"
                        style={{
                          height: "110px",
                          backgroundColor:
                            "#24282c",
                        }}
                      >
                        {order.product?.image ? (
                          <img
                            src={
                              order.product.image
                            }
                            alt={
                              order.product.name
                            }
                            className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              color: "#777d83",
                            }}
                          >
                            <i className="bi bi-image fs-2" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="col-8 col-md-4">
                      <small
                        style={{
                          color: "#8f969d",
                        }}
                      >
                        Order ID
                      </small>

                      <div className="small mb-2">
                        #{order._id.slice(-8)}
                      </div>

                      <h5 className="fw-bold mb-1">
                        {order.product?.name}
                      </h5>

                      <div
                        style={{
                          color: "#9ca1a7",
                        }}
                      >
                        Quantity:{" "}
                        {order.quantity}
                      </div>
                    </div>

                    {/* PRICE */}

                    <div className="col-6 col-md-2">
                      <small
                        style={{
                          color: "#8f969d",
                        }}
                      >
                        Total
                      </small>

                      <div className="fw-bold mt-1">
                        ₹
                        {order.totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="col-6 col-md-2">
                      <small
                        style={{
                          color: "#8f969d",
                        }}
                      >
                        Status
                      </small>

                      <div className="mt-1">
                        <span
                          className="badge rounded-pill px-3 py-2 text-capitalize"
                          style={{
                            backgroundColor:
                              order.status ===
                              "delivered"
                                ? "#193d2a"
                                : order.status ===
                                  "cancelled"
                                ? "#482124"
                                : "#34383d",
                            color:
                              "#ffffff",
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* ACTION */}

                    <div className="col-12 col-md-2 text-md-end">

                      {(order.status ===
                        "pending" ||
                        order.status ===
                          "confirmed") && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() =>
                            handleCancel(
                              order._id
                            )
                          }
                          disabled={
                            cancelling ===
                            order._id
                          }
                        >
                          {cancelling ===
                          order._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" />
                              Cancelling
                            </>
                          ) : (
                            <>
                              <i className="bi bi-x-circle me-1" />
                              Cancel
                            </>
                          )}
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;