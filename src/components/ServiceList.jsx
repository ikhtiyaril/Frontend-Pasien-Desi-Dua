import React from "react";
import { ArrowRight, Info } from "lucide-react";

// Dummy data (no TypeScript, pure JSX)
const services = [
  {
    id: 1,
    name: "General Checkup",
    description: "Pemeriksaan kesehatan dasar untuk memastikan kondisi tubuh tetap prima.",
    duration_minutes: 30,
    price: 80000,
    require_doctor: true,
    allow_walkin: true,
  },
  {
    id: 2,
    name: "Dental Cleaning",
    description: "Membersihkan karang gigi serta menjaga kesehatan mulut dan gusi.",
    duration_minutes: 45,
    price: 150000,
    require_doctor: true,
    allow_walkin: false,
  },
  {
    id: 3,
    name: "Therapy Massage",
    description: "Terapi pijat untuk merilekskan otot dan mengurangi ketegangan tubuh.",
    duration_minutes: 60,
    price: 120000,
    require_doctor: false,
    allow_walkin: true,
  },
];

export default function ServiceList() {
  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          Pilih Layanan Klinik
        </h1>

        <div className="grid gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-sm rounded-xl p-5 border border-blue-100 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-blue-900">
                    {service.name}
                  </h2>
                  <p className="text-sm text-blue-700/70 mt-1 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-blue-800">
                    <span>Durasi: {service.duration_minutes} menit</span>
                    <span>⋅</span>
                    <span>Rp {service.price.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3 mt-2 text-xs">
                    {service.require_doctor ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                        Butuh Dokter
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                        Tanpa Dokter
                      </span>
                    )}

                    {service.allow_walkin ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                        Bisa Walk-in
                      </span>
                    ) : (
                      <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded-lg">
                        Harus Booking
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                    Pesan Sekarang <ArrowRight size={18} />
                  </button>

                  <button className="flex items-center justify-center gap-2 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition w-full sm:w-auto">
                    <Info size={18} /> Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
