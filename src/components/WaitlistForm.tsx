"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

const MAX_NAME_LEN = 100;
const MAX_PHONE_LEN = 20;
const MAX_INSTA_LEN = 60;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

const ORANGE = "#f1663b";
const WHITE = "#ffffff";
const INPUT_BG = "#feefe2";
const LABEL_FONT = '"Bastia Bold", Georgia, serif';
const BODY_FONT = '"Helvetica Neue", Arial, sans-serif';

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "clamp(8px, 1.8vh, 16px) clamp(16px, 2vw, 28px)",
  borderRadius: "110px",
  border: "none",
  backgroundColor: INPUT_BG,
  color: ORANGE,
  fontFamily: BODY_FONT,
  fontWeight: 700,
  fontSize: "clamp(12px, 1.6vh, 16px)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: LABEL_FONT,
  fontSize: "clamp(13px, 1.7vh, 20px)",
  color: WHITE,
  marginBottom: "clamp(3px, 0.5vh, 7px)",
};

export default function WaitlistForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", instagram: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = (): string | null => {
    const name = sanitize(formData.name);
    const phone = sanitize(formData.phone);
    const instagram = sanitize(formData.instagram);

    if (!name) return "name is required";
    if (name.length > MAX_NAME_LEN) return "name is too long";
    if (!phone) return "phone number is required";
    if (!PHONE_REGEX.test(phone)) return "please enter a valid phone number";
    if (phone.length > MAX_PHONE_LEN) return "phone number is too long";
    if (instagram.length > MAX_INSTA_LEN) return "instagram handle is too long";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
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
          phone: sanitize(formData.phone),
          instagram: sanitize(formData.instagram),
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
    } catch {
      toast.error("something went wrong. please try again.");
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError("");
    setIsLoading(false);
    setFormData({ name: "", phone: "", instagram: "" });
  };

  if (success) {
    return (
      <div style={{ width: "100%", maxWidth: "480px", textAlign: "center" }}>
        <p style={{ fontFamily: LABEL_FONT, fontSize: "32px", color: WHITE, marginBottom: "12px" }}>
          you&apos;re in, bestie!
        </p>
        <p style={{ fontFamily: BODY_FONT, fontSize: "16px", color: "rgba(255,255,255,0.8)", marginBottom: "28px" }}>
          we&apos;ll hit you up with exclusives when we launch 🎉
        </p>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: ORANGE,
            color: WHITE,
            fontFamily: LABEL_FONT,
            fontSize: "18px",
            padding: "14px 36px",
            borderRadius: "110px",
            border: "none",
            cursor: "pointer",
          }}
        >
          add another bestie
        </button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" />
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ width: "min(480px, 90vw)", display: "flex", flexDirection: "column", gap: 0 }}
      >
        {/* Name */}
        <div style={{ marginBottom: "clamp(8px, 1.5vh, 20px)" }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Hi bestie!"
            required
            maxLength={MAX_NAME_LEN}
            autoComplete="name"
            disabled={isLoading}
            style={inputStyle}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "clamp(8px, 1.5vh, 20px)" }}>
          <label style={labelStyle}>Phone number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="So we can contact you when you win ;)"
            maxLength={MAX_PHONE_LEN}
            autoComplete="tel"
            disabled={isLoading}
            style={inputStyle}
          />
        </div>

        {/* Instagram */}
        <div style={{ marginBottom: "clamp(10px, 2vh, 28px)" }}>
          <label style={labelStyle}>Instagram Username</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            placeholder="@your IG handle"
            maxLength={MAX_INSTA_LEN}
            disabled={isLoading}
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            style={{
              fontFamily: BODY_FONT,
              fontSize: "14px",
              color: "#ffd0c0",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            alignSelf: "flex-start",
            backgroundColor: ORANGE,
            color: WHITE,
            fontFamily: LABEL_FONT,
            fontSize: "clamp(15px, 1.8vh, 22px)",
            padding: "clamp(10px, 1.6vh, 18px) clamp(28px, 3vw, 44px)",
            borderRadius: "110px",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "submitting..." : "Okay I'm in!"}
        </button>
      </form>
    </>
  );
}
