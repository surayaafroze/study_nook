"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiBookOpen, FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";




/* ═══════════════════════════════════════════
   TOAST COMPONENT
═══════════════════════════════════════════ */
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5
            rounded-2xl shadow-2xl border backdrop-blur-sm min-w-[260px] max-w-[340px]
            ${
              t.type === "success"
                ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
        >
          {t.type === "success" ? (
            <FiCheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500" />
          ) : (
            <FiXCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          )}
          <div className="flex-1 text-sm font-medium leading-snug">{t.msg}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="mt-0.5 shrink-0 opacity-50 hover:opacity-100 transition"
          >
            <FiX size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  /* ── toast helpers ── */
  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  /* ── email sign in ── */
  const onSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        addToast(error?.message || "Sign in failed. Please try again.", "error");
      } else {
        addToast("Welcome back! Signing you in…", "success");
        setTimeout(() => router.push("/"), 1200);
      }
    } catch {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── google sign in ── */
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({ provider: "google" });
    } catch {
      addToast("Google sign-in failed. Try again.", "error");
      setGoogleLoading(false);
    }
  };

  /* ── animation variants ── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 320, damping: 26 },
    },
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* ── full-page background ── */}
      <div
        className="min-h-screen w-full flex items-center justify-center
        bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30
        dark:from-zinc-950 dark:via-indigo-950/20 dark:to-zinc-950
        px-4 py-10 sm:py-16"
      >
        {/* decorative blobs */}
        <div
          className="pointer-events-none select-none fixed inset-0 overflow-hidden hidden sm:block"
          aria-hidden
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/20 dark:bg-indigo-700/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-300/20 dark:bg-purple-700/10 blur-3xl" />
        </div>

        {/* ── card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="w-full max-w-md"
        >
          <Card
            className="
            w-full rounded-3xl border border-slate-200/80 dark:border-zinc-800
            bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl
            shadow-2xl shadow-indigo-100/40 dark:shadow-indigo-950/40
            px-6 py-10 sm:px-10
          "
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-0"
            >
              {/* ── header ── */}
              <motion.div variants={item} className="text-center mb-8">
                <div
                  className="inline-flex items-center justify-center
                  w-14 h-14 rounded-2xl
                  bg-indigo-600 dark:bg-indigo-500
                  shadow-lg shadow-indigo-500/30 mb-4"
                >
                  <FiBookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400">
                  Sign in to your StudyNook account
                </p>
              </motion.div>

              {/* ── form ── */}
              <Form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>
                {/* email */}
                <motion.div variants={item} className="w-full">
                  <TextField
                    isRequired
                    name="email"
                    type="email"
                    className="w-full"
                    validate={(value) => {
                      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
                        return "Please enter a valid email address";
                      return null;
                    }}
                  >
                    <Label className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 block">
                      Email
                    </Label>
                    <Input
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-700
                        bg-slate-50 dark:bg-zinc-800
                        px-4 py-2.5 text-sm
                        text-slate-800 dark:text-white
                        placeholder:text-slate-400 dark:placeholder:text-zinc-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        transition"
                    />
                    <FieldError className="text-xs text-red-500 mt-1" />
                  </TextField>
                </motion.div>

                {/* password */}
                <motion.div variants={item} className="w-full">
                  <TextField
                    isRequired
                    minLength={8}
                    name="password"
                    type="password"
                    className="w-full"
                    validate={(value) => {
                      if (value.length < 8)
                        return "Password must be at least 8 characters";
                      if (!/[A-Z]/.test(value))
                        return "Must contain at least one uppercase letter";
                      if (!/[0-9]/.test(value))
                        return "Must contain at least one number";
                      return null;
                    }}
                  >
                    <Label className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 block">
                      Password
                    </Label>
                    <Input
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-700
                        bg-slate-50 dark:bg-zinc-800
                        px-4 py-2.5 text-sm
                        text-slate-800 dark:text-white
                        placeholder:text-slate-400 dark:placeholder:text-zinc-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        transition"
                    />
                    <FieldError className="text-xs text-red-500 mt-1" />
                  </TextField>
                </motion.div>

                {/* submit */}
                <motion.div variants={item} className="w-full mt-1">
                  <Button
                    type="submit"
                    isDisabled={loading}
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-white
                      bg-indigo-600 hover:bg-indigo-700
                      dark:bg-indigo-500 dark:hover:bg-indigo-600
                      shadow-md shadow-indigo-500/30
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-150 active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Signing in…
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </Form>

              {/* divider */}
              <motion.div variants={item} className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700" />
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700" />
              </motion.div>

              {/* google */}
              <motion.div variants={item}>
                <Button
                  onClick={handleGoogleSignIn}
                  isDisabled={googleLoading}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2.5
                    rounded-xl py-2.5 px-4 text-sm font-medium
                    border border-slate-200 dark:border-zinc-700
                    text-slate-700 dark:text-zinc-300
                    bg-white dark:bg-zinc-900
                    hover:bg-slate-50 dark:hover:bg-zinc-800
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all duration-150 active:scale-[0.98]"
                >
                  {googleLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  ) : (
                    <FcGoogle size={18} />
                  )}
                  Continue with Google
                </Button>
              </motion.div>

              {/* register link */}
              <motion.div variants={item} className="text-center mt-6">
                <Link
                  href="/register"
                  className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Don&apos;t have an account? Register
                </Link>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}