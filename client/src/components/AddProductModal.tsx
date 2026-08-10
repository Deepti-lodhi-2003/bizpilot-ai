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
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      price: string;
      stock: string;
      category: string;
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
  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={() => !creating && onClose()}
      />

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">

            {/* Header */}
            <div className="modal-header px-4 py-3">
              <div>
                <h5 className="modal-title fw-bold mb-1">
                  Add New Product
                </h5>

                <small className="text-muted">
                  Add a product to your inventory
                </small>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => !creating && onClose()}
                disabled={creating}
              />
            </div>

            {/* Form */}
            <form onSubmit={onSubmit}>
              <div className="modal-body p-4">

                {/* Error */}
                {createError && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2" />
                    {createError}
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
                    placeholder="Enter product name"
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

                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      Price
                    </label>

                    <div className="input-group">
                      <span className="input-group-text">
                        ₹
                      </span>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
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
                  </div>

                  <div className="col-6">
                    <label className="form-label fw-semibold">
                      Stock
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
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
              <div className="modal-footer px-4 py-3">

                <button
                  type="button"
                  className="btn btn-light"
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
                      <span className="spinner-border spinner-border-sm me-2" />
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
    </>
  );
};

export default AddProductModal;