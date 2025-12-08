import React from "react";

export default function PaymentMethodList({ data }) {
  const groupColor = {
    "Virtual Account": "bg-blue-50 border-blue-300",
    "Convenience Store": "bg-amber-50 border-amber-300",
    "E-Wallet": "bg-purple-50 border-purple-300",
  };

  const safeNumber = (num) => Number(num ?? 0).toLocaleString();

  return (
    <div className="w-full grid grid-cols-1 gap-5">
      {data?.map((item, idx) => (
        <div
          key={idx}
          className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
            groupColor[item.group] || "bg-gray-50 border-gray-300"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={item.icon_url}
              alt={item.name}
              className="w-10 h-10 object-contain"
            />
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.code}</p>
            </div>
          </div>

          {/* Group Tag */}
          <span className="inline-block text-xs px-2 py-1 bg-white border rounded-md text-gray-600 mb-3">
            {item.group}
          </span>

          {/* Fees */}
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Fee Merchant:</span> Rp{" "}
              {safeNumber(item?.fee_merchant?.flat)} +{" "}
              {item?.fee_merchant?.percent ?? 0}%
            </p>
            
          </div>
         

          {/* Status */}
          <div className="mt-4">
            {item?.active ? (
              <span className="text-green-600 font-semibold text-sm">● Active</span>
            ) : (
              <span className="text-red-600 font-semibold text-sm">● Not Active</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
