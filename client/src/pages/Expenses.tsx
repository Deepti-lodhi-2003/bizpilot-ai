import { useEffect, useMemo, useState } from "react";
import { getExpenses, createExpense, deleteExpense, type Expense } from "../services/expenseService";
import AddExpenseModal from "../components/AddExpenseModal";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    description: "",
    status: "Paid" as const,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getExpenses();
      setExpenses(data || []);
    } catch (err: any) {
      console.error("Failed to fetch expenses:", err);
      setError(err?.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setCreating(true);
      await createExpense({
        ...formData,
        amount: Number(formData.amount),
      });
      setShowModal(false);
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "",
        description: "",
        status: "Paid",
      });
      loadData();
    } catch (err: any) {
      console.error("Failed to add expense:", err);
      alert(err?.response?.data?.message || "Failed to add expense");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        loadData();
      } catch (err: any) {
        console.error("Failed to delete expense:", err);
        alert(err?.response?.data?.message || "Failed to delete expense");
      }
    }
  };

  const filteredExpenses = useMemo(() => {
    const searchText = search.toLowerCase().trim();
    const result = expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(searchText);
      const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    return result;
  }, [expenses, search, selectedCategory]);

  const stats = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = expenses.filter(e => e.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0);
    const thisMonth = expenses.filter(e => {
      const date = new Date(e.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((acc, curr) => acc + curr.amount, 0);
    return { total, pending, thisMonth };
  }, [expenses]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border" style={{ color: "#1f2428" }} role="status" />
        <p className="text-muted mt-3 mb-0">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-circle me-2" />
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <div className="text-uppercase fw-semibold small text-secondary mb-1" style={{ letterSpacing: "1.5px" }}>
            Finance
          </div>
          <h2 className="fw-bold mb-1" style={{ color: "#1f2428" }}>
            Expenses
          </h2>
          <p className="text-muted mb-0">
            Track and manage your business expenditures.
          </p>
        </div>
        <button
          className="btn btn-dark d-flex align-items-center gap-2 px-3 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg" />
          <span className="d-none d-sm-inline">Add Expense</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Total Expenses</p>
                <h3 className="fw-bold mb-0 text-danger">
                  ₹{stats.total.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "46px", height: "46px", backgroundColor: "#f8d7da", color: "#dc3545" }}
              >
                <i className="bi bi-wallet2 fs-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">This Month</p>
                <h3 className="fw-bold mb-0">
                  ₹{stats.thisMonth.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "46px", height: "46px", backgroundColor: "#e2e3e5", color: "#383d41" }}
              >
                <i className="bi bi-calendar-check fs-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1">Pending Payments</p>
                <h3 className="fw-bold mb-0 text-warning">
                  ₹{stats.pending.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "46px", height: "46px", backgroundColor: "#fff3cd", color: "#856404" }}
              >
                <i className="bi bi-hourglass-split fs-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search expenses by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setSearch("")}>
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Utilities">Utilities</option>
                <option value="Salary">Salary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <span className="text-muted small">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </span>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                {["Date", "Title & Category", "Payment Method", "Status", "Amount", "Action"].map((heading, idx) => (
                  <th
                    key={heading}
                    className={idx === 0 ? "px-4 py-3" : "py-3"}
                    style={{ backgroundColor: "#495057", color: "#fff", borderColor: "#5c636a" }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <i className="bi bi-receipt fs-2 text-muted" />
                    <p className="text-muted mt-2 mb-0">No expenses found.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="px-4">
                      <small className="text-muted fw-semibold">
                        {new Date(expense.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{expense.title}</div>
                      <small className="text-muted">{expense.category}</small>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                        {expense.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${expense.status === "Paid" ? "text-bg-success" : "text-bg-warning"}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="fw-semibold text-danger">
                      ₹{expense.amount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Expense"
                        onClick={() => handleDeleteExpense(expense._id)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <AddExpenseModal
        show={showModal}
        creating={creating}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
};

export default Expenses;
