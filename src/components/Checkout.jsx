import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingMethod, setShippingMethod] = useState("reguler"); // dummy ongkir
  const [paymentMethod, setPaymentMethod] = useState("manual"); // dummy payment
  const [shippingCost, setShippingCost] = useState(10000); // default ongkir

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Hitung total barang
  const totalItemsPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const totalPrice = totalItemsPrice + shippingCost;

  // Dummy change ongkir
  const handleShippingChange = (method) => {
    setShippingMethod(method);
    switch (method) {
      case "reguler":
        setShippingCost(10000);
        break;
      case "express":
        setShippingCost(20000);
        break;
      default:
        setShippingCost(10000);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Optional: validate checkout dulu
      await axios.post(
        `${API}/api/checkout/validate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.post(
        `${API}/api/checkout`,
        { payment_method: paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Checkout berhasil! Order ID: " + res.data.order.id);
      navigate("/orders"); // redirect ke halaman orders
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Checkout gagal");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!cart.length)
    return (
      <div className="text-center mt-10">
        <p>Keranjang kosong 😢</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Belanja Sekarang
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
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
                <p className="text-gray-500">
                  Rp {item.product.price} x {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-semibold">
              Rp {item.product.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Ongkir (Shipping)</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shipping"
              value="reguler"
              checked={shippingMethod === "reguler"}
              onChange={() => handleShippingChange("reguler")}
            />
            <span>Reguler - Rp 10.000</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shipping"
              value="express"
              checked={shippingMethod === "express"}
              onChange={() => handleShippingChange("express")}
            />
            <span>Express - Rp 20.000</span>
          </label>
        </div>
      </div>

      {/* Payment */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Metode Pembayaran</h2>
        <select
          className="border rounded p-2 w-full"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="manual">Manual Transfer</option>
          <option value="credit_card">Credit Card</option>
          <option value="e_wallet">E-Wallet</option>
        </select>
      </div>

      {/* Total & Button */}
      <div className="p-4 border rounded flex justify-between items-center">
        <div>
          <p className="text-gray-500">Subtotal: Rp {totalItemsPrice}</p>
          <p className="text-gray-500">Ongkir: Rp {shippingCost}</p>
          <p className="text-xl font-bold">Total: Rp {totalPrice}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
