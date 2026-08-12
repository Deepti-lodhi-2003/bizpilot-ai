import { NavLink } from "react-router-dom";

const products = [
  {
    name: "Premium Laptop",
    category: "Computers",
    price: 54999,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Wireless Headphones",
    category: "Audio",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Smart Watch",
    category: "Smart Gadgets",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
  },
];

const FeaturedProducts = () => {
  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#101214",
        color: "#fff",
      }}
    >
      <div className="container py-4">

        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <span
              className="text-uppercase small fw-semibold"
              style={{
                color: "#858b91",
                letterSpacing: "1.5px",
              }}
            >
              Our Collection
            </span>

            <h2 className="fw-bold mt-2 mb-1">
              Featured Products
            </h2>

            <p
              className="mb-0"
              style={{ color: "#858b91" }}
            >
              Our most popular products.
            </p>
          </div>

          <NavLink
              to="/shop"
              className="btn btn-outline-light rounded-pill px-4 "
            >
              View all
              <i className="bi bi-arrow-up-right ms-2" />
            </NavLink>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={product.name}
            >
              <div
                className="rounded-4 overflow-hidden h-100"
                style={{
                  backgroundColor: "#181c20",
                  border: "1px solid #292e33",
                }}
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-100"
                  style={{
                    height: "280px",
                    objectFit: "cover",
                  }}
                />

                <div className="p-4">
                  <small style={{ color: "#858b91" }}>
                    {product.category}
                  </small>

                  <h5 className="fw-semibold mt-2">
                    {product.name}
                  </h5>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold fs-5">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <NavLink
                      to="/shop"
                      className="btn btn-light btn-sm rounded-3"
                    >
                      View
                    </NavLink>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;