import type { Order } from "../services/orderService";

interface OrderDetailsModalProps {
    show: boolean;
    order: Order | null;
    onClose: () => void;
}

const OrderDetailsModal = ({
    show,
    order,
    onClose,
}: OrderDetailsModalProps) => {
    if (!show || !order) return null;

    const statusClass =
        order.status === "pending"
            ? "text-bg-warning"
            : order.status === "confirmed"
                ? "text-bg-info"
                : order.status === "shipped"
                    ? "text-bg-primary"
                    : order.status === "delivered"
                        ? "text-bg-success"
                        : "text-bg-danger";

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
                }}
            />

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className="modal-content border-0 shadow-lg"
                        style={{
                            maxWidth: "600px",
                            margin: "0 auto",
                            maxHeight: "91vh",
                            overflow: "hidden",
                        }}
                    >

                        {/* Header */}
                        <div
                            className="modal-header px-4 py-2"
                            style={{
                                backgroundColor: "#343a40",
                                color: "#fff",
                            }}
                        >
                            <div>
                                <h5 className="modal-title fw-bold mb-1 text-white">
                                    Order Details
                                </h5>

                                <small className="text-white-50">
                                    #{order._id.slice(-6).toUpperCase()}
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body px-4 py-3">

                            {/* Order Info */}
                            <div className="row g-2 mb-2">

                                <div className="col-6">
                                    <div
                                        className="rounded-3 p-3 h-100"
                                        style={{
                                            backgroundColor: "#f1f3f5",
                                            border: "1px solid #dee2e6",
                                        }}
                                    >
                                        <small className="text-muted">
                                            Order ID
                                        </small>

                                        <div className="fw-semibold mt-1">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div
                                        className="rounded-3 p-3 h-100"
                                        style={{
                                            backgroundColor: "#f1f3f5",
                                            border: "1px solid #dee2e6",
                                        }}
                                    >
                                        <small className="text-muted">
                                            Order Date
                                        </small>

                                        <div className="fw-semibold mt-1">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-IN")}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Customer */}
                            <div className="mb-2">

                                <h6 className="fw-bold mb-2">
                                    Customer Information
                                </h6>

                                <div
                                    className="rounded-3 p-3"
                                    style={{
                                        backgroundColor: "#f1f3f5",
                                        border: "1px solid #dee2e6",
                                    }}
                                >
                                    <div className="row">

                                        {/* Name */}
                                        <div className="col-6">
                                            <small className="text-muted d-block">
                                                Name
                                            </small>

                                            <span className="fw-semibold">
                                                {order.user.name}
                                            </span>
                                        </div>

                                        {/* Email */}
                                        <div className="col-6">
                                            <small className="text-muted d-block">
                                                Email
                                            </small>

                                            <span className="text-break">
                                                {order.user.email}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* Product */}
                            <div className="mb-3">

                                <h6 className="fw-bold mb-2">
                                    Product Information
                                </h6>

                                <div
                                    className="rounded-3 p-3"
                                    style={{
                                        backgroundColor: "#f1f3f5",
                                        border: "1px solid #dee2e6",
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>
                                            <div className="fw-semibold">
                                                {order.product.name}
                                            </div>

                                            <small className="text-muted">
                                                Category: {order.product.category}
                                            </small>
                                        </div>

                                        <div className="text-end">
                                            <small className="text-muted d-block">
                                                Quantity
                                            </small>

                                            <span className="fw-semibold">
                                                {order.quantity}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* Order Summary */}
                            <div className="mb-0">

                                <h6 className="fw-bold mb-2">
                                    Order Summary
                                </h6>

                                <div
                                    className="rounded-3 p-2"
                                    style={{
                                        backgroundColor: "#f1f3f5",
                                        border: "1px solid #dee2e6",
                                    }}
                                >

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">
                                            Quantity
                                        </span>

                                        <span>
                                            {order.quantity}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">
                                            Status
                                        </span>

                                        <span className={`badge ${statusClass}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <hr className="my-2" />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-semibold">
                                            Total Amount
                                        </span>

                                        <span className="fw-bold fs-5">
                                            ₹
                                            {order.totalAmount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Footer */}
                        {/* <div className="modal-footer px-4 py-3">

              <button
                type="button"
                className="btn btn-dark px-4"
                onClick={onClose}
              >
                Close
              </button>

            </div> */}

                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsModal;