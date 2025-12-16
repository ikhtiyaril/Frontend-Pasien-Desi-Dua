import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentMethodList from "./PaymentMethodList";
import PaymentMethodCheckbox from "./CheckboxPayment";
import { Calculator } from "lucide-react";
import PaymentFeeCalculator from "./CalculatorPayment";
import FloatingPayment from "./FloatingPayment";

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
    const res = await axios.get(`${API}/api/service`);
    setServices(res.data);
  };

  const fetchDoctors = async () => {
    const res = await axios.get(`${API}/api/doctor`);
    setDoctors(res.data.data);
  };

  const fetchBlockedTimes = async () => {
    if (!form.doctor_id || !form.date) return;
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
    fetchServices();
    fetchDoctors();
    fetchPayment();
  }, []);

  useEffect(() => {
    if (!form.doctor_id || !form.date) return;
    fetchBlockedTimes();
  }, [form.doctor_id, form.date]);

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
    const breakEnd = break_end ? timeToMinutes(break_end) : null;

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
        const bEnd = timeToMinutes(b.time_end);
        if (t >= bStart && t < bEnd) slot.disabled = true;
      });

      arr.push(slot);
    }

    setSlots(arr);
  };

  useEffect(() => {
    generateSlots();
  }, [doctorSchedule, duration, blockedTime]);

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
      console.log(res.data.booking);
      console.log("info payment:", JSON.stringify(calculatorData?.[0]?.total_fee?.merchant));

      // 🔥 Build payment payload LANGSUNG di sini
      const paymentPayload = {
        method: paymentMethod,
        merchant_ref: res.data.booking.booking_code,
        amount: (selectedService?.price || 0) + (calculatorData?.[0]?.total_fee?.merchant || 0),
        order_items: [
          {
            name: selectedService?.name || "Service",
            price: (selectedService?.price || 0) + (calculatorData?.[0]?.total_fee?.merchant || 0),
            quantity: 1,
          },
        ],
        id: res.data.booking.id,
      };

      // 🔥 Kirim payload-nya, bukan state paymentData
      const response = await axios.post(`${API}/api/payment`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
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
    if (!form.service_id) return;

    const selectedService = services.find((s) => s.id === Number(form.service_id));

    if (selectedService) {
      // Simpan durasi service
      setDuration(selectedService.duration_minutes || 30);
    }

    const filtered = doctors.filter((d) => selectedService?.doctorIds?.includes(d.id));

    setAvailableDoctors(filtered);

    // reset dokter
    setForm((prev) => ({ ...prev, doctor_id: "" }));
  }, [form.service_id, services, doctors]);

  useEffect(() => {
    if (paymentMethod) {
      calculatorPrice();
    }
  }, [paymentMethod]);

  const calculatorPrice = async () => {
    if (!selectedService) return;
    const res = await axios.post(`${API}/api/payment/fee`, {
      code: paymentMethod,
      amount: selectedService.price,
    });

    setCalculatorData(res.data.data);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col md:flex-row gap-6">
           <div className="w-full md:w-1/2 space-y-6 md:sticky md:top-4 order-2 md:order-2 ">
        {/* STEP 1: SERVICE LIST */}
        {!selectedService && (
          <div>
            <div className="grid grid-cols-1 gap-5">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="
            group bg-white p-4 rounded-2xl shadow-md border border-blue-100 
            flex gap-5 cursor-pointer transition-all
            hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 
            hover:bg-white/90
          "
                  onClick={() => chooseService(s)}
                >
                  {/* Gambar */}
                  <div className="shrink-0">
                    <img
                      className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:shadow-md transition"
                      src="/Poli-Umum.jpg"
                      alt={s.name}
                    />
                  </div>

                  {/* Konten */}
                  <div className="flex flex-col justify-between grow">
                    <div>
                      <h3 className="font-bold text-blue-700 text-lg leading-snug">{s.name}</h3>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{s.description}</p>
                    </div>

                    {/* Durasi */}
                    <div className="flex items-center gap-2 mt-2">
                      <img className="w-5 h-5" src="/duration.png" alt="durasi" />
                      <p className="text-sm text-gray-500">{s.duration_minutes} menit</p>
                    </div>

                    {/* Harga */}
                    <div className="flex items-center gap-2">
                      <img className="w-5 h-5" src="/Price.png" alt="harga" />
                      <p className="font-semibold text-red-500 text-sm">{s.price ? `Rp ${s.price}` : "Free"}</p>
                    </div>

                    {/* Jenis Layanan */}
                    <p className="text-sm font-medium mt-1 text-purple-600">{s.is_live ? "Video Call" : "Layanan Normal"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DOCTOR LIST */}
        {selectedService && !selectedDoctor && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols gap-4">
              {doctors
                .filter((d) => selectedService?.doctorIds?.includes(d.id))
                .map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => chooseDoctor(doc)}
                    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer w-full"
                  >
                    <div className="flex items-center space-x-4">
                      <img src={doc.avatar || "https://via.placeholder.com/100"} alt={doc.name} className="w-20 h-20 rounded-full object-cover" />

                      <div>
                        <h3 className="text-lg font-semibold text-blue-700">{doc.name}</h3>

                        <p className="text-sm text-gray-600">{doc.specialization}</p>

                        {/* Optional rating (kalau mau diisi nanti) */}
                        <div className="flex items-center space-x-1 text-yellow-500 text-sm mt-1">
                          <span>★★★★★</span>
                          <span className="text-gray-400">(2)</span>
                        </div>
                      </div>
                    </div>

                    {/* Optional price & next schedule */}
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-lg text-orange-500">{selectedService.price ? `Rp${selectedService.price}` : "Rp -"}</p>
                      <p className="text-xs text-green-600">Jadwal Berikutnya: {doc.isActive ? "Tersedia" : "Tidak tersedia"}</p>
                    </div>

                    <button className="w-full mt-4 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition duration-200">Pilih Dokter</button>
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
              <img src={selectedDoctor.avatar || "https://via.placeholder.com/120"} alt={selectedDoctor.name} className="w-24 h-24 rounded-full object-cover shadow" />

              {/* Basic info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-blue-700">{selectedDoctor.name}</h2>
                <p className="text-gray-600 text-sm">{selectedDoctor.specialization}</p>

                {/* Optional Study / Education */}
                {selectedDoctor.Study && <p className="text-gray-500 text-sm mt-1 italic">{selectedDoctor.Study}</p>}

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
              <p className="text-gray-600 leading-relaxed text-sm">{selectedDoctor.bio || "Dokter ini belum menambahkan informasi bio."}</p>
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
                  <p className="font-medium text-orange-600">Rp{selectedDoctor.price.toLocaleString()}</p>
                </div>
              )}

              {selectedDoctor.experience && (
                <div>
                  <p className="text-gray-500">Pengalaman</p>
                  <p className="font-medium text-gray-700">{selectedDoctor.experience} tahun</p>
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
              <p className="text-blue-700 text-sm">Silakan pilih tanggal & jam pada panel kanan untuk melanjutkan proses booking.</p>
            </div>
          </div>
        )}

        {paymentTime && !paymentMethod && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Metode Pembayaran</h1>
            <PaymentMethodList data={payment} />
          </div>
        )}

        {paymentMethod && <PaymentFeeCalculator data={calculatorData} service={selectedService} />}
      </div>
      {/* ===== RIGHT PANEL ===== */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-md order-1 md:order-1">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Form Booking</h2>

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
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* TIME */}
        <select
          name="time_start"
          value={form.time_start}
          onChange={(e) => {
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
        <div className="mb-4 mt-4">
          <label className="font-medium text-blue-800">Catatan</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-lg"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <PaymentMethodCheckbox
          data={payment}
          selectedMethod={paymentMethod}
          onChange={(val) => {
            setPaymentMethod(val);
          }}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-4"
        >
          Buat Booking
        </button>
      </div>

      {/* ===== LEFT PANEL ===== */}
   

      <FloatingPayment payment={paymentTransaction} onClose={() => setPaymentTransaction(null)} />
    </div>
  );
}
