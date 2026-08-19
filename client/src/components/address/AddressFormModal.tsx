import { useEffect, useState } from "react";
import type { ShippingAddress } from "../../services/orderService";

export interface Address extends ShippingAddress {
  _id: string;
  user: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AddressFormModalProps {
  show: boolean;
  address: Address | null;
  onClose: () => void;
  onSave: (data: ShippingAddress) => Promise<void>;
}

const emptyForm: ShippingAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const AddressFormModal = ({
  show,
  address,
  onClose,
  onSave,
}: AddressFormModalProps) => {
  const [form, setForm] =
    useState<ShippingAddress>(emptyForm);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (address) {
      setForm({
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });
    } else {
      setForm(emptyForm);
    }
  }, [address, show]);

  if (!show) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.addressLine.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all address fields.");
      return;
    }

    try {
      setSaving(true);

      await onSave(form);

      setForm(emptyForm);
    } catch (error) {
      console.error("Address save error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1050,
        }}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="position-fixed top-50 start-50 translate-middle w-100 px-3"
        style={{
          zIndex: 1051,
          maxWidth: "650px",
        }}
      >
        <div
          className="rounded-4 p-4"
          style={{
            backgroundColor: "#1b1e21",
            border: "1px solid #34383d",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4
                className="fw-bold mb-1"
                style={{ color: "#ffffff" }}
              >
                {address
                  ? "Edit Address"
                  : "Add New Address"}
              </h4>

              <small
                style={{ color: "#9ca1a7" }}
              >
                {address
                  ? "Update your delivery address"
                  : "Enter your delivery address"}
              </small>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-circle"
              onClick={onClose}
              disabled={saving}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* FULL NAME */}
              <div className="col-md-6">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#ffffff" }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Enter full name"
                />
              </div>

              {/* PHONE */}
              <div className="col-md-6">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#ffffff" }}
                >
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Enter phone number"
                />
              </div>

              {/* ADDRESS */}
              <div className="col-12">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#ffffff" }}
                >
                  Address
                </label>

                <input
                  type="text"
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="House no, street, area"
                />
              </div>

              {/* CITY */}
              <div className="col-md-4">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#ffffff" }}
                >
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="City"
                />
              </div>

              {/* STATE */}
              <div className="col-md-4">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#ffffff" }}
                >
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="State"
                />
              </div>

              {/* PINCODE */}
              <div className="col-md-4">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#ffffff" }}
                >
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Pincode"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-light rounded-pill px-4"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2" />

                    {address
                      ? "Update Address"
                      : "Save Address"}
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-light rounded-pill px-4"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressFormModal;