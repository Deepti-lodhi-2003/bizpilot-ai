import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="product-card card h-100 border-1 shadow-sm">

        {/* ================= PRODUCT IMAGE ================= */}
        <div
          className="rounded-top overflow-hidden d-flex align-items-center justify-content-center"
          style={{
            height: "145px",
            backgroundColor: "#f0f2f3",
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
              }}
            />
          ) : (
            <i className="bi bi-box-seam fs-2 text-secondary"></i>
          )}
        </div>

        <div className="card-body d-flex flex-column p-3">

          {/* ================= PRODUCT NAME ================= */}
          <h5
            className="fw-bold mb-2"
            style={{
              color: "#1f2428",
              height: "48px",
              lineHeight: "24px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.name}
          </h5>

          {/* ================= DESCRIPTION ================= */}
          <p
            className="text-muted small mb-3"
            style={{
              height: "36px",
              lineHeight: "20px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.description}
          </p>

          {/* ================= PRICE + CATEGORY ================= */}
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{
              height: "29px",
            }}
          >
            <h5
              className="fw-bold mb-0"
              style={{
                color: "#1f2428",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </h5>

            <span
              className="badge text-bg-light border"
              style={{
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={product.category}
            >
              {product.category}
            </span>
          </div>

          {/* ================= STOCK ================= */}
          <div
            className="d-flex justify-content-between align-items-center border-top pt-1 mb-2"
            style={{
              minHeight: "42px",
            }}
          >
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

          {/* ================= ACTIONS ================= */}
          <div className="d-flex gap-2 mt-auto">

            <button
              type="button"
              className="product-action btn btn-sm btn-dark flex-grow-1"
              onClick={() => onEdit(product)}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </button>

            <button
              type="button"
              className="product-action btn btn-sm btn-danger px-3"
              onClick={() => onDelete(product)}
            >
              <i className="bi bi-trash3"></i>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;