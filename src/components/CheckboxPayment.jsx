import React from "react";

export default function PaymentMethodCheckbox({ data, selectedMethod, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {data?.map((item, idx) => (
        <label
          key={idx}
          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all 
            ${selectedMethod === item.code ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          `}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            value={item.code}
            checked={selectedMethod === item.code}
            onChange={() => onChange(item.code)}
            className="w-5 h-5 accent-blue-600"
          />

          {/* Image */}
          <img
            src={item.icon_url}
            alt={item.name}
            className="w-10 h-10 object-contain"
          />

          {/* Name */}
          <span className="font-medium text-gray-800">{item.name}</span>
        </label>
      ))}
    </div>
  );
}
