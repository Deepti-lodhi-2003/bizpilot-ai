import type { Product } from "../types/Product";

interface DeleteProductModalProps {
    show: boolean;
    product: Product | null;
    deleting: boolean;
    deleteError: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteProductModal = ({
    show,
    product,
    deleting,
    deleteError,
    onClose,
    onConfirm,
}: DeleteProductModalProps) => {
    if (!show || !product) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{
                    zIndex: 1040,
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
                aria-modal="true"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">

                        {/* Header */}
                        <div
                            className="modal-header px-4 py-3"
                            style={{
                                backgroundColor: "#343a40",
                                color: "#fff",
                            }}
                        >
                            <h5 className="modal-title fw-bold text-white">
                                Delete Product
                            </h5>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                disabled={deleting}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body text-center py-4">

                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#f8d7da",
                                    color: "#dc3545",
                                }}
                            >
                                <i className="bi bi-trash3 fs-4"></i>
                            </div>

                            <h5 className="fw-semibold">
                                Are you sure?
                            </h5>

                            {/* <p className="text-muted mb-2">
                                You are about to delete:
                            </p> */}

                            <p className="fw-bold mb-3">
                                {product.name}
                            </p>

                            <p className="text-muted small mb-0">
                                This action cannot be undone.
                            </p>

                            {/* Error */}
                            {deleteError && (
                                <div className="alert alert-danger mt-3 mb-0">
                                    {deleteError}
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="modal-footer">

                            {/* Cancel - Left */}
                            <button
                                type="button"
                                className="btn btn-dark me-auto"
                                onClick={onClose}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            {/* Delete - Right */}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3 me-1"></i>
                                        Delete Product
                                    </>
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteProductModal;