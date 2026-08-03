interface StateMessageProps {
    type: "loading" | "error" | "empty";
    message: string;
}

const StateMessage = ({
    type,
    message,
}: StateMessageProps) => {
    const icon = {
        loading: "bi-arrow-repeat",
        error: "bi-exclamation-circle",
        empty: "bi-inbox",
    }[type];

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
                <i
                    className={`bi ${icon} fs-1 text-muted`}
                ></i>

                <p className="text-muted mt-3 mb-0">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default StateMessage;