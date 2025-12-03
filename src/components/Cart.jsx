import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // asumsi token disimpan di localStorage
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

  // Update qty
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

  // Hapus item
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center mt-10">
        <p>Keranjangmu kosong 😢</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
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
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border rounded"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.product.name}</h2>
                <p className="text-gray-500">Rp {item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  updateQty(item.id, Math.max(1, item.quantity - 1))
                }
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <p className="font-semibold">
                Rp {item.product.price * item.quantity}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Kosongkan Keranjang
        </button>
        <div className="text-right">
          <p className="text-lg font-semibold">Total: Rp {totalPrice}</p>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-2 px-6 py-2 bg-green-500 text-white rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
