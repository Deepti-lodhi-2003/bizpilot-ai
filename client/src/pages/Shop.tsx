import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { Product } from "../types/Product";
import ScrollReveal from "../components/customer/ScrollReveal";

const floatingIcons = [
  { icon: "bi-bag-fill", top: "12%", left: "8%", size: 20, duration: 7, delay: 0 },
  { icon: "bi-flower1", top: "74%", left: "15%", size: 17, duration: 9, delay: 1.2 },
  { icon: "bi-gem", top: "18%", left: "87%", size: 19, duration: 8, delay: 0.5 },
  { icon: "bi-tree-fill", top: "80%", left: "63%", size: 19, duration: 11, delay: 1.5 },
  { icon: "bi-box-seam-fill", top: "14%", left: "46%", size: 17, duration: 8.5, delay: 0.3 },
  { icon: "bi-stars", top: "58%", left: "32%", size: 16, duration: 7.5, delay: 1.8 },
  { icon: "bi-tag-fill", top: "36%", left: "94%", size: 16, duration: 9.5, delay: 0.9 },
  { icon: "bi-heart-fill", top: "48%", left: "4%", size: 15, duration: 10, delay: 2.1 },
  { icon: "bi-lightning-charge-fill", top: "8%", left: "65%", size: 16, duration: 8.8, delay: 0.6 },
  { icon: "bi-basket-fill", top: "88%", left: "88%", size: 17, duration: 9.2, delay: 1.6 },
];

const floatingBubbles = [
  { top: "8%", left: "24%", size: 12, duration: 6, delay: 0.2 },
  { top: "64%", left: "5%", size: 20, duration: 8, delay: 0.6 },
  { top: "28%", left: "58%", size: 10, duration: 5.5, delay: 1 },
  { top: "50%", left: "80%", size: 16, duration: 7, delay: 1.4 },
  { top: "86%", left: "42%", size: 11, duration: 6.5, delay: 0.8 },
  { top: "40%", left: "16%", size: 8, duration: 5, delay: 1.8 },
  { top: "16%", left: "98%", size: 13, duration: 7.5, delay: 0.4 },
  { top: "70%", left: "70%", size: 9, duration: 6.2, delay: 1.2 },
];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Fetch Products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error: any) {
        console.error("Failed to load products:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Categories from backend products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  // Search + Filter + Sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchText = search.toLowerCase().trim();

    if (searchText) {
      result = result.filter((product) =>
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    sortBy,
  ]);

  return (
    <div className="shop-page">

      {/* ================= HERO ================= */}
      <section
        className="shop-hero position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #101214 0%, #1d2328 55%, #343a40 100%)",
          color: "#fff",
        }}
      >
        <div className="shop-hero-glow shop-hero-glow-1" />
        <div className="shop-hero-glow shop-hero-glow-2" />

        {/* Floating decorative layer — bubbles, leaves, product icons */}
        <div className="shop-float-layer position-absolute top-0 start-0 w-100 h-100">
          {floatingBubbles.map((b, i) => (
            <span
              key={`bubble-${i}`}
              className="shop-bubble"
              style={{
                top: b.top,
                left: b.left,
                width: b.size,
                height: b.size,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}

          {floatingIcons.map((f, i) => (
            <span
              key={`icon-${i}`}
              className="shop-float-icon"
              style={{
                top: f.top,
                left: f.left,
                fontSize: f.size,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
              }}
            >
              <i className={`bi ${f.icon} shop-float-icon-glyph`} />
            </span>
          ))}
        </div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">

            <div className="col-lg-7">
              <ScrollReveal>
                <span
                  className="text-uppercase small fw-semibold"
                  style={{
                    color: "#adb5bd",
                    letterSpacing: "2px",
                  }}
                >
                  BIZPILOT COLLECTION
                </span>

                <h1
                  className="display-4 fw-bold mt-3 mb-3"
                  style={{
                    lineHeight: "1.1",
                  }}
                >
                  Discover products
                  <br />
                  <span className="text-secondary">
                    made for you.
                  </span>
                </h1>

                <p
                  className="lead mb-0"
                  style={{
                    color: "#adb5bd",
                    maxWidth: "600px",
                  }}
                >
                  Explore our collection of quality
                  products designed for modern living.
                </p>
              </ScrollReveal>
            </div>

            <div className="col-lg-5 mt-4 mt-lg-0">
              <ScrollReveal delay={150}>
                <div
                  className="rounded-4 overflow-hidden shop-hero-image"
                  style={{
                    height: "300px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background:
                      "linear-gradient(135deg, #343a40, #111315)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85"
                    alt="Shopping collection"
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      opacity: 0.7,
                    }}
                  />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FILTER AREA ================= */}
      <section
        className="py-4 shop-filter-bar"
        style={{
          backgroundColor: "#f5f6f7",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <div className="container">

          <ScrollReveal>
            <div className="row g-3 align-items-center">

              {/* Search */}
              <div className="col-12 col-lg-6">
                <div className="input-group shop-search">

                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted" />
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                  {search && (
                    <button
                      type="button"
                      className="btn btn-white border"
                      onClick={() => setSearch("")}
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  )}

                </div>
              </div>

              {/* Sort */}
              <div className="col-12 col-lg-6">
                <select
                  className="form-select shop-sort"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >
                  <option value="default">
                    Sort Products
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="name">
                    Name: A to Z
                  </option>
                </select>
              </div>

              {/* Categories — its own full-width row so it always has room to breathe */}
              <div className="col-12">
                <div className="shop-category-scroll">
                  <div
                    className="d-flex gap-2 flex-nowrap"
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={`btn rounded-pill text-nowrap flex-shrink-0 shop-cat-btn ${
                          selectedCategory === category
                            ? "btn-dark"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <div className="container py-lg-4">

          {/* Heading */}
          <ScrollReveal>
            <div className="d-flex justify-content-between align-items-end mb-4">

              <div>
                <span
                  className="text-uppercase small fw-semibold text-muted"
                  style={{
                    letterSpacing: "1.5px",
                  }}
                >
                  Our Products
                </span>

                <h2
                  className="fw-bold mt-2 mb-1"
                  style={{
                    color: "#1f2428",
                  }}
                >
                  Shop the collection
                </h2>

                <p className="text-muted mb-0">
                  Showing{" "}
                  <strong>
                    {filteredProducts.length}
                  </strong>{" "}
                  products
                </p>
              </div>

              {selectedCategory !== "All" && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark rounded-pill shop-clear-btn"
                  onClick={() =>
                    setSelectedCategory("All")
                  }
                >
                  Clear filter
                </button>
              )}

            </div>
          </ScrollReveal>

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#1f2428",
                }}
                role="status"
              />

              <p className="text-muted mt-3 mb-0">
                Loading products...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-circle me-2" />
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="text-center py-5">

                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f1f3f5",
                  }}
                >
                  <i className="bi bi-search fs-2 text-secondary" />
                </div>

                <h4 className="fw-bold mt-4">
                  No products found
                </h4>

                <p className="text-muted">
                  Try another search or category.
                </p>

                <button
                  type="button"
                  className="btn btn-dark rounded-pill px-4"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Reset filters
                </button>

              </div>
            )}

          {/* Product Grid */}
          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="row g-4">

                {filteredProducts.map(
                  (product, index) => (
                    <div
                      className="col-12 col-sm-6 col-lg-4 col-xl-3"
                      key={product._id}
                    >
                      <ScrollReveal
                        delay={index * 70}
                      >
                        <div
                          className="product-card h-100 overflow-hidden rounded-4"
                          style={{
                            backgroundColor:
                              "#ffffff",
                            border:
                              "1px solid #e9ecef",
                          }}
                        >

                          {/* Image */}
                          <div
                            className="product-image-wrapper position-relative"
                            style={{
                              height: "200px",
                              backgroundColor:
                                "#f1f3f5",
                              overflow: "hidden",
                            }}
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-image w-100 h-100"
                                style={{
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <i className="bi bi-image fs-1 text-secondary" />
                              </div>
                            )}

                            {/* Category Badge */}
                            <span
                              className="position-absolute top-0 start-0 m-3 badge rounded-pill"
                              style={{
                                backgroundColor:
                                  "rgba(31,36,40,0.9)",
                              }}
                            >
                              {product.category}
                            </span>

                            {/* Stock */}
                            {product.stock === 0 && (
                              <span
                                className="position-absolute bottom-0 start-0 m-3 badge text-bg-danger rounded-pill"
                              >
                                Out of Stock
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-3">

                            <small
                              className="text-muted"
                              style={{
                                display:
                                  "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient:
                                  "vertical",
                                overflow: "hidden",
                                minHeight: "36px",
                              }}
                            >
                              {product.description}
                            </small>

                            <h5
                              className="fw-bold mt-2 mb-0"
                              style={{
                                color: "#1f2428",
                                fontSize: "1.02rem",
                              }}
                            >
                              {product.name}
                            </h5>

                            <div className="d-flex align-items-center justify-content-between mt-3">

                              <span
                                className="fw-bold fs-5"
                                style={{
                                  color: "#1f2428",
                                }}
                              >
                                ₹
                                {Number(
                                  product.price
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                             <NavLink
  to={`/shop/${product._id}`}
  className={`btn rounded-3 px-3 shop-view-btn ${
    product.stock === 0
      ? "btn-secondary disabled"
      : "btn-dark"
  }`}
>
  View
  <i className="bi bi-arrow-right ms-2" />
</NavLink>
                            </div>
                          </div>

                        </div>
                      </ScrollReveal>
                    </div>
                  )
                )}

              </div>
            )}

        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      {!loading && products.length > 0 && (
        <section
          className="py-5"
          style={{
            backgroundColor: "#101214",
            color: "#fff",
          }}
        >
          <div className="container py-4">

            <ScrollReveal>
              <div className="row align-items-center">

                <div className="col-lg-8">
                  <span
                    className="text-uppercase small fw-semibold"
                    style={{
                      color: "#858b91",
                      letterSpacing: "1.5px",
                    }}
                  >
                    BizPilot
                  </span>

                  <h3 className="fw-bold mt-2 mb-2">
                    Find something you love?
                  </h3>

                  <p
                    className="mb-0"
                    style={{
                      color: "#858b91",
                    }}
                  >
                    Add it to your cart and enjoy a
                    smooth shopping experience.
                  </p>
                </div>

                <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                  <NavLink
                    to="/cart"
                    className="btn btn-light rounded-pill px-4 py-2 shop-cart-cta"
                  >
                    <i className="bi bi-cart3 me-2" />
                    View Cart
                  </NavLink>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </section>
      )}

      {/* Page CSS */}
      <style>
        {`
          /* ---------- hero ---------- */

          .shop-hero {
            padding-top: 140px;
            padding-bottom: 64px;
          }

          @media (max-width: 991px) {
            .shop-hero {
              padding-top: 120px;
              padding-bottom: 48px;
            }
          }

          .shop-hero-glow {
            position: absolute;
            border-radius: 50%;
            filter: blur(110px);
            opacity: 0.28;
            pointer-events: none;
            z-index: 0;
          }
          .shop-hero-glow-1 {
            width: 460px;
            height: 460px;
            background: #5a82c2;
            top: -160px;
            right: -100px;
          }
          .shop-hero-glow-2 {
            width: 360px;
            height: 360px;
            background: #8a929a;
            bottom: -160px;
            left: -80px;
          }

          .shop-hero-image img {
            transition: transform 8s ease;
          }
          .shop-hero-image:hover img {
            transform: scale(1.08);
          }

          /* ---------- floating decorative layer ---------- */

          .shop-float-layer {
            pointer-events: none;
            z-index: 0;
          }

          .shop-bubble {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04) 70%);
            border: 1px solid rgba(255, 255, 255, 0.22);
            box-shadow: 0 0 18px rgba(255, 255, 255, 0.08);
            animation-name: shopBubbleFloat;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }

          .shop-float-icon {
            position: absolute;
            width: 2.6em;
            height: 2.6em;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(3px);
            animation-name: shopIconFloat;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }

          .shop-float-icon-glyph {
            color: rgba(255, 255, 255, 0.42);
            font-size: 0.62em;
          }

          @keyframes shopBubbleFloat {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
            50% { transform: translate(8px, -26px) scale(1.1); opacity: 1; }
          }

          @keyframes shopIconFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-10px, -20px) rotate(10deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .shop-bubble,
            .shop-float-icon {
              animation: none;
            }
          }

          /* ---------- filter bar ---------- */

          .shop-search .form-control {
            transition: box-shadow 0.25s ease, border-color 0.25s ease;
          }
          .shop-search .form-control:focus {
            box-shadow: 0 0 0 3px rgba(31, 36, 40, 0.08);
          }

          .shop-sort {
            transition: box-shadow 0.25s ease, border-color 0.25s ease;
          }
          .shop-sort:focus {
            box-shadow: 0 0 0 3px rgba(31, 36, 40, 0.08);
          }

          /* horizontally scrollable, with a fade at both edges so it always
             signals "there's more" no matter how many categories exist */
          .shop-category-scroll {
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            padding: 2px 4px 10px;
            margin: -2px -4px -8px;
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 20px,
              black calc(100% - 20px),
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 20px,
              black calc(100% - 20px),
              transparent 100%
            );
          }
          .shop-category-scroll::-webkit-scrollbar {
            display: none;
          }
          .shop-category-scroll > div {
            padding: 0 20px;
          }

          .shop-cat-btn {
            transition: background-color 0.25s ease, color 0.25s ease,
              border-color 0.25s ease, transform 0.2s ease;
          }
          .shop-cat-btn:hover {
            transform: translateY(-2px);
          }

          .shop-clear-btn {
            transition: transform 0.2s ease, background-color 0.25s ease, color 0.25s ease;
          }
          .shop-clear-btn:hover {
            transform: translateY(-2px);
          }

          /* ---------- product cards ---------- */

          .product-card {
            transition:
              transform 0.35s ease,
              box-shadow 0.35s ease,
              border-color 0.35s ease;
          }

          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
            border-color: #ced4da !important;
          }

          .product-image {
            transition: transform 0.6s ease;
          }

          .product-card:hover .product-image {
            transform: scale(1.06);
          }

          .shop-view-btn {
            transition: transform 0.2s ease, box-shadow 0.25s ease;
          }
          .shop-view-btn:hover:not(.disabled) {
            transform: translateX(2px);
          }

          .shop-cart-cta {
            transition: transform 0.2s ease, box-shadow 0.25s ease;
          }
          .shop-cart-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px -12px rgba(255, 255, 255, 0.35);
          }

          @media (prefers-reduced-motion: reduce) {
            .product-card,
            .product-image,
            .shop-cat-btn,
            .shop-clear-btn,
            .shop-view-btn,
            .shop-cart-cta,
            .shop-hero-image img {
              transition: none;
            }

            .product-card:hover,
            .product-card:hover .product-image,
            .shop-cat-btn:hover,
            .shop-clear-btn:hover,
            .shop-view-btn:hover,
            .shop-cart-cta:hover,
            .shop-hero-image:hover img {
              transform: none;
            }
          }
        `}
      </style>

    </div>
  );
};

export default Shop;