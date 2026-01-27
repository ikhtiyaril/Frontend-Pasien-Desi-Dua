import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentMethodList from "./PaymentMethodList";
import PaymentMethodCheckbox from "./CheckboxPayment";
import { Calculator, ArrowLeft, Calendar as CalendarIcon, Clock as ClockIcon, FileText, ChevronDown } from "lucide-react";
import PaymentFeeCalculator from "./CalculatorPayment";
import FloatingPayment from "./FloatingPayment";
import BookingService from "./BookingService";
import BookingDoctorCard from "./BookingDoctorCard";

export default function UserBookingMobile() {
  const API = import.meta.env.VITE_API_URL;
  const API_KEY_TRIPAY = import.meta.env.VITE_API_KEY_TRIPAY;

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

  // =====================
  // FETCH SERVICES
  // =====================
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
      const res = await axios.get(` ${API}/api/payment`);
      setPayment(res.data.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const fetchSchedules = async () => {
    if (!form.doctor_id || !form.date) return;

    try {
      const res = await axios.get(
        `${API}/api/doctor-schedule/${form.doctor_id}`,
        {
          params: { date: form.date },
        }
      );
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

    const selectedService = services.find(
      (s) => s.id === Number(form.service_id)
    );

    if (selectedService) {
      setDuration(selectedService.duration_minutes || 30);
    }

    const filtered = doctors.filter((d) =>
      selectedService?.doctorIds?.includes(d.id)
    );

    setAvailableDoctors(filtered);

    // reset dokter
    setForm((prev) => ({ ...prev, doctor_id: "" }));
  }, [form.service_id, services, doctors]);

  // =====================
  // HANDLE DOCTOR / DATE CHANGE
  // =====================
  useEffect(() => {
    fetchSchedules();
  }, [form.doctor_id, form.date]);

  // =====================
  // TIME SLOT GENERATOR
  // =====================

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

      if (breakStart && breakEnd && t >= breakStart && t < breakEnd) {
        slot.disabled = true;
      }

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

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`${API}/api/booking`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Booking berhasil dibuat!");

      setForm({
        service_id: "",
        doctor_id: "",
        date: "",
        time_start: "",
        notes: "",
      });

      const paymentPayload = {
        method: paymentMethod,
        merchant_ref: res.data.booking.booking_code,
        amount: selectedService.price + calculatorData[0].total_fee.merchant,
        order_items: [
          {
            name: selectedService.name,
            price:
              selectedService.price + calculatorData[0].total_fee.merchant,
            quantity: 1,
          },
        ],
        id: res.data.booking.id,
      };

      const response = await axios.post(`${API}/api/payment`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPaymentTransaction(response.data.data);
      setAvailableDoctors([]);
      setSlots([]);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuat booking" + err);
    }
  };

  const chooseService = (srv) => {
    setSelectedService(srv);
    setSelectedDoctor(null);

    setForm((prev) => ({
      ...prev,
      service_id: srv.id,
      doctor_id: "",
    }));
  };

  const chooseDoctor = (doc) => {
    setSelectedDoctor(doc);
    setForm((prev) => ({
      ...prev,
      doctor_id: doc.id,
    }));
  };

  useEffect(() => {
    if (paymentMethod) {
      calculatorPrice();
    }
  }, [paymentMethod]);

  const calculatorPrice = async () => {
    const res = await axios.post(`${API}/api/payment/fee`, {
      code: paymentMethod,
      amount: selectedService.price,
    });

    setCalculatorData(res.data.data);
  };

  // ========================================================
  // MOBILE UI RENDER
  // ========================================================
  
  // Helper to go back
  const handleBack = () => {
    if (selectedDoctor) {
      setSelectedDoctor(null);
      setForm(prev => ({ ...prev, doctor_id: "" }));
      return;
    }
    if (selectedService) {
      setSelectedService(null);
      setForm(prev => ({ ...prev, service_id: "" }));
      return;
    }
  };

  // Helper for Time Selection (Chip Style)
  const handleTimeSelect = (time) => {
    setForm(prev => ({ ...prev, time_start: time }));
    setPaymentTime(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      {/* HEADER MOBILE */}
      <div className="bg-white px-4 py-4 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        {(selectedService || selectedDoctor) && (
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-800">
          {!selectedService 
            ? "Pilih Layanan" 
            : !selectedDoctor 
              ? "Pilih Dokter" 
              : "Detail Booking"}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        
        {/* VIEW 1: PILIH LAYANAN */}
        {!selectedService && (
          <div className="grid grid-cols-1 gap-4">
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-2">
                <h2 className="text-blue-800 font-semibold mb-1">Halo!</h2>
                <p className="text-sm text-blue-600">Pilih layanan kesehatan yang Anda butuhkan hari ini.</p>
             </div>
            {services.map((s) => (
              <BookingService
                key={s.id}
                service={s}
                onSelect={chooseService}
              />
            ))}
          </div>
        )}

        {/* VIEW 2: PILIH DOKTER */}
        {selectedService && !selectedDoctor && (
          <div className="space-y-4">
            {/* Selected Service Summary */}
            <div className="bg-white p-3 rounded-xl border border-blue-200 flex justify-between items-center shadow-sm">
               <div>
                  <p className="text-xs text-gray-500">Layanan Dipilih</p>
                  <p className="font-bold text-blue-700">{selectedService.name}</p>
               </div>
               <button onClick={() => setSelectedService(null)} className="text-xs text-blue-500 underline">Ganti</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {doctors
                .filter((d) => selectedService?.doctorIds?.includes(d.id))
                .map((doc) => (
                  <BookingDoctorCard
                    key={doc.id}
                    doctor={doc}
                    service={selectedService}
                    onSelect={chooseDoctor}
                  />
                ))}
                
               {availableDoctors.length === 0 && (
                 <div className="text-center py-10 text-gray-400">
                   Tidak ada dokter tersedia untuk layanan ini.
                 </div>
               )}
            </div>
          </div>
        )}

        {/* VIEW 3: FORM BOOKING LENGKAP */}
        {selectedDoctor && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 3.1 Doctor Info Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <img
                src={selectedDoctor.avatar || "https://via.placeholder.com/100"}
                alt={selectedDoctor.name}
                className="w-20 h-20 rounded-full object-cover bg-gray-100"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                  {selectedDoctor.name}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-1">{selectedDoctor.specialization}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{selectedDoctor.bio || "Dokter spesialis berpengalaman."}</p>
              </div>
            </div>

            {/* 3.2 Date Picker */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Pilih Tanggal
              </label>
              <input
                type="date"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>

            {/* 3.3 Time Slots (Chips Style) */}
            <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all ${!form.date ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                Pilih Jam
              </label>
              
              {slots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={s.disabled}
                      onClick={() => handleTimeSelect(s.time)}
                      className={`
                        py-2 px-1 text-sm rounded-lg border font-medium transition-colors
                        ${s.disabled 
                          ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed" 
                          : form.time_start === s.time
                            ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }
                      `}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed text-gray-400 text-sm">
                   {form.date ? "Tidak ada jadwal tersedia" : "Pilih tanggal terlebih dahulu"}
                </div>
              )}
            </div>

            {/* 3.4 Notes */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                Keluhan / Catatan
              </label>
              <textarea
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                placeholder="Tulis keluhan singkat..."
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            {/* 3.5 Payment Method */}
            {paymentTime && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-sm font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
                 <PaymentMethodCheckbox
                    data={payment}
                    selectedMethod={paymentMethod}
                    onChange={(val) => {setPaymentMethod(val)}}
                  />
                  
                  {/* Calculator Summary */}
                  {paymentMethod && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <PaymentFeeCalculator data={calculatorData} service={selectedService}/>
                    </div>
                  )}
              </div>
            )}
            
          </div>
        )}
      </div>

      {/* FLOATING BOTTOM BAR (Total & Submit) */}
      {selectedDoctor && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Total Biaya</span>
              <span className="font-bold text-lg text-blue-700">
                 {/* Simple formatted price display logic for sticky footer */}
                 {paymentMethod && calculatorData 
                    ? `Rp ${(selectedService.price + calculatorData[0].total_fee.merchant).toLocaleString()}`
                    : `Rp ${selectedService?.price?.toLocaleString() || 0}`}
              </span>
            </div>
            
            <button 
              onClick={handleSubmit} 
              disabled={!form.time_start || !paymentMethod}
              className={`
                px-6 py-3 rounded-xl font-semibold text-white shadow-lg flex-1
                ${(!form.time_start || !paymentMethod) 
                   ? "bg-gray-400 cursor-not-allowed" 
                   : "bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
                }
              `}
            >
              Booking Sekarang
            </button>
          </div>
        </div>
      )}

      <FloatingPayment
        payment={paymentTransaction}
        onClose={() => setPaymentTransaction(null)}
      />
    </div>
  );
}