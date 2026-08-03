import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

const data: RevenueData[] = [
  { month: "Jan", revenue: 45000, expenses: 22000 },
  { month: "Feb", revenue: 52000, expenses: 25000 },
  { month: "Mar", revenue: 48000, expenses: 21000 },
  { month: "Apr", revenue: 61000, expenses: 28000 },
  { month: "May", revenue: 72000, expenses: 31000 },
  { month: "Jun", revenue: 85400, expenses: 32100 },
];

const RevenueChart = () => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">

        <div className="mb-3">
          <h5 className="fw-bold mb-1">
            Revenue & Expenses
          </h5>

          <p className="text-muted mb-0">
            Monthly business performance
          </p>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#198754"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#dc3545"
                strokeWidth={2}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default RevenueChart;