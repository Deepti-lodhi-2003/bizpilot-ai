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
      <div className="product-card card h-100 border-1 shadow-md">
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
              className="product-action btn btn-sm btn-dark flex-grow-1"
              onClick={() => onEdit(product)}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </button>

            <button
              type="button"
              className="product-action btn btn-sm btn-danger"
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