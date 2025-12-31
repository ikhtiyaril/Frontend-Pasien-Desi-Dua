import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentMethodList from "./PaymentMethodList";
import PaymentMethodCheckbox from "./CheckboxPayment";
import { Calculator } from "lucide-react";
import PaymentFeeCalculator from "./CalculatorPayment";
import FloatingPayment from "./FloatingPayment";
import { Clock, DollarSign, Video, Stethoscope, Star, Calendar, CheckCircle, ChevronRight } from 'lucide-react';



export default function UserBooking() {
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
  const [payment,setPayment] = useState([])

  const [duration, setDuration] = useState(0);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [blockedTime,setBlockedTime] = useState([])
  const [slots, setSlots] = useState([]);
  const [paymentTime,setPaymentTime] = useState(false)
  const [paymentMethod,setPaymentMethod] = useState(null)
  const [paymentData,setPaymentData] = useState(null)

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [calculatorData, setCalculatorData] = useState(null)
  const [paymentTransaction,setPaymentTransaction] = useState(null)
  // =====================
  // FETCH SERVICES
  // =====================
  const fetchServices = async () => {
    const res = await axios.get(`${API}/api/service`);
    setServices(res.data);
  };


  const fetchDoctors = async () => {
    const res = await axios.get(`${API}/api/doctor`);
    setDoctors(res.data.data);
  };


 const fetchBlockedTimes = async ()=> {
  const res = await axios.get(`${API}/api/blocked-time/doctor/${form.doctor_id}/date/${form.date}`);
  setBlockedTime(res.data)
 }

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



  const fetchSchedules = async () => {
    if (!form.doctor_id || !form.date) return;


    try {
      const res = await axios.get(
        `${API}/api/doctor-schedule/${form.doctor_id}`,
        {
          params: { date: form.date },
        }
      );
const data = Array.isArray(res.data) ? res.data[0] : res.data ;
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
      // Simpan durasi service
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
  if (!t) return 0; // handle undefined/null
  const [h, m] = t.split(":");
  return parseInt(h) * 60 + parseInt(m);
};


const generateSlots = () => {
  if (!doctorSchedule || !duration) return setSlots([]);


  const { start_time, end_time, break_start, break_end } = doctorSchedule;


  const start = timeToMinutes(start_time);
  const end = timeToMinutes(end_time);
  const breakStart = break_start ? timeToMinutes(break_start) : null;
  const breakEnd   = break_end   ? timeToMinutes(break_end)   : null;


  const arr = [];


  for (let t = start; t + duration <= end; t += duration) {
    const slot = { time: minutesToTime(t), disabled: false };


    // disable break time
    if (breakStart && breakEnd && t >= breakStart && t < breakEnd) {
      slot.disabled = true;
    }


    // disable blocked times
    blockedTime.forEach((b) => {
      const bStart = timeToMinutes(b.time_start);
      const bEnd   = timeToMinutes(b.time_end);




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
    console.log(res.data.booking)
console.log("info payment:", JSON.stringify(calculatorData[0].total_fee.merchant));
    // 🔥 Build payment payload LANGSUNG di sini
    const paymentPayload = {
      method: paymentMethod,
      merchant_ref: res.data.booking.booking_code,
      amount: selectedService.price + calculatorData[0].total_fee.merchant,
      order_items: [
        {
          name: selectedService.name,
          price: selectedService.price+calculatorData[0].total_fee.merchant,
          quantity: 1,
        },
      ],
      id: res.data.booking.id
    };

    // 🔥 Kirim payload-nya, bukan state paymentData
    const response = await axios.post(`${API}/api/payment`, paymentPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(response.data)
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

const calculatorPrice = async () =>{
  const res = await axios.post(`${API}/api/payment/fee`,{
    code : paymentMethod,
    amount : selectedService.price,
  })
 
  setCalculatorData(res.data.data)
}
  return (
     <div className="min-h-screen bg-blue-50  p-6 flex gap-6">

      

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          Form Booking
        </h2>


        {/* SERVICE */}
        <div className="mb-4">
          <label className="font-medium text-blue-800">Layanan</label>
          <select
            className="w-full mt-1 p-2 border rounded-lg"
            value={form.service_id}
            onChange={(e) => {
              const s = services.find((x) => x.id == e.target.value);
              chooseService(s);
            }}
          >
            <option value="1">-- Pilih Layanan --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>


        {/* DOCTOR */}
        <div className="mb-4">
          <label className="font-medium text-blue-800">Dokter</label>
          <select
            className="w-full mt-1 p-2 border rounded-lg"
            value={form.doctor_id}
            disabled={!selectedService}
            onChange={(e) => {
              const d = doctors.find((x) => x.id == e.target.value);
              chooseDoctor(d);
            }}
          >
            <option value="">-- Pilih Dokter --</option>
            {selectedService &&
              doctors
                .filter((d) => selectedService?.doctorIds?.includes(d.id))
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
          </select>
        </div>


        {/* DATE */}
        <div className="mb-4">
          <label className="font-medium text-blue-800">Tanggal</label>
          <input
            type="date"
            className="w-full mt-1 p-2 border rounded-lg"
            disabled={!selectedDoctor}
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </div>


        {/* TIME */}
          <select
            name="time_start"
            value={form.time_start}
            onChange={
              (e)=>{
              handleChange(e);
              setPaymentTime(true);
            }}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg"
            required
            disabled={slots.length === 0}
          >
            <option value="">-- Pilih Jam --</option>
            {slots.map((s) => (
              <option key={s.time} value={s.time} disabled={s.disabled}>
                {s.time} {s.disabled ? " (Unavailable)" : ""}
              </option>
            ))}
          </select>

  


        {/* NOTES */}
        <div className="mb-4">
          <label className="font-medium text-blue-800">Catatan</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-lg"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>

 <PaymentMethodCheckbox
  data={payment}
  selectedMethod={paymentMethod}
  onChange={(val) => {setPaymentMethod(val)}}
/>

        <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
          Buat Booking
        </button>
      </div>
     
{/* ===== LEFT PANEL ===== */}
      <div className="w-1/2 space-y-6 sticky top-4">
        {/* STEP 1: SERVICE LIST */}
 {!selectedService && (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pilih Layanan</h2>
        <p className="text-gray-600 text-sm mt-1">Pilih layanan kesehatan yang Anda butuhkan</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {services.map((s) => (
        <div
          key={s.id}
          className="group relative bg-white rounded-2xl border-2 border-blue-100 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1"
          onClick={() => chooseService(s)}
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
          
          <div className="p-5 flex gap-5">
            {/* Image with overlay effect */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <img
                className="w-24 h-24 rounded-xl object-cover shadow-md border-2 border-blue-100 group-hover:border-blue-300 transition-all"
                src="/Poli-Umum.jpg"
                alt={s.name}
              />
              {/* Service type badge */}
              <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                s.is_live ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}>
                {s.is_live ? (
                  <Video className="w-4 h-4 text-white" />
                ) : (
                  <Stethoscope className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-xl leading-tight group-hover:text-blue-700 transition-colors">
                    {s.name}
                  </h3>
                  <ChevronRight className="w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                  {s.description}
                </p>

                {/* Service type badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  s.is_live 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {s.is_live ? (
                    <>
                      <Video className="w-3.5 h-3.5" />
                      Video Call
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-3.5 h-3.5" />
                      Layanan Normal
                    </>
                  )}
                </span>
              </div>

              {/* Info row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                {/* Duration */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Durasi</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {s.duration_minutes} menit
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Biaya</p>
                    <p className="text-sm font-bold text-green-600">
                      {s.price ? `Rp ${Number(s.price).toLocaleString()}` : "Gratis"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* STEP 2: DOCTOR LIST */}
{selectedService && !selectedDoctor && (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Pilih Dokter</h2>
      <p className="text-gray-600 text-sm mt-1">
        Pilih dokter untuk layanan <span className="font-semibold text-blue-600">{selectedService.name}</span>
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols gap-5">
      {doctors
        .filter((d) => selectedService?.doctorIds?.includes(d.id))
        .map((doc) => (
          <div
            key={doc.id}
            onClick={() => chooseDoctor(doc)}
            className="group relative bg-white rounded-2xl border-2 border-blue-100 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6">
              {/* Header with avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={doc.avatar || "https://via.placeholder.com/100"}
                    alt={doc.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-all shadow-md"
                  />
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${
                    doc.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {doc.specialization}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">(2 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-4" />

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Price card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-gray-600 font-medium">Biaya Konsultasi</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700">
                    {selectedService.price ? `Rp ${Number(selectedService.price).toLocaleString()}` : "Gratis"}
                  </p>
                </div>

                {/* Availability card */}
                <div className={`rounded-xl p-3 border ${
                  doc.isActive 
                    ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className={`w-4 h-4 ${doc.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                    <p className="text-xs text-gray-600 font-medium">Status</p>
                  </div>
                  <p className={`text-sm font-bold ${doc.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                    {doc.isActive ? "Tersedia" : "Tidak Tersedia"}
                  </p>
                </div>
              </div>

              {/* Action button */}
              <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
                Pilih Dokter
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
)}


        {/* STEP 3: DATE & TIME INFO */}
       {selectedDoctor && !paymentTime && (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-start space-x-4">
      {/* Avatar */}
      <img
        src={selectedDoctor.avatar || "https://via.placeholder.com/120"}
        alt={selectedDoctor.name}
        className="w-24 h-24 rounded-full object-cover shadow"
      />

      {/* Basic info */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-blue-700">
          {selectedDoctor.name}
        </h2>
        <p className="text-gray-600 text-sm">{selectedDoctor.specialization}</p>

        {/* Optional Study / Education */}
        {selectedDoctor.Study && (
          <p className="text-gray-500 text-sm mt-1 italic">
            {selectedDoctor.Study}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-1 mt-2">
          <span className="text-yellow-500 text-lg">★★★★★</span>
          <span className="text-sm text-gray-400">(12)</span>
        </div>
      </div>
    </div>

    {/* Bio */}
    <div className="mt-4">
      <h3 className="font-semibold text-gray-700 mb-1">Tentang Dokter</h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        {selectedDoctor.bio || "Dokter ini belum menambahkan informasi bio."}
      </p>
    </div>

    {/* Extra info (optional fields) */}
    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
      <div>
        <p className="text-gray-500">Nomor Telepon</p>
        <p className="font-medium text-gray-700">{selectedDoctor.phone}</p>
      </div>

      {selectedDoctor.price && (
        <div>
          <p className="text-gray-500">Harga Konsultasi</p>
          <p className="font-medium text-orange-600">
            Rp{selectedDoctor.price.toLocaleString()}
          </p>
        </div>
      )}

      {selectedDoctor.experience && (
        <div>
          <p className="text-gray-500">Pengalaman</p>
          <p className="font-medium text-gray-700">
            {selectedDoctor.experience} tahun
          </p>
        </div>
      )}

      {selectedDoctor.location && (
        <div>
          <p className="text-gray-500">Lokasi Praktik</p>
          <p className="font-medium text-gray-700">{selectedDoctor.location}</p>
        </div>
      )}
    </div>

    {/* Booking hint */}
    <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
      <p className="text-blue-700 text-sm">
        Silakan pilih tanggal & jam pada panel kanan untuk melanjutkan proses booking.
      </p>
    </div>
  </div>
)}

{paymentTime && !paymentMethod && (
  <div className="p-6" >
      <h1 className="text-2xl font-bold mb-6 text-white">Metode Pembayaran</h1>
      <PaymentMethodList data={payment} />
    </div>
)}

{
  paymentMethod && (
   <>
   <PaymentFeeCalculator data={calculatorData} service={selectedService}/>
   </>
  )
}


      </div>

 <FloatingPayment
        payment={paymentTransaction}
        onClose={() => setPaymentTransaction(null)}
      />
    </div>
  );
}









