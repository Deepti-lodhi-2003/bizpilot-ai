import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCart,
  clearCart,
} from "../services/cartService";
import type { CartItem } from "../services/cartService";

import {
  createOrder,
  type ShippingAddress,
} from "../services/orderService";

import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentService";

import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

import AddressModal from "../components/address/AddressFormModal";

// ======================================
// ADDRESS TYPE
// ======================================

interface Address extends ShippingAddress {
  _id: string;
  user: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ======================================
// RAZORPAY SCRIPT
// ======================================

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById(
      "razorpay-script"
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-script";
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// ======================================
// CHECKOUT
// ======================================

const Checkout = () => {
  const navigate = useNavigate();

  // ======================================
  // CART
  // ======================================

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================================
  // PAYMENT
  // ======================================

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  // ======================================
  // ADDRESS
  // ======================================

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  const [addressLoading, setAddressLoading] =
    useState(true);

  // ======================================
  // ADDRESS MODAL
  // ======================================

  const [showAddressModal, setShowAddressModal] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  // ======================================
  // LOAD CART
  // ======================================

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCart();

        setCart(data);
      } catch (error) {
        console.error(
          "Failed to load checkout cart:",
          error
        );

        setError(
          "Failed to load your cart. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // ======================================
  // LOAD ADDRESSES
  // ======================================

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);

      const data = await getMyAddresses();

      setAddresses(data);

      const defaultAddress = data.find(
        (address: Address) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error(
        "Failed to load addresses:",
        error
      );

      setError(
        "Failed to load your addresses."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // ======================================
  // ADD ADDRESS
  // ======================================

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  // ======================================
  // EDIT ADDRESS
  // ======================================

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  // ======================================
  // CLOSE MODAL
  // ======================================

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  // ======================================
  // SAVE ADDRESS
  // ======================================

  const handleSaveAddress = async (
    data: ShippingAddress
  ) => {
    try {
      setError("");

      if (editingAddress) {
        await updateAddress(
          editingAddress._id,
          {
            ...data,
            isDefault: editingAddress.isDefault,
          }
        );
      } else {
        await addAddress({
          ...data,
          isDefault: addresses.length === 0,
        });
      }

      handleCloseAddressModal();

      await loadAddresses();
    } catch (error: any) {
      console.error(
        "Save address error:",
        error
      );

      throw new Error(
        error?.response?.data?.message ||
          "Failed to save address."
      );
    }
  };

  // ======================================
  // DELETE ADDRESS
  // ======================================

  const handleDeleteAddress = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      await deleteAddress(id);

      await loadAddresses();
    } catch (error: any) {
      console.error(
        "Delete address error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete address."
      );
    }
  };

  // ======================================
  // SET DEFAULT
  // ======================================

  const handleSetDefaultAddress = async (
    address: Address
  ) => {
    try {
      await setDefaultAddress(address._id);

      await loadAddresses();
    } catch (error: any) {
      console.error(
        "Set default address error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to set default address."
      );
    }
  };

  // ======================================
  // TOTALS
  // ======================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;

  const total = subtotal + shipping;

  // ======================================
  // PLACE ORDER
  // ======================================

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      alert(
        "Please select a delivery address before payment."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      // ====================================
      // LOAD RAZORPAY
      // ====================================

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        alert(
          "Razorpay failed to load. Please check your internet connection."
        );

        setPlacingOrder(false);
        return;
      }

      // ====================================
      // CREATE ORDERS
      // ====================================

      const createdOrders = [];

      for (const item of cart) {
        const order = await createOrder(
          item.product._id,
          item.quantity,
          {
            fullName:
              selectedAddress.fullName,

            phone:
              selectedAddress.phone,

            addressLine:
              selectedAddress.addressLine,

            city:
              selectedAddress.city,

            state:
              selectedAddress.state,

            pincode:
              selectedAddress.pincode,
          }
        );

        createdOrders.push(order);
      }

      // ====================================
      // PAYMENT
      // ====================================

      for (const order of createdOrders) {
        const razorpayOrder =
          await createPaymentOrder(order._id);

        await new Promise<void>(
          (resolve, reject) => {
            const options = {
              key:
                import.meta.env
                  .VITE_RAZORPAY_KEY_ID,

              amount:
                razorpayOrder.amount,

              currency:
                razorpayOrder.currency || "INR",

              name: "BizPilot",

              description:
                `Order #${order._id
                  .slice(-6)
                  .toUpperCase()}`,

              order_id:
                razorpayOrder.id,

              handler: async (
                response: {
                  razorpay_order_id: string;
                  razorpay_payment_id: string;
                  razorpay_signature: string;
                }
              ) => {
                try {
                  await verifyPayment({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  });

                  resolve();
                } catch (error) {
                  console.error(
                    "Payment verification failed:",
                    error
                  );

                  reject(
                    new Error(
                      "Payment verification failed"
                    )
                  );
                }
              },

              theme: {
                color: "#111315",
              },

              prefill: {
                name:
                  selectedAddress.fullName,

                email: "",

                contact:
                  selectedAddress.phone,
              },

              modal: {
                ondismiss: () => {
                  reject(
                    new Error(
                      "Payment cancelled by user"
                    )
                  );
                },
              },
            };

            const razorpay =
              new window.Razorpay(options);

            razorpay.open();
          }
        );
      }

      // ====================================
      // CLEAR CART
      // ====================================

      await clearCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // ====================================
      // GO ORDERS
      // ====================================

      navigate("/orders");
    } catch (error: any) {
      console.error(
        "Place order/payment error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Payment failed. Please try again.";

      setError(message);

      alert(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <section
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#111315",
          color: "#ffffff",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ color: "#ffffff" }}
          />

          <p
            className="mt-3 mb-0"
            style={{
              color: "#a8adb3",
            }}
          >
            Loading checkout...
          </p>
        </div>
      </section>
    );
  }

  // ======================================
  // EMPTY CART
  // ======================================

  if (cart.length === 0) {
    return (
      <section
        className="min-vh-100 d-flex align-items-center"
        style={{
          backgroundColor: "#111315",
          color: "#ffffff",
          paddingTop: "120px",
          paddingBottom: "60px",
        }}
      >
        <div className="container">
          <div
            className="text-center rounded-4 p-5 mx-auto"
            style={{
              maxWidth: "650px",
              backgroundColor: "#1b1e21",
              border:
                "1px solid #34383d",
            }}
          >
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#292d31",
              }}
            >
              <i className="bi bi-cart3 fs-2" />
            </div>

            <h3 className="fw-bold">
              Your cart is empty
            </h3>

            <p
              style={{
                color: "#9ca1a7",
              }}
            >
              Add some products before
              proceeding to checkout.
            </p>

            <Link
              to="/shop"
              className="btn btn-light rounded-pill px-4 py-2 mt-2 fw-semibold"
            >
              Continue Shopping
              <i className="bi bi-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: "#111315",
        color: "#ffffff",
        paddingTop: "120px",
        paddingBottom: "60px",
      }}
    >
      <div className="container">

        {/* HEADER */}

        <div className="mb-5">
          <span
            className="text-uppercase small fw-semibold"
            style={{
              letterSpacing: "2px",
              color: "#a8adb3",
            }}
          >
            Secure Checkout
          </span>

          <h1
            className="display-5 fw-bold mt-2 mb-2"
          >
            Complete Your Order
          </h1>

          <p
            style={{
              color: "#9ca1a7",
            }}
          >
            Select your delivery address and
            complete your payment securely.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="alert alert-danger rounded-3 mb-4"
            role="alert"
          >
            <i className="bi bi-exclamation-circle me-2" />
            {error}
          </div>
        )}

        <div className="row g-4">

          {/* ==================================
              LEFT
          ================================== */}

          <div className="col-lg-7">

            {/* ADDRESS */}

            <div
              className="rounded-4 p-4 mb-4"
              style={{
                backgroundColor: "#1b1e21",
                border:
                  "1px solid #34383d",
              }}
            >

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                  <h4 className="fw-bold mb-1">
                    Delivery Address
                  </h4>

                  <small
                    style={{
                      color: "#9ca1a7",
                    }}
                  >
                    Choose where you want
                    your order delivered.
                  </small>
                </div>

                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3"
                  onClick={handleAddAddress}
                >
                  <i className="bi bi-plus-lg me-2" />
                  Add Address
                </button>

              </div>

              {/* ADDRESS LOADING */}

              {addressLoading ? (
                <div className="text-center py-4">

                  <div
                    className="spinner-border spinner-border-sm"
                    style={{
                      color: "#ffffff",
                    }}
                  />

                  <p
                    className="small mt-2 mb-0"
                    style={{
                      color: "#9ca1a7",
                    }}
                  >
                    Loading addresses...
                  </p>

                </div>
              ) : addresses.length === 0 ? (

                /* NO ADDRESS */

                <div
                  className="text-center rounded-3 p-4"
                  style={{
                    backgroundColor: "#24282c",
                    border:
                      "1px solid #3b4045",
                  }}
                >

                  <i
                    className="bi bi-geo-alt fs-1"
                    style={{
                      color: "#ffffff",
                    }}
                  />

                  <h6 className="fw-bold mt-3">
                    No delivery address
                  </h6>

                  <p
                    className="small"
                    style={{
                      color: "#9ca1a7",
                    }}
                  >
                    Add your address before
                    placing the order.
                  </p>

                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={handleAddAddress}
                  >
                    <i className="bi bi-plus-lg me-2" />
                    Add Delivery Address
                  </button>

                </div>

              ) : (

                /* ADDRESS LIST */

                <div className="d-flex flex-column gap-3">

                  {addresses.map(
                    (address) => {

                      const isSelected =
                        selectedAddress?._id ===
                        address._id;

                      return (
                        <div
                          key={address._id}
                          className="rounded-3 p-3"
                          onClick={() =>
                            setSelectedAddress(
                              address
                            )
                          }
                          style={{
                            backgroundColor:
                              isSelected
                                ? "#292e33"
                                : "#24282c",

                            border:
                              isSelected
                                ? "1px solid #ffffff"
                                : "1px solid #3b4045",

                            cursor: "pointer",
                          }}
                        >

                          <div className="d-flex justify-content-between gap-3">

                            <div className="d-flex gap-3">

                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor:
                                    isSelected
                                      ? "#ffffff"
                                      : "#343a40",
                                }}
                              >
                                <i
                                  className="bi bi-geo-alt"
                                  style={{
                                    color:
                                      isSelected
                                        ? "#111315"
                                        : "#ffffff",
                                  }}
                                />
                              </div>

                              <div>

                                <div className="d-flex align-items-center gap-2 flex-wrap">

                                  <span className="fw-bold">
                                    {address.fullName}
                                  </span>

                                  {address.isDefault && (
                                    <span className="badge bg-light text-dark">
                                      Default
                                    </span>
                                  )}

                                  {isSelected && (
                                    <span className="badge bg-success">
                                      Selected
                                    </span>
                                  )}

                                </div>

                                <div
                                  className="small mt-1"
                                  style={{
                                    color: "#c2c6ca",
                                  }}
                                >
                                  {address.addressLine}
                                </div>

                                <div
                                  className="small"
                                  style={{
                                    color: "#9ca1a7",
                                  }}
                                >
                                  {address.city},{" "}
                                  {address.state} -{" "}
                                  {address.pincode}
                                </div>

                                <div
                                  className="small mt-1"
                                  style={{
                                    color: "#9ca1a7",
                                  }}
                                >
                                  <i className="bi bi-telephone me-1" />
                                  {address.phone}
                                </div>

                              </div>

                            </div>

                            {/* ACTIONS */}

                            <div
                              className="d-flex gap-2 align-items-start"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >

                              {!address.isDefault && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-light rounded-pill"
                                  title="Set default"
                                  onClick={() =>
                                    handleSetDefaultAddress(
                                      address
                                    )
                                  }
                                >
                                  <i className="bi bi-check2-circle" />
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light rounded-pill"
                                title="Edit"
                                onClick={() =>
                                  handleEditAddress(
                                    address
                                  )
                                }
                              >
                                <i className="bi bi-pencil" />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                title="Delete"
                                onClick={() =>
                                  handleDeleteAddress(
                                    address._id
                                  )
                                }
                              >
                                <i className="bi bi-trash" />
                              </button>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* ==================================
                ORDER ITEMS
            ================================== */}

            <div
              className="rounded-4 p-4 mb-4"
              style={{
                backgroundColor: "#1b1e21",
                border:
                  "1px solid #34383d",
              }}
            >

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h4 className="fw-bold mb-0">
                  Your Items
                </h4>

                <span
                  className="small"
                  style={{
                    color: "#9ca1a7",
                  }}
                >
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="d-flex gap-3 align-items-center py-3"
                  style={{
                    borderBottom:
                      "1px solid #34383d",
                  }}
                >

                  <div
                    className="rounded-3 overflow-hidden flex-shrink-0"
                    style={{
                      width: "85px",
                      height: "85px",
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
                        <i className="bi bi-image fs-3" />
                      </div>
                    )}

                  </div>

                  <div className="flex-grow-1">

                    <small
                      style={{
                        color: "#8f969d",
                      }}
                    >
                      {item.product.category}
                    </small>

                    <h6 className="fw-bold mt-1 mb-1">
                      {item.product.name}
                    </h6>

                    <small
                      style={{
                        color: "#9ca1a7",
                      }}
                    >
                      ₹
                      {item.product.price.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </small>

                  </div>

                  <div className="fw-bold">
                    ₹
                    {(
                      item.product.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* ==================================
              RIGHT
          ================================== */}

          <div className="col-lg-5">

            <div
              className="rounded-4 p-4 sticky-top"
              style={{
                top: "100px",
                backgroundColor: "#1b1e21",
                border:
                  "1px solid #34383d",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.25)",
              }}
            >

              <h4 className="fw-bold mb-4">
                Order Summary
              </h4>

              {/* DELIVERY */}

              <div className="mb-4">

                <div className="d-flex justify-content-between align-items-center mb-2">

                  <span className="fw-semibold">
                    Deliver To
                  </span>

                  <i className="bi bi-geo-alt" />

                </div>

                {selectedAddress ? (

                  <div
                    className="rounded-3 p-3"
                    style={{
                      backgroundColor: "#24282c",
                      border:
                        "1px solid #3b4045",
                    }}
                  >

                    <div className="fw-semibold">
                      {selectedAddress.fullName}
                    </div>

                    <div
                      className="small mt-1"
                      style={{
                        color: "#9ca1a7",
                      }}
                    >
                      {selectedAddress.addressLine}
                    </div>

                    <div
                      className="small"
                      style={{
                        color: "#9ca1a7",
                      }}
                    >
                      {selectedAddress.city},{" "}
                      {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </div>

                    <div
                      className="small mt-1"
                      style={{
                        color: "#9ca1a7",
                      }}
                    >
                      {selectedAddress.phone}
                    </div>

                  </div>

                ) : (

                  <div
                    className="small rounded-3 p-3"
                    style={{
                      backgroundColor: "#3a2727",
                      color: "#ffb3b3",
                    }}
                  >
                    Please select a delivery
                    address.
                  </div>

                )}

              </div>

              {/* SUBTOTAL */}

              <div className="d-flex justify-content-between mb-3">

                <span
                  style={{
                    color: "#9ca1a7",
                  }}
                >
                  Subtotal
                </span>

                <span className="fw-semibold">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* SHIPPING */}

              <div className="d-flex justify-content-between mb-3">

                <span
                  style={{
                    color: "#9ca1a7",
                  }}
                >
                  Shipping
                </span>

                <span className="fw-semibold">
                  Free
                </span>

              </div>

              <hr
                style={{
                  borderColor: "#34383d",
                }}
              />

              {/* TOTAL */}

              <div className="d-flex justify-content-between mb-4">

                <span className="fw-bold">
                  Total
                </span>

                <span className="fw-bold fs-4">
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* PAY */}

              <button
                type="button"
                className="btn btn-light w-100 rounded-pill py-3 fw-semibold"
                disabled={
                  placingOrder ||
                  !selectedAddress
                }
                onClick={handlePlaceOrder}
              >

                {placingOrder ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                    />

                    Processing Payment...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-2" />

                    Pay ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </>
                )}

              </button>

              {/* BACK */}

              <Link
                to="/cart"
                className="btn w-100 rounded-pill py-3 mt-2"
                style={{
                  color: "#ffffff",
                  border:
                    "1px solid #555b61",
                  backgroundColor:
                    "transparent",
                }}
              >
                <i className="bi bi-arrow-left me-2" />
                Back to Cart
              </Link>

              <div
                className="text-center mt-4"
                style={{
                  color: "#777d83",
                }}
              >
                <small>
                  <i className="bi bi-shield-lock me-1" />
                  Secure payment powered by
                  Razorpay
                </small>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ======================================
          ADDRESS MODAL
      ====================================== */}

      <AddressModal
        show={showAddressModal}
        address={editingAddress}
        onClose={handleCloseAddressModal}
        onSave={handleSaveAddress}
      />

    </section>
  );
};

export default Checkout;