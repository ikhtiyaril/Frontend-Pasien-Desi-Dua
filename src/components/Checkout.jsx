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

  const [paymentMethod, setPaymentMethod] = useState(""); // Tripay code
  const [paymentFee, setPaymentFee] = useState(null); // hasil fee calculator
const [payment,setPayment]= useState([])
  const [paymentTransaction, setPaymentTransaction] = useState(null); // untuk FloatingPayment

  const token = localStorage.getItem("token");

  // =============================
  // FETCH CART
  // =============================
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.data.items)
      setCart(res.data.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      const res = await axios.get(
        ` ${API}/api/payment`,
      );
  
      console.log(res.data.data.data);
   setPayment(res.data.data.data)
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    fetchCart();
    fetchPayment()
  }, []);

  // =============================
  // HITUNG TOTAL BARANG
  // =============================
  const subtotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  // =============================
  // PAYMENT FEE FROM TRIPAY
  // =============================
  const fetchPaymentFee = async (method) => {
    if (!method) return;

    try {
      const res = await axios.post(
        `${API}/api/payment/fee`,
        {
          code :method,amount:subtotal
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentFee(res.data.data[0]); // Tripay always returns array
    } catch (err) {
      console.error("Fee Calc Error:", err);
    }
  };

  useEffect(() => {
    if (paymentMethod) {
      fetchPaymentFee(paymentMethod);
    }
  }, [paymentMethod, subtotal]);

  // =============================
  // TOTAL FINAL
  // =============================
  
  const tripayFee = paymentFee?.total_fee?.merchant || 0;

  const finalTotal = subtotal + shippingCost + tripayFee;

  // =============================
  // ON CHECKOUT
  // =============================
  const handleCheckout = async () => {
  if (!paymentMethod) return alert("Pilih metode pembayaran dulu!");

  try {
    // 1. Buat transaksi/order di backend
    const orderRes = await axios.post(
      `${API}/api/orders/create`,
      {
        items : cart,
        total_price: finalTotal, // subtotal + ongkir + fee
        payment_method: paymentMethod,
       
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderRes.data.order;
    const reference = order.order_code; // bisa pakai order_code sebagai merchant_ref
console.log(order)
    // 2. Buat pembayaran Tripay
    const paymentRes = await axios.post(
      `${API}/api/payment/checkout`,
      {
        reference,
        paymentMethod,
        amount: subtotal,
        shipping_cost: shippingCost,
        fee_customer: tripayFee,
        orderItems: cart.map(item => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        id : order.id
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
console.log(paymentRes.data)
    setPaymentTransaction(paymentRes.data.data.data);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Checkout gagal");
  }
};

  // =============================
  // DISPLAY
  // =============================
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

      {/* CART */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border rounded"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image_url}
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

      {/* SHIPPING */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Ongkir</h2>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="reguler"
            checked={shippingMethod === "reguler"}
            onChange={() => {
              setShippingMethod("reguler");
              setShippingCost(10000);
            }}
          />
          <span>Reguler - Rp 10.000</span>
        </label>
        <label className="flex items-center space-x-2 mt-2">
          <input
            type="radio"
            value="express"
            checked={shippingMethod === "express"}
            onChange={() => {
              setShippingMethod("express");
              setShippingCost(20000);
            }}
          />
          <span>Express - Rp 20.000</span>
        </label>
      </div>

      {/* PAYMENT */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Metode Pembayaran</h2>

         <PaymentMethodCheckbox
          data={payment}
          selectedMethod={paymentMethod}
          onChange={(val) => {setPaymentMethod(val)}}
        />
      </div>

      {/* TOTAL */}
      <div className="p-4 border rounded flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-500">Subtotal: Rp {subtotal}</p>
          <p className="text-gray-500">Ongkir: Rp {shippingCost}</p>
          <p className="text-gray-500">
            Fee Payment: Rp {tripayFee || 0}
          </p>
          <p className="text-xl font-bold mt-1">
            Total: Rp {finalTotal}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Bayar Sekarang
        </button>
      </div>

      {/* FLOATING PAYMENT */}
      {paymentTransaction && (
        <FloatingPayment
          payment={paymentTransaction}
          onClose={() => setPaymentTransaction(null)}
        />
      )}
    </div>
  );
}
