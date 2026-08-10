import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/Product";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        setError("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // Search + Category filter
  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Inventory statistics
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  ).length;

  // Loading
  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#1f2428" }}
          role="status"
        ></div>

        <p className="text-muted mt-3 mb-0">
          Loading inventory...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* ================= Header ================= */}
      <div className="mb-4">
        <div
          className="text-uppercase fw-semibold small text-secondary mb-1"
          style={{ letterSpacing: "1.5px" }}
        >
          Inventory
        </div>

        <h2
          className="fw-bold mb-1"
          style={{ color: "#1f2428" }}
        >
          Inventory Management
        </h2>

        <p className="text-muted mb-0">
          Monitor your product stock and inventory levels.
        </p>
      </div>

      {/* ================= Stats ================= */}
      <div className="row g-4 mb-4">

        {/* Total Products */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    Total Products
                  </p>

                  <h3 className="fw-bold mb-0">
                    {totalProducts}
                  </h3>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#f0f2f3",
                    color: "#1f2428",
                  }}
                >
                  <i className="bi bi-box-seam fs-4"></i>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Total Stock */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    Total Stock
                  </p>

                  <h3 className="fw-bold mb-0">
                    {totalStock.toLocaleString("en-IN")}
                  </h3>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#f0f2f3",
                    color: "#1f2428",
                  }}
                >
                  <i className="bi bi-stack fs-4"></i>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    Low Stock
                  </p>

                  <h3 className="fw-bold mb-0">
                    {lowStockProducts}
                  </h3>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                  }}
                >
                  <i className="bi bi-exclamation-triangle fs-4"></i>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    Out of Stock
                  </p>

                  <h3 className="fw-bold mb-0">
                    {outOfStockProducts}
                  </h3>
                </div>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#f8d7da",
                    color: "#842029",
                  }}
                >
                  <i className="bi bi-x-circle fs-4"></i>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ================= Search + Filter ================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">

          <div className="row g-3">

            {/* Search */}
            <div className="col-12 col-md-8">
              <div className="input-group">

                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}

              </div>
            </div>

            {/* Category */}
            <div className="col-12 col-md-4">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* ================= Count ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">
          Showing {filteredProducts.length} of{" "}
          {products.length} products
        </span>
      </div>

      {/* ================= Inventory Table ================= */}
      <div className="card border-0 shadow-sm">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-5"
                  >
                    <i className="bi bi-box-seam fs-2 text-muted"></i>

                    <p className="text-muted mt-2 mb-0">
                      No products found.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id}>

                    {/* Product */}
                    <td className="px-4">
                      <div className="d-flex align-items-center gap-3">

                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: "42px",
                            height: "42px",
                            backgroundColor: "#f0f2f3",
                            color: "#1f2428",
                          }}
                        >
                          <i className="bi bi-box-seam"></i>
                        </div>

                        <div>
                          <div className="fw-semibold">
                            {product.name}
                          </div>

                          <div className="text-muted small">
                            {product.description}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge text-bg-light">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="fw-semibold">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    {/* Stock */}
                    <td>
                      <span className="fw-semibold">
                        {product.stock}
                      </span>
                      <span className="text-muted small ms-1">
                        units
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      {product.stock === 0 ? (
                        <span className="badge text-bg-danger">
                          Out of stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="badge text-bg-warning">
                          Low stock
                        </span>
                      ) : (
                        <span className="badge text-bg-success">
                          In stock
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default Inventory;