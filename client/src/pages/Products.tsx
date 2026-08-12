import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import EditProductModal from "../components/EditProductModal";
import type { Product } from "../types/Product";
import AddProductModal from "../components/AddProductModal";
import DeleteProductModal from "../components/DeleteProductModal";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] =
    useState<Product | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    image: formData.image,
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
        image:"",
        
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

  // edit
   // edit
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
});

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);

    setEditFormData({
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category,
    image: product.image || "",
});

    setUpdateError("");
    setShowEditProduct(true);
  };

  const handleUpdateProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      setUpdating(true);
      setUpdateError("");

      await updateProduct(editingProduct._id, {
    name: editFormData.name,
    description: editFormData.description,
    price: Number(editFormData.price),
    stock: Number(editFormData.stock),
    category: editFormData.category,
    image: editFormData.image,
});

      const data = await getProducts();
      setProducts(data);

      setShowEditProduct(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Update product error:", error);

      setUpdateError(
        error.response?.data?.message ||
        "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  };

  // delete
  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setDeleteError("");
    setShowDeleteProduct(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteProduct(deletingProduct._id);

      const data = await getProducts();
      setProducts(data);

      setShowDeleteProduct(false);
      setDeletingProduct(null);

    } catch (error: any) {
      console.error("Delete product error:", error);

      setDeleteError(
        error.response?.data?.message ||
        "Failed to delete product"
      );
    } finally {
      setDeleting(false);
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
          {/* <div
            className="text-uppercase fw-semibold small text-secondary mb-1"
            style={{ letterSpacing: "1.5px" }}
          >
            Inventory
          </div> */}

          <h2
            className="fw-bold mb-1"
            style={{ color: "#1f2428" }}
          >
            Products
          </h2>

          {/* <p className="text-muted mb-0">
            Manage your products and inventory.
          </p> */}
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

            <div className="card border-0 shadow-md">
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
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
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

      <EditProductModal
        show={showEditProduct}
        updating={updating}
        updateError={updateError}
        formData={editFormData}
        setFormData={setEditFormData}
        onClose={() => {
          setShowEditProduct(false);
          setEditingProduct(null);
        }}
        onSubmit={handleUpdateProduct}
      />

      <DeleteProductModal
        show={showDeleteProduct}
        product={deletingProduct}
        deleting={deleting}
        deleteError={deleteError}
        onClose={() => {
          setShowDeleteProduct(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default Products;