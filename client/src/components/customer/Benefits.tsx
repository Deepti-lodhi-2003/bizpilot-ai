const benefits = [
  {
    icon: "bi-truck",
    title: "Fast Delivery",
    text: "Quick and reliable delivery on your orders.",
  },
  {
    icon: "bi-shield-check",
    title: "Secure Payment",
    text: "Safe and secure payment experience.",
  },
  {
    icon: "bi-award",
    title: "Quality Products",
    text: "Products selected with quality in mind.",
  },
  {
    icon: "bi-headset",
    title: "Customer Support",
    text: "We're always here when you need us.",
  },
];

const Benefits = () => {
  return (
    <section className="py-5 bg-white">
      <div className="container py-4">

        <div className="row g-4">
          {benefits.map((item) => (
            <div
              className="col-12 col-sm-6 col-lg-3"
              key={item.title}
            >
              <div className="text-center px-3">

                <div
                  className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#f1f3f5",
                  }}
                >
                  <i
                    className={`bi ${item.icon} fs-4`}
                    style={{ color: "#212529" }}
                  />
                </div>

                <h6 className="fw-bold">
                  {item.title}
                </h6>

                <p className="text-muted small mb-0">
                  {item.text}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Benefits;