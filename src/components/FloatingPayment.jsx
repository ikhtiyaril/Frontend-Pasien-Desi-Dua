import React, { useState } from "react";

export default function FloatingPayment({ payment, onClose }) {
  if (!payment) return null;

  // Biar tutorial bisa buka-tutup
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center 
      bg-black/40 backdrop-blur-sm p-4">

      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-5 
        max-h-[90vh] overflow-y-auto animate-slide-up">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Pembayaran</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        {/* TOTAL */}
        <p className="text-gray-600 text-sm mb-3">
          Total:{" "}
          <span className="font-semibold">
            Rp {payment.amount?.toLocaleString()}
          </span>
        </p>

        {/* QRIS */}
        {payment.qr_url && (
          <div className="flex flex-col items-center mb-4">
            <img
              src={payment.qr_url}
              alt="QRIS"
              className="w-48 h-48 rounded-lg shadow"
            />
            <p className="text-xs text-gray-500 mt-2">Scan QR untuk bayar</p>
          </div>
        )}

        {/* VA */}
        {payment.pay_code && (
          <div className="mb-4 bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Kode Virtual Account</p>
            <p className="text-xl font-bold tracking-wider">
              {payment.pay_code}
            </p>
          </div>
        )}

        {/* ACCORDION UNTUK INSTRUCTIONS */}
        <div className="space-y-2">
          {payment.instructions?.map((item, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              
              {/* HEADER */}
              <button
                className="w-full text-left px-4 py-3 bg-gray-100 
                  hover:bg-gray-200 font-semibold flex justify-between"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {item.title}
                <span>{openIndex === i ? "▲" : "▼"}</span>
              </button>

              {/* CONTENT */}
              {openIndex === i && (
                <div className="p-4 bg-white text-sm space-y-2">
                  {item.steps.map((step, idx) => (
                    <p
                      key={idx}
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
