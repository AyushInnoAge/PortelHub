"use client";
import { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { loginUser } from "@/_api_/loginapi";

export default function LoginPage() {
  const { login, user } = useContext(AuthContext); // Ensure AuthContext is defined
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Added this
  const formRef = useRef(null);
  const [loginButtonDisable, setLoginButtonDisable] = useState(false);
  const [displayValue, setDisplayValue] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
      return;
    }
    setDisplayValue(true);
  }, [user])

  // Hide message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Hide the message after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [message]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (email && password && password.length >= 6) {
        formRef.current.requestSubmit();
      }
    }
  };

  const handleSubmit = async (event) => {
    setLoginButtonDisable(true);
    event.preventDefault();
    setError("");
    setMessage(""); // Reset message on new submit

    // Email pattern validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    try {
      const data = await loginUser(email, password); // Call API from separate folder

      if (data.statusCode === 200 && !data.message.isVerified && !data.isError) {
        router.push(`/ResetPasswordEmail?email=${encodeURIComponent(email)}`);
        return;
      } else if (data.statusCode === 200 && data.message.isVerified && data.message?.token && !data.isError) {
        const token = data.message.token;
        const userdata = data.message.user;
        login(userdata);
        localStorage.setItem("token", token);
        router.push("/dashboard");
        return;
      } else {
        setError(data.message || "Try again later!");
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoginButtonDisable(false);
    }
  };

  return (
    <div className={styles.container}>
      {displayValue ? <div className={styles.card}>
        <img src="/logo.svg" alt="Innoage Logo" className={styles.logo} />
        <h2 className={styles.title}>Welcome To InnoAge</h2>
        <p className={styles.subtitle}>Sign in to your account</p>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>} {/* Fixed success message rendering */}

        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />

          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
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

          <button
            type="submit"
            className={`${styles.button} ${(!(email && password && password.length >= 6)) || loginButtonDisable ? styles.disabledButton : ""
              }`}
            disabled={(!(email && password && password.length >= 6)) || loginButtonDisable}
          >
            Login
          </button>
        </form>

        <p className={styles.footerText}>
          Forgot Your Password?{" "}
          <Link href="/ResetPasswordEmail" className={styles.link}>
            Forgot Password
          </Link>
        </p>
      </div> : null}
    </div>
  );
}
