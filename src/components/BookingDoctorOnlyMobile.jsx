import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  CheckCircle2,
  Video,
  MapPin,
  FileText,
  User,
  Award,
  Stethoscope,
  Banknote,
  ArrowRight,
  Clock,
  ChevronDown,
  Check,
} from 'lucide-react';
import FloatingPayment from './FloatingPayment';

const API_URL = import.meta.env.VITE_API_URL || '';

// ─── STEP CONFIG ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Dokter' },
  { id: 2, label: 'Jadwal' },
  { id: 3, label: 'Detail' },
];

export default function BookingDoctorMobile() {
  // ==========================================
  // LOGIC & STATE (TIDAK DIUBAH)
  // ==========================================
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payment, setPayment] = useState(null);

  const [form, setForm] = useState({
    service_id: '',
    doctor_id: '',
    date: '',
    time_start: '',
    notes: '',
    consultation_type: 'online',
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [blockedTime, setBlockedTime] = useState([]);
  const [slots, setSlots] = useState([]);
  const [duration, setDuration] = useState(30);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ─── MOBILE STEP STATE ──────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);

  // ─── REDIRECT IF NOT LOGGED IN ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.replace('/login');
    }
  }, []);

  // --- Utils (TIDAK DIUBAH) ---
  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (m) => {
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return `${h}:${mm}`;
  };

  const formatDateAPI = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const normalizeImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.includes('localhost')) return url.replace(/http:\/\/localhost:\d+/, API_URL);
    return url;
  };

  // --- Fetch (TIDAK DIUBAH) ---
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor`);
      setDoctors(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExclusiveServices = async (doctorId) => {
    try {
      const res = await axios.get(`${API_URL}/api/service/doctors/${doctorId}/services`);
      return res.data || [];
    } catch (e) {
      return [];
    }
  };

  const fetchDoctorSchedule = async (doctorId, date) => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor-schedule/${doctorId}`, { params: { date } });
      return Array.isArray(res.data) ? res.data[0] : res.data;
    } catch (e) {
      return null;
    }
  };

  const fetchBlockedTimes = async (doctorId, date) => {
    try {
      const res = await axios.get(`${API_URL}/api/blocked-time/doctor/${doctorId}/date/${date}`);
      return res.data || [];
    } catch (e) {
      return [];
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      // const res = await axios.get(`${API_URL}/api/payment`);
      // setPaymentMethods(res.data.data?.data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const generateSlots = (schedule, dur, blocked) => {
    if (!schedule) return setSlots([]);
    const start = timeToMinutes(schedule.start_time);
    const end = timeToMinutes(schedule.end_time);
    const breakStart = schedule.break_start ? timeToMinutes(schedule.break_start) : null;
    const breakEnd = schedule.break_end ? timeToMinutes(schedule.break_end) : null;
    const arr = [];
    for (let t = start; t + dur <= end; t += dur) {
      let disabled = false;
      if (breakStart && breakEnd && t >= breakStart && t < breakEnd) disabled = true;
      blocked.forEach((b) => {
        const bStart = timeToMinutes(b.time_start);
        const bEnd = timeToMinutes(b.time_end);
        if (t >= bStart && t < bEnd) disabled = true;
      });
      arr.push({ time: minutesToTime(t), disabled });
    }
    setSlots(arr);
  };

  const totalPayment = useMemo(() => {
    const price = Number(selectedService?.price || 0);
    const parseFee = (feeMerchant) => {
      if (!feeMerchant) return 0;
      if (feeMerchant.flat != null) {
        const raw = feeMerchant.flat;
        if (typeof raw === 'number') return raw;
        if (typeof raw === 'string') {
          const digits = raw.replace(/[^\d]/g, '');
          const n = Number(digits);
          return Number.isFinite(n) ? n : 0;
        }
      }
      if (feeMerchant.amount != null) return Number(feeMerchant.amount) || 0;
      if (feeMerchant.value != null) return Number(feeMerchant.value) || 0;
      if (Array.isArray(feeMerchant) && feeMerchant.length > 0) return parseFee(feeMerchant[0]);
      return 0;
    };
    const fee = parseFee(selectedPayment?.fee_merchant);
    const total = price + fee;
    return Number.isFinite(total) ? total : 0;
  }, [selectedService, selectedPayment]);

  const selectServiceByType = (consultationType, services) => {
    if (!Array.isArray(services) || services.length === 0) return null;
    const service = services.find((s) => {
      const matchType = consultationType === 'online' ? s.is_live === true : s.is_live === false;
      return matchType && s.is_doctor_service === true;
    });
    return service || services.find((s) => s.is_doctor_service === true) || null;
  };

  useEffect(() => {
    fetchDoctors();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (!selectedDoctor) return;
    (async () => {
      const services = await fetchExclusiveServices(selectedDoctor.id);
      setAvailableServices(services);
      const initialService = selectServiceByType(form.consultation_type, services);
      if (initialService) {
        setSelectedService(initialService);
        setDuration(initialService.duration_minutes || 30);
        setForm((p) => ({ ...p, service_id: initialService.id }));
      }
    })();
  }, [selectedDoctor]);

  useEffect(() => {
    if (availableServices.length === 0) return;
    const service = selectServiceByType(form.consultation_type, availableServices);
    if (service) {
      setSelectedService(service);
      setDuration(service.duration_minutes || 30);
      setForm((p) => ({ ...p, service_id: service.id }));
    }
  }, [form.consultation_type]);

  useEffect(() => {
    if (!selectedDoctor || !form.date) return;
    (async () => {
      const sch = await fetchDoctorSchedule(selectedDoctor.id, form.date);
      const blocked = await fetchBlockedTimes(selectedDoctor.id, form.date);
      setDoctorSchedule(sch);
      setBlockedTime(blocked);
      generateSlots(sch, duration, blocked);
    })();
  }, [form.date, selectedDoctor, duration]);

  const handleDoctorSelect = (doc) => {
    setSelectedDoctor(doc);
    setForm({
      service_id: '',
      doctor_id: doc.id,
      date: '',
      time_start: '',
      notes: '',
      consultation_type: 'online',
    });
    setSlots([]);
    setAvailableServices([]);
    setSelectedService(null);
    setShowBookingModal(true);
    setCurrentStep(2); // mobile: langsung ke step jadwal
  };

  const handleDateSelect = (date) => {
    const dateStr = formatDateAPI(date);
    setForm((prev) => ({ ...prev, date: dateStr }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu');
      window.location.href = '/login';
    }
    if (!form.date || !form.time_start) {
      return alert('Tanggal & jam wajib diisi');
    }
    if (!selectedService) {
      return alert('Service tidak tersedia');
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const bookingStart = Date.now();
      const res = await axios.post(`${API_URL}/api/booking`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingDuration = Date.now() - bookingStart;
      const booking = res.data.booking;
      const paymentPayload = {
        merchant_ref: booking.booking_code,
        amount: selectedService.price,
        order_items: [{ name: selectedService.name, price: selectedService.price, quantity: 1 }],
        id: booking.id,
      };
      const paymentStart = Date.now();
      const response = await axios.post(`${API_URL}/api/paymentXendit`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentDuration = Date.now() - paymentStart;
      setPayment(response.data.data);
      alert('Booking Berhasil');
      window.location.replace(response.data.data.invoice_url);
    } catch (err) {
      console.log('\n=================================');
      console.log('❌ ERROR IN BOOKING FLOW');
      console.log('=================================');
      console.log('MESSAGE:', err.message);
      if (err.response) {
        console.log('\n📡 SERVER RESPONSE ERROR');
        console.log('Status:', err.response.status);
        console.dir(err.response.data, { depth: null });
      }
      console.error(err.stack);
      alert(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      console.log('\n🏁 BOOKING FLOW END\n');
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    `${d.name} ${d.specialization || ''}`.toLowerCase().includes(query.toLowerCase())
  );

  const isServiceInactive = selectedService && selectedService.active === false;

  // ==========================================
  // MOBILE UI HELPERS
  // ==========================================

  const canGoToStep3 = form.date && form.time_start;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-0 px-4 pt-4 pb-3">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isDone = currentStep > step.id;
        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => {
                if (isDone || (step.id === 2 && selectedDoctor)) setCurrentStep(step.id);
              }}
              className="flex flex-col items-center gap-1 min-w-[56px]"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isDone ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : isActive ? 'bg-sky-600 text-white shadow-lg shadow-sky-200'
                    : 'bg-slate-100 text-slate-400'}`}
              >
                {isDone ? <Check size={14} /> : step.id}
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-sky-600' : isDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-[2px] mb-4 mx-1 rounded-full transition-colors ${currentStep > step.id ? 'bg-emerald-400' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ─── STEP 1: Pilih Dokter ────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:text-slate-400"
            placeholder="Cari nama dokter atau spesialis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Count */}
      <div className="px-4 pb-2">
        <span className="text-xs text-slate-400 font-medium">{filteredDoctors.length} dokter tersedia</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-2.5">
        {filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">Dokter tidak ditemukan</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDoctorSelect(doc)}
              className="w-full bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 text-left shadow-sm active:scale-[0.98] transition-transform"
            >
              <img
                src={normalizeImageUrl(doc.avatar)}
                className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 truncate">{doc.name}</div>
                <div className="text-xs text-sky-600 font-semibold mt-0.5">{doc.specialization}</div>
                {doc.experience && (
                  <div className="text-[11px] text-slate-400 mt-1">{doc.experience} tahun pengalaman</div>
                )}
              </div>
              <div className="shrink-0 w-8 h-8 bg-sky-50 rounded-full flex items-center justify-center">
                <ChevronRight size={16} className="text-sky-500" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  // ─── STEP 2: Pilih Jadwal ────────────────────────────────────────────────
  const renderStep2 = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    return (
      <div className="flex flex-col flex-1 overflow-y-auto pb-32">
        {/* Doctor Summary Card */}
        {selectedDoctor && (
          <div className="mx-4 mb-4 bg-gradient-to-r from-sky-600 to-sky-500 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-sky-200">
            <img src={normalizeImageUrl(selectedDoctor.avatar)} className="w-12 h-12 rounded-xl object-cover border-2 border-white/30" alt="" />
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm truncate">{selectedDoctor.name}</div>
              <div className="text-sky-100 text-xs mt-0.5">{selectedDoctor.specialization}</div>
            </div>
            {selectedService && (
              <div className="shrink-0 text-right">
                <div className="text-[10px] text-sky-200">Biaya</div>
                <div className="text-white font-bold text-sm">Rp {Number(selectedService.price).toLocaleString('id-ID')}</div>
              </div>
            )}
          </div>
        )}

        {/* Consultation Type */}
        <div className="px-4 mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Tipe Konsultasi</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setForm((p) => ({ ...p, consultation_type: 'online' }))}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${form.consultation_type === 'online' ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-200' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <div className={`p-1.5 rounded-lg ${form.consultation_type === 'online' ? 'bg-white/20' : 'bg-slate-100'}`}><Video size={16} /></div>
              <div className="text-left">
                <div className="text-sm font-bold">Online</div>
                <div className="text-[10px] opacity-70">Video Call</div>
              </div>
            </button>
            <button
              onClick={() => setForm((p) => ({ ...p, consultation_type: 'offline' }))}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${form.consultation_type === 'offline' ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-200' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <div className={`p-1.5 rounded-lg ${form.consultation_type === 'offline' ? 'bg-white/20' : 'bg-slate-100'}`}><MapPin size={16} /></div>
              <div className="text-left">
                <div className="text-sm font-bold">Klinik</div>
                <div className="text-[10px] opacity-70">Tatap Muka</div>
              </div>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="px-4 mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Pilih Tanggal</div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const n = new Date(currentMonth);
                  n.setMonth(n.getMonth() - 1);
                  const now = new Date();
                  if (n.getFullYear() > now.getFullYear() || (n.getFullYear() === now.getFullYear() && n.getMonth() >= now.getMonth())) setCurrentMonth(n);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <span className="font-bold text-slate-800 text-sm">{monthName}</span>
              <button
                onClick={() => {
                  const n = new Date(currentMonth);
                  n.setMonth(n.getMonth() + 1);
                  setCurrentMonth(n);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-[10px] text-slate-400 font-bold py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, idx) => {
                if (!date) return <div key={idx} />;
                const dateStr = formatDateAPI(date);
                const isSel = form.date === dateStr;
                const isDis = isDateDisabled(date);
                return (
                  <button
                    key={dateStr}
                    onClick={() => !isDis && handleDateSelect(date)}
                    disabled={isDis}
                    className={`aspect-square w-full rounded-xl text-xs font-semibold transition-all
                      ${isSel ? 'bg-sky-600 text-white shadow-md shadow-sky-200' : isDis ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-sky-50 text-slate-700 active:scale-95'}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="px-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Jam Tersedia {form.date && <span className="normal-case text-sky-500">— {formatDateDisplay(form.date)}</span>}
          </div>
          {!form.date ? (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-10 flex flex-col items-center gap-2">
              <Calendar size={28} className="text-slate-300" />
              <span className="text-sm text-slate-400">Pilih tanggal terlebih dahulu</span>
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={slot.disabled}
                  onClick={() => setForm((p) => ({ ...p, time_start: slot.time }))}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-all
                    ${form.time_start === slot.time
                      ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-200'
                      : slot.disabled
                        ? 'bg-slate-50 text-slate-200 cursor-not-allowed border-slate-100'
                        : 'bg-white border-slate-100 hover:border-sky-300 text-slate-700 active:scale-95'
                    }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
              <span className="text-red-500 text-sm font-medium">Tidak ada jadwal tersedia</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── STEP 3: Detail & Konfirmasi ─────────────────────────────────────────
  const renderStep3 = () => (
    <div className="flex flex-col flex-1 overflow-y-auto pb-36">
      {/* Summary Card */}
      <div className="mx-4 mb-5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Ringkasan Booking</div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Doctor Row */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-50">
            <img src={normalizeImageUrl(selectedDoctor?.avatar)} className="w-12 h-12 rounded-xl object-cover bg-slate-100" alt="" />
            <div>
              <div className="font-bold text-sm text-slate-900">{selectedDoctor?.name}</div>
              <div className="text-xs text-sky-600 font-semibold mt-0.5">{selectedDoctor?.specialization}</div>
            </div>
          </div>
          {/* Details */}
          <div className="divide-y divide-slate-50">
            <SummaryRow icon={<Calendar size={15} />} label="Tanggal" value={form.date ? formatDateDisplay(form.date) : '—'} />
            <SummaryRow icon={<Clock size={15} />} label="Jam" value={form.time_start || '—'} />
            <SummaryRow icon={form.consultation_type === 'online' ? <Video size={15} /> : <MapPin size={15} />} label="Tipe" value={form.consultation_type === 'online' ? 'Online (Video Call)' : 'Klinik (Tatap Muka)'} />
            {selectedService && (
              <SummaryRow icon={<FileText size={15} />} label="Layanan" value={`${selectedService.name} • ${selectedService.duration_minutes} mnt`} />
            )}
          </div>
        </div>
        {isServiceInactive && (
          <div className="mt-2 px-1 text-xs text-red-500 font-semibold">
            ⚠️ Layanan ini sedang tidak aktif dan tidak dapat dibooking.
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="mx-4 mb-5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Pembayaran</div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="text-sm font-semibold text-slate-800 mb-1">Metode Pembayaran</div>
          <div className="text-xs text-slate-500 leading-relaxed">
            Pemilihan metode pembayaran dilakukan setelah proses booking. Lanjutkan booking, lalu pilih metode pada halaman berikutnya.
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mx-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Catatan (Opsional)</div>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="w-full h-32 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 resize-none placeholder:text-slate-300"
          placeholder="Tuliskan keluhan singkat atau hal yang perlu diketahui dokter..."
        />
      </div>
    </div>
  );

  // ─── BOTTOM ACTION BAR ───────────────────────────────────────────────────
  const renderBottomBar = () => {
    if (currentStep === 1) return null;

    if (currentStep === 2) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-4 shadow-2xl">
          <button
            disabled={!canGoToStep3}
            onClick={() => setCurrentStep(3)}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all
              ${canGoToStep3
                ? 'bg-sky-600 text-white shadow-xl shadow-sky-200 active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            Lanjut ke Konfirmasi <ArrowRight size={16} />
          </button>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 pt-3 pb-5 shadow-2xl">
          {/* Total */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Total Bayar</span>
            <span className="text-xl font-black text-slate-900">Rp {totalPayment?.toLocaleString('id-ID')}</span>
          </div>
          <button
            disabled={loading || !form.date || !form.time_start || isServiceInactive}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all
              ${loading || !form.date || !form.time_start || isServiceInactive
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-sky-600 text-white shadow-xl shadow-sky-200 active:scale-[0.98]'}`}
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
              <>Konfirmasi Booking <ArrowRight size={16} /></>
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col max-w-md mx-auto relative">
      {/* ── TOP HEADER ── */}
      <div className="bg-white sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <Stethoscope size={18} className="text-sky-600" />
              Medical Booking
            </h1>
            <p className="text-[11px] text-slate-400">
              {currentStep === 1 && 'Pilih dokter spesialismu'}
              {currentStep === 2 && 'Atur jadwal konsultasi'}
              {currentStep === 3 && 'Konfirmasi pemesanan'}
            </p>
          </div>
        </div>
        {renderStepIndicator()}
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden pt-3">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      {renderBottomBar()}

      {/* ── PAYMENT OVERLAY ── */}
      {payment && (
        <FloatingPayment
          payment={payment}
          onClose={() => {
            setPayment(null);
            setSelectedDoctor(null);
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─── HELPER COMPONENT ────────────────────────────────────────────────────────
function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-slate-400 font-semibold">{label}</div>
        <div className="text-sm text-slate-800 font-semibold mt-0.5 leading-snug">{value}</div>
      </div>
    </div>
  );
}