import { useState } from "react";
import type { Product } from "../types/Product";

interface ManageStockModalProps {
    show: boolean;
    product: Product | null;
    updating: boolean;
    stockError: string;
    onClose: () => void;
    onAddStock: (quantity: number) => void;
    onRemoveStock: (quantity: number) => void;
}

const ManageStockModal = ({
    show,
    product,
    updating,
    stockError,
    onClose,
    onAddStock,
    onRemoveStock,
}: ManageStockModalProps) => {
    const [quantity, setQuantity] = useState("");

    if (!show || !product) return null;

    const handleAddStock = () => {
        const value = Number(quantity);

        if (!value || value <= 0) return;

        onAddStock(value);
    };

    const handleRemoveStock = () => {
        const value = Number(quantity);

        if (!value || value <= 0) return;

        if (value > product.stock) return;

        onRemoveStock(value);
    };

    const handleClose = () => {
        if (updating) return;

        setQuantity("");
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={handleClose}
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
                                <h5 className="modal-title fw-bold mb-1">
                                    Manage Stock
                                </h5>

                                <small className="text-white-50">
                                    Update product inventory
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={handleClose}
                                disabled={updating}
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4">

                            {/* Error */}
                            {stockError && (
                                <div className="alert alert-danger d-flex align-items-center">
                                    <i className="bi bi-exclamation-circle me-2" />
                                    {stockError}
                                </div>
                            )}

                            {/* Product */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Product
                                </label>

                                <div className="border rounded-3 p-3 bg-light">
                                    <div className="fw-bold">
                                        {product.name}
                                    </div>

                                    <small className="text-muted">
                                        {product.category}
                                    </small>
                                </div>
                            </div>

                            {/* Current Stock */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Current Stock
                                </label>

                                <div className="fs-3 fw-bold">
                                    {product.stock}
                                    <span className="fs-6 text-muted ms-2">
                                        units
                                    </span>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    disabled={updating}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2">

                                <button
                                    type="button"
                                    className="btn btn-dark flex-grow-1"
                                    onClick={handleAddStock}
                                    disabled={
                                        updating ||
                                        !quantity ||
                                        Number(quantity) <= 0
                                    }
                                >
                                    {updating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-lg me-2" />
                                            Add Stock
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger flex-grow-1"
                                    onClick={handleRemoveStock}
                                    disabled={
                                        updating ||
                                        !quantity ||
                                        Number(quantity) <= 0 ||
                                        Number(quantity) > product.stock
                                    }
                                >
                                    <i className="bi bi-dash-lg me-2" />
                                    Remove Stock
                                </button>

                            </div>

                            {/* Stock warning */}
                            {Number(quantity) > product.stock && (
                                <div className="text-danger small mt-2">
                                    Quantity cannot be greater than current stock.
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        {/* <div className="modal-footer px-4 py-3">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={handleClose}
                                disabled={updating}
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

export default ManageStockModal;