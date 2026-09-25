import { useEffect } from "react";
import { Expense } from "../types/Expense";

interface AddExpenseModalProps {
  show: boolean;
  creating: boolean;
  formData: {
    title: string;
    amount: string;
    category: string;
    date: string;
    paymentMethod: string;
    description: string;
    status: 'Paid' | 'Pending';
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddExpenseModal = ({
  show,
  creating,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: AddExpenseModalProps) => {
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

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow-lg"
            style={{ maxHeight: "90vh", overflow: "hidden" }}
          >
            <div
              className="modal-header px-4 py-3"
              style={{ backgroundColor: "#343a40", color: "#fff" }}
            >
              <h5 className="modal-title fw-bold mb-0 text-white">Add Expense</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => !creating && onClose()}
                disabled={creating}
              />
            </div>

            <form onSubmit={onSubmit}>
              <div
                className="modal-body p-4"
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(90vh - 130px)",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter expense title"
                    style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salary">Salary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-4">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-semibold">Payment</label>
                    <select
                      className="form-select"
                      style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Paid' | 'Pending' })}
                      required
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter description (optional)"
                    style={{ backgroundColor: "#f1f3f5", borderColor: "#dee2e6" }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer px-4 py-3 bg-white">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={onClose}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark px-4" disabled={creating}>
                  {creating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-lg me-2" />
                      Add Expense
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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

export default AddExpenseModal;
