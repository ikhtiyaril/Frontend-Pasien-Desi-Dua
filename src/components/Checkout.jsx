import React, { useEffect, useState } from "react";
import axios from "axios";
import FloatingPayment from "../components/FloatingPayment";
import PaymentMethodCheckbox from "./CheckboxPayment";

const API = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const token = localStorage.getItem("token");

  // =============================
  // CART & PAYMENT
  // =============================
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentFee, setPaymentFee] = useState(null);
  const [payment, setPayment] = useState([]);
  const [paymentTransaction, setPaymentTransaction] = useState(null);

  // =============================
  // SHIPPING
  // =============================
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  // =============================
  // REGION & ADDRESS
  // =============================
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [province, setProvince] = useState("");
  const [regency, setRegency] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  // =============================
  // FETCH CART & PAYMENT
  // =============================
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.data.items || []);
    } catch (err) {
      console.error("Gagal ambil cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`${API}/api/payment`);
      setPayment(res.data.data.data || []);
    } catch (err) {
      console.error("Gagal ambil metode pembayaran:", err);
      setPayment([]);
    }
  };

  // =============================
  // FETCH REGION
  // =============================
  const fetchProvinces = async () => {
    try {
      const res = await axios.get(`${API}/api/shipping/provinces`);
      setProvinces(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil provinsi:", err);
      setProvinces([]);
    }
  };

  const fetchRegencies = async (provinceCode) => {
    try {
      const res = await axios.get(
        `${API}/api/shipping/regencies/${provinceCode}`
      );
      setRegencies(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil kabupaten/kota:", err);
      setRegencies([]);
    }
  };

  const fetchDistricts = async (regencyCode) => {
    try {
      const res = await axios.get(
        `${API}/api/shipping/districts/${regencyCode}`
      );
      setDistricts(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil kecamatan:", err);
      setDistricts([]);
    }
  };

  const fetchVillages = async (districtCode) => {
    try {
      const res = await axios.get(
        `${API}/api/shipping/villages/${districtCode}`
      );
      setVillages(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil desa/kelurahan:", err);
      setVillages([]);
    }
  };

  // =============================
  // FETCH SHIPPING COST (DESA)
  // =============================
  const fetchShippingCost = async (villageCode) => {
    try {
      const res = await axios.get(`${API}/api/shipping/shipping-cost`, {
        params: {
          destination_village_code: villageCode,
        },
      });

      setCouriers(res.data.data.couriers || []);
      setSelectedCourier(null);
      setShippingCost(0);
    } catch (err) {
      console.error("Gagal ambil ongkir:", err);
      setCouriers([]);
      setSelectedCourier(null);
      setShippingCost(0);
    }
  };

  // =============================
  // INIT
  // =============================
  useEffect(() => {
    fetchCart();
    fetchPayment();
    fetchProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =============================
  // TOTAL
  // =============================
  const subtotal = cart.reduce(
    (acc, item) => acc + item.quantity * (item.product?.price || 0),
    0
  );

  const fetchPaymentFee = async (method) => {
    if (!method) {
      setPaymentFee(null);
      return;
    }
    try {
      const res = await axios.post(
        `${API}/api/payment/fee`,
        { code: method, amount: subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentFee(res.data.data?.[0] || null);
    } catch (err) {
      console.error("Gagal ambil payment fee:", err);
      setPaymentFee(null);
    }
  };

  useEffect(() => {
    if (paymentMethod) fetchPaymentFee(paymentMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, subtotal]);

  const tripayFee = paymentFee?.total_fee?.merchant || 0;
  const finalTotal = subtotal + shippingCost + tripayFee;

  // =============================
  // CHECKOUT
  // =============================
  const handleCheckout = async () => {
  if (isProcessing) return;

  // VALIDASI
  if (!province || !regency || !district || !village || !addressDetail) {
    return alert("Lengkapi alamat pengiriman");
  }

  if (!selectedCourier) {
    return alert("Pilih jasa pengiriman");
  }

  if (!paymentMethod) {
    return alert("Pilih metode pembayaran");
  }

  if (!cart || cart.length === 0) {
    return alert("Keranjang kosong");
  }

  setIsProcessing(true);

  try {
    // =========================
    // 1. CREATE ORDER
    // =========================
    const orderBody = {
      items: cart, // ini masih oke buat create order
      shipping: {
        courier_code: selectedCourier.courier_code ?? selectedCourier.code ?? null,
        courier_name: selectedCourier.courier_name ?? selectedCourier.name ?? null,
        cost: shippingCost,
      },
      shipping_address: {
        province,
        regency,
        district,
        village,
        address_detail: addressDetail,
      },
      payment_method: paymentMethod,
    };

    const orderRes = await axios.post(
      `${API}/api/orders/create`,
      orderBody,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const order = orderRes.data?.order || orderRes.data?.data || null;

    if (!order) {
      throw new Error("Gagal membuat order");
    }

    // =========================
    // 2. PAYMENT CHECKOUT
    // =========================
    const paymentRes = await axios.post(
      `${API}/api/paymentXendit/checkout`,
      {
        id: order.id,
        reference:
          order.order_code ??
          order.orderCode ??
          order.code ??
          `ORDER-${order.id}`,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const paymentData =
      paymentRes.data?.data?.data || paymentRes.data?.data || null;

    if (!paymentData) {
      throw new Error("Gagal membuat pembayaran");
    }
    window.location.href = paymentRes.data?.data.invoice_url;
    
    // =========================
    // 3. SET PAYMENT UI
    // =========================

    setPaymentTransaction(paymentData);

    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Checkout gagal. Silakan coba lagi.");
  } finally {
    setIsProcessing(false);
  }
};
  // =============================
  // UI
  // =============================
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* CART */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-blue-700">Produk</h2>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-500">Keranjang kosong.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        Rp {Number(item.product?.price || 0).toLocaleString("id-ID")} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    Rp {Number((item.product?.price || 0) * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* ADDRESS */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-blue-700">Alamat Pengiriman</h2>

            {/* PROVINCE */}
            <select
              className="w-full border rounded-lg p-2"
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setRegency("");
                setDistrict("");
                setVillage("");
                setCouriers([]);
                setShippingCost(0);
                if (e.target.value) fetchRegencies(e.target.value);
              }}
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* REGENCY */}
            {province && (
              <select
                className="w-full border rounded-lg p-2"
                value={regency}
                onChange={(e) => {
                  setRegency(e.target.value);
                  setDistrict("");
                  setVillage("");
                  setCouriers([]);
                  setShippingCost(0);
                  if (e.target.value) fetchDistricts(e.target.value);
                }}
              >
                <option value="">Pilih Kabupaten / Kota</option>
                {regencies.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}

            {/* DISTRICT */}
            {regency && (
              <select
                className="w-full border rounded-lg p-2"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setVillage("");
                  setCouriers([]);
                  setShippingCost(0);
                  if (e.target.value) fetchVillages(e.target.value);
                }}
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* VILLAGE */}
            {district && (
              <select
                className="w-full border rounded-lg p-2"
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  setCouriers([]);
                  setShippingCost(0);
                  if (e.target.value) fetchShippingCost(e.target.value);
                }}
              >
                <option value="">Pilih Desa / Kelurahan</option>
                {villages.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}

            <textarea
              rows="3"
              className="w-full border rounded-lg p-2"
              placeholder="Alamat lengkap (Nama jalan, RT/RW, No Rumah)"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
          </div>

          {/* SHIPPING */}
          {couriers.length > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <h2 className="font-semibold text-blue-700 mb-2">Pilih Jasa Pengiriman (3kg)</h2>

              {couriers.map((c, i) => (
                <label
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-3 mb-2 cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="courier"
                      checked={selectedCourier?.courier_code === c.courier_code}
                      onChange={() => {
                        setSelectedCourier(c);
                        setShippingCost(c.price || 0);
                      }}
                    />
                    <div>
                      <p className="font-medium">{c.courier_name}</p>
                      <p className="text-sm text-gray-500">Estimasi: {c.estimation || "-"}</p>
                    </div>
                  </div>
                  <p className="font-semibold">Rp {Number(c.price || 0).toLocaleString("id-ID")}</p>
                </label>
              ))}
            </div>
          )}

          {/* PAYMENT */}
          <div className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold text-blue-700 mb-3">Metode Pembayaran</h2>
            <PaymentMethodCheckbox data={payment} selectedMethod={paymentMethod} onChange={setPaymentMethod} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded-xl p-4 h-fit">
          <h2 className="font-semibold text-blue-700 mb-3">Ringkasan</h2>

          <p className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Rp {Number(subtotal).toLocaleString("id-ID")}</span>
          </p>
          <p className="flex justify-between text-sm">
            <span>Ongkir</span>
            <span>Rp {Number(shippingCost).toLocaleString("id-ID")}</span>
          </p>
          <p className="flex justify-between text-sm">
            <span>Fee Payment</span>
            <span>Rp {Number(tripayFee).toLocaleString("id-ID")}</span>
          </p>

          <hr className="my-3" />

          <p className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {Number(finalTotal).toLocaleString("id-ID")}</span>
          </p>

          <button
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            className={`w-full mt-4 py-3 rounded-xl font-semibold ${isProcessing || cart.length === 0 ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {isProcessing ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>

      {paymentTransaction && (
        <FloatingPayment payment={paymentTransaction} onClose={() => setPaymentTransaction(null)} />
      )}
    </div>
  );
}
