import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RequestPrescriptionModal from "../components/RequestPrescriptionModal";

const API = import.meta.env.VITE_API_URL;

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [prescriptionAccess, setPrescriptionAccess] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [validating, setValidating] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  /* ================= FETCH CART ================= */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/cart`, authHeader);
      const cartData = res.data.data;
      setCart(cartData);

      // cek akses resep
      for (const item of cartData.items) {
        if (item.product.is_prescription_required) {
          checkPrescriptionAccess(item.product.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= CHECK PRESCRIPTION ================= */
  const checkPrescriptionAccess = async (productId) => {
    try {
      const res = await axios.get(
        `${API}/api/prescription/access/check?productId=${productId}`,
        authHeader
      );

      setPrescriptionAccess((prev) => ({
        ...prev,
        [productId]: res.data.access,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= VALIDATE CART ================= */
  const validateCart = async () => {
    try {
      setValidating(true);
      const res = await axios.get(`${API}/api/cart/validate`, authHeader);
      setValidationErrors(res.data.errors || []);
      return res.data.valid;
    } catch (err) {
      return false;
    } finally {
      setValidating(false);
    }
  };

  /* ================= ACTIONS ================= */
  const updateQty = async (itemId, qty) => {
    if (qty <= 0) {
      await removeItem(itemId);
      return;
    }
    await axios.put(
      `${API}/api/cart/update/${itemId}`,
      { quantity: qty },
      authHeader
    );
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await axios.delete(`${API}/api/cart/remove/${itemId}`, authHeader);
    fetchCart();
  };

  const clearCart = async () => {
    await axios.delete(`${API}/api/cart/clear`, authHeader);
    fetchCart();
  };

  const handleCheckout = async () => {
    const valid = await validateCart();
    if (valid) navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* ================= COMPUTED ================= */
  const hasStockIssue = cart?.items.some(
    (item) => item.product.stock < item.quantity
  );

  const hasPrescriptionIssue = cart?.items.some(
    (item) =>
      item.product.is_prescription_required &&
      !prescriptionAccess[item.product.id]
  );

  const canCheckout = !hasStockIssue && !hasPrescriptionIssue;

  const totalPrice =
    cart?.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ) || 0;

  /* ================= UI ================= */
  if (loading)
    return (
      <div className="text-center mt-10 text-blue-600 font-medium">
        Loading keranjang...
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600">Keranjang kosong 😢</p>
        <button
          onClick={() => navigate("/medicine")}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Belanja
        </button>
      </div>
    );

  return (
    <>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-40 sm:pb-32 bg-blue-50 min-h-screen">
        <h1 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-3 sm:mb-4">
          Keranjang Belanja
        </h1>

        {/* VALIDATION ERROR */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
            {validationErrors.map((e, i) => (
              <p key={i} className="text-red-600 text-xs sm:text-sm">
                • {e.message}
              </p>
            ))}
          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-3 sm:space-y-4">
          {cart.items.map((item) => {
            const needPrescription =
              item.product.is_prescription_required &&
              !prescriptionAccess[item.product.id];

            const outOfStock = item.product.stock < item.quantity;

            return (
              <div
                key={item.id}
                className={`bg-white p-3 sm:p-4 rounded-xl shadow border ${
                  outOfStock ? "border-red-300" : ""
                }`}
              >
                <div className="flex gap-2 sm:gap-4 items-start">
                  <img
                    src={item.product.image_url}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover flex-shrink-0"
                    alt={item.product.name}
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
                      {item.product.name}
                    </h2>
                    <p className="text-blue-600 text-sm sm:text-base mt-1">
                      Rp {item.product.price.toLocaleString("id-ID")}
                    </p>

                    {outOfStock && (
                      <p className="text-xs text-red-500 mt-1">
                        Stok tidak cukup
                      </p>
                    )}

                    {needPrescription && (
                      <button
                        onClick={() => {
                          setSelectedProduct(item.product);
                          setShowModal(true);
                        }}
                        className="mt-2 text-xs sm:text-sm text-orange-600 underline"
                      >
                        Minta resep ke dokter
                      </button>
                    )}

                    {prescriptionAccess[item.product.id] && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Resep disetujui
                      </p>
                    )}

                    {/* QTY & REMOVE - Mobile Layout */}
                    <div className="flex items-center justify-between mt-3 sm:hidden">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQty(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQty(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-xs font-medium px-2"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* QTY & REMOVE - Desktop Layout */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQty(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-blue-100 rounded-lg"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-blue-100 rounded-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 sm:p-4 mb-16 sm:mb-0 shadow-lg">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
            <button
              onClick={clearCart}
              className="bg-blue-100 px-4 py-2 rounded-xl text-sm sm:text-base order-2 sm:order-1"
            >
              Kosongkan
            </button>

            <div className="text-left sm:text-right order-1 sm:order-2">
              <p className="font-semibold text-sm sm:text-base">
                Total: Rp {totalPrice.toLocaleString("id-ID")}
              </p>
              <button
                disabled={!canCheckout || validating}
                onClick={handleCheckout}
                className={`mt-2 w-full sm:w-auto px-6 py-3 rounded-xl text-white text-sm sm:text-base ${
                  canCheckout
                    ? "bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {validating ? "Memvalidasi..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <RequestPrescriptionModal
        isOpen={showModal}
        product={selectedProduct}
        onClose={() => setShowModal(false)}
        onSuccess={fetchCart}
      />
    </>
  );
}