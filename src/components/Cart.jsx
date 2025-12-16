import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil Cart
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

  // Update Qty
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

  // Hapus Item
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

  // Kosongkan cart
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

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading keranjang...
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center mt-16">
        <p className="text-gray-600 text-lg">Keranjangmu masih kosong 😢</p>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow"
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Keranjang Belanja</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div>
                <h2 className="font-semibold text-gray-800">
                  {item.product.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Rp {item.product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* QTY */}
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <button
                onClick={() =>
                  updateQty(item.id, Math.max(1, item.quantity - 1))
                }
                className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold transition"
              >
                -
              </button>

              <span className="text-lg font-semibold min-w-[24px] text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold transition"
              >
                +
              </button>
            </div>

            {/* PRICE + REMOVE */}
            <div className="flex flex-col items-end mt-3 md:mt-0">
              <p classname="font-semibold text-gray-800 text-lg">
                Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
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
      <div className="mt-8 bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          Kosongkan Keranjang
        </button>

        <div className="text-right">
          <p className="text-xl font-semibold text-gray-800">
            Total: Rp {totalPrice.toLocaleString("id-ID")}
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition shadow"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
