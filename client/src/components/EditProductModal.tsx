import type { Dispatch, FormEvent, SetStateAction } from "react";
// import type { Product } from "../types/Product";

interface EditProductModalProps {
    show: boolean;
    updating: boolean;
    updateError: string;
    formData: {
        name: string;
        description: string;
        price: string;
        stock: string;
        category: string;
    };
    setFormData: Dispatch<
        SetStateAction<{
            name: string;
            description: string;
            price: string;
            stock: string;
            category: string;
        }>
    >;
    onClose: () => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const EditProductModal = ({
    show,
    updating,
    updateError,
    formData,
    setFormData,
    onClose,
    onSubmit,
}: EditProductModalProps) => {
    if (!show) {
        return null;
    }

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{
                    zIndex: 1040,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    opacity: 1,
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                }}
            ></div>

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
                            <h5
                                className="modal-title fw-bold"
                                style={{ color: "#fff" }}
                            >
                                Edit Product
                            </h5>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                disabled={updating}
                            ></button>
                        </div>

                        {/* Form */}
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">

                                {/* Error */}
                                {updateError && (
                                    <div className="alert alert-danger">
                                        {updateError}
                                    </div>
                                )}

                                {/* Name */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    ></textarea>
                                </div>

                                <div className="row">

                                    {/* Price */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    stock: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                </div>

                                {/* Category */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={onClose}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-dark"
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check2 me-1"></i>
                                            Update Product
                                        </>
                                    )}
                                </button>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProductModal;