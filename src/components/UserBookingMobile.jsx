import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentMethodList from "./PaymentMethodList";
import PaymentMethodCheckbox from "./CheckboxPayment";
import { Calculator } from "lucide-react";
import PaymentFeeCalculator from "./CalculatorPayment";
import FloatingPayment from "./FloatingPayment";
import {
  Clock,
  DollarSign,
  Video,
  Stethoscope,
  Star,
  Calendar,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  MapPin,
  FileText,
  User,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import BookingService from "./BookingService";
import BookingDoctorCard from "./BookingDoctorCard";

export default function UserBookingMobile() {
  const API = import.meta.env.VITE_API_URL;
  const API_KEY_TRIPAY = import.meta.env.VITE_API_KEY_TRIPAY;

  // ─── REDIRECT IF NOT LOGGED IN ────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  // ==========================================
  // STATE (TIDAK DIUBAH)
  // ==========================================
  const [form, setForm] = useState({
    service_id: "",
    doctor_id: "",
    date: "",
    time_start: "",
    notes: "",
  });

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(false);

  const [duration, setDuration] = useState(0);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [blockedTime, setBlockedTime] = useState([]);
  const [slots, setSlots] = useState([]);
  const [paymentTime, setPaymentTime] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [calculatorData, setCalculatorData] = useState(null);
  const [paymentTransaction, setPaymentTransaction] = useState(null);

  // ─── MOBILE STEP STATE ────────────────────────────────────────────────────
  // Step 1: Pilih Layanan, Step 2: Pilih Dokter, Step 3: Jadwal & Detail
  const [currentStep, setCurrentStep] = useState(1);

  // ==========================================
  // FETCH (TIDAK DIUBAH)
  // ==========================================
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/api/service`);
      const filteredServices = res.data.filter(
        (service) => service.is_doctor_service === false
      );
      setServices(filteredServices);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const fetchDoctors = async () => {
    const res = await axios.get(`${API}/api/doctor`);
    setDoctors(res.data.data);
  };

  const fetchBlockedTimes = async () => {
    const res = await axios.get(
      `${API}/api/blocked-time/doctor/${form.doctor_id}/date/${form.date}`
    );
    setBlockedTime(res.data);
  };

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`${API}/api/payment`);
      setPayment(res.data.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const fetchSchedules = async () => {
    if (!form.doctor_id || !form.date) return;
    try {
      const res = await axios.get(`${API}/api/doctor-schedule/${form.doctor_id}`, {
        params: { date: form.date },
      });
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setDoctorSchedule(data);
    } catch (err) {
      console.error("Gagal fetch schedules:", err);
    }
  };

  useEffect(() => {
    if (!form.doctor_id || !form.date) return;
    fetchBlockedTimes();
  }, [form.doctor_id, form.date]);

  useEffect(() => {
    fetchServices();
    fetchDoctors();
    fetchPayment();
  }, []);

  useEffect(() => {
    if (!form.service_id) return;
    const svc = services.find((s) => s.id === Number(form.service_id));
    if (svc) setDuration(svc.duration_minutes || 30);
    const filtered = doctors.filter((d) => svc?.doctorIds?.includes(d.id));
    setAvailableDoctors(filtered);
    setForm((prev) => ({ ...prev, doctor_id: "" }));
  }, [form.service_id, services, doctors]);

  useEffect(() => {
    fetchSchedules();
  }, [form.doctor_id, form.date]);

  // ==========================================
  // SLOT GENERATOR (TIDAK DIUBAH)
  // ==========================================
  const minutesToTime = (m) => {
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${h}:${mm}`;
  };

  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":");
    return parseInt(h) * 60 + parseInt(m);
  };

  const generateSlots = () => {
    if (!doctorSchedule || !duration) return setSlots([]);
    const { start_time, end_time, break_start, break_end } = doctorSchedule;
    const start = timeToMinutes(start_time);
    const end = timeToMinutes(end_time);
    const breakStart = break_start ? timeToMinutes(break_start) : null;
    const breakEnd = break_end ? timeToMinutes(break_end) : null;
    const arr = [];
    for (let t = start; t + duration <= end; t += duration) {
      const slot = { time: minutesToTime(t), disabled: false };
      if (breakStart && breakEnd && t >= breakStart && t < breakEnd) slot.disabled = true;
      blockedTime.forEach((b) => {
        const bStart = timeToMinutes(b.time_start);
        const bEnd = timeToMinutes(b.time_end);
        if (t >= bStart && t < bEnd) slot.disabled = true;
      });
      arr.push(slot);
    }
    setSlots(arr);
  };

  useEffect(() => {
    generateSlots();
  }, [doctorSchedule, duration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================================
  // SUBMIT (TIDAK DIUBAH)
  // ==========================================
  const handleSubmit = async () => {
    if (loading) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu");
      window.location.href = "/login";
    }
    if (!form.date || !form.time_start) {
      return alert("Tanggal & jam wajib diisi");
    }
    if (!selectedService) {
      return alert("Service tidak tersedia");
    }
    setLoading(true);
    try {
      const bookingStart = Date.now();
      const res = await axios.post(`${API}/api/booking`, form, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      const bookingDuration = Date.now() - bookingStart;
      console.log("⏱ Booking duration:", bookingDuration, "ms");
      const booking = res.data.booking;
      if (!booking) throw new Error("Booking gagal dibuat");
      const price = selectedService?.price || 0;
      if (price <= 0) throw new Error("Harga service tidak valid");
      const paymentPayload = {
        merchant_ref: booking.booking_code,
        amount: price,
        order_items: [{ name: selectedService.name, price, quantity: 1 }],
        id: booking.id,
      };
      const paymentStart = Date.now();
      const response = await axios.post(`${API}/api/paymentXendit`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentDuration = Date.now() - paymentStart;
      console.log("⏱ Payment duration:", paymentDuration, "ms");
      const invoice = response.data?.data;
      if (!invoice?.invoice_url) throw new Error("Invoice URL tidak ditemukan");
      setPayment(invoice);
      alert("Booking Berhasil");
      window.location.href = invoice.invoice_url;
    } catch (err) {
      console.log("❌ ERROR IN BOOKING FLOW");
      if (err.response) console.dir(err.response.data, { depth: null });
      console.error("\nSTACK:", err.stack);
      alert(err.response?.data?.message || err.message || "Terjadi kesalahan");
    } finally {
      console.log("\n🏁 BOOKING FLOW END\n");
      setLoading(false);
    }
  };

  const chooseService = (srv) => {
    setSelectedService(srv);
    setSelectedDoctor(null);
    setForm((prev) => ({ ...prev, service_id: srv.id, doctor_id: "" }));
    setCurrentStep(2);
  };

  const chooseDoctor = (doc) => {
    setSelectedDoctor(doc);
    setForm((prev) => ({ ...prev, doctor_id: doc.id }));
    setCurrentStep(3);
  };

  useEffect(() => {
    if (paymentMethod) calculatorPrice();
  }, [paymentMethod]);

  const calculatorPrice = async () => {
    const res = await axios.post(`${API}/api/payment/fee`, {
      code: paymentMethod,
      amount: selectedService.price,
    });
    setCalculatorData(res.data.data);
  };

  // ==========================================
  // STEP LABEL CONFIG
  // ==========================================
  const STEPS = [
    { id: 1, label: "Layanan" },
    { id: 2, label: "Dokter" },
    { id: 3, label: "Jadwal" },
  ];

  const canSubmit =
    form.date && form.time_start && selectedService && selectedDoctor && !loading;

  // ==========================================
  // STEP INDICATOR
  // ==========================================
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-0 px-4 py-3">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isDone = currentStep > step.id;
        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => {
                if (isDone) setCurrentStep(step.id);
              }}
              className="flex flex-col items-center gap-1 min-w-[56px]"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isDone ? "bg-green-500 text-white shadow shadow-green-200"
                    : isActive ? "bg-blue-600 text-white shadow shadow-blue-200"
                    : "bg-blue-100 text-blue-400"}`}
              >
                {isDone ? <Check size={14} /> : step.id}
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors
                  ${isActive ? "text-blue-600" : isDone ? "text-green-500" : "text-blue-300"}`}
              >
                {step.label}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-[2px] mb-4 mx-1 rounded-full transition-colors
                  ${currentStep > step.id ? "bg-green-400" : "bg-blue-100"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ==========================================
  // STEP 1: PILIH LAYANAN
  // ==========================================
  const renderStep1 = () => (
    <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4">
      <div className="pt-2 pb-1">
        <h2 className="text-lg font-bold text-gray-900">Pilih Layanan</h2>
        <p className="text-gray-500 text-xs mt-0.5">
          Pilih layanan kesehatan yang Anda butuhkan
        </p>
      </div>
      {services.map((s) => (
        <div
          key={s?.id}
          onClick={() => chooseService(s)}
          className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <BookingService service={s} onSelect={chooseService} />
        </div>
      ))}
    </div>
  );

  // ==========================================
  // STEP 2: PILIH DOKTER
  // ==========================================
  const renderStep2 = () => {
    const availDocs = doctors.filter((d) =>
      selectedService?.doctorIds?.includes(d.id)
    );
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4">
        {/* Selected Service Chip */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pilih Dokter</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Untuk layanan{" "}
              <span className="font-semibold text-blue-600">
                {selectedService?.name}
              </span>
            </p>
          </div>
          <button
            onClick={() => setCurrentStep(1)}
            className="text-xs text-blue-500 font-semibold bg-blue-50 px-3 py-1.5 rounded-full"
          >
            Ganti
          </button>
        </div>

        {availDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <User size={28} className="text-blue-300" />
            </div>
            <p className="text-gray-400 text-sm">
              Tidak ada dokter untuk layanan ini
            </p>
          </div>
        ) : (
          availDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => chooseDoctor(doc)}
              className="bg-white rounded-2xl border border-blue-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer overflow-hidden"
            >
              <BookingDoctorCard
                doctor={doc}
                service={selectedService}
                onSelect={chooseDoctor}
              />
            </div>
          ))
        )}
      </div>
    );
  };

  // ==========================================
  // STEP 3: JADWAL & DETAIL
  // ==========================================
  const renderStep3 = () => (
    <div className="flex-1 overflow-y-auto pb-40">
      {/* Doctor Info Card */}
      {selectedDoctor && (
        <div className="mx-4 mt-2 mb-5 bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-4 shadow-lg shadow-blue-200">
          <div className="flex items-center gap-3">
            <img
              src={selectedDoctor.avatar || "https://via.placeholder.com/120"}
              alt={selectedDoctor.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white/30"
            />
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold truncate">{selectedDoctor.name}</div>
              <div className="text-blue-100 text-xs mt-0.5">{selectedDoctor.specialization}</div>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill="#FCD34D" className="text-yellow-300" />
                ))}
                <span className="text-blue-200 text-[10px] ml-1">(12)</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="shrink-0 text-[10px] bg-white/20 text-white px-2.5 py-1.5 rounded-full font-semibold"
            >
              Ganti
            </button>
          </div>
        </div>
      )}

      <div className="px-4 space-y-5">
        {/* Tanggal */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
          <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2.5 block">
            Tanggal Booking
          </label>
          <input
            type="date"
            className="w-full p-3 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 transition-all bg-blue-50"
            disabled={!selectedDoctor}
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* Pilih Jam */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
          <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2.5 block">
            Jam Tersedia
          </label>
          {!form.date ? (
            <div className="py-8 flex flex-col items-center gap-2 border-2 border-dashed border-blue-100 rounded-xl">
              <Calendar size={24} className="text-blue-200" />
              <span className="text-sm text-gray-400">Pilih tanggal terlebih dahulu</span>
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  disabled={s.disabled}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, time_start: s.time }));
                    setPaymentTime(true);
                  }}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all
                    ${form.time_start === s.time
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                      : s.disabled
                        ? "bg-gray-50 text-gray-200 cursor-not-allowed border-gray-100"
                        : "bg-white border-blue-100 hover:border-blue-400 text-gray-700 active:scale-95"
                    }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              Tidak ada jadwal tersedia
            </div>
          )}
        </div>

        {/* Keluhan / Catatan */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
          <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2.5 block">
            Keluhan
          </label>
          <textarea
            className="w-full h-28 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 resize-none placeholder:text-gray-400"
            value={form.notes}
            placeholder="Tuliskan keluhan singkat..."
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        {/* Metode Pembayaran */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
          <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2.5 block">
            Pembayaran
          </label>
          {!paymentTime ? (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <AlertCircle size={16} className="text-blue-400 shrink-0" />
              <span className="text-xs text-blue-600">
                Pilih jam terlebih dahulu untuk mengaktifkan pembayaran
              </span>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-gray-800 mb-1">Metode Pembayaran</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pemilihan metode pembayaran dilakukan setelah booking selesai.
              </p>
              <div className="mt-3 flex items-center gap-2 text-green-600 text-xs font-semibold">
                <CheckCircle size={14} />
                Lanjutkan booking untuk memilih metode
              </div>
            </div>
          )}
        </div>

        {/* Calculator (jika ada paymentMethod) */}
        {paymentMethod && calculatorData && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
            <PaymentFeeCalculator data={calculatorData} service={selectedService} />
          </div>
        )}

        {/* Ringkasan Layanan */}
        {selectedService && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              Ringkasan
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-blue-500" />
                <span className="text-sm text-gray-700 font-medium">
                  {selectedService.name}
                </span>
              </div>
              <span className="text-sm font-bold text-blue-700">
                Rp {Number(selectedService.price || 0).toLocaleString("id-ID")}
              </span>
            </div>
            {selectedService.duration_minutes && (
              <div className="flex items-center gap-2 mt-1.5">
                <Clock size={13} className="text-blue-400" />
                <span className="text-xs text-gray-500">
                  {selectedService.duration_minutes} menit
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // BOTTOM ACTION BAR
  // ==========================================
  const renderBottomBar = () => {
    if (currentStep === 1) return null;

    if (currentStep === 2) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-blue-100 px-4 py-4 shadow-2xl max-w-md mx-auto">
          <p className="text-center text-xs text-gray-400 mb-3">
            Tap salah satu dokter di atas untuk melanjutkan
          </p>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-blue-100 px-4 pt-3 pb-5 shadow-2xl max-w-md mx-auto">
          {selectedService && (
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                Total Bayar
              </span>
              <span className="text-xl font-black text-blue-700">
                Rp {Number(selectedService.price || 0).toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all
              ${canSubmit
                ? "bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-[0.98] hover:bg-blue-700"
                : "bg-blue-100 text-blue-300 cursor-not-allowed"}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memproses...
              </span>
            ) : (
              <>Buat Booking <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      );
    }
  };

  // ==========================================
  // RENDER UTAMA
  // ==========================================
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col max-w-md mx-auto relative">
      {/* ── TOP HEADER ── */}
      <div className="bg-white sticky top-0 z-40 border-b border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-1">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 active:scale-95 transition-transform shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-base font-black text-blue-700 flex items-center gap-1.5">
              <Stethoscope size={18} className="text-blue-600" />
              Form Booking
            </h1>
            <p className="text-[11px] text-gray-400">
              {currentStep === 1 && "Pilih layanan kesehatan Anda"}
              {currentStep === 2 && "Pilih dokter yang sesuai"}
              {currentStep === 3 && "Lengkapi jadwal & detail"}
            </p>
          </div>
        </div>
        {renderStepIndicator()}
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden pt-1">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* ── BOTTOM BAR ── */}
      {renderBottomBar()}

      {/* ── FLOATING PAYMENT ── */}
      <FloatingPayment
        payment={paymentTransaction}
        onClose={() => setPaymentTransaction(null)}
      />
    </div>
  );
}