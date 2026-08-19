import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getCart,
    updateCartQuantity,
    removeFromCart,
} from "../services/cartService";
import type { CartItem } from "../services/cartService";

const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD CART
    // =========================
    const loadCart = async () => {
        try {
            setLoading(true);

            const data = await getCart();

            setCart(data);
        } catch (error) {
            console.error("Failed to load cart:", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        loadCart();
    }, []);

    // =========================
    // QUANTITY UPDATE
    // =========================
    const handleQuantity = async (
        id: string,
        quantity: number
    ) => {
        if (quantity < 1) return;

        try {
            const updatedItem = await updateCartQuantity(
                id,
                quantity
            );

            setCart((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? {
                            ...item,
                            quantity: updatedItem.quantity,
                        }
                        : item
                )
            );

            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error(
                "Failed to update quantity:",
                error
            );
        }
    };

    // =========================
    // REMOVE ITEM
    // =========================
    const handleRemove = async (id: string) => {
        try {
            await removeFromCart(id);

            setCart((prev) =>
                prev.filter((item) => item._id !== id)
            );

            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error(
                "Failed to remove item:",
                error
            );
        }
    };

    // =========================
    // TOTALS
    // =========================
    const subtotal = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 0 : 0;

    const total = subtotal + shipping;

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div
                className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: "#111315",
                    color: "#f5f5f5",
                }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border"
                        role="status"
                        style={{
                            color: "#fff",
                        }}
                    />

                    <p
                        className="mt-3 mb-0"
                        style={{
                            color: "#a8adb3",
                        }}
                    >
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section
            className="py-5"
            style={{
                minHeight: "80vh",
                backgroundColor: "#111315",
                color: "#f5f5f5",
                paddingTop: "120px",
            }}
        >
            <div className="container py-lg-4">

                {/* =========================
            HEADER
        ========================= */}
                <div className="mb-5">
                    <span
                        className="text-uppercase small fw-semibold"
                        style={{
                            letterSpacing: "2px",
                            color: "#a8adb3",
                        }}
                    >
                        Shopping Bag
                    </span>

                    <h1
                        className="display-5 fw-bold mt-2 mb-2"
                        style={{
                            color: "#ffffff",
                        }}
                    >
                        Your Cart
                    </h1>

                    <p
                        className="mb-0"
                        style={{
                            color: "#9ca1a7",
                        }}
                    >
                        Review your selected products before checkout.
                    </p>
                </div>

                {/* =========================
            EMPTY CART
        ========================= */}
                {cart.length === 0 ? (
                    <div
                        className="text-center rounded-4 p-5"
                        style={{
                            backgroundColor: "#1b1e21",
                            border: "1px solid #34383d",
                        }}
                    >
                        <div
                            className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: "80px",
                                height: "80px",
                                backgroundColor: "#292d31",
                                color: "#f5f5f5",
                            }}
                        >
                            <i className="bi bi-cart3 fs-2" />
                        </div>

                        <h3
                            className="fw-bold"
                            style={{
                                color: "#ffffff",
                            }}
                        >
                            Your cart is empty
                        </h3>

                        <p
                            style={{
                                color: "#9ca1a7",
                            }}
                        >
                            Looks like you haven't added anything yet.
                        </p>

                        <Link
                            to="/shop"
                            className="btn btn-light rounded-pill px-4 py-2 mt-2 fw-semibold"
                        >
                            Continue Shopping
                            <i className="bi bi-arrow-right ms-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">

                        {/* =========================
                CART ITEMS
            ========================= */}
                        <div className="col-lg-8">
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="rounded-4 p-3 p-md-4 mb-3"
                                    style={{
                                        backgroundColor: "#1b1e21",
                                        border: "1px solid #2d3135",
                                        boxShadow:
                                            "0 8px 25px rgba(0,0,0,0.25)",
                                    }}
                                >
                                    <div className="row align-items-center g-3">

                                        {/* IMAGE */}
                                        <div className="col-4 col-md-3">
                                            <div
                                                className="rounded-3 overflow-hidden"
                                                style={{
                                                    height: "150px",
                                                    backgroundColor: "#24282c",
                                                }}
                                            >
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="w-100 h-100"
                                                        style={{
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-100 h-100 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            color: "#777d83",
                                                        }}
                                                    >
                                                        <i className="bi bi-image fs-2" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* PRODUCT INFO */}
                                        <div className="col-8 col-md-5">
                                            <small
                                                style={{
                                                    color: "#8f969d",
                                                }}
                                            >
                                                {item.product.category}
                                            </small>

                                            <h5
                                                className="fw-bold mt-1 mb-2"
                                                style={{
                                                    color: "#ffffff",
                                                }}
                                            >
                                                {item.product.name}
                                            </h5>

                                            <p
                                                className="small mb-0"
                                                style={{
                                                    color: "#9ca1a7",
                                                }}
                                            >
                                                {item.product.description}
                                            </p>

                                            <div
                                                className="mt-2 fw-semibold"
                                                style={{
                                                    color: "#ffffff",
                                                }}
                                            >
                                                ₹
                                                {item.product.price.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </div>
                                        </div>

                                        {/* QUANTITY + PRICE */}
                                        <div className="col-8 col-md-3">
                                            <div
                                                className="d-inline-flex align-items-center rounded-pill"
                                                style={{
                                                    border: "1px solid #3b4045",
                                                    backgroundColor: "#24282c",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-sm border-0"
                                                    style={{
                                                        color: "#ffffff",
                                                    }}
                                                    onClick={() =>
                                                        handleQuantity(
                                                            item._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <i className="bi bi-dash" />
                                                </button>

                                                <span
                                                    className="px-2 fw-semibold"
                                                    style={{
                                                        color: "#ffffff",
                                                    }}
                                                >
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm border-0"
                                                    style={{
                                                        color: "#ffffff",
                                                    }}
                                                    onClick={() =>
                                                        handleQuantity(
                                                            item._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-plus" />
                                                </button>
                                            </div>

                                            <div
                                                className="mt-2 fw-bold"
                                                style={{
                                                    color: "#ffffff",
                                                }}
                                            >
                                                ₹
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toLocaleString("en-IN")}
                                            </div>
                                        </div>

                                        {/* REMOVE */}
                                        <div className="col-4 col-md-1 text-end">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger rounded-circle"
                                                onClick={() =>
                                                    handleRemove(item._id)
                                                }
                                                title="Remove"
                                            >
                                                <i className="bi bi-trash" />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* =========================
                ORDER SUMMARY
            ========================= */}
                        <div className="col-lg-4">
                            <div
                                className="rounded-4 p-4 sticky-top"
                                style={{
                                    top: "100px",
                                    backgroundColor: "#1b1e21",
                                    border: "1px solid #34383d",
                                    boxShadow:
                                        "0 8px 25px rgba(0,0,0,0.25)",
                                }}
                            >
                                <h4
                                    className="fw-bold mb-4"
                                    style={{
                                        color: "#ffffff",
                                    }}
                                >
                                    Order Summary
                                </h4>

                                <div className="d-flex justify-content-between mb-3">
                                    <span
                                        style={{
                                            color: "#9ca1a7",
                                        }}
                                    >
                                        Subtotal
                                    </span>

                                    <span
                                        className="fw-semibold"
                                        style={{
                                            color: "#ffffff",
                                        }}
                                    >
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span
                                        style={{
                                            color: "#9ca1a7",
                                        }}
                                    >
                                        Shipping
                                    </span>

                                    <span
                                        className="fw-semibold"
                                        style={{
                                            color: "#ffffff",
                                        }}
                                    >
                                        Free
                                    </span>
                                </div>

                                <hr
                                    style={{
                                        borderColor: "#34383d",
                                    }}
                                />

                                <div className="d-flex justify-content-between mb-4">
                                    <span
                                        className="fw-bold"
                                        style={{
                                            color: "#ffffff",
                                        }}
                                    >
                                        Total
                                    </span>

                                    <span
                                        className="fw-bold fs-5"
                                        style={{
                                            color: "#ffffff",
                                        }}
                                    >
                                        ₹{total.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-light w-100 rounded-pill py-3 fw-semibold"
                                    onClick={() => {
                                        console.log("Checkout clicked");
                                        window.location.href = "/checkout";
                                    }}
                                >
                                    Proceed to Checkout
                                    <i className="bi bi-arrow-right ms-2" />
                                </button>

                                <Link
                                    to="/shop"
                                    className="btn w-100 rounded-pill py-3 mt-2"
                                    style={{
                                        color: "#ffffff",
                                        border: "1px solid #555b61",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;