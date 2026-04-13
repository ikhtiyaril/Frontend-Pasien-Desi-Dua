import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FloatingPayment from "./FloatingPayment";

// ─── SVG Icon Components ──────────────────────────────────────────────────────
const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const IconCreditCard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconTruck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconPackage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconHash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const IconShoppingBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconZap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// ─── Status Config ────────────────────────────────────────────────────────────
const LOGISTIC_STATUS = {
  pending:    { label: "Pending",    dot: "#f59e0b", bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  processing: { label: "Diproses",  dot: "#3b82f6", bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  delivered:  { label: "Dikirim",   dot: "#6366f1", bg: "#eef2ff", text: "#3730a3", border: "#c7d2fe" },
  completed:  { label: "Selesai",   dot: "#10b981", bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  cancelled:  { label: "Dibatalkan",dot: "#ef4444", bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
};
const PAYMENT_STATUS = {
  PAID:    { label: "Lunas",   bg: "#ecfdf5", text: "#059669" },
  UNPAID:  { label: "Belum",   bg: "#fff7ed", text: "#c2410c" },
  PENDING: { label: "Pending", bg: "#fff7ed", text: "#c2410c" },
  EXPIRED: { label: "Expired", bg: "#f9fafb", text: "#6b7280" },
  FAILED:  { label: "Gagal",   bg: "#fef2f2", text: "#dc2626" },
};

// ─── Sub Components ───────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const cfg = LOGISTIC_STATUS[status] || { label: status, dot: "#9ca3af", bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };
  return (
    <span style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.02em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

const PaymentChip = ({ status }) => {
  const cfg = PAYMENT_STATUS[status] || { label: status, bg: "#f3f4f6", text: "#6b7280" };
  return (
    <span style={{ background: cfg.bg, color: cfg.text, padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {cfg.label}
    </span>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
    <span style={{ color: "#93c5fd", marginTop: 2, flexShrink: 0 }}>{icon}</span>
    <div>
      <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{value || "—"}</p>
    </div>
  </div>
);

const Divider = () => <div style={{ height: 1, background: "#e2e8f0", margin: "12px 0" }} />;

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", padding: 20 }}>
    {[80, 120, 60].map((w, i) => (
      <div key={i} style={{ height: 14, width: `${w}%`, background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "400% 100%", borderRadius: 6, marginBottom: 10, animation: "shimmer 1.4s infinite" }} />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrdersDashboard({ initialFetch = true }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (initialFetch) fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data?.orders || []);
    } catch (err) {
      setError("Gagal mengambil daftar order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/api/payment/session`, {
        params: { type: "order", id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayment(response.data.session.session_data);
    } catch (err) {
      alert("Gagal memproses pembayaran");
    }
  };

  const formatCurrency = (v) =>
    new Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    page: {
      minHeight: "100vh",
      background: "#f0f6ff",
      padding: "24px 16px",
      fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif",
    },
    container: { maxWidth: 860, margin: "0 auto" },
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 28,
    },
    headerLeft: {},
    title: {
      margin: 0, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800,
      color: "#0f172a", letterSpacing: "-0.03em",
      display: "flex", alignItems: "center", gap: 10,
    },
    titleIcon: {
      width: 36, height: 36, borderRadius: 10, background: "#2563eb",
      display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
    },
    subtitle: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
    refreshBtn: {
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 14px", background: "#fff", border: "1px solid #dbeafe",
      borderRadius: 10, cursor: "pointer", color: "#2563eb", fontSize: 13, fontWeight: 600,
      transition: "all 0.15s", boxShadow: "0 1px 3px rgba(37,99,235,0.08)",
    },
    // Card
    card: {
      background: "#fff", border: "1px solid #dbeafe", borderRadius: 16,
      overflow: "hidden", marginBottom: 14,
      transition: "box-shadow 0.2s, transform 0.2s",
      boxShadow: "0 1px 4px rgba(37,99,235,0.06)",
    },
    cardHeader: {
      padding: "16px 20px",
      display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
      gap: 12, borderBottom: "1px solid #f1f5f9",
    },
    orderCode: { fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#2563eb", letterSpacing: "0.04em" },
    date: { display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "#94a3b8" },
    cardMeta: {
      padding: "12px 20px",
      display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
      gap: 10, background: "#fafcff",
    },
    metaLeft: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
    metaItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" },
    metaLabel: { color: "#94a3b8" },
    payBtn: {
      display: "flex", alignItems: "center", gap: 6,
      background: "#2563eb", color: "#fff", padding: "7px 18px",
      borderRadius: 9, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
      transition: "all 0.15s", boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
      letterSpacing: "0.01em",
    },
    total: { textAlign: "right" },
    totalLabel: { fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 },
    totalValue: { fontSize: 16, fontWeight: 800, color: "#0f172a" },
    chevronBtn: {
      padding: 7, borderRadius: 8, border: "1px solid #e2e8f0",
      background: "#f8faff", cursor: "pointer", color: "#64748b",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.15s",
    },
    rightGroup: { display: "flex", alignItems: "center", gap: 10 },
    // Expanded
    expanded: {
      padding: "20px",
      background: "#f8faff",
      borderTop: "1px solid #e2e8f0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 20,
    },
    sectionTitle: {
      fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase",
      letterSpacing: "0.1em", marginBottom: 12,
      display: "flex", alignItems: "center", gap: 6,
    },
    sectionIcon: { color: "#93c5fd" },
    itemRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" },
    itemName: { fontSize: 13, color: "#374151" },
    itemQty: { fontSize: 11, color: "#94a3b8", marginLeft: 4 },
    itemPrice: { fontSize: 13, fontWeight: 600, color: "#1e293b" },
    infoBox: {
      background: "#fff", border: "1px solid #dbeafe", borderRadius: 12,
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12,
    },
    resiCode: { fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: "#2563eb", letterSpacing: "0.06em" },
    addressBlock: { fontSize: 13, color: "#475569", lineHeight: 1.6 },
    addressName: { fontWeight: 700, color: "#0f172a", marginBottom: 2 },
    // Empty & Error
    empty: { textAlign: "center", padding: "60px 24px", color: "#94a3b8" },
    emptyIcon: { marginBottom: 16, color: "#cbd5e1" },
    emptyTitle: { fontSize: 16, fontWeight: 700, color: "#64748b", marginBottom: 6 },
    emptyText: { fontSize: 13 },
    errorBox: {
      background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
      padding: "14px 18px", color: "#dc2626", fontSize: 13, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .order-card:hover { box-shadow: 0 6px 24px rgba(37,99,235,0.1) !important; transform: translateY(-1px); }
        .refresh-btn:hover { background: #eff6ff !important; }
        .pay-btn:hover { background: #1d4ed8 !important; transform: translateY(-1px); }
        .chevron-btn:hover { background: #eff6ff !important; border-color: #bfdbfe !important; color: #2563eb !important; }
        .expanded-section { animation: fadeSlide 0.2s ease; }
      `}</style>

      <div style={S.page}>
        <div style={S.container}>

          {/* ── Header ── */}
          <div style={S.header}>
            <div style={S.headerLeft}>
              <h1 style={S.title}>
                <span style={S.titleIcon}><IconShoppingBag /></span>
                Riwayat Pesanan
              </h1>
              <p style={S.subtitle}>Pantau status pengiriman dan pembayaran Anda</p>
            </div>
            <button className="refresh-btn" style={S.refreshBtn} onClick={fetchOrders}>
              <IconRefresh />
              Refresh
            </button>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={S.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* ── Loading ── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : orders.length === 0 ? (
            /* ── Empty ── */
            <div style={S.empty}>
              <div style={S.emptyIcon}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p style={S.emptyTitle}>Belum Ada Pesanan</p>
              <p style={S.emptyText}>Pesanan Anda akan muncul di sini setelah checkout.</p>
            </div>
          ) : (
            /* ── Order List ── */
            <div>
              {orders.map((order) => (
                <div key={order.id} className="order-card" style={S.card}>

                  {/* Card Header */}
                  <div style={S.cardHeader}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={S.orderCode}>{order.order_code}</span>
                        <StatusPill status={order.status} />
                      </div>
                      <div style={S.date}>
                        <IconCalendar />
                        {new Date(order.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
                      </div>
                    </div>

                    <div style={S.rightGroup}>
                      <div style={S.total}>
                        <p style={S.totalLabel}>Total Tagihan</p>
                        <p style={S.totalValue}>{formatCurrency(order.total_price)}</p>
                      </div>
                      <button
                        className="chevron-btn"
                        style={S.chevronBtn}
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        aria-label="Toggle detail"
                      >
                        {expandedId === order.id ? <IconChevronUp /> : <IconChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Card Meta */}
                  <div style={S.cardMeta}>
                    <div style={S.metaLeft}>
                      <div style={S.metaItem}>
                        <span style={{ color: "#93c5fd" }}><IconCreditCard /></span>
                        <span style={S.metaLabel}>Pembayaran</span>
                        <PaymentChip status={order.payment_status} />
                      </div>
                      <div style={{ width: 1, height: 16, background: "#e2e8f0" }} />
                      <div style={S.metaItem}>
                        <span style={{ color: "#93c5fd" }}><IconTruck /></span>
                        <span style={S.metaLabel}>Kurir</span>
                        <span style={{ fontWeight: 600, textTransform: "capitalize", color: "#1e293b" }}>
                          {order.ekspedition || "Belum dipilih"}
                        </span>
                      </div>
                    </div>

                    {(order.payment_status === "PENDING" || order.payment_status === "UNPAID") && order.status === "pending" && (
                      <button className="pay-btn" style={S.payBtn} onClick={() => handlePay(order.id)}>
                        <IconZap />
                        Bayar Sekarang
                      </button>
                    )}
                  </div>

                  {/* Expanded Detail */}
                  {expandedId === order.id && (
                    <div className="expanded-section" style={S.expanded}>

                      {/* 1. Item Pesanan */}
                      <div>
                        <p style={S.sectionTitle}>
                          <span style={S.sectionIcon}><IconPackage /></span>
                          Item Pesanan
                        </p>
                        <div>
                          {order.items?.map((item, idx) => (
                            <div key={idx}>
                              <div style={S.itemRow}>
                                <span style={S.itemName}>
                                  {item.product?.name}
                                  <span style={S.itemQty}>×{item.quantity}</span>
                                </span>
                                <span style={S.itemPrice}>{formatCurrency(item.price)}</span>
                              </div>
                              {idx < order.items.length - 1 && <Divider />}
                            </div>
                          ))}
                          <Divider />
                          <div style={{ ...S.itemRow, background: "#eff6ff", borderRadius: 8, padding: "8px 10px", marginTop: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", display: "flex", alignItems: "center", gap: 5 }}>
                              <IconTruck /> Ongkos Kirim
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>{formatCurrency(order.shipping_cost || 0)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Info Pengiriman */}
                      <div>
                        <p style={S.sectionTitle}>
                          <span style={S.sectionIcon}><IconTruck /></span>
                          Informasi Pengiriman
                        </p>
                        <div style={S.infoBox}>
                          <InfoRow
                            icon={<IconHash />}
                            label="Nomor Resi"
                            value={<span style={S.resiCode}>{order.no_resi || "Belum tersedia"}</span>}
                          />
                          <Divider />
                          <InfoRow
                            icon={<IconCreditCard />}
                            label="Metode Pembayaran"
                            value={order.payment_method ? order.payment_method.toUpperCase() : "Belum dipilih"}
                          />
                        </div>
                      </div>

                      {/* 3. Alamat */}
                      <div>
                        <p style={S.sectionTitle}>
                          <span style={S.sectionIcon}><IconMapPin /></span>
                          Alamat Tujuan
                        </p>
                        <div style={S.infoBox}>
                          <div style={S.addressBlock}>
                            <p style={S.addressName}>{order.user?.name || "Penerima"}</p>
                            <p style={{ margin: 0 }}>{order.address_detail}</p>
                            <p style={{ margin: 0 }}>{order.village}, {order.district}</p>
                            <p style={{ margin: 0 }}>{order.regency}, {order.province}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {payment && <FloatingPayment payment={payment} onClose={() => setPayment(null)} />}
    </>
  );
}