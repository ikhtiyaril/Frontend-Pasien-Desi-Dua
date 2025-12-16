import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FloatingPayment from "../components/FloatingPayment";
import PaymentMethodCheckbox from "./CheckboxPayment";

const API = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shippingMethod, setShippingMethod] = useState("reguler");
  const [shippingCost, setShippingCost] = useState(10000);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentFee, setPaymentFee] = useState(null);
  const [payment, setPayment] = useState([]);
  const [paymentTransaction, setPaymentTransaction] = useState(null);

  const token = localStorage.getItem("token");

  // =============================
  // FETCH CART
  // =============================
  const fetchCart = async () => {
    try {
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

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`${API}/api/payment`);
      setPayment(res.data.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchPayment();
  }, []);

  // =============================
  // HITUNG TOTAL
  // =============================
  const subtotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const fetchPaymentFee = async (method) => {
    if (!method) return;
    try {
      const res = await axios.post(
        `${API}/api/payment/fee`,
        { code: method, amount: subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentFee(res.data.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (paymentMethod) fetchPaymentFee(paymentMethod);
  }, [paymentMethod, subtotal]);

  const tripayFee = paymentFee?.total_fee?.merchant || 0;
  const finalTotal = subtotal + shippingCost + tripayFee;

  // =============================
  // CHECKOUT
  // =============================
  const handleCheckout = async () => {
    if (!paymentMethod) return alert("Pilih metode pembayaran dulu!");

    try {
      const orderRes = await axios.post(
        `${API}/api/orders/create`,
        {
          items: cart,
          total_price: finalTotal,
          payment_method: paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderRes.data.order;

      const paymentRes = await axios.post(
        `${API}/api/payment/checkout`,
        {
          reference: order.order_code,
          paymentMethod,
          amount: subtotal,
          shipping_cost: shippingCost,
          fee_customer: tripayFee,
          orderItems: cart.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          id: order.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentTransaction(paymentRes.data.data.data);
    } catch (err) {
      alert("Checkout gagal");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-blue-600">Loading...</p>;

  if (!cart.length)
    return (
      <div className="text-center mt-16">
        <p className="text-gray-600">Keranjang kosong 😢</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Belanja Sekarang
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* CART */}
          <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
            <h2 className="font-semibold text-blue-700">Produk</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image_url}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Rp {item.product.price.toLocaleString("id-ID")} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-blue-700">
                  Rp{" "}
                  {(item.product.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          {/* SHIPPING */}
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-blue-700 mb-3">Pengiriman</h2>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={shippingMethod === "reguler"}
                onChange={() => {
                  setShippingMethod("reguler");
                  setShippingCost(10000);
                }}
              />
              <span>Reguler – Rp 10.000</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={shippingMethod === "express"}
                onChange={() => {
                  setShippingMethod("express");
                  setShippingCost(20000);
                }}
              />
              <span>Express – Rp 20.000</span>
            </label>
          </div>

          {/* PAYMENT */}
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-blue-700 mb-3">
              Metode Pembayaran
            </h2>

            <PaymentMethodCheckbox
              data={payment}
              selectedMethod={paymentMethod}
              onChange={(val) => setPaymentMethod(val)}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded-xl shadow-sm p-4 h-fit">
          <h2 className="font-semibold text-blue-700 mb-4">Ringkasan</h2>

          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </p>
            <p className="flex justify-between">
              <span>Ongkir</span>
              <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
            </p>
            <p className="flex justify-between">
              <span>Fee Payment</span>
              <span>Rp {tripayFee.toLocaleString("id-ID")}</span>
            </p>
          </div>

          <hr className="my-3" />

          <p className="flex justify-between font-bold text-blue-700 text-lg">
            <span>Total</span>
            <span>Rp {finalTotal.toLocaleString("id-ID")}</span>
          </p>

          <button
            onClick={handleCheckout}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>

      {paymentTransaction && (
        <FloatingPayment
          payment={paymentTransaction}
          onClose={() => setPaymentTransaction(null)}
        />
      )}
    </div>
  );
}
