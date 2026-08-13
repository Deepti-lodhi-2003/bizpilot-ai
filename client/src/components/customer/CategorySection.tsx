import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { getCategories, type Category } from "../../services/categoryService";

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="category-section py-5 bg-dark">
      <div className="container py-lg-5">

        {/* Heading */}
        <ScrollReveal>
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4 mb-lg-5">

            <div>
              <span
                className="text-uppercase fw-semibold small"
                style={{
                  color: "#adb5bd",
                  letterSpacing: "2px",
                }}
              >
                Shop by category
              </span>

              <h2
                className="fw-bold text-white mt-2 mb-0"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                }}
              >
                Find what fits
                <br />
                <span style={{ color: "#adb5bd" }}>
                  your lifestyle.
                </span>
              </h2>
            </div>

            <Link
              to="/shop"
              className="btn btn-outline-light rounded-pill px-4 align-self-start align-self-md-auto"
            >
              View all
              <i className="bi bi-arrow-up-right ms-2" />
            </Link>

          </div>
        </ScrollReveal>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border text-light"
              role="status"
            />

            <p className="text-white-50 mt-3 mb-0">
              Loading categories...
            </p>
          </div>
        )}

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <div className="row g-4">

            {categories.map((category, index) => (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={category._id}
              >
                <ScrollReveal delay={index * 100}>

                  <Link
                    to={`/shop?category=${category._id}`}
                    className="text-decoration-none d-block"
                  >

                    <div
                      className="category-card position-relative overflow-hidden rounded-4"
                      style={{
                        height: "360px",
                        backgroundColor: "#212529",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >

                      {/* Image */}
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                            transition:
                              "transform 0.6s ease",
                          }}
                        />
                      ) : (
                        <div
                          className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #343a40, #16191c)",
                          }}
                        >
                          <i
                            className="bi bi-grid-3x3-gap fs-1 text-white-50"
                          />
                        </div>
                      )}

                      {/* Dark overlay */}
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.05) 65%)",
                        }}
                      />

                      {/* Content */}
                      <div
                        className="position-absolute bottom-0 start-0 w-100 p-4"
                        style={{ color: "#fff" }}
                      >

                        <div className="d-flex align-items-end justify-content-between">

                          <div>
                            <span
                              className="small text-white-50 text-uppercase"
                              style={{
                                letterSpacing: "1.5px",
                              }}
                            >
                              Category
                            </span>

                            <h5 className="fw-bold mb-1 mt-1">
                              {category.name}
                            </h5>

                            <p className="text-white-50 small mb-0">
                              Explore products
                            </p>
                          </div>

                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: "42px",
                              height: "42px",
                              backgroundColor:
                                "rgba(255,255,255,0.12)",
                              border:
                                "1px solid rgba(255,255,255,0.2)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <i className="bi bi-arrow-up-right text-white" />
                          </div>

                        </div>

                      </div>

                    </div>

                  </Link>

                </ScrollReveal>
              </div>
            ))}

          </div>
        )}

        {/* Empty */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-grid fs-1 text-white-50" />

            <p className="text-white-50 mt-3 mb-0">
              No categories available.
            </p>
          </div>
        )}

      </div>

      {/* Hover Animation */}
      <style>
        {`
          .category-card {
            cursor: pointer;
          }

          .category-card img {
            transform: scale(1);
          }

          .category-card:hover img {
            transform: scale(1.08);
          }

          .category-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at 50% 35%,
              rgba(255,255,255,0.15),
              transparent 60%
            );
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
          }

          .category-card:hover::after {
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
};

export default CategorySection;