import { useEffect, useMemo, useState } from "react";
import { getProducts, createProduct } from "../services/productService";
import type { Product } from "../types/Product";
import AddProductModal from "../components/AddProductModal";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
});

const [creating, setCreating] = useState(false);
const [createError, setCreateError] = useState("");

  // Get products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // create products
  const handleCreateProduct = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setCreating(true);
    setCreateError("");

    await createProduct({
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
    });

    // Products dobara load karo
    const data = await getProducts();
    setProducts(data);

    // Modal close
    setShowAddProduct(false);

    // Form reset
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
  } catch (error: any) {
    console.error("Create product error:", error);

    setCreateError(
      error.response?.data?.message ||
      "Failed to create product"
    );
  } finally {
    setCreating(false);
  }
};

  // Categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // Search + Category filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Loading
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#1f2428" }}
          role="status"
        ></div>

        <p className="text-muted mt-3 mb-0">
          Loading products...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-circle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">

      {/* ================= Header ================= */}
      <div className="products-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
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
            Products
          </h2>

          <p className="text-muted mb-0">
            Manage your products and inventory.
          </p>
        </div>

        <button
  type="button"
  className="btn btn-dark px-4"
  onClick={() => {
    setCreateError("");
    setShowAddProduct(true);
  }}
>
  <i className="bi bi-plus-lg me-2"></i>
  Add Product
</button>

      </div>

      {/* ================= Search + Filter ================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">

          <div className="row g-3">

            {/* Search */}
            <div className="products-search col-12 col-md-8">
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

      {/* ================= Product Count ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <span className="text-muted small">
          Showing {filteredProducts.length} of {products.length} products
        </span>

      </div>

      {/* ================= Products ================= */}
      <div className="row g-4">

        {filteredProducts.length === 0 ? (

          /* Empty State */
          <div className="col-12">

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">

                <div
                  className="product-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#f0f2f3",
                    color: "#1f2428",
                  }}
                >
                  <i className="bi bi-box-seam fs-4"></i>
                </div>

                <h5
                  className="fw-semibold"
                  style={{ color: "#1f2428" }}
                >
                  No products found
                </h5>

                <p className="text-muted mb-0">
                  Try changing your search or category filter.
                </p>

              </div>
            </div>

          </div>

        ) : (

          /* Product Cards */
          filteredProducts.map((product) => (

            <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
              key={product._id}
            >

              <div className="product-card card h-100 border-0 shadow-sm">

                <div className="card-body d-flex flex-column">

                  {/* Icon + Category */}
                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <div
                      className="product-icon rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "45px",
                        height: "45px",
                        backgroundColor: "#f0f2f3",
                        color: "#1f2428",
                      }}
                    >
                      <i className="bi bi-box-seam fs-5"></i>
                    </div>

                    <span className="badge text-bg-light">
                      {product.category}
                    </span>

                  </div>

                  {/* Product Name */}
                  <h5
                    className="fw-bold mb-2"
                    style={{ color: "#1f2428" }}
                  >
                    {product.name}
                  </h5>

                  {/* Description */}
                  <p className="text-muted small mb-3">
                    {product.description}
                  </p>

                  {/* Price */}
                  <h4
                    className="fw-bold mb-3"
                    style={{ color: "#1f2428" }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </h4>

                  {/* Stock */}
                  <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">

                    <span className="text-muted small">
                      Stock
                    </span>

                    {product.stock === 0 ? (
                      <span className="badge text-bg-danger">
                        Out of stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="badge text-bg-warning">
                        {product.stock} left
                      </span>
                    ) : (
                      <span className="badge text-bg-success">
                        {product.stock} units
                      </span>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 mt-3">

                    <button
                      type="button"
                      className="product-action btn btn-sm btn-outline-dark flex-grow-1"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="product-action btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))
        )}

      </div>

      <AddProductModal
  show={showAddProduct}
  creating={creating}
  createError={createError}
  formData={formData}
  setFormData={setFormData}
  onClose={() => setShowAddProduct(false)}
  onSubmit={handleCreateProduct}
/>

    </div>
  );
};

export default Products;