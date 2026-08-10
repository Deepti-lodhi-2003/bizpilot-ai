import { useEffect, useState } from "react";
import {
    getInventoryHistory,
    type InventoryHistory,
} from "../services/inventoryService";

interface InventoryHistoryModalProps {
    show: boolean;
    productId: string | null;
    productName: string;
    onClose: () => void;
}

const InventoryHistoryModal = ({
    show,
    productId,
    productName,
    onClose,
}: InventoryHistoryModalProps) => {
    const [history, setHistory] = useState<InventoryHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show || !productId) return;

        const loadHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getInventoryHistory(productId);

                setHistory(data);
            } catch (error: any) {
                console.error("History error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load inventory history"
                );
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [show, productId]);

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={() => !loading && onClose()}
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
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg">

                        {/* Header */}
                        <div
                            className="modal-header px-4 py-3"
                            style={{
                                backgroundColor: "#343a40",
                                color: "#fff",
                            }}
                        >
                            <div>
                                <h5 className="modal-title fw-bold mb-1 text-white">
                                    Stock History
                                </h5>

                                <small className="text-white-50">
                                    {productName}
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                disabled={loading}
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4">

                            {/* Loading */}
                            {loading && (
                                <div className="text-center py-5">
                                    <div
                                        className="spinner-border"
                                        role="status"
                                    />

                                    <p className="text-muted mt-3 mb-0">
                                        Loading history...
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {error && !loading && (
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-circle me-2" />
                                    {error}
                                </div>
                            )}

                            {/* Empty */}
                            {!loading &&
                                !error &&
                                history.length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="bi bi-clock-history fs-1 text-muted" />

                                        <p className="text-muted mt-3 mb-0">
                                            No inventory history found.
                                        </p>
                                    </div>
                                )}

                            {/* History Table */}
                            {!loading &&
                                !error &&
                                history.length > 0 && (
                                    <div className="table-responsive">

                                        <table className="table table-hover align-middle mb-0">

                                            <thead className="table-light">
                                                <tr>
                                                    <th>Action</th>
                                                    <th>Quantity</th>
                                                    <th>Stock</th>
                                                    <th>Performed By</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {history.map((item) => (
                                                    <tr key={item._id}>

                                                        {/* Action */}
                                                        <td>
                                                            {item.type === "add" ? (
                                                                <span className="badge text-bg-success">
                                                                    <i className="bi bi-plus-lg me-1" />
                                                                    Added
                                                                </span>
                                                            ) : (
                                                                <span className="badge text-bg-danger">
                                                                    <i className="bi bi-dash-lg me-1" />
                                                                    Removed
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Quantity */}
                                                        <td className="fw-semibold">
                                                            {item.quantity}
                                                        </td>

                                                        {/* Stock */}
                                                        <td>
                                                            {item.previousStock}

                                                            <i className="bi bi-arrow-right mx-2 text-muted" />

                                                            <strong>
                                                                {item.newStock}
                                                            </strong>
                                                        </td>

                                                        {/* User */}
                                                        <td>
                                                            <div className="fw-semibold">
                                                                {item.performedBy.name}
                                                            </div>

                                                            <small className="text-muted">
                                                                {item.performedBy.email}
                                                            </small>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="text-muted small">
                                                            {new Date(
                                                                item.createdAt
                                                            ).toLocaleString("en-IN")}
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>

                                    </div>
                                )}

                        </div>

                        {/* Footer */}
                        {/* <div className="modal-footer px-4 py-3">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                                disabled={loading}
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

export default InventoryHistoryModal;