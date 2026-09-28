import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsData } from "../services/analyticsService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#0dcaf0", "#6610f2", "#d63384"];
const STATUS_COLORS = {
  pending: "#ffc107",
  confirmed: "#0dcaf0",
  shipped: "#0d6efd",
  delivered: "#198754",
  cancelled: "#dc3545",
};

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAnalytics();
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {error || "No data available."}
      </div>
    );
  }

  // Format expenseByCategory for PieChart
  const expenseData = Object.entries(data.expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Format orderStatus for BarChart/PieChart
  const orderStatusData = Object.entries(data.orderStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || "#6c757d",
  }));

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Analytics Dashboard</h2>
          <p className="text-muted mb-0">Overview of your business performance</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1 fw-semibold text-uppercase">Total Revenue</p>
                <h3 className="fw-bold mb-0 text-success">
                  ₹{data.totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "48px", height: "48px", backgroundColor: "#d1e7dd", color: "#0f5132" }}
              >
                <i className="bi bi-graph-up-arrow fs-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1 fw-semibold text-uppercase">Total Expenses</p>
                <h3 className="fw-bold mb-0 text-danger">
                  ₹{data.totalExpenses.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "48px", height: "48px", backgroundColor: "#f8d7da", color: "#842029" }}
              >
                <i className="bi bi-graph-down-arrow fs-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1 fw-semibold text-uppercase">Net Profit</p>
                <h3 className="fw-bold mb-0 text-primary">
                  ₹{data.netProfit.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "48px", height: "48px", backgroundColor: "#cfe2ff", color: "#084298" }}
              >
                <i className="bi bi-wallet2 fs-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small mb-1 fw-semibold text-uppercase">Total Orders</p>
                <h3 className="fw-bold mb-0 text-dark">
                  {data.totalOrders.toLocaleString("en-IN")}
                </h3>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "48px", height: "48px", backgroundColor: "#e2e3e5", color: "#41464b" }}
              >
                <i className="bi bi-box-seam fs-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* REVENUE VS EXPENSES TREND */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0">Revenue vs Expenses (Last 6 Months)</h5>
            </div>
            <div className="card-body">
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={data.monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#198754"
                      fillOpacity={0.1}
                      fill="#198754"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#dc3545"
                      fillOpacity={0.1}
                      fill="#dc3545"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* EXPENSES BY CATEGORY */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0">Expenses by Category</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              {expenseData.length > 0 ? (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => `₹${Number(value).toLocaleString("en-IN")}`}
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-muted text-center">
                  <i className="bi bi-pie-chart fs-1 mb-2 d-block opacity-25"></i>
                  No expense data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* ORDER STATUS DISTRIBUTION */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0">Order Status Distribution</h5>
            </div>
            <div className="card-body">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={orderStatusData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="value" name="Orders" radius={[0, 4, 4, 0]} barSize={30}>
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK INSIGHTS */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0">
                {/* <i className="bi bi-lightbulb-fill text-warning me-2"></i> */}
                Key Business Insights
              </h5>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="row g-4">
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <p className="text-muted mb-1 small text-uppercase fw-semibold">Profit Margin</p>
                      <h3 className="fw-bold mb-0 text-dark">
                        {data.totalRevenue > 0 ? ((data.netProfit / data.totalRevenue) * 100).toFixed(1) : 0}%
                      </h3>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <p className="text-muted mb-1 small text-uppercase fw-semibold">Avg Order Value</p>
                      <h3 className="fw-bold mb-0 text-dark">
                        ₹{data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders).toLocaleString("en-IN") : 0}
                      </h3>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <p className="text-muted mb-1 small text-uppercase fw-semibold">Delivery Rate</p>
                      <h3 className="fw-bold mb-0 text-dark">
                        {data.totalOrders > 0 ? ((data.orderStatus?.delivered / data.totalOrders) * 100).toFixed(1) : 0}%
                      </h3>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <p className="text-muted mb-1 small text-uppercase fw-semibold">Active Orders</p>
                      <h3 className="fw-bold mb-0 text-dark">
                        {((data.orderStatus?.pending || 0) + (data.orderStatus?.confirmed || 0) + (data.orderStatus?.shipped || 0)).toLocaleString("en-IN")}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-top">
                <p className="text-muted mb-0 small">
                  <i className="bi bi-info-circle me-1"></i>
                  Metrics are calculated based on your total historical data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;




