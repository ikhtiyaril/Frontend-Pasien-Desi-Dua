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
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Belanja
        </button>
      </div>
    );

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-32 bg-blue-50 min-h-screen">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">
          Keranjang Belanja
        </h1>

        {/* VALIDATION ERROR */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            {validationErrors.map((e, i) => (
              <p key={i} className="text-red-600 text-sm">
                • {e.message}
              </p>
            ))}
          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-4">
          {cart.items.map((item) => {
            const needPrescription =
              item.product.is_prescription_required &&
              !prescriptionAccess[item.product.id];

            const outOfStock = item.product.stock < item.quantity;

            return (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-xl shadow border ${
                  outOfStock ? "border-red-300" : ""
                }`}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.image_url}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold">
                      {item.product.name}
                    </h2>
                    <p className="text-blue-600">
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
                        className="mt-2 text-sm text-orange-600 underline"
                      >
                        Minta resep ke dokter
                      </button>
                    )}

                    {prescriptionAccess[item.product.id] && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Resep disetujui
                      </p>
                    )}
                  </div>

                  {/* QTY */}
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
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between">
          <button
            onClick={clearCart}
            className="bg-blue-100 px-4 py-2 rounded-xl"
          >
            Kosongkan
          </button>

          <div className="text-right">
            <p className="font-semibold">
              Total: Rp {totalPrice.toLocaleString("id-ID")}
            </p>
            <button
              disabled={!canCheckout || validating}
              onClick={handleCheckout}
              className={`mt-2 px-6 py-3 rounded-xl text-white ${
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
