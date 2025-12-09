import React from "react";

export default function PaymentFeeCalculator({ data, service }) {
   
  if (!data || data.length === 0 || !service) {
    return (
      <p className="text-gray-500 text-sm">
        Data layanan atau biaya tidak tersedia.
      </p>
    );
  }

  const item = data[0]; // Tripay selalu kirim array
  const servicePrice = service.price || 0;

  // Total yang dibayar user = harga layanan + fee customer
  const totalUserPay = servicePrice + item.total_fee.merchant;

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Rincian Biaya Pembayaran
      </h2>

      {/* Info Layanan */}
      <div className="space-y-1">
        <p className="text-sm text-gray-700 font-medium">Layanan:</p>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Nama Layanan</span>
          <span className="font-medium text-gray-900">{service.name}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Harga Layanan</span>
          <span className="font-medium text-gray-900">
            Rp {servicePrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Pembayaran */}
      <div className="space-y-1 border-t pt-3">
        <p className="text-sm text-gray-700 font-medium">
          Metode Pembayaran ({item.name})
        </p>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fee Admin</span>
          <span className="font-medium text-gray-900">
            Rp {item.total_fee.merchant.toLocaleString()}
          </span>
        </div>

        

      {/* Detail Fee */}
      <div className="space-y-1 border-t pt-3">
        <p className="text-sm text-gray-700 font-medium mb-1">Detail Fee:</p>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Flat</span>
          <span className="font-medium text-gray-900">
            Rp {item.fee.flat.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Percent</span>
          <span className="font-medium text-gray-900">
            {item.fee.percent}%
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-3 border-t">
        <div className="flex justify-between text-base font-semibold">
          <span>Total Dibayar User</span>
          <span>Rp {totalUserPay.toLocaleString()}</span>
        </div>
      </div>
    </div>
    </div>
  );
}
