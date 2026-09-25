import React, { useState, useEffect } from "react";
import { createExpense, updateExpense, type Expense } from "../services/expenseService";

interface ExpenseModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expenseToEdit?: Expense | null;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  show,
  onClose,
  onSuccess,
  expenseToEdit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "",
    status: "Pending",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        category: expenseToEdit.category,
        amount: expenseToEdit.amount,
        date: expenseToEdit.date.slice(0, 10),
        paymentMethod: expenseToEdit.paymentMethod,
        status: expenseToEdit.status,
        description: expenseToEdit.description || "",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: "",
        status: "Pending",
        description: "",
      });
    }
    setError("");
  }, [expenseToEdit, show]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (expenseToEdit) {
        await updateExpense(expenseToEdit._id, formData);
      } else {
        await createExpense(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save expense:", err);
      setError(err?.response?.data?.message || "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title fw-bold" style={{ color: "#1f2428" }}>
                {expenseToEdit ? "Edit Expense" : "Add Expense"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              />
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-circle me-1" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} id="expenseForm">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Office Supplies"
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Rent">Rent</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Travel">Travel</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Payment Method</label>
                    <select
                      className="form-select"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Additional details..."
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer border-0 bg-light">
              <button
                type="button"
                className="btn btn-light border"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="expenseForm"
                className="btn btn-dark"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Expense"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseModal;
