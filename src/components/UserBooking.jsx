import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserBooking() {
  const API = import.meta.env.VITE_API_URL;

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

  const [duration, setDuration] = useState(0);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
const [blockedTime,setBlockedTime] = useState([])
  const [slots, setSlots] = useState([]);

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
      await axios.post(`${API}/api/booking`, form, {
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
      setAvailableDoctors([]);
      setSlots([]);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuat booking");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-start py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg border border-blue-100"
      >
        <h2 className="text-xl font-semibold text-blue-700 mb-6">
          Buat Booking
        </h2>

        {/* SERVICE */}
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-1">
            Pilih Layanan
          </label>
          <select
            name="service_id"
            value={form.service_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg"
            required
          >
            <option value="">-- Pilih Layanan --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* DOCTOR */}
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-1">
            Pilih Dokter
          </label>
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg"
            required
            disabled={!availableDoctors.length}
          >
            <option value="">-- Pilih Dokter --</option>
            {availableDoctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-1">
            Tanggal
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg"
            required
          />
        </div>

        {/* TIME SLOT */}
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-1">Jam</label>

          <select
            name="time_start"
            value={form.time_start}
            onChange={handleChange}
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
        </div>

        {/* NOTES */}
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-1">
            Catatan
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Buat Booking
        </button>
      </form>
    </div>
  );
}



