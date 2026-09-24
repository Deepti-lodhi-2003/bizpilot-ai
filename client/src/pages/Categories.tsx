import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CategoryFormData,
} from "../services/categoryService";

const sampleImages = [
  {
    label: "Electronics",
    url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Fashion / Apparel",
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Footwear",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Home & Living",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Beauty & Personal Care",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Sports & Fitness",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "products-high" | "products-low" | "newest">("products-high");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filter & Sort
  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase().trim();

    const result = categories.filter((cat) => {
      const name = cat.name.toLowerCase();
      const desc = (cat.description || "").toLowerCase();
      return name.includes(query) || desc.includes(query);
    });

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "products-high") {
        return (b.productCount || 0) - (a.productCount || 0);
      }
      if (sortBy === "products-low") {
        return (a.productCount || 0) - (b.productCount || 0);
      }
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [categories, search, sortBy]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalProducts = categories.reduce(
      (acc, c) => acc + (c.productCount || 0),
      0
    );
    const withImages = categories.filter((c) => Boolean(c.image?.trim())).length;
    const topCategory = [...categories].sort(
      (a, b) => (b.productCount || 0) - (a.productCount || 0)
    )[0];

    return {
      totalCategories,
      totalProducts,
      withImages,
      topCategoryName: topCategory?.name || "None",
      topCategoryCount: topCategory?.productCount || 0,
    };
  }, [categories]);

  // Handlers
  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedCategory(null);
    setFormData({ name: "", description: "", image: "" });
    setFormError("");
    setShowModal(true);
  };

  const handleOpenEdit = (category: Category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Category name is required");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Description is required");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (modalMode === "add") {
        await createCategory(formData);
      } else if (selectedCategory) {
        await updateCategory(selectedCategory._id, formData);
      }

      await loadCategories();
      setShowModal(false);
    } catch (err: any) {
      console.error("Save category error:", err);
      setFormError(
        err?.response?.data?.message || "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      setDeleteError("");
      await deleteCategory(categoryToDelete._id);
      await loadCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      console.error("Delete category error:", err);
      setDeleteError(
        err?.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#1f2428" }}
          role="status"
        />
        <p className="text-muted mt-3 mb-0">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "#1f2428" }}>
            Category Management
          </h2>
          <p className="text-muted mb-0">
            Organize products into customer-facing categories with custom images & descriptions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-dark px-4 d-inline-flex align-items-center"
          onClick={handleOpenAdd}
        >
          <i className="bi bi-plus-lg me-2" />
          Add Category
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Categories
                </span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: "#1f2428" }}>
                  {stats.totalCategories}
                </h3>
              </div>
              <div
                className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#f0f4f8", color: "#1f2428" }}
              >
                <i className="bi bi-tags fs-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Products
                </span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: "#1f2428" }}>
                  {stats.totalProducts}
                </h3>
              </div>
              <div
                className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#f0f4f8", color: "#1f2428" }}
              >
                <i className="bi bi-box-seam fs-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Top Category
                </span>
                <h5 className="fw-bold mt-1 mb-0 text-truncate" style={{ color: "#1f2428", maxWidth: "160px" }}>
                  {stats.topCategoryName}
                </h5>
                <small className="text-muted">{stats.topCategoryCount} products</small>
              </div>
              <div
                className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#f0f4f8", color: "#1f2428" }}
              >
                <i className="bi bi-graph-up-arrow fs-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Visual Coverage
                </span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: "#1f2428" }}>
                  {stats.withImages} / {stats.totalCategories}
                </h3>
                <small className="text-muted">with custom images</small>
              </div>
              <div
                className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#f0f4f8", color: "#1f2428" }}
              >
                <i className="bi bi-image fs-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <i className="bi bi-exclamation-circle me-2" />
          {error}
        </div>
      )}

      {/* Filters & Controls */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-6 col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search categories by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSearch("")}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="col-8 col-md-4 col-lg-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="products-high">Most Products</option>
                <option value="products-low">Fewest Products</option>
                <option value="name">Name (A-Z)</option>
                <option value="newest">Recently Created</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="col-4 col-md-2 col-lg-2 text-end">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "grid" ? "btn-dark" : "btn-outline-secondary"
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <i className="bi bi-grid-fill" />
                </button>
                <button
                  type="button"
                  className={`btn ${
                    viewMode === "table" ? "btn-dark" : "btn-outline-secondary"
                  }`}
                  onClick={() => setViewMode("table")}
                  title="Table View"
                >
                  <i className="bi bi-list-ul" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Content */}
      {filteredCategories.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#f0f2f3",
                color: "#1f2428",
              }}
            >
              <i className="bi bi-tags fs-4" />
            </div>
            <h5 className="fw-semibold" style={{ color: "#1f2428" }}>
              No categories found
            </h5>
            <p className="text-muted mb-3">
              {search
                ? "No categories match your search term."
                : "Create your first category to start organizing your catalog."}
            </p>
            {search ? (
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-dark"
                onClick={handleOpenAdd}
              >
                <i className="bi bi-plus-lg me-2" />
                Add Category
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="row g-4">
          {filteredCategories.map((category) => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={category._id}>
              <div className="card border-0 shadow-sm h-100 overflow-hidden category-card-admin">
                {/* Image / Header */}
                <div
                  className="position-relative"
                  style={{
                    height: "160px",
                    backgroundColor: "#212529",
                    overflow: "hidden",
                  }}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        background: "linear-gradient(135deg, #343a40, #151719)",
                      }}
                    >
                      <i className="bi bi-grid-3x3-gap fs-1 text-white-50" />
                    </div>
                  )}

                  {/* Dark gradient overlay */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%)",
                    }}
                  />

                  {/* Product Count Badge */}
                  <span
                    className="position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#1f2428",
                      fontWeight: 600,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="bi bi-box-seam me-1" />
                    {category.productCount || 0} Products
                  </span>

                  {/* Category Name overlay */}
                  <div className="position-absolute bottom-0 start-0 p-3 text-white">
                    <h5 className="fw-bold mb-0 text-shadow">{category.name}</h5>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-3 d-flex flex-column justify-content-between">
                  <p
                    className="text-muted small mb-3"
                    style={{
                      minHeight: "38px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {category.description || "No description provided."}
                  </p>

                  <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                    <Link
                      to={`/category/${encodeURIComponent(category.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      title="View category in customer storefront"
                    >
                      <i className="bi bi-eye me-1" />
                      Shop Page
                    </Link>

                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-light text-dark rounded-circle"
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        onClick={() => handleOpenEdit(category)}
                        title="Edit Category"
                      >
                        <i className="bi bi-pencil" />
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-light text-danger rounded-circle"
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        onClick={() => handleOpenDelete(category)}
                        title="Delete Category"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: "220px" }}>Category</th>
                  <th style={{ minWidth: "280px" }}>Description</th>
                  <th style={{ minWidth: "140px" }} className="text-center">Products</th>
                  <th style={{ minWidth: "150px" }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-3 overflow-hidden flex-shrink-0"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#f0f2f3",
                          }}
                        >
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                              <i className="bi bi-tags" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="fw-semibold d-block text-dark">
                            {category.name}
                          </span>
                          <small className="text-muted">
                            {category.createdAt
                              ? new Date(category.createdAt).toLocaleDateString()
                              : ""}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted small">
                        {category.description || "—"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                        <i className="bi bi-box-seam me-1 text-secondary" />
                        {category.productCount || 0}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-flex gap-2">
                        <Link
                          to={`/category/${encodeURIComponent(category.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary"
                          title="View on Storefront"
                        >
                          <i className="bi bi-eye" />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenEdit(category)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleOpenDelete(category)}
                          title="Delete"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT CATEGORY MODAL */}
      {/* ========================================================================= */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => !saving && setShowModal(false)}
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(6px)",
            }}
          />

          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                {/* Modal Header */}
                <div
                  className="modal-header px-4 py-3"
                  style={{ backgroundColor: "#343a40", color: "#fff" }}
                >
                  <h5 className="modal-title fw-bold text-white mb-0">
                    {modalMode === "add" ? "Add New Category" : "Edit Category"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => !saving && setShowModal(false)}
                    disabled={saving}
                  />
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body p-4">
                    {formError && (
                      <div className="alert alert-danger d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2" />
                        {formError}
                      </div>
                    )}

                    {/* Category Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Footwear, Electronics, Home Decor"
                        style={{
                          backgroundColor: "#f1f3f5",
                          borderColor: "#dee2e6",
                        }}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        autoFocus
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe what kind of products belong in this category..."
                        style={{
                          backgroundColor: "#f1f3f5",
                          borderColor: "#dee2e6",
                        }}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Category Image URL */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Category Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://images.unsplash.com/photo-..."
                        style={{
                          backgroundColor: "#f1f3f5",
                          borderColor: "#dee2e6",
                        }}
                        value={formData.image || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                      />
                      <small className="text-muted mt-1 d-block">
                        This image will appear on the Home page banner and Shop category cards.
                      </small>
                    </div>

                    {/* Sample image quick-presets */}
                    <div className="mb-3">
                      <label className="form-label small text-muted fw-semibold">
                        Quick Image Presets:
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {sampleImages.map((sample) => (
                          <button
                            key={sample.label}
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                            onClick={() =>
                              setFormData({ ...formData, image: sample.url })
                            }
                          >
                            {sample.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Preview */}
                    {formData.image && (
                      <div className="mt-3">
                        <label className="form-label small text-muted fw-semibold">
                          Image Live Preview:
                        </label>
                        <div
                          className="rounded-3 overflow-hidden border"
                          style={{ height: "120px", backgroundColor: "#f8f9fa" }}
                        >
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="modal-footer px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setShowModal(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark px-4"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          Saving...
                        </>
                      ) : modalMode === "add" ? (
                        <>
                          <i className="bi bi-plus-lg me-2" />
                          Create Category
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showDeleteModal && categoryToDelete && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => !deleting && setShowDeleteModal(false)}
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(6px)",
            }}
          />

          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div
                  className="modal-header px-4 py-3"
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                >
                  <h5 className="modal-title fw-bold text-white mb-0">
                    Delete Category
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => !deleting && setShowDeleteModal(false)}
                    disabled={deleting}
                  />
                </div>

                <div className="modal-body p-4">
                  {deleteError && (
                    <div className="alert alert-danger d-flex align-items-center mb-3">
                      <i className="bi bi-exclamation-circle me-2" />
                      {deleteError}
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-danger flex-shrink-0"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#f8d7da",
                      }}
                    >
                      <i className="bi bi-exclamation-triangle fs-4" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">
                        Are you sure you want to delete "{categoryToDelete.name}"?
                      </h6>
                      <p className="text-muted small mb-0">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  {(categoryToDelete.productCount || 0) > 0 && (
                    <div className="alert alert-warning py-2 px-3 small">
                      <i className="bi bi-info-circle me-1" />
                      <strong>Notice:</strong> There are currently{" "}
                      <strong>{categoryToDelete.productCount}</strong> products in this category.
                    </div>
                  )}
                </div>

                <div className="modal-footer px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-1" />
                        Delete Category
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Styles */}
      <style>{`
        .category-card-admin {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .category-card-admin:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }
      `}</style>
    </div>
  );
};

export default Categories;
