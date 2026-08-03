interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    trend: string;
}

const StatCard = ({
    title,
    value,
    icon,
    trend,
}: StatCardProps) => {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <p className="text-muted mb-2">{title}</p>
                        <h3 className="fw-bold mb-2">{value}</h3>
                        <small className="text-success">
                            {trend}
                        </small>
                    </div>

                    <div className="bg-dark text-white rounded p-3">
                        <i className={`bi ${icon}`}></i>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StatCard;