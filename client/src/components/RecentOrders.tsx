import { Link } from "react-router-dom";

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "Completed" | "Pending" | "Cancelled";
  date: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const getStatusClass = (status: Order["status"]) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
      return "bg-success-subtle text-success";

    case "pending":
    case "processing":
      return "bg-warning-subtle text-warning-emphasis";

    case "cancelled":
      return "bg-danger-subtle text-danger";

    default:
      return "bg-primary-subtle text-primary";
  }
};

const RecentOrders = ({ orders }: RecentOrdersProps) => {
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

          <Link to="/orders" className="btn btn-sm btn-outline-dark">
            View All
          </Link>
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