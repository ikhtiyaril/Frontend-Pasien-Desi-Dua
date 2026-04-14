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
  ArrowRight
} from 'lucide-react';
import FloatingPayment from './FloatingPayment';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function BookingDoctorOnlyMobile() {
  // ==========================================
  // LOGIC & STATE (SAMA PERSIS DENGAN WEB)
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
    // Di Mobile, kita tidak pakai modal pop-up, tapi ganti view,
    // state 'selectedDoctor' yang tidak null akan memicu render form
  };

  const handleDateSelect = (date) => {
    const dateStr = formatDateAPI(date);
    setForm((prev) => ({ ...prev, date: dateStr }));
  };

  const handleSubmit = async () => {
     const token = localStorage.getItem('token');

  // 🚫 BELUM LOGIN
  if (!token) {
    alert('Silakan login terlebih dahulu');
    
    // redirect ke halaman login (sesuaikan route lo)
    window.location.href = '/login';
  }
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
  // MOBILE UI RENDER
  // ==========================================

  // Fungsi Calendar untuk Mobile (Agak lebih compact)
  const renderMobileCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
    const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between mb-4">
           <button onClick={() => { const n = new Date(currentMonth); n.setMonth(n.getMonth() - 1); if (n >= new Date()) setCurrentMonth(n); }} className="p-2 bg-slate-50 rounded-lg">
             <ChevronLeft size={16} />
           </button>
           <div className="text-sm font-bold text-slate-800">{monthName}</div>
           <button onClick={() => { const n = new Date(currentMonth); n.setMonth(n.getMonth() + 1); setCurrentMonth(n); }} className="p-2 bg-slate-50 rounded-lg">
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
                className={`h-9 w-full rounded-lg text-xs font-medium transition-colors flex items-center justify-center
                  ${isSel ? 'bg-blue-600 text-white shadow-md' : isDis ? 'text-slate-300' : 'bg-slate-50 text-slate-700'}
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

  // --- VIEW 1: DOCTOR LIST ---
  if (!selectedDoctor) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        <div className="bg-white p-4 sticky top-0 z-30 shadow-sm border-b border-slate-100">
           <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
             <Stethoscope className="text-blue-600" /> Medical Booking
           </h1>
           <div className="relative">
             <Search className="absolute left-3 top-3 text-slate-400" size={18} />
             <input
               className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
               placeholder="Cari dokter..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
           </div>
        </div>

        <div className="p-4 space-y-3">
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
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-transform"
                    >
                      <img src={normalizeImageUrl(doc.avatar)} className="w-14 h-14 rounded-xl object-cover bg-slate-200" alt="" />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                        <div className="text-xs text-blue-600 font-medium mb-1">{doc.specialization}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1"><Award size={10}/> Pengalaman 5+ Tahun</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <ChevronRight size={16}/>
                      </div>
                    </div>
                ))
            )}
        </div>
        {/* Helper untuk Floating Payment jika ada sisa state, though unlikely in list view */}
        {payment && <FloatingPayment payment={payment} onClose={() => setPayment(null)} />}
      </div>
    );
  }
const isServiceInactive = selectedService && selectedService.active === false;

  // --- VIEW 2: BOOKING FORM (FULL SCREEN MOBILE) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
        {/* Mobile Header */}
        <div className="bg-white p-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 flex items-center gap-3">
            <button onClick={() => setSelectedDoctor(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronLeft size={20} className="text-slate-700"/>
            </button>
            <h1 className="text-base font-bold text-slate-900">Buat Janji Temu</h1>
        </div>

        <div className="p-4 space-y-6">
            {/* Doctor Info Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <img src={normalizeImageUrl(selectedDoctor.avatar)} className="w-14 h-14 rounded-full border border-slate-100" alt=""/>
                <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedDoctor.name}</div>
                    <div className="text-xs text-slate-500">{selectedDoctor.specialization}</div>
                </div>
            </div>

            {/* Step 1: Tipe Konsultasi */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tipe Konsultasi</h3>
                <div className="flex gap-3">
                    <button
                        onClick={() => setForm(p => ({...p, consultation_type: 'online'}))}
                        className={`flex-1 p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${form.consultation_type === 'online' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                    >
                        <Video size={20}/>
                        <span className="text-xs font-bold">Online</span>
                    </button>
                    <button
                        onClick={() => setForm(p => ({...p, consultation_type: 'offline'}))}
                        className={`flex-1 p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${form.consultation_type === 'offline' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                    >
                        <MapPin size={20}/>
                        <span className="text-xs font-bold">Klinik</span>
                    </button>
                </div>
            </div>

             {/* Service Info */}
             {selectedService && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <FileText size={18} className="text-blue-600 mt-0.5"/>
                    <div>
                        <div className="text-sm font-bold text-blue-900">{selectedService.name}</div>
                        <div className="text-xs text-blue-700 mt-1">Durasi: {selectedService.duration_minutes} Menit</div>
                        <div className="text-xs text-blue-700 mt-0.5 font-bold">Rp {Number(selectedService.price).toLocaleString('id-ID')}</div>
                         {isServiceInactive && (
                             <div className="mt-2 text-xs text-red-600 font-semibold">
                                Layanan ini sedang tidak aktif dan tidak dapat dibooking
                             </div>
                                    )}
                    </div>
                </div>
             )}

            {/* Step 2: Calendar */}
            <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pilih Tanggal</h3>
                 {renderMobileCalendar()}
            </div>

            {/* Step 3: Slots */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Jam Tersedia {form.date && `(${formatDateDisplay(new Date(form.date))})`}
                </h3>
                {!form.date ? (
                    <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                        <span className="text-xs text-slate-400">Pilih tanggal dahulu</span>
                    </div>
                ) : slots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                        {slots.map((slot) => (
                            <button
                                key={slot.time}
                                disabled={slot.disabled}
                                onClick={() => setForm(p => ({...p, time_start: slot.time}))}
                                className={`py-2 rounded-lg text-xs font-bold border transition-all
                                    ${form.time_start === slot.time
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : slot.disabled
                                            ? 'bg-slate-50 text-slate-300 border-transparent'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }
                                `}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs text-center">Jadwal penuh/tidak tersedia.</div>
                )}
            </div>

            {/* Step 4: Notes */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Keluhan</h3>
                <textarea
                    value={form.notes}
                    onChange={(e) => setForm(p => ({...p, notes: e.target.value}))}
                    className="w-full h-[100px] p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    placeholder="Tulis keluhan singkat..."
                />
            </div>

            {/* Step 5: Payment */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pembayaran</h3>
                <div className="space-y-2">
                    {paymentMethods.map((m) => (
                        <button
                            key={m.code}
                            onClick={() => setSelectedPayment(m)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all
                                ${selectedPayment?.code === m.code ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <img src={normalizeImageUrl(m.icon_url)} className="w-6 h-6 object-contain" alt=""/>
                                <div className="text-sm font-bold text-slate-800">{m.name}</div>
                            </div>
                            {selectedPayment?.code === m.code && <CheckCircle2 size={16} className="text-blue-600"/>}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* BOTTOM FIXED ACTION BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
            <div className="flex items-center justify-between mb-3">
                 <span className="text-xs text-slate-500 font-medium">Total Pembayaran</span>
                 <span className="text-lg font-bold text-blue-700">Rp {totalPayment?.toLocaleString('id-ID')}</span>
            </div>
            <button
               disabled={
                       loading ||
                       !form.date ||
                       !form.time_start ||
                       !selectedPayment ||
                       isServiceInactive
                         }
                onClick={handleSubmit}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${loading || !form.date || !form.time_start || !selectedPayment
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white active:bg-blue-700'
                    }
                `}
            >
                {loading ? 'Memproses...' : 'Booking Sekarang'} <ArrowRight size={16}/>
            </button>
        </div>

        {/* Payment Modal Overlay */}
        {payment && (
            <FloatingPayment payment={payment} onClose={() => { setPayment(null); setSelectedDoctor(null); }} />
        )}
    </div>
  );
}