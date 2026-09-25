import { useEffect } from "react";
import type { Expense } from "../types/Expense";

interface DeleteExpenseModalProps {
  show: boolean;
  expense: Expense | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteExpenseModal = ({
  show,
  expense,
  deleting,
  onClose,
  onConfirm,
}: DeleteExpenseModalProps) => {
  useEffect(() => {
    if (!show) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [show]);

  if (!show || !expense) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={() => !deleting && onClose()}
        style={{
          zIndex: 1040,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
        }}
      ></div>

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-danger text-white py-3">
              <h5 className="modal-title fw-bold">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={deleting}
              ></button>
            </div>

            <div className="modal-body p-4 text-center">
              <div
                className="mb-3 text-danger d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                }}
              >
                <i className="bi bi-exclamation-triangle fs-3"></i>
              </div>

              <h5 className="fw-bold mb-3">Delete Expense?</h5>

              <p className="text-muted mb-0">
                Are you sure you want to delete the expense "<strong>{expense.title}</strong>"?<br />
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
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
                    <i className="bi bi-trash me-2"></i>
                    Delete
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

export default DeleteExpenseModal;
