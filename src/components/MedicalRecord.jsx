import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  ClipboardList,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function MedicalRecord() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/medical-record/patient`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRecords(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch records:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <p className="text-gray-600 mt-4">Loading medical records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Kembali
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 mt-4">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center">
          <div className="bg-blue-50 p-3 rounded-xl mr-4">
            <FileText size={26} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Medical Records
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {records.length} records found
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        {records.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-blue-50 p-6 rounded-full mb-4">
              <ClipboardList size={48} className="text-blue-300" />
            </div>
            <p className="text-gray-500">
              No medical records found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Your consultation records will appear here
            </p>
          </div>
        )}

        {records.map((item) => (
          <div key={item.id}>
            {/* Card */}
            <button
              onClick={() => toggle(item.id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow transition"
            >
              <div className="p-5 flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.doctor?.name || "Doctor"}
                    </h3>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 ml-1">
                    <Calendar size={16} className="mr-2" />
                    {new Date(item.consultation_date).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      }
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                  {openId === item.id ? (
                    <ChevronUp className="text-blue-600" />
                  ) : (
                    <ChevronDown className="text-blue-600" />
                  )}
                </div>
              </div>

              {openId !== item.id && (
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                  Click to view details
                </div>
              )}
            </button>

            {/* Detail */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openId === item.id ? "max-h-[1000px] mt-3" : "max-h-0"
              }`}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="bg-blue-600 px-5 py-3">
                  <p className="text-white font-semibold">
                    Consultation Details
                  </p>
                </div>

                <div className="p-5">
                  <SoapSection label="Subjective" value={item.subjective} />
                  <SoapSection label="Objective" value={item.objective} />
                  <SoapSection label="Assessment" value={item.assessment} />
                  <SoapSection
                    label="Plan"
                    value={item.plan}
                    isLast
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoapSection({ label, value, isLast }) {
  return (
    <div className={!isLast ? "mb-5 pb-5 border-b border-gray-100" : ""}>
      <div className="flex items-center mb-2">
        <div className="w-1 h-5 bg-blue-600 rounded-full mr-3" />
        <h4 className="font-semibold text-gray-900">{label}</h4>
      </div>
      <p className="text-gray-700 leading-relaxed ml-4">
        {value || (
          <span className="text-gray-400 italic">
            No information recorded
          </span>
        )}
      </p>
    </div>
  );
}
