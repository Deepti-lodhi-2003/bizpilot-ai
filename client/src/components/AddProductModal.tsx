import { useEffect } from "react";

interface AddProductModalProps {
  show: boolean;
  creating: boolean;
  createError: string;
  formData: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    image: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      price: string;
      stock: string;
      category: string;
      image: string;
    }>
  >;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddProductModal = ({
  show,
  creating,
  createError,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: AddProductModalProps) => {
  // Prevent background screen scrolling
  useEffect(() => {
    if (!show) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={() => !creating && onClose()}
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
        style={{
          zIndex: 1050,
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="modal-header px-4 py-3"
              style={{
                backgroundColor: "#343a40",
                color: "#fff",
              }}
            >
              <div>
                <h5 className="modal-title fw-bold mb-0 text-white">
                  Add New Product
                </h5>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => !creating && onClose()}
                disabled={creating}
              />
            </div>

            {/* Form */}
            <form onSubmit={onSubmit}>
              {/* Scrollable Form Body */}
              <div
                className="modal-body p-4"
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(90vh - 130px)",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Error */}
                {createError && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2" />
                    {createError}
                  </div>
                )}

                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Product Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter product name"
                    style={{
                      backgroundColor: "#f1f3f5",
                      borderColor: "#dee2e6",
                    }}
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
                    placeholder="Enter product description"
                    style={{
                      backgroundColor: "#f1f3f5",
                      borderColor: "#dee2e6",
                    }}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Price + Stock */}
                <div className="row g-3">
                  {/* Price */}
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      Price
                    </label>

                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          backgroundColor: "#e9ecef",
                          borderColor: "#dee2e6",
                        }}
                      >
                        ₹
                      </span>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        min="0"
                        style={{
                          backgroundColor: "#f1f3f5",
                          borderColor: "#dee2e6",
                        }}
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
                  </div>

                  {/* Stock */}
                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      Stock
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      style={{
                        backgroundColor: "#f1f3f5",
                        borderColor: "#dee2e6",
                      }}
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mt-3">
                  <label className="form-label fw-semibold">
                    Category
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Electronics"
                    style={{
                      backgroundColor: "#f1f3f5",
                      borderColor: "#dee2e6",
                    }}
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

                {/* Product Image URL */}
                <div className="mt-3">
                  <label className="form-label fw-semibold">
                    Product Image URL
                  </label>

                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/product.jpg"
                    style={{
                      backgroundColor: "#f1f3f5",
                      borderColor: "#dee2e6",
                    }}
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div
                className="modal-footer px-4 py-3"
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={onClose}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-lg me-2" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hide Modal Scrollbar */}
      <style>
        {`
          .modal-body::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  );
};

export default AddProductModal;