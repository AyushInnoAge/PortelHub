"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./resetpasswordemail.module.css";
import { sendResetPasswordOtp, verifyOtpAndUpdatePassword } from "@/_api_/resetpasswordEmail";
import { useRouter, useSearchParams } from "next/navigation";


export default function ResetPasswordPage() {
  const router = useSearchParams();
  const route= useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("email"); // "email" → "otp-password"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const emailFromParams = router.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [])


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current.requestSubmit();
    }
  };
  //  Step 1: Request OTP
  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await sendResetPasswordOtp(email); // Call API from separate folder
      setMessage("OTP sent to your email. Enter OTP and set a new password.");
      setStep("otp-password");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Update Password
  const handleVerifyOtpAndUpdatePassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await verifyOtpAndUpdatePassword(email, otp, newPassword); // Call API from separate folder
      setMessage("Password updated successfully! Redirecting to login...");
      route.push("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.svg" alt="Innoage Logo" className={styles.logo} />
        <h2 className={styles.title}>Welcome To InnoAge</h2>
        <p className={styles.subtitle}>Trouble logging in?</p>

        {error && <p className={styles.error}>{error}</p>}
        <form
          ref={formRef}
          onSubmit={step === "email" ? handleSendOtp : handleVerifyOtpAndUpdatePassword}
          className={styles.form}
        >
          {step === "email" && (
            <>
              <input
                type="email"
                placeholder="Enter Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
              <button type="submit" className={styles.button} disabled={!email || loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "otp-password" && (
            <>
              {/* OTP Input */}
              <input
                type="text"
                placeholder="Enter OTP"
                className={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                maxLength="6"
              />

              {/* New Password Input */}
              <div className={styles.passwordContainer}>
                <input
                  type="text"
                  placeholder="New Password"
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {/* <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button> */}
              </div>

              {/* Confirm Password Input */}
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? "Updating Password..." : "Verify OTP & Update Password"}
              </button>
            </>
          )}
        </form>
        {message && <p className={styles.success}>{message}</p>}

        <p className={styles.footerText}>
          Back to Login: <Link href="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}
