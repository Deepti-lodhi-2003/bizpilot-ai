interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "Completed" | "Pending" | "Cancelled";
  date: string;
}

const orders: Order[] = [
  {
    id: "#ORD-1024",
    customer: "Rahul Sharma",
    product: "Premium Plan",
    amount: "₹2,499",
    status: "Completed",
    date: "Aug 02, 2026",
  },
  {
    id: "#ORD-1023",
    customer: "Priya Singh",
    product: "Business Plan",
    amount: "₹4,999",
    status: "Pending",
    date: "Aug 02, 2026",
  },
  {
    id: "#ORD-1022",
    customer: "Aman Verma",
    product: "Starter Plan",
    amount: "₹999",
    status: "Completed",
    date: "Aug 01, 2026",
  },
  {
    id: "#ORD-1021",
    customer: "Neha Patel",
    product: "Premium Plan",
    amount: "₹2,499",
    status: "Cancelled",
    date: "Aug 01, 2026",
  },
];

const getStatusClass = (status: Order["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-success-subtle text-success";

    case "Pending":
      return "bg-warning-subtle text-warning-emphasis";

    case "Cancelled":
      return "bg-danger-subtle text-danger";

    default:
      return "";
  }
};

const RecentOrders = () => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">
              Recent Orders
            </h5>

            <p className="text-muted mb-0 small">
              Latest orders from your customers
            </p>
          </div>

          <button className="btn btn-sm btn-outline-dark">
            View All
          </button>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">

            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>

                  <td className="fw-semibold">
                    {order.id}
                  </td>

                  <td>
                    {order.customer}
                  </td>

                  <td>
                    {order.product}
                  </td>

                  <td className="fw-semibold">
                    {order.amount}
                  </td>

                  <td>
                    <span
                      className={`badge rounded-pill ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="text-muted">
                    {order.date}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default RecentOrders;