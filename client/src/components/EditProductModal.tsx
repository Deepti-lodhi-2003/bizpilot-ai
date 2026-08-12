import { useEffect } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

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
    image: string;
  };
  setFormData: Dispatch<
    SetStateAction<{
      name: string;
      description: string;
      price: string;
      stock: string;
      category: string;
      image: string;
    }>
  >;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
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
  // Prevent background screen scrolling
  useEffect(() => {
    if (!show) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [show]);

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
              <h5 className="modal-title fw-bold text-white">
                Edit Product
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={updating}
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
                {updateError && (
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-circle me-2" />
                    {updateError}
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
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Price
                    </label>

                    <input
                      type="number"
                      className="form-control"
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

                  {/* Stock */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Stock
                    </label>

                    <input
                      type="number"
                      className="form-control"
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
                      required
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

                {/* Image URL */}
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

              {/* Footer */}
              <div className="modal-footer px-4 py-3">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={onClose}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2 me-1" />
                      Update Product
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

export default EditProductModal;