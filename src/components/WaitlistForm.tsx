"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "./PhoneInput";

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const MAX_EMAIL_LEN = 254;
const MAX_PHONE_LEN = 20;
const MAX_ADDRESS_LEN = 500;
const MAX_COMMENTS_LEN = 500;

const PURPLE = "#4B388F";
const ORANGE = "#EF5D34";
const CARD_BG = "#E8D3EE";
const INPUT_BG = "#F5E2F8";
const fontFamily = '"DM Sans", sans-serif';

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    comments: "",
  });
  const [phoneComplete, setPhoneComplete] = useState(false);
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

  const handlePhoneChange = (value: string, isComplete: boolean) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    setPhoneComplete(isComplete);
    if (error) setError("");
  };

  const validateForm = (): string | null => {
    const name = sanitize(formData.name);
    const email = sanitize(formData.email);
    const phone = sanitize(formData.phone);
    const address = sanitize(formData.address);
    const comments = formData.comments;

    if (!name) return "name is required";
    if (name.length > 100) return "name is too long";

    if (!email) return "email is required";
    if (email.length > MAX_EMAIL_LEN) return "email is too long";
    if (!EMAIL_REGEX.test(email)) return "please enter a valid email address";

    if (!phone) return "phone number is required";
    if (!phoneComplete) return "please enter a complete phone number";

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
          name: sanitize(formData.name),
          email: sanitize(formData.email).toLowerCase(),
          phone: sanitize(formData.phone),
          address: sanitize(formData.address),
          comments: sanitize(formData.comments),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || "something went wrong. please try again.";
        if (response.status === 429) {
          toast.error(msg);
        } else {
          setError(msg);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", address: "", comments: "" });
    } catch {
      toast.error("something went wrong. please try again.");
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError("");
    setIsLoading(false);
    setPhoneComplete(false);
    setFormData({ name: "", email: "", phone: "", address: "", comments: "" });
  };

  // === Success State ===
  if (success) {
    return (
      <>
        <ToastContainer
          position="top-center"
          toastStyle={{
            backgroundColor: CARD_BG,
            color: PURPLE,
            fontFamily,
            fontSize: "0.875rem",
            border: `1.5px solid ${PURPLE}`,
            borderRadius: 0,
            boxShadow: `4px 4px 0 0 ${PURPLE}`,
          }}
        />
        <div className="reveal-item w-full max-w-md">
          <div
            className="p-8 text-center"
            style={{ backgroundColor: CARD_BG, boxShadow: `6px 6px 0 0 ${PURPLE}` }}
          >
            <div className="mb-4" aria-hidden="true">
              <svg className="mx-auto" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" stroke={PURPLE} strokeWidth="1.5" fill="none" />
                <path d="M12 18 L16 22 L24 14" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h2
              className="text-xl mb-2"
              style={{ color: PURPLE, fontFamily: '"Bastia Bold", Georgia, serif' }}
            >
              you&apos;re on the list!
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: PURPLE, fontFamily, opacity: 0.75 }}
            >
              we&apos;ll be in touch with exclusive updates
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs tracking-wide transition-opacity hover:opacity-80"
              style={{
                backgroundColor: PURPLE,
                color: "#FFFFFF",
                fontFamily,
                fontWeight: 500,
              }}
              aria-label="Add another person to the waitlist"
            >
              add another person
            </button>
          </div>
        </div>
      </>
    );
  }

  // === Form State ===
  return (
    <>
      <ToastContainer
        position="top-center"
        toastStyle={{
          backgroundColor: CARD_BG,
          color: PURPLE,
          fontFamily,
          fontSize: "0.875rem",
          border: `1.5px solid ${PURPLE}`,
          borderRadius: 0,
          boxShadow: `4px 4px 0 0 ${PURPLE}`,
        }}
      />
      <div className="reveal-item w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-3 sm:p-4"
          style={{ backgroundColor: CARD_BG, borderRadius: "0", boxShadow: `6px 6px 0 0 ${PURPLE}` }}
        >
          <h2
            className="text-base sm:text-lg text-center mb-2"
            style={{
              color: PURPLE,
              fontFamily: '"Bastia Bold", Georgia, serif',
            }}
          >
            join the waitlist
          </h2>

          {/* Name */}
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-xs tracking-wide mb-1"
              style={{ color: PURPLE, fontFamily, fontWeight: 500, opacity: 0.75 }}
            >
              full name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="your name"
              required
              maxLength={100}
              autoComplete="name"
              disabled={isLoading}
              aria-required="true"
              className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-colors disabled:opacity-50 text-sm"
              style={{
                borderColor: PURPLE,
                backgroundColor: INPUT_BG,
                color: PURPLE,
                fontFamily,
                borderRadius: "0",
              }}
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-xs tracking-wide mb-1"
              style={{ color: PURPLE, fontFamily, fontWeight: 500, opacity: 0.75 }}
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
              className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-colors disabled:opacity-50 text-sm"
              style={{
                borderColor: PURPLE,
                backgroundColor: INPUT_BG,
                color: PURPLE,
                fontFamily,
                borderRadius: "0",
              }}
            />
          </div>

          {/* Phone */}
          <div className="mb-2">
            <label
              htmlFor="phone"
              className="block text-xs tracking-wide mb-1"
              style={{ color: PURPLE, fontFamily, fontWeight: 500, opacity: 0.75 }}
            >
              phone number *
            </label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              borderColor={PURPLE}
              bgColor={INPUT_BG}
            />
          </div>

          {/* Address */}
          <div className="mb-2">
            <label
              htmlFor="address"
              className="block text-xs tracking-wide mb-1"
              style={{ color: PURPLE, fontFamily, fontWeight: 500, opacity: 0.75 }}
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
              rows={2}
              aria-required="true"
              className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-colors resize-none disabled:opacity-50 text-sm"
              style={{
                borderColor: PURPLE,
                backgroundColor: INPUT_BG,
                color: PURPLE,
                fontFamily,
                borderRadius: "0",
              }}
            />
          </div>

          {/* Comments */}
          <div className="mb-2">
            <label
              htmlFor="comments"
              className="block text-xs tracking-wide mb-1"
              style={{ color: PURPLE, fontFamily, fontWeight: 500, opacity: 0.75 }}
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
              className="w-full px-3 py-2 border-b-2 border-t-0 border-l-0 border-r-0 transition-colors resize-none disabled:opacity-50 text-sm"
              style={{
                borderColor: PURPLE,
                backgroundColor: INPUT_BG,
                color: PURPLE,
                fontFamily,
                borderRadius: "0",
              }}
            />
            <div
              className="text-xs mt-1 text-right"
              style={{ color: PURPLE, fontFamily, opacity: 0.5 }}
              aria-live="polite"
            >
              {formData.comments.length}/500
            </div>
          </div>

          {/* Inline validation error — fixed slot prevents layout shift */}
          <div className="mb-2 min-h-[1.75rem]">
            {error && (
              <div
                className="p-2.5 text-xs"
                style={{
                  backgroundColor: "rgba(239, 93, 52, 0.15)",
                  color: ORANGE,
                  fontFamily,
                }}
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: ORANGE,
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
    </>
  );
}
