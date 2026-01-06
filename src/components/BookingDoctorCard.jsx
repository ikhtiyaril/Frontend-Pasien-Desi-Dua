import {
  Star,
  DollarSign,
  Calendar,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

export default function BookingDoctorCard({ doctor, service, onSelect }) {
  return (
    <div
      onClick={() => onSelect(doctor)}
      className="group relative bg-white rounded-2xl border-2 border-blue-100 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          <div className="relative">
            <img
              src={doctor.avatar || "https://via.placeholder.com/100"}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 group-hover:border-blue-300 shadow-md transition"
            />

            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${
                doctor.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold group-hover:text-blue-700 transition">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {doctor.specialization}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">(2 reviews)</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-4" />

        {/* Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600">Biaya Konsultasi</p>
            </div>
            <p className="text-lg font-bold text-blue-700">
              {service.price
                ? `Rp ${Number(service.price).toLocaleString()}`
                : "Gratis"}
            </p>
          </div>

          <div
            className={`rounded-xl p-3 border ${
              doctor.isActive
                ? "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200"
                : "bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar
                className={`w-4 h-4 ${
                  doctor.isActive ? "text-green-600" : "text-gray-600"
                }`}
              />
              <p className="text-xs text-gray-600">Status</p>
            </div>
            <p
              className={`text-sm font-bold ${
                doctor.isActive ? "text-green-700" : "text-gray-700"
              }`}
            >
              {doctor.isActive ? "Tersedia" : "Tidak Tersedia"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3 transition"
        >
          Pilih Dokter
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
