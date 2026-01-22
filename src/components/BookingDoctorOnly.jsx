import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  X,
  CreditCard,
  CheckCircle2,
  Video,
  MapPin,
  FileText,
  User,
  Award,
  Stethoscope,
  Banknote,
  ArrowRight
} from 'lucide-react';
import FloatingPayment from './FloatingPayment';

// NOTE: web version uses Vite env variable
const API_URL = import.meta.env.VITE_API_URL || '';

export default function BookingDoctorWeb() {
  // ==========================================
  // LOGIC & STATE (TIDAK DIUBAH)
  // ==========================================
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false); // Tidak dipakai UI, tapi dibiarkan agar logic aman
  const [showDatePicker, setShowDatePicker] = useState(false); // Kita akan override di UI agar selalu true/embedded
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

  // --- Utils ---
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
    const d = typeof date === 'string' ? new Date(date) : date;
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
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
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
    if (url.includes('localhost')) {
      return url.replace(/http:\/\/localhost:\d+/, API_URL);
    }
    return url;
  };

  // --- Fetch ---
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
      const res = await axios.get(`${API_URL}/api/payment`);
      setPaymentMethods(res.data.data?.data || []);
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
  };

  const handleDateSelect = (date) => {
    const dateStr = formatDateAPI(date);
    setForm((prev) => ({ ...prev, date: dateStr }));
  };

  const handleSubmit = async () => {
    if (!form.date || !form.time_start) return alert('Tanggal & jam wajib diisi');
    if (!selectedPayment) return alert('Pilih metode pembayaran');
    if (!selectedService) return alert('Service tidak tersedia');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/booking`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paymentPayload = {
        method: selectedPayment.code,
        merchant_ref: res.data.booking.booking_code,
        amount: selectedService.price,
        order_items: [
          { name: selectedService.name, price: selectedService.price, quantity: 1 },
        ],
        id: res.data.booking.id,
      };

      const response = await axios.post(`${API_URL}/api/payment`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayment(response.data.data);
      alert('Booking Berhasil');
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    `${d.name} ${d.specialization || ''}`.toLowerCase().includes(query.toLowerCase())
  );

  // ==========================================
  // UI COMPONENTS (WEB OPTIMIZED)
  // ==========================================

  // 1. Calendar (Flat/Embedded Style)
  const renderFlatCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
    const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
           <button onClick={() => { const n = new Date(currentMonth); n.setMonth(n.getMonth() - 1); if (n >= new Date()) setCurrentMonth(n); }} className="p-1 hover:bg-slate-100 rounded-lg">
             <ChevronLeft size={16} />
           </button>
           <div className="text-sm font-bold text-slate-800">{monthName}</div>
           <button onClick={() => { const n = new Date(currentMonth); n.setMonth(n.getMonth() + 1); setCurrentMonth(n); }} className="p-1 hover:bg-slate-100 rounded-lg">
             <ChevronRight size={16} />
           </button>
        </div>
        <div className="grid grid-cols-7 mb-2 gap-1">
          {weekDays.map((d) => <div key={d} className="text-center text-[10px] text-slate-400 font-bold">{d}</div>)}
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
                className={`h-9 w-full rounded-lg text-xs font-medium transition-colors
                  ${isSel ? 'bg-blue-600 text-white' : isDis ? 'text-slate-300' : 'hover:bg-blue-50 text-slate-700'}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Halaman */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-sm">
        <div>
           <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Stethoscope className="text-blue-600" /> Medical Booking
           </h1>
        </div>
        {/* Breadcrumb sederhana */}
        <div className="flex items-center text-sm text-slate-500">
            <span>Dashboard</span>
            <ChevronRight size={14} className="mx-2"/>
            <span className="text-blue-600 font-medium">Buat Janji Temu</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 md:p-8">
        <div className="grid grid-cols-12 gap-6 items-start h-[calc(100vh-140px)]">

          {/* LEFT COLUMN: LIST DOKTER (Scrollable) */}
          <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Search Header */}
            <div className="p-5 border-b border-slate-100 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Pilih Dokter</h2>
              <p className="text-slate-500 text-xs mb-4">Cari dokter spesialis yang sesuai kebutuhanmu</p>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Nama dokter atau spesialis..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-10">
                   <User className="mx-auto text-slate-300 mb-2" size={32}/>
                   <p className="text-slate-500 text-sm">Dokter tidak ditemukan</p>
                </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center group
                      ${selectedDoctor?.id === doc.id
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                        : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }
                    `}
                  >
                    <img src={normalizeImageUrl(doc.avatar)} className="w-12 h-12 rounded-lg object-cover bg-slate-200" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm truncate ${selectedDoctor?.id === doc.id ? 'text-blue-700' : 'text-slate-900'}`}>{doc.name}</div>
                      <div className="text-xs text-blue-600 font-medium">{doc.specialization}</div>
                    </div>
                    {selectedDoctor?.id === doc.id && <ChevronRight size={16} className="text-blue-600"/>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING FORM (Scrollable) */}
          <div className="col-span-12 md:col-span-8 lg:col-span-8 h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            {!selectedDoctor ? (
              // EMPTY STATE
              <div className="flex-1 flex flex-col items-center justify-center p-10 bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                  <Stethoscope size={32} className="text-blue-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Belum ada dokter dipilih</h3>
                <p className="text-slate-500 text-sm mt-1">Pilih dokter dari daftar di sebelah kiri untuk memulai.</p>
              </div>
            ) : (
              // FORM CONTENT
              <>
                {/* Form Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-20">
                    <div className="flex items-center gap-4">
                      <img src={normalizeImageUrl(selectedDoctor.avatar)} className="w-10 h-10 rounded-full border border-slate-100" alt=""/>
                      <div>
                        <div className="font-bold text-slate-900">{selectedDoctor.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1"><Award size={12}/> {selectedDoctor.specialization}</div>
                      </div>
                    </div>
                    {selectedService && (
                      <div className="hidden md:block bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        <span className="text-xs font-bold text-blue-700">Rp {Number(selectedService.price).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                  <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* SECTION 1: Type & Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tipe Konsultasi</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setForm(p => ({...p, consultation_type: 'online'}))}
                                    className={`flex-1 p-3 rounded-xl border flex items-center gap-3 transition-all ${form.consultation_type === 'online' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                >
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><Video size={16}/></div>
                                    <div className="text-left"><div className="text-sm font-bold">Online</div><div className="text-[10px]">Video Call</div></div>
                                </button>
                                <button
                                    onClick={() => setForm(p => ({...p, consultation_type: 'offline'}))}
                                    className={`flex-1 p-3 rounded-xl border flex items-center gap-3 transition-all ${form.consultation_type === 'offline' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                >
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><MapPin size={16}/></div>
                                    <div className="text-left"><div className="text-sm font-bold">Klinik</div><div className="text-[10px]">Tatap Muka</div></div>
                                </button>
                            </div>
                        </section>
                        
                        <section>
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Layanan</h3>
                             {selectedService ? (
                                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-3">
                                   <div className="p-2 bg-white rounded-lg text-blue-600"><FileText size={16}/></div>
                                   <div>
                                     <div className="text-sm font-bold text-slate-800">{selectedService.name}</div>
                                     <div className="text-xs text-slate-500">{selectedService.duration_minutes} Menit</div>
                                   </div>
                                </div>
                             ) : <div className="text-sm text-red-500">Layanan tidak tersedia</div>}
                        </section>
                    </div>

                    <hr className="border-slate-100"/>

                    {/* SECTION 2: Schedule (Grid Layout) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Calendar */}
                        <div className="lg:col-span-5">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilih Tanggal</h3>
                            {renderFlatCalendar()}
                        </div>

                        {/* Slots */}
                        <div className="lg:col-span-7">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Jam Tersedia {form.date && `(${formatDateDisplay(new Date(form.date))})`}</h3>
                            {!form.date ? (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <Calendar className="text-slate-200 mb-2" size={24}/>
                                    <span className="text-xs text-slate-400">Pilih tanggal di kalender</span>
                                </div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            disabled={slot.disabled}
                                            onClick={() => setForm(p => ({...p, time_start: slot.time}))}
                                            className={`py-2 rounded-lg text-sm font-medium border transition-all
                                                ${form.time_start === slot.time
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                    : slot.disabled
                                                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed border-transparent'
                                                        : 'bg-white border-slate-200 hover:border-blue-400 text-slate-700'
                                                }
                                            `}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                    Tidak ada jadwal tersedia.
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-slate-100"/>

                    {/* SECTION 3: Payment & Notes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <section>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pembayaran</h3>
                            <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {paymentMethods.map((m) => (
                                    <button
                                        key={m.code}
                                        onClick={() => setSelectedPayment(m)}
                                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all
                                            ${selectedPayment?.code === m.code ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:bg-slate-50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-slate-100">
                                                <img src={normalizeImageUrl(m.icon_url)} className="w-5 h-5 object-contain" alt=""/>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">{m.name}</div>
                                                {m.fee_merchant && <div className="text-[10px] text-slate-500">Admin: Rp {m.fee_merchant.flat || 0}</div>}
                                            </div>
                                        </div>
                                        {selectedPayment?.code === m.code && <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center"><CheckCircle2 size={10} className="text-white"/></div>}
                                    </button>
                                ))}
                            </div>
                         </section>

                         <section>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Catatan</h3>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm(p => ({...p, notes: e.target.value}))}
                                className="w-full h-[140px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                placeholder="Tuliskan keluhan singkat..."
                            />
                         </section>
                    </div>

                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 z-20 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Banknote size={20}/></div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">Total Bayar</div>
                            <div className="text-2xl font-bold text-slate-900">Rp {totalPayment?.toLocaleString('id-ID')}</div>
                        </div>
                     </div>
                     <button
                        disabled={loading || !form.date || !form.time_start || !selectedPayment}
                        onClick={handleSubmit}
                        className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg
                            ${loading || !form.date || !form.time_start || !selectedPayment
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5'
                            }
                        `}
                     >
                        {loading ? 'Memproses...' : 'Konfirmasi Booking'} <ArrowRight size={16}/>
                     </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PAYMENT (OVERLAY) */}
      {payment && (
        <FloatingPayment payment={payment} onClose={() => { setPayment(null); setSelectedDoctor(null); setShowBookingModal(false); }} />
      )}
    </div>
  );
}