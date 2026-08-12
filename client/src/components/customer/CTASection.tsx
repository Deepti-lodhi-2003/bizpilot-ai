import { NavLink } from "react-router-dom";

const CTASection = () => {
  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#101214",
        color: "#fff",
      }}
    >
      <div className="container py-4">

        <div
          className="rounded-4 p-5 text-center"
          style={{
            background:
              "linear-gradient(135deg, #1c2125, #111417)",
            border: "1px solid #2d3338",
          }}
        >
          <i className="bi bi-bag-heart fs-1" />

          <h2 className="fw-bold mt-3">
            Ready to find something great?
          </h2>

          <p
            className="mx-auto"
            style={{
              color: "#92989e",
              maxWidth: "550px",
            }}
          >
            Explore our collection and discover products
            you'll love.
          </p>

          <NavLink
            to="/shop"
            className="btn btn-light btn-lg px-4 rounded-3 mt-2"
          >
            Start Shopping
            <i className="bi bi-arrow-right ms-2" />
          </NavLink>
        </div>

      </div>
    </section>
  );
};

export default CTASection;