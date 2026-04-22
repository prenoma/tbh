"use client";

import { useState } from "react";
import PhoneInput from "./PhoneInput";

// Input sanitisation — strip HTML/script tags from user text
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// Email regex — handles most common formats
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const MAX_EMAIL_LEN = 254;
const MAX_PHONE_LEN = 20;
const MAX_ADDRESS_LEN = 500;
const MAX_COMMENTS_LEN = 500;

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    comments: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (error) setError("");
  };

  const validateForm = (): string | null => {
    const email = sanitize(formData.email);
    const phone = sanitize(formData.phone);
    const address = sanitize(formData.address);
    const comments = formData.comments;

    if (!email) return "email is required";
    if (email.length > MAX_EMAIL_LEN) return "email is too long";
    if (!EMAIL_REGEX.test(email)) return "please enter a valid email address";

    if (!phone) return "phone number is required";
    if (phone.length > MAX_PHONE_LEN) return "phone number is too long";
    if (!/^\+?[0-9\s\-()]{6,}$/.test(phone)) return "please enter a valid phone number";

    if (!address) return "address is required";
    if (address.length > MAX_ADDRESS_LEN) return "address must be 500 characters or less";

    if (comments.length > MAX_COMMENTS_LEN) return "comments must be 500 characters or less";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sanitize(formData.email).toLowerCase(),
          phone: sanitize(formData.phone),
          address: sanitize(formData.address),
          comments: sanitize(formData.comments),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "something went wrong. please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ email: "", phone: "", address: "", comments: "" });
    } catch {
      setError("something went wrong. please try again.");
      setIsLoading(false);
    }
  };

  const fontFamily = '"DM Sans", sans-serif';
  const cardBg = "#E8D3EE";
  const borderColor = "#4B388F";

  // === Success State ===
  if (success) {
    return (
      <div className="reveal-item w-full max-w-md">
        <div
          className="p-8 text-center"
          style={{ backgroundColor: cardBg, boxShadow: "6px 6px 0 0 #4B388F" }}
        >
          <div className="mb-4" aria-hidden="true">
            <svg className="mx-auto" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="#4B388F" strokeWidth="1.5" fill="none" />
              <path d="M12 18 L16 22 L24 14" stroke="#EF5D34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h2
            className="text-xl mb-2"
            style={{ color: "#4B388F", fontFamily: '"Bastia Bold", Georgia, serif' }}
          >
            you&apos;re on the list!
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "#4B388F", fontFamily, opacity: 0.75 }}
          >
            we&apos;ll be in touch with exclusive updates ✨
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-4 py-2 text-xs tracking-wide transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "#4B388F",
              color: "#FFFFFF",
              fontFamily,
              fontWeight: 500,
            }}
            aria-label="Sign up another person"
          >
            sign up another
          </button>
        </div>
      </div>
    );
  }

  // === Form State ===
  return (
    <div className="reveal-item w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-4 sm:p-5"
        style={{ backgroundColor: cardBg, borderRadius: "0", boxShadow: "6px 6px 0 0 #4B388F" }}
      >
        {/* Card heading */}
        <h2
          className="text-lg sm:text-xl text-center mb-3"
          style={{
            color: "#4B388F",
            fontFamily: '"Bastia Bold", Georgia, serif',
          }}
        >
          join the waitlist
        </h2>

         {/* Email */}
         <div className="mb-3">
           <label
             htmlFor="email"
             className="block text-xs tracking-wide mb-1.5"
             style={{ color: "#4B388F", fontFamily, fontWeight: 500, opacity: 0.75 }}
           >
             email address *
           </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              maxLength={MAX_EMAIL_LEN}
              autoComplete="email"
              disabled={isLoading}
              aria-required="true"
              className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-all disabled:opacity-50 text-sm"
              style={{
                borderColor: borderColor,
                backgroundColor: "#F5E2F8",
                color: "#4B388F",
                fontFamily,
                borderRadius: "0",
              }}
            />
        </div>

         {/* Phone */}
         <div className="mb-3">
           <label
             htmlFor="phone"
             className="block text-xs tracking-wide mb-1.5"
             style={{ color: "#4B388F", fontFamily, fontWeight: 500, opacity: 0.75 }}
           >
             phone number *
           </label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              borderColor={borderColor}
              bgColor="#F5E2F8"
            />
         </div>

         {/* Address */}
         <div className="mb-3">
            <label
              htmlFor="address"
              className="block text-xs tracking-wide mb-1.5"
              style={{ color: "#4B388F", fontFamily, fontWeight: 500, opacity: 0.75 }}
            >
              address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="your delivery address"
              required
              maxLength={MAX_ADDRESS_LEN}
              autoComplete="street-address"
              disabled={isLoading}
              rows={3}
              aria-required="true"
              className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-all resize-none disabled:opacity-50 text-sm"
              style={{
                borderColor: borderColor,
                backgroundColor: "#F5E2F8",
                color: "#4B388F",
                fontFamily,
                borderRadius: "0",
              }}
            />
         </div>

          {/* Comments */}
         <div className="mb-3">
           <label
             htmlFor="comments"
             className="block text-xs tracking-wide mb-1.5"
             style={{ color: "#4B388F", fontFamily, fontWeight: 500, opacity: 0.75 }}
           >
             drop your thoughts below
           </label>
             <textarea
               id="comments"
               name="comments"
               value={formData.comments}
               onChange={handleInputChange}
               placeholder="anything you'd like to ask or share..."
               maxLength={MAX_COMMENTS_LEN}
               disabled={isLoading}
               rows={2}
               className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-all resize-none disabled:opacity-50 text-sm"
               style={{
                 borderColor: borderColor,
                 backgroundColor: "#F5E2F8",
                 color: "#4B388F",
                 fontFamily,
                 borderRadius: "0",
               }}
             />
          <div
            className="text-xs mt-1 text-right"
            style={{ color: "#4B388F", fontFamily, opacity: 0.5 }}
            aria-live="polite"
          >
            {formData.comments.length}/500
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-3 p-2.5 text-xs"
            style={{
              backgroundColor: "rgba(239, 93, 52, 0.15)",
              color: "#EF5D34",
              fontFamily,
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: "#EF5D34",
            color: "#FFFFFF",
            fontFamily,
            fontWeight: 600,
            borderRadius: "0",
          }}
        >
          {isLoading ? "submitting..." : "notify me when it drops"}
        </button>
      </form>
    </div>
  );
}
