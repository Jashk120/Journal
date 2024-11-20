import React from 'react';

function TextInput({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded border"
        required={required}
      />
    </div>
  );
}

export default TextInput;
