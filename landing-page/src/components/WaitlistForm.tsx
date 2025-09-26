"use client";

import { useId, useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  orientation?: "horizontal" | "vertical";
};

type RoleOption = {
  value: string;
  label: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

type StatusMessage = {
  Icon: LucideIcon;
  text: string;
  className: string;
};

const roleOptions: RoleOption[] = [
  { value: "", label: "Your role (optional)" },
  { value: "homeowner", label: "Homeowner / Renter" },
  { value: "organizer", label: "Professional organizer" },
  { value: "relocation", label: "Relocation consultant" },
  { value: "property-manager", label: "Property manager" },
  { value: "other", label: "Something else" },
];

const messageByStatus: Record<Extract<FormStatus, "success" | "error">, StatusMessage> = {
  success: {
    Icon: CheckCircle2,
    text: "Thanks! Check your inbox for the Moving Day Command Center preview.",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    Icon: AlertCircle,
    text: "We could not add that email. Double-check and try again.",
    className: "text-rose-600 dark:text-rose-400",
  },
};

function WaitlistForm({ orientation = "horizontal" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const formId = useId();
  const emailId = `${formId}-email`;
  const roleId = `${formId}-role`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("company")) {
      return;
    }

    if (!email.trim()) {
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      await new Promise((resolve) => setTimeout(resolve, 850));
      setStatus("success");
      setEmail("");
      setRole("");
    } catch {
      setStatus("error");
    }
  };

  const statusMessage = status === "success" || status === "error" ? messageByStatus[status] : null;
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col items-stretch gap-3",
        orientation === "horizontal"
          ? "sm:flex-row sm:items-stretch sm:justify-start sm:gap-3"
          : "",
      )}
      aria-live="polite"
    >
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="flex-1">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-base shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-200 dark:focus:ring-slate-100/10"
        />
      </div>

      <div className={cn("w-full sm:w-52", orientation === "horizontal" ? "sm:mt-0" : "")}>
        <label htmlFor={roleId} className="sr-only">
          Role
        </label>
        <select
          id={roleId}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-base text-slate-700 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-200 dark:focus:ring-slate-100/10"
        >
          {roleOptions.map((option) => (
            <option key={option.value || "empty"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={cn(
          "group relative inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-400 px-6 py-3 text-base font-semibold text-white shadow-[0_0_18px_rgba(249,115,22,0.45)] transition",
          "focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2 dark:focus:ring-offset-slate-950",
          "hover:shadow-[0_0_26px_rgba(249,115,22,0.55)]",
          orientation === "horizontal" ? "sm:mt-0" : "mt-1",
          isLoading ? "cursor-wait opacity-80" : "",
        )}
        disabled={isLoading}
      >
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-orange-400/20 blur-xl transition opacity-70",
            isLoading ? "opacity-40" : "group-hover:opacity-100",
          )}
          aria-hidden
        />
        <span className="relative flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {isSuccess ? "Waitlist joined" : "Join the waitlist"}
        </span>
      </button>

      {statusMessage ? (
        <p
          className={cn(
            "flex items-center gap-2 pt-3 text-sm font-medium",
            orientation === "horizontal" ? "sm:pl-4 sm:pt-0" : "",
            statusMessage.className,
          )}
        >
          <statusMessage.Icon className="h-4 w-4" />
          <span>{statusMessage.text}</span>
        </p>
      ) : null}
    </form>
  );
}

export default WaitlistForm;

