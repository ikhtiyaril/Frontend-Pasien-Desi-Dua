import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function RequestPrescriptionModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  /* ================= FILE HANDLER ================= */

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!file) {
      setError("Foto resep dokter wajib diunggah");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("prescription", file);
      formData.append("notes", notes);

      await axios.post(
        `${API}/api/prescription/request/${product.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengirim request resep"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          Minta Resep Dokter
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Upload foto resep untuk obat:
          <span className="font-medium text-gray-700">
            {" "}
            {product.name}
          </span>
        </p>

        {/* IMAGE UPLOAD */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Foto Resep Dokter
          </label>

          <label className="cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Klik untuk upload foto
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG / PNG
                </p>
              </>
            )}
          </label>
        </div>

        {/* NOTES */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Catatan (opsional)
          </label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Resep dari dokter umum"
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mt-3">
            {error}
          </p>
        )}

        {/* ACTION */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700"
          >
            Batal
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-xl text-white ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
