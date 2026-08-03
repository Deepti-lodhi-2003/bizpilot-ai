interface AIInsight {
  type: "positive" | "warning" | "info";
  title: string;
  description: string;
  icon: string;
}

const insights: AIInsight[] = [
  {
    type: "positive",
    title: "Revenue is growing",
    description:
      "Your revenue increased by 12.5% compared to last month.",
    icon: "bi-graph-up-arrow",
  },
  {
    type: "warning",
    title: "Expenses increased",
    description:
      "Your expenses are 5.2% higher than last month.",
    icon: "bi-exclamation-triangle",
  },
  {
    type: "info",
    title: "Orders are performing well",
    description:
      "You received 248 orders this month.",
    icon: "bi-lightbulb",
  },
];

const getInsightClass = (type: AIInsight["type"]) => {
  switch (type) {
    case "positive":
      return "bg-success-subtle text-success";

    case "warning":
      return "bg-warning-subtle text-warning-emphasis";

    case "info":
      return "bg-primary-subtle text-primary";

    default:
      return "";
  }
};

const AIInsightCard = () => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">

        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="bg-dark text-white rounded p-2">
            <i className="bi bi-robot"></i>
          </div>

          <div>
            <h5 className="fw-bold mb-0">
              AI Insights
            </h5>

            <small className="text-muted">
              Smart business analysis
            </small>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className={`p-3 rounded ${getInsightClass(
                insight.type
              )}`}
            >
              <div className="d-flex gap-2">

                <i className={`bi ${insight.icon}`}></i>

                <div>
                  <strong>{insight.title}</strong>

                  <p className="small mb-0 mt-1">
                    {insight.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AIInsightCard;