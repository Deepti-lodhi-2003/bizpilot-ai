import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RecentOrders from "../components/RecentOrders";
import AIInsightCard from "../components/AIInsightCard";
import { getAnalytics } from "../services/authService";

interface StatCardData {
  title: string;
  value: string;
  icon: string;
  trend: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatCardData[]>([
    {
      title: "Revenue",
      value: "₹0",
      icon: "bi-currency-rupee",
      trend: "Loading...",
    },
    {
      title: "Expenses",
      value: "₹0",
      icon: "bi-wallet2",
      trend: "Loading...",
    },
    {
      title: "Profit",
      value: "₹0",
      icon: "bi-graph-up-arrow",
      trend: "Loading...",
    },
    {
      title: "Orders",
      value: "0",
      icon: "bi-cart3",
      trend: "Loading...",
    },
  ]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        const { totalRevenue, totalExpenses, netProfit, totalOrders, monthlyData: mData, insights: aiInsights, recentOrders: rOrders } = data.analytics;

        setMonthlyData(mData || []);
        setInsights(aiInsights || []);
        setRecentOrders(rOrders || []);

        setStats([
          {
            title: "Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: "bi-currency-rupee",
            trend: "All time",
          },
          {
            title: "Expenses",
            value: `₹${totalExpenses.toLocaleString()}`,
            icon: "bi-wallet2",
            trend: "All time",
          },
          {
            title: "Profit",
            value: `₹${netProfit.toLocaleString()}`,
            icon: "bi-graph-up-arrow",
            trend: "All time",
          },
          {
            title: "Orders",
            value: `${totalOrders}`,
            icon: "bi-cart3",
            trend: "Total orders",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Dashboard</h2>

        {/* <p className="text-muted mb-0">
          Here's what's happening with your business today.
        </p> */}
      </div>


      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div
            className="col-12 col-sm-6 col-xl-3"
            key={stat.title}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          </div>
        ))}
      </div>


      {/* Charts */}
      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <RevenueChart data={monthlyData} />
        </div>

        <div className="col-12 col-xl-4">
          <AIInsightCard insights={insights} />
        </div>
      </div>


      {/* Recent Orders */}
      <div className="row mt-4">
        <div className="col-12">
          <RecentOrders orders={recentOrders} />
        </div>
      </div>


    </div>
  );
};

export default Dashboard; 