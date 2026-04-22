"use client";

import { useState, useMemo } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isComplete: boolean) => void;
  borderColor: string;
  bgColor: string;
}

const countries = [
  { id: "in", code: "+91", name: "India", maxLen: 10 },
  { id: "us", code: "+1", name: "USA", maxLen: 10 },
  { id: "gb", code: "+44", name: "UK", maxLen: 10 },
  { id: "ae", code: "+971", name: "UAE", maxLen: 9 },
  { id: "ca", code: "+1", name: "Canada", maxLen: 10 },
  { id: "au", code: "+61", name: "Australia", maxLen: 9 },
  { id: "sg", code: "+65", name: "Singapore", maxLen: 8 },
  { id: "other", code: "+", name: "Other", maxLen: 15 },
];

export default function PhoneInput({
  value,
  onChange,
  borderColor,
  bgColor,
}: PhoneInputProps) {
  const [selectedId, setSelectedId] = useState("in");
  const selected = useMemo(() => countries.find((c) => c.id === selectedId) ?? countries[0], [selectedId]);

  const phoneNumber = value.startsWith("+")
    ? value.slice(selected.code.length).trim()
    : value;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const newCountry = countries.find((c) => c.id === newId);
    setSelectedId(newId);
    if (newCountry) {
      const digits = phoneNumber;
      onChange(`${newCountry.code}${digits}`, digits.length === newCountry.maxLen);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    onChange(`${selected.code}${digitsOnly}`, digitsOnly.length === selected.maxLen);
  };

  const font = '"DM Sans", sans-serif';

  return (
    <div className="flex gap-2">
      <select
        value={selectedId}
        onChange={handleCountryChange}
        aria-label="Country code"
        className="flex-shrink-0 px-2.5 py-2 border-b-2 border-t-0 border-l-0 border-r-0 text-sm transition-all"
        style={{
          borderColor: borderColor,
          backgroundColor: bgColor,
          color: "#4B388F",
          fontFamily: font,
          borderRadius: "0",
          paddingRight: "28px",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234B388F' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
          minWidth: "max-content",
        }}
      >
        {countries.map((country) => (
          <option key={country.id} value={country.id} style={{ color: "#4B388F" }}>
            {country.name} ({country.code})
          </option>
        ))}
      </select>

      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="phone number"
        maxLength={selected.maxLen}
        autoComplete="tel-national"
        aria-label="Phone number"
        className="flex-1 px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 text-sm transition-all"
        style={{
          borderColor: borderColor,
          backgroundColor: bgColor,
          color: "#4B388F",
          fontFamily: font,
          borderRadius: "0",
        }}
      />
    </div>
  );
}
