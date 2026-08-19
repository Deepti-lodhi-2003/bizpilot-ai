import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScrollReveal from "../components/customer/ScrollReveal";
import {
  getCategories,
  type Category,
} from "../services/categoryService";
import { getProducts } from "../services/productService";
import type { Product } from "../types/Product";

const CategoryProducts = () => {
  // URL:
  // /category/Electronics
  //
  // categoryName = "Electronics"
  const { categoryName } = useParams<{
    categoryName: string;
  }>();

  const [category, setCategory] =
    useState<Category | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [categories, allProducts] =
          await Promise.all([
            getCategories(),
            getProducts(),
          ]);

        console.log("CATEGORY NAME FROM URL:", categoryName);
        console.log("ALL CATEGORIES:", categories);
        console.log("ALL PRODUCTS:", allProducts);

        if (!categoryName) {
          setError("Category not found");
          return;
        }

        // Decode URL value
        const decodedCategoryName =
          decodeURIComponent(categoryName);

        console.log(
          "DECODED CATEGORY:",
          decodedCategoryName
        );

        // Find category by NAME
        const foundCategory = categories.find(
          (item) =>
            item.name.trim().toLowerCase() ===
            decodedCategoryName.trim().toLowerCase()
        );

        console.log(
          "FOUND CATEGORY:",
          foundCategory
        );

        if (!foundCategory) {
          setError("Category not found");
          return;
        }

        setCategory(foundCategory);

        /*
          IMPORTANT

          Product model:

          category: string

          Isliye product.category me category ka NAME
          store ho raha hai.

          Example:

          product.category = "Electronics"

          category.name = "Electronics"

          Dono ko compare karenge.
        */

        const categoryProducts = allProducts.filter(
          (product) => {
            if (!product.category) {
              return false;
            }

            const productCategory =
              String(product.category)
                .trim()
                .toLowerCase();

            const currentCategory =
              foundCategory.name
                .trim()
                .toLowerCase();

            console.log(
              "PRODUCT CATEGORY:",
              product.name,
              productCategory,
              "CURRENT CATEGORY:",
              currentCategory
            );

            return (
              productCategory === currentCategory
            );
          }
        );

        console.log(
          "CATEGORY PRODUCTS:",
          categoryProducts
        );

        setProducts(categoryProducts);
      } catch (err) {
        console.error(
          "Failed to load category products:",
          err
        );

        setError(
          "Failed to load category products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [categoryName]);

  /*
   * SEARCH + SORT
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue =
        search.toLowerCase().trim();

      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(searchValue) ||
          product.description
            ?.toLowerCase()
            .includes(searchValue)
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, search, sort]);

  /*
   * PRODUCT IMAGE
   */
  const getImage = (product: Product) => {
    return (
      product.image ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
    );
  };

  /*
   * LOADING
   */
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
            Loading category...
          </p>

        </div>
      </div>
    );
  }

  /*
   * ERROR
   */
  if (error || !category) {
    return (
      <section
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
                width: "85px",
                height: "85px",
                backgroundColor: "#292d31",
              }}
            >
              <i className="bi bi-grid fs-2 text-white-50" />
            </div>

            <h3 className="fw-bold">
              {error || "Category not found"}
            </h3>

            <p className="text-white-50">
              The category you're looking for is not available.
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

  return (
    <div
      className="category-products-page"
      style={{
        backgroundColor: "#17191b",
        color: "#fff",
        minHeight: "100vh",
      }}
    >

      {/* =========================
          BREADCRUMB
      ========================= */}

      <section
        className="category-breadcrumb"
        style={{
          paddingTop: "105px",
        }}
      >
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
                className="bi bi-chevron-right"
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
                className="bi bi-chevron-right"
                style={{ color: "#666" }}
              />

              <span className="fw-semibold text-white">
                {category.name}
              </span>

            </div>

          </ScrollReveal>

        </div>
      </section>

      {/* =========================
          CATEGORY HERO
      ========================= */}

      <section className="py-4 py-lg-5">
        <div className="container">

          <ScrollReveal>

            <div className="category-hero">

              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-hero-image"
                />
              ) : (
                <div className="category-hero-placeholder">
                  <i className="bi bi-grid-3x3-gap" />
                </div>
              )}

              <div className="category-hero-overlay" />

              <div className="category-hero-content">

                <span className="category-eyebrow">
                  SHOP CATEGORY
                </span>

                <h1>{category.name}</h1>

                <p>
                  Explore our collection of{" "}
                  <strong>{category.name}</strong>{" "}
                  products. Find something that fits
                  your style and needs.
                </p>

                <div className="d-flex align-items-center gap-2 flex-wrap">

                  <span className="category-product-count">
                    <i className="bi bi-box-seam me-2" />
                    {products.length} Products
                  </span>

                  <span className="category-available">
                    <span className="category-status-dot" />
                    Available Collection
                  </span>

                </div>

              </div>

            </div>

          </ScrollReveal>

        </div>
      </section>

      {/* =========================
          PRODUCTS SECTION
      ========================= */}

      <section className="pb-5">
        <div className="container pb-lg-5">

          {/* Heading + Filters */}

          <ScrollReveal>

            <div className="category-products-header">

              <div>

                <span className="category-section-label">
                  COLLECTION
                </span>

                <h2>
                  {category.name} Products
                </h2>

                <p>
                  Discover everything available in
                  this category.
                </p>

              </div>

              <div className="category-controls">

                {/* Search */}

                <div className="category-search">

                  <i className="bi bi-search" />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>

                {/* Sort */}

                <select
                  className="category-sort"
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                >
                  <option value="default">
                    Sort By
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="name">
                    Name
                  </option>

                </select>

              </div>

            </div>

          </ScrollReveal>

          {/* =========================
              PRODUCTS
          ========================= */}

          {filteredProducts.length > 0 ? (

            <div className="row g-4">

              {filteredProducts.map(
                (product, index) => {

                  const outOfStock =
                    product.stock <= 0;

                  return (
                    <div
                      className="col-12 col-sm-6 col-lg-4 col-xl-3"
                      key={product._id}
                    >

                      <ScrollReveal
                        delay={index * 70}
                      >

                        <div className="category-product-card">

                          {/* Image */}

                          <Link
                            to={`/products/${product._id}`}
                            className="text-decoration-none"
                          >

                            <div className="category-product-image">

                              <img
                                src={getImage(product)}
                                alt={product.name}
                              />

                              <div className="category-product-overlay">
                                <span>
                                  <i className="bi bi-eye me-2" />
                                  View Product
                                </span>
                              </div>

                              <span
                                className={`category-stock-badge ${
                                  outOfStock
                                    ? "out-stock"
                                    : ""
                                }`}
                              >
                                {outOfStock
                                  ? "Out of Stock"
                                  : "In Stock"}
                              </span>

                            </div>

                          </Link>

                          {/* Content */}

                          <div className="category-product-content">

                            <div className="d-flex justify-content-between align-items-center mb-2">

                              <span className="category-product-label">
                                {category.name}
                              </span>

                              {!outOfStock && (
                                <span className="category-available-small">
                                  <span />
                                  Available
                                </span>
                              )}

                            </div>

                            <Link
                              to={`/products/${product._id}`}
                              className="text-decoration-none"
                            >
                              <h4>
                                {product.name}
                              </h4>
                            </Link>

                            <p>
                              {product.description}
                            </p>

                            <div className="category-product-bottom">

                              <div>

                                <small>
                                  PRICE
                                </small>

                                <div className="category-product-price">
                                  ₹
                                  {product.price.toLocaleString(
                                    "en-IN"
                                  )}
                                </div>

                              </div>

                              <Link
                                to={`/products/${product._id}`}
                                className="category-product-arrow"
                              >
                                <i className="bi bi-arrow-up-right" />
                              </Link>

                            </div>

                          </div>

                        </div>

                      </ScrollReveal>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <ScrollReveal>

              <div className="category-empty">

                <div className="category-empty-icon">
                  <i className="bi bi-box-seam" />
                </div>

                <h4>
                  {search
                    ? "No products found"
                    : "No products in this category"}
                </h4>

                <p>
                  {search
                    ? "Try searching with a different product name."
                    : "There are currently no products available in this category."}
                </p>

                {search && (
                  <button
                    className="btn btn-light rounded-pill px-4"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    Clear Search
                  </button>
                )}

              </div>

            </ScrollReveal>

          )}

        </div>
      </section>

      {/* =========================
          STYLES
      ========================= */}

      <style>
        {`
          .category-hero {
            height: 430px;
            position: relative;
            overflow: hidden;
            border-radius: 28px;
            background: #292d31;
            border: 1px solid rgba(255,255,255,0.08);
          }

          .category-hero-image,
          .category-hero-placeholder {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .category-hero-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6rem;
            color: rgba(255,255,255,0.15);
            background: linear-gradient(
              135deg,
              #343a40,
              #151719
            );
          }

          .category-hero-overlay {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(
                90deg,
                rgba(0,0,0,0.9) 0%,
                rgba(0,0,0,0.62) 45%,
                rgba(0,0,0,0.12) 100%
              );
          }

          .category-hero-content {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            padding: 55px;
            max-width: 700px;
          }

          .category-eyebrow,
          .category-section-label {
            display: block;
            color: #aeb3b7;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 2px;
          }

          .category-hero-content h1 {
            font-size: clamp(2.5rem, 6vw, 4.8rem);
            font-weight: 800;
            line-height: 1;
            margin: 12px 0 18px;
            color: #fff;
          }

          .category-hero-content p {
            color: #c4c8cb;
            line-height: 1.7;
            margin-bottom: 22px;
            max-width: 580px;
          }

          .category-product-count,
          .category-available {
            display: inline-flex;
            align-items: center;
            padding: 9px 15px;
            border-radius: 999px;
            font-size: 0.82rem;
            color: #fff;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.16);
            backdrop-filter: blur(10px);
          }

          .category-status-dot,
          .category-available-small span {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #b9c0c5;
            display: inline-block;
            margin-right: 7px;
          }

          .category-products-header {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 25px;
            margin-bottom: 35px;
          }

          .category-products-header h2 {
            color: #fff;
            font-size: clamp(1.8rem, 3vw, 2.6rem);
            font-weight: 750;
            margin: 7px 0;
          }

          .category-products-header p {
            color: #8f969b;
            margin: 0;
          }

          .category-controls {
            display: flex;
            gap: 10px;
          }

          .category-search {
            width: 240px;
            height: 46px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 15px;
            background: #292d31;
            border: 1px solid #3b4045;
            border-radius: 12px;
          }

          .category-search i {
            color: #8f969b;
          }

          .category-search input {
            width: 100%;
            border: 0;
            outline: none;
            background: transparent;
            color: #fff;
          }

          .category-search input::placeholder {
            color: #777e83;
          }

          .category-sort {
            height: 46px;
            min-width: 165px;
            padding: 0 14px;
            color: #fff;
            background-color: #292d31;
            border: 1px solid #3b4045;
            border-radius: 12px;
            outline: none;
          }

          .category-sort option {
            background: #292d31;
            color: #fff;
          }

          .category-product-card {
            height: 100%;
            overflow: hidden;
            border-radius: 20px;
            background: #222629;
            border: 1px solid rgba(255,255,255,0.07);
            transition:
              transform 0.35s ease,
              border-color 0.35s ease,
              box-shadow 0.35s ease;
          }

          .category-product-card:hover {
            transform: translateY(-7px);
            border-color: rgba(255,255,255,0.18);
            box-shadow: 0 20px 45px rgba(0,0,0,0.28);
          }

          .category-product-image {
            height: 270px;
            position: relative;
            overflow: hidden;
            background: #292d31;
          }

          .category-product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.55s ease;
          }

          .category-product-card:hover
          .category-product-image img {
            transform: scale(1.07);
          }

          .category-product-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.38);
            opacity: 0;
            transition: opacity 0.35s ease;
          }

          .category-product-overlay span {
            color: #17191b;
            background: #fff;
            padding: 10px 17px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 600;
            transform: translateY(10px);
            transition: transform 0.35s ease;
          }

          .category-product-card:hover
          .category-product-overlay {
            opacity: 1;
          }

          .category-product-card:hover
          .category-product-overlay span {
            transform: translateY(0);
          }

          .category-stock-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            padding: 7px 12px;
            border-radius: 999px;
            background: #fff;
            color: #17191b;
            font-size: 0.72rem;
            font-weight: 700;
          }

          .category-stock-badge.out-stock {
            background: #dc3545;
            color: #fff;
          }

          .category-product-content {
            padding: 20px;
          }

          .category-product-label {
            color: #8f969b;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: 600;
          }

          .category-available-small {
            display: flex;
            align-items: center;
            color: #92999e;
            font-size: 0.7rem;
          }

          .category-product-content h4 {
            color: #fff;
            font-size: 1.1rem;
            font-weight: 700;
            margin: 8px 0;
            transition: color 0.25s ease;
          }

          .category-product-content h4:hover {
            color: #c7ccd0;
          }

          .category-product-content p {
            color: #858c91;
            font-size: 0.84rem;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 43px;
            margin-bottom: 18px;
          }

          .category-product-bottom {
            display: flex;
            align-items: end;
            justify-content: space-between;
            padding-top: 15px;
            border-top: 1px solid #363b3f;
          }

          .category-product-bottom small {
            display: block;
            color: #70777c;
            font-size: 0.65rem;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }

          .category-product-price {
            color: #fff;
            font-size: 1.25rem;
            font-weight: 750;
          }

          .category-product-arrow {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: #17191b;
            background: #fff;
            text-decoration: none;
            transition: transform 0.25s ease;
          }

          .category-product-arrow:hover {
            color: #17191b;
            transform: rotate(45deg);
          }

          .category-empty {
            padding: 80px 20px;
            text-align: center;
            border: 1px dashed #3c4145;
            border-radius: 22px;
            background: #202427;
          }

          .category-empty-icon {
            width: 75px;
            height: 75px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #292d31;
            color: #858c91;
            font-size: 1.8rem;
          }

          .category-empty h4 {
            color: #fff;
            font-weight: 700;
          }

          .category-empty p {
            color: #858c91;
            margin-bottom: 20px;
          }

          @media (max-width: 767px) {

            .category-hero {
              height: 430px;
              border-radius: 20px;
            }

            .category-hero-overlay {
              background:
                linear-gradient(
                  to top,
                  rgba(0,0,0,0.94),
                  rgba(0,0,0,0.15)
                );
            }

            .category-hero-content {
              padding: 28px;
            }

            .category-hero-content h1 {
              font-size: 2.7rem;
            }

            .category-products-header {
              align-items: stretch;
              flex-direction: column;
            }

            .category-controls {
              flex-direction: column;
            }

            .category-search {
              width: 100%;
            }

            .category-sort {
              width: 100%;
            }

            .category-product-image {
              height: 290px;
            }
          }

          @media (max-width: 480px) {

            .category-hero {
              height: 400px;
            }

            .category-hero-content {
              padding: 22px;
            }

            .category-hero-content h1 {
              font-size: 2.25rem;
            }

            .category-product-count,
            .category-available {
              font-size: 0.72rem;
            }
          }
        `}
      </style>

    </div>
  );
};

export default CategoryProducts;