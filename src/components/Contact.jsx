import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Contact() {
  const [profile, setProfile] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/clinic-profile`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Gagal ambil profile:", err));
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat informasi kontak...
      </div>
    );
  }

  const { contact, operationalHours, shortDescription } = profile;

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">
          Hubungi Klinik Desidua
        </h1>
        <p className="max-w-2xl mx-auto text-lg">
          {shortDescription ||
            "Kami siap membantu kebutuhan kesehatan ibu, anak, dan keluarga Anda."}
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
        {/* INFO KONTAK */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Informasi Kontak
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                📍 <strong>Alamat:</strong>
                <br />
                {contact.address || "-"}
              </li>
              <li>
                📞 <strong>Telepon / WhatsApp:</strong>
                <br />
                <a
                  href={`https://wa.me/${contact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.phone || "-"}
                </a>
              </li>
              <li>
                📧 <strong>Email:</strong>
                <br />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.email || "-"}
                </a>
              </li>
            </ul>
          </div>

          {/* JAM OPERASIONAL */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Jam Operasional
            </h2>
            <ul className="text-sm space-y-1 text-gray-700">
              {Object.entries(operationalHours).map(([day, hour]) => (
                <li key={day} className="flex justify-between">
                  <span className="capitalize">{day}</span>
                  <span>{hour || "-"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FORM + MAP */}
        <div className="space-y-8">
          {/* MAP */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <iframe
              title="Google Maps Klinik"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                contact.address
              )}&output=embed`}
              className="w-full h-64 border-0"
              loading="lazy"
            ></iframe>
          </div>

          {/* FORM KONTAK */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Kirim Pesan
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Nomor WhatsApp"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                rows="4"
                placeholder="Pesan atau pertanyaan Anda"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
              <button
                type="button"
                onClick={() =>
                  window.open(`https://wa.me/${contact.phone}`, "_blank")
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Kirim via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CATATAN PENTING */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-sm text-gray-700">
          ⚠️ <strong>Catatan Penting:</strong>
          <br />
          Untuk kondisi darurat medis atau keadaan yang mengancam nyawa, silakan
          segera menuju IGD rumah sakit terdekat. Klinik Desidua melayani
          konsultasi dan perawatan terjadwal.
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">
          Siap Konsultasi dengan Kami?
        </h2>
        <a
          href={`https://wa.me/${contact.phone}`}
          className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
        >
          Chat WhatsApp Sekarang
        </a>
      </section>
    </div>
  );
}
