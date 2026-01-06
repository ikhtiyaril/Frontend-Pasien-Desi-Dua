import { 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Video, 
  Stethoscope 
} from "lucide-react";

export default function BookingService({ service, onSelect }) {
  const { 
    name, 
    description, 
    duration_minutes, 
    price, 
    is_live 
  } = service;

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-blue-100 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1"
      onClick={() => onSelect(service)}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      <div className="p-5 flex gap-5">
        {/* Image */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <img
            src="/Poli-Umum.jpg"
            alt={name}
            className="w-24 h-24 rounded-xl object-cover shadow-md border-2 border-blue-100 group-hover:border-blue-300 transition-all"
          />

          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
            is_live 
              ? "bg-gradient-to-br from-purple-500 to-purple-600"
              : "bg-gradient-to-br from-blue-500 to-blue-600"
          }`}>
            {is_live ? (
              <Video className="w-4 h-4 text-white" />
            ) : (
              <Stethoscope className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-xl font-bold group-hover:text-blue-700 transition">
                {name}
              </h3>
              <ChevronRight className="w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              is_live 
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {is_live ? "Video Call" : "Layanan Normal"}
            </span>
          </div>

          <div className="flex gap-5 mt-4">
            <InfoItem icon={<Clock />} label="Durasi" value={`${duration_minutes} menit`} />
            <InfoItem 
              icon={<DollarSign />} 
              label="Biaya" 
              value={price ? `Rp ${Number(price).toLocaleString()}` : "Gratis"} 
              highlight 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        highlight ? "bg-green-50" : "bg-blue-50"
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm font-semibold ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
}
