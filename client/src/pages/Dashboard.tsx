import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RecentOrders from "../components/RecentOrders";
import AIInsightCard from "../components/AIInsightCard";

interface StatCardData {
  title: string;
  value: string;
  icon: string;
  trend: string;
}

const stats: StatCardData[] = [
  {
    title: "Revenue",
    value: "₹85,400",
    icon: "bi-currency-rupee",
    trend: "+12.5% this month",
  },
  {
    title: "Expenses",
    value: "₹32,100",
    icon: "bi-wallet2",
    trend: "+5.2% this month",
  },
  {
    title: "Profit",
    value: "₹53,300",
    icon: "bi-graph-up-arrow",
    trend: "+18.4% this month",
  },
  {
    title: "Orders",
    value: "248",
    icon: "bi-cart3",
    trend: "+8.7% this month",
  },
];

const Dashboard = () => {
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
          <RevenueChart />
        </div>

        <div className="col-12 col-xl-4">
          <AIInsightCard />
        </div>
      </div>


      {/* Recent Orders */}
      <div className="row mt-4">
        <div className="col-12">
          <RecentOrders />
        </div>
      </div>


    </div>
  );
};

export default Dashboard; 