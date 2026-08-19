import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import type { Product } from "../types/Product";
import ScrollReveal from "../components/customer/ScrollReveal";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const products = await getProducts();

        setAllProducts(products);

        const foundProduct = products.find(
          (item) => item._id === id
        );

        if (!foundProduct) {
          setError("Product not found");
          return;
        }

        setProduct(foundProduct);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // =========================
  // QUANTITY
  // =========================
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    try {
      setAddingToCart(true);
      setCartMessage("");

      // Add product
      await addToCart(product._id, quantity);

      // IMPORTANT:
      // Navbar ko cart update ka signal
      window.dispatchEvent(new Event("cartUpdated"));

      setCartMessage("Product added to cart successfully!");

      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("Failed to add product to cart:", error);

      if (error?.response?.status === 401) {
        setCartMessage("Please login to add products to cart.");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setCartMessage(
          error?.response?.data?.message ||
            "Failed to add product to cart"
        );
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#17191b",
          color: "#fff",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ color: "#fff" }}
            role="status"
          />

          <p className="text-white-50 mt-3 mb-0">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !product) {
    return (
      <section
        className="py-5"
        style={{
          minHeight: "100vh",
          backgroundColor: "#17191b",
          color: "#fff",
          paddingTop: "120px",
        }}
      >
        <div className="container py-5">
          <div className="text-center py-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#292d31",
              }}
            >
              <i className="bi bi-box-seam fs-2 text-white-50" />
            </div>

            <h3 className="fw-bold">
              {error || "Product not found"}
            </h3>

            <p className="text-white-50">
              The product you're looking for is not available.
            </p>

            <Link
              to="/shop"
              className="btn btn-light rounded-pill px-4 mt-2"
            >
              <i className="bi bi-arrow-left me-2" />
              Back to Shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // PRODUCT IMAGE
  // =========================
  const image =
    product.image ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85";

  const isOutOfStock = product.stock <= 0;

  // =========================
  // RELATED PRODUCTS
  // =========================
  const sameCategoryProducts = allProducts.filter(
    (item) =>
      item._id !== product._id &&
      item.category?.toLowerCase() ===
        product.category?.toLowerCase()
  );

  const otherProducts = allProducts.filter(
    (item) =>
      item._id !== product._id &&
      item.category?.toLowerCase() !==
        product.category?.toLowerCase()
  );

  const relatedProducts = [
    ...sameCategoryProducts,
    ...otherProducts,
  ].slice(0, 4);

  return (
    <div
      style={{
        backgroundColor: "#17191b",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          BREADCRUMB
      ========================= */}
      <section style={{ paddingTop: "100px" }}>
        <div className="container">
          <ScrollReveal>
            <div className="d-flex align-items-center gap-2 small flex-wrap">
              <Link
                to="/"
                className="text-decoration-none"
                style={{ color: "#9da3a8" }}
              >
                Home
              </Link>

              <i
                className="bi bi-chevron-right small"
                style={{ color: "#666" }}
              />

              <Link
                to="/shop"
                className="text-decoration-none"
                style={{ color: "#9da3a8" }}
              >
                Shop
              </Link>

              <i
                className="bi bi-chevron-right small"
                style={{ color: "#666" }}
              />

              <span
                className="fw-semibold text-truncate"
                style={{
                  color: "#fff",
                  maxWidth: "220px",
                }}
              >
                {product.name}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================
          MAIN PRODUCT
      ========================= */}
      <section className="py-4 py-lg-5">
        <div className="container py-lg-4">
          <div className="row g-4 g-lg-5 align-items-center">
            {/* IMAGE */}
            <div className="col-lg-6">
              <ScrollReveal>
                <div
                  className="rounded-4 overflow-hidden position-relative"
                  style={{
                    backgroundColor: "#292d31",
                    minHeight: "520px",
                  }}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="w-100 h-100"
                    style={{
                      minHeight: "520px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="position-absolute top-0 start-0 m-4">
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        isOutOfStock
                          ? "text-bg-danger"
                          : "text-bg-light"
                      }`}
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : "In Stock"}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* DETAILS */}
            <div className="col-lg-6">
              <ScrollReveal delay={150}>
                <div className="ps-lg-3">
                  {/* Category */}
                  <span
                    className="text-uppercase small fw-semibold"
                    style={{
                      color: "#9da3a8",
                      letterSpacing: "1.8px",
                    }}
                  >
                    {product.category}
                  </span>

                  {/* Name */}
                  <h1
                    className="display-5 fw-bold mt-2 mb-3"
                    style={{
                      color: "#fff",
                      lineHeight: 1.1,
                    }}
                  >
                    {product.name}
                  </h1>

                  {/* Price */}
                  <div className="mb-4">
                    <span
                      className="fw-bold"
                      style={{
                        fontSize: "2rem",
                        color: "#fff",
                      }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Description */}
                  <div
                    className="py-4 mb-4"
                    style={{
                      borderTop: "1px solid #3a3e42",
                      borderBottom: "1px solid #3a3e42",
                    }}
                  >
                    <h6 className="fw-bold mb-2 text-white">
                      Product Details
                    </h6>

                    <p
                      className="mb-0"
                      style={{
                        color: "#b8bdc2",
                        lineHeight: 1.8,
                      }}
                    >
                      {product.description}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <i className="bi bi-box-seam text-white-50" />

                    <span style={{ color: "#b8bdc2" }}>
                      {isOutOfStock
                        ? "Currently unavailable"
                        : `${product.stock} items available`}
                    </span>
                  </div>

                  {/* Quantity */}
                  {!isOutOfStock && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-white">
                        Quantity
                      </label>

                      <div
                        className="d-flex align-items-center border rounded-3 overflow-hidden"
                        style={{
                          width: "145px",
                          backgroundColor: "#292d31",
                          borderColor: "#444",
                        }}
                      >
                        <button
                          type="button"
                          className="btn border-0 rounded-0 text-white"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <i className="bi bi-dash" />
                        </button>

                        <div className="flex-grow-1 text-center fw-semibold text-white">
                          {quantity}
                        </div>

                        <button
                          type="button"
                          className="btn border-0 rounded-0 text-white"
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <i className="bi bi-plus" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MESSAGE */}
                  {cartMessage && (
                    <div
                      className={`alert ${
                        cartMessage.includes("successfully")
                          ? "alert-success"
                          : "alert-warning"
                      } py-2 px-3 mb-3`}
                      role="alert"
                    >
                      <i
                        className={`bi ${
                          cartMessage.includes("successfully")
                            ? "bi-check-circle"
                            : "bi-info-circle"
                        } me-2`}
                      />

                      {cartMessage}
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div className="d-flex flex-column flex-sm-row gap-3">
                    {/* ADD TO CART */}
                    <button
                      type="button"
                      className="btn btn-light btn-lg rounded-3 px-4 flex-grow-1"
                      disabled={
                        isOutOfStock || addingToCart
                      }
                      onClick={handleAddToCart}
                    >
                      {addingToCart ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />

                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart3 me-2" />

                          {isOutOfStock
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </>
                      )}
                    </button>

                    <Link
                      to="/shop"
                      className="btn btn-outline-light btn-lg rounded-3 px-4"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* FEATURES */}
                  <div className="row g-3 mt-4">
                    <div className="col-6">
                      <div className="d-flex gap-2">
                        <i className="bi bi-shield-check fs-5 text-white" />

                        <div>
                          <small className="fw-semibold d-block text-white">
                            Secure Shopping
                          </small>

                          <small style={{ color: "#9da3a8" }}>
                            Safe & reliable
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="d-flex gap-2">
                        <i className="bi bi-truck fs-5 text-white" />

                        <div>
                          <small className="fw-semibold d-block text-white">
                            Easy Delivery
                          </small>

                          <small style={{ color: "#9da3a8" }}>
                            Fast & simple
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          RELATED PRODUCTS
      ========================= */}
      {relatedProducts.length > 0 && (
        <section
          className="py-5"
          style={{
            backgroundColor: "#dcdcd8",
            color: "#17191b",
          }}
        >
          <div className="container py-lg-4">
            <ScrollReveal>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
                <div>
                  <span
                    className="text-uppercase small fw-semibold"
                    style={{
                      color: "#6f6f6b",
                      letterSpacing: "2px",
                    }}
                  >
                    More to explore
                  </span>

                  <h2
                    className="fw-bold mt-2 mb-2"
                    style={{
                      color: "#17191b",
                      fontSize: "2rem",
                    }}
                  >
                    You May Also Like
                  </h2>

                  <p
                    className="mb-0"
                    style={{ color: "#666662" }}
                  >
                    Discover more products you might love.
                  </p>
                </div>

                <Link
                  to="/shop"
                  className="btn btn-dark rounded-pill px-4 mt-4 mt-md-0"
                >
                  View All
                  <i className="bi bi-arrow-right ms-2" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="row g-4">
              {relatedProducts.map((item, index) => {
                const relatedImage =
                  item.image ||
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85";

                const relatedOutOfStock =
                  item.stock <= 0;

                return (
                  <div
                    className="col-12 col-sm-6 col-lg-3"
                    key={item._id}
                  >
                    <ScrollReveal delay={index * 100}>
                      <div className="related-product-card">
                        <Link
                          to={`/products/${item._id}`}
                          className="text-decoration-none"
                        >
                          <div className="related-product-image">
                            <img
                              src={relatedImage}
                              alt={item.name}
                              className="related-product-img"
                            />

                            <div className="related-image-overlay">
                              <span>
                                <i className="bi bi-eye me-2" />
                                Quick View
                              </span>
                            </div>

                            <span
                              className={`related-stock-badge ${
                                relatedOutOfStock
                                  ? "out-stock"
                                  : ""
                              }`}
                            >
                              {relatedOutOfStock
                                ? "Out of Stock"
                                : "In Stock"}
                            </span>
                          </div>
                        </Link>

                        <div className="related-product-content">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="related-product-category">
                              {item.category}
                            </span>

                            {!relatedOutOfStock && (
                              <span className="related-dot">
                                <span />
                                Available
                              </span>
                            )}
                          </div>

                          <Link
                            to={`/products/${item._id}`}
                            className="text-decoration-none"
                          >
                            <h5 className="related-product-title">
                              {item.name}
                            </h5>
                          </Link>

                          <div className="related-product-bottom">
                            <div>
                              <small className="related-price-label">
                                Price
                              </small>

                              <div className="related-product-price">
                                ₹
                                {item.price.toLocaleString(
                                  "en-IN"
                                )}
                              </div>
                            </div>

                            <Link
                              to={`/products/${item._id}`}
                              className="related-view-btn"
                            >
                              <i className="bi bi-arrow-up-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================
          BOTTOM CTA
      ========================= */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#eeeeea",
          color: "#17191b",
          borderTop: "1px solid #d8d8d4",
        }}
      >
        <div className="container py-3">
          <ScrollReveal>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span
                  className="small text-uppercase"
                  style={{
                    color: "#70706c",
                    letterSpacing: "1.5px",
                  }}
                >
                  BizPilot Shopping
                </span>

                <h3
                  className="fw-bold mt-2 mb-2"
                  style={{ color: "#17191b" }}
                >
                  Simple shopping, thoughtfully designed.
                </h3>

                <p
                  className="mb-lg-0"
                  style={{ color: "#666662" }}
                >
                  Discover products, manage your cart and
                  keep track of your orders in one place.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <Link
                  to="/shop"
                  className="btn btn-dark rounded-pill px-4"
                >
                  Explore More
                  <i className="bi bi-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;