import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/Product";
import ScrollReveal from "./ScrollReveal";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();

        console.log("Featured products:", data);

        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#101214",
        color: "#fff",
      }}
    >
      <div className="container py-4">

        {/* Heading */}
        <ScrollReveal>
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
              className="btn btn-outline-light rounded-pill px-4"
            >
              View all
              <i className="bi bi-arrow-up-right ms-2" />
            </NavLink>
          </div>
        </ScrollReveal>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border text-light"
              role="status"
            />
            <p className="text-secondary mt-3">
              Loading products...
            </p>
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-box-seam fs-1 text-secondary" />

            <h5 className="mt-3">
              No products available
            </h5>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="row g-4">
            {products.map((product, index) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={product._id}
              >
                <ScrollReveal delay={index * 100}>
                  <div
                    className="rounded-4 overflow-hidden h-100 featured-product-card"
                    style={{
                      backgroundColor: "#181c20",
                      border: "1px solid #292e33",
                    }}
                  >

                    {/* Image */}
                    <Link
                      to={`/shop/${product._id}`}
                      className="text-decoration-none"
                    >
                      <div className="featured-product-image">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="featured-product-img"
                        />

                        {/* Image Overlay */}
                        <div className="featured-image-overlay">
                          <span>
                            <i className="bi bi-eye me-2" />
                            Quick View
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-4">

                      <small
                        style={{
                          color: "#858b91",
                        }}
                      >
                        {product.category}
                      </small>

                      <h5 className="fw-semibold mt-2 mb-0">
                        {product.name}
                      </h5>

                      <div className="d-flex justify-content-between align-items-center mt-3">

                        <span className="fw-bold fs-5">
                          ₹
                          {Number(product.price).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <NavLink
                          to={`/shop/${product._id}`}
                          className="btn btn-light btn-sm rounded-3"
                        >
                          View
                          <i className="bi bi-arrow-right ms-1" />
                        </NavLink>

                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>
        {`
          .featured-product-card {
            transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          }
          .featured-product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.6);
            border-color: #3a4046 !important;
          }

          .featured-product-image {
            position: relative;
            height: 280px;
            overflow: hidden;
            background-color: #22272b;
          }

          .featured-product-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .featured-product-card:hover .featured-product-img {
            transform: scale(1.08);
          }

          .featured-image-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.75) 0%,
              rgba(0, 0, 0, 0.25) 55%,
              rgba(0, 0, 0, 0.1) 100%
            );
            opacity: 0;
            transition: opacity 0.35s ease;
          }

          .featured-image-overlay span {
            display: inline-flex;
            align-items: center;
            color: #fff;
            font-weight: 600;
            font-size: 0.85rem;
            letter-spacing: 0.03em;
            padding: 10px 20px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(10px);
            transition: transform 0.35s ease;
          }

          .featured-product-card:hover .featured-image-overlay {
            opacity: 1;
          }
          .featured-product-card:hover .featured-image-overlay span {
            transform: translateY(0);
          }

          @media (prefers-reduced-motion: reduce) {
            .featured-product-card,
            .featured-product-img,
            .featured-image-overlay,
            .featured-image-overlay span {
              transition: none;
            }
            .featured-product-card:hover {
              transform: none;
            }
            .featured-product-card:hover .featured-product-img {
              transform: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default FeaturedProducts;