import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CART ================= */

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= ACTION ================= */

  const updateQty = async (itemId, qty) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/cart/update/${itemId}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= STATE ================= */

  if (loading)
    return (
      <div className="text-center mt-10 text-blue-600 font-medium">
        Loading keranjang...
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center mt-20 px-4">
        <p className="text-gray-600 text-lg">Keranjangmu masih kosong 😢</p>
        <button
          className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
          onClick={() => navigate("/")}
        >
          Belanja Sekarang
        </button>
      </div>
    );

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-blue-700 mb-5">
        Keranjang Belanja
      </h1>

      {/* ITEM LIST */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-xl border"
              />

              <div>
                <h2 className="font-semibold text-gray-800 text-sm md:text-base">
                  {item.product.name}
                </h2>
                <p className="text-blue-600 font-medium text-sm">
                  Rp {item.product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* QTY */}
            <div className="flex items-center justify-between md:justify-start gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQty(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center font-bold"
                >
                  -
                </button>

                <span className="font-semibold text-gray-800 min-w-[24px] text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>

              {/* PRICE + REMOVE (MOBILE INLINE) */}
              <div className="text-right md:hidden">
                <p className="font-semibold text-gray-800 text-sm">
                  Rp{" "}
                  {(item.product.price * item.quantity).toLocaleString("id-ID")}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>

            {/* PRICE + REMOVE DESKTOP */}
            <div className="hidden md:flex flex-col items-end">
              <p className="font-semibold text-gray-800 text-lg">
                Rp{" "}
                {(item.product.price * item.quantity).toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm hover:underline mt-1"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-13 left-0 right-0 md:static bg-white border-t md:border rounded-t-2xl md:rounded-xl shadow-md p-4 mt-8 flex justify-between items-center gap-4">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 text-sm"
        >
          Kosongkan
        </button>

        <div className="text-right">
          <p className="font-semibold text-gray-800">
            Total: Rp {totalPrice.toLocaleString("id-ID")}
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
