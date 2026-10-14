"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertTriangle, LoaderCircle, ShieldAlert, Trash2 } from "lucide-react";
import { supabase } from "@/4_infrastructure/database/supabaseClient";

const copy = {
  title: "X\u00f3a t\u00e0i kho\u1ea3n",
  irreversible: "Thao t\u00e1c n\u00e0y kh\u00f4ng th\u1ec3 ho\u00e0n t\u00e1c.",
  warning: "D\u1eef li\u1ec7u s\u1ebd b\u1ecb x\u00f3a v\u0129nh vi\u1ec5n",
  details: "Nh\u1eadp \u0111\u00fang email v\u00e0 m\u1eadt kh\u1ea9u c\u1ee7a t\u00e0i kho\u1ea3n mu\u1ed1n x\u00f3a. To\u00e0n b\u1ed9 d\u1eef li\u1ec7u t\u00e0i ch\u00ednh li\u00ean quan s\u1ebd b\u1ecb x\u00f3a.",
  email: "Email t\u00e0i kho\u1ea3n c\u1ea7n x\u00f3a",
  emailPlaceholder: "Nh\u1eadp email",
  password: "M\u1eadt kh\u1ea9u t\u00e0i kho\u1ea3n c\u1ea7n x\u00f3a",
  passwordPlaceholder: "Nh\u1eadp m\u1eadt kh\u1ea9u",
  emailRequired: "Vui l\u00f2ng nh\u1eadp email t\u00e0i kho\u1ea3n.",
  passwordRequired: "Vui l\u00f2ng nh\u1eadp m\u1eadt kh\u1ea9u \u0111\u1ec3 ti\u1ebfp t\u1ee5c.",
  invalidCredentials: "Email ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng ch\u00ednh x\u00e1c.",
  deleting: "\u0110ang x\u00e1c minh v\u00e0 x\u00f3a...",
  delete: "X\u00e1c minh v\u00e0 x\u00f3a t\u00e0i kho\u1ea3n",
  cancel: "H\u1ee7y v\u00e0 quay l\u1ea1i \u1ee9ng d\u1ee5ng",
};

export default function DeleteAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError(copy.emailRequired);
      return;
    }
    if (!password) {
      setError(copy.passwordRequired);
      return;
    }

    setIsDeleting(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setError(copy.invalidCredentials);
      setIsDeleting(false);
      return;
    }

    const { error: deleteError } = await supabase.rpc("delete_current_user");
    if (deleteError) {
      setError(deleteError.message);
      setIsDeleting(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    router.replace("/login?accountDeleted=1");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-red-500/40 bg-slate-900 p-6 shadow-[0_0_40px_rgba(239,68,68,0.14)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-red-400">
            <ShieldAlert className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wide text-red-300">{copy.title}</h1>
            <p className="text-sm text-slate-400">{copy.irreversible}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
          <div className="mb-2 flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {copy.warning}
          </div>
          {copy.details}
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          <label htmlFor="account-email" className="block text-sm font-medium text-slate-300">{copy.email}</label>
          <input
            id="account-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            disabled={isDeleting}
            required
            className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <label htmlFor="account-password" className="block text-sm font-medium text-slate-300">{copy.password}</label>
          <input
            id="account-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder={copy.passwordPlaceholder}
            disabled={isDeleting}
            required
            className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            aria-describedby={error ? "delete-account-error" : undefined}
          />

          {error && <p id="delete-account-error" role="alert" className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={isDeleting || !email || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Trash2 className="h-5 w-5" aria-hidden="true" />}
            {isDeleting ? copy.deleting : copy.delete}
          </button>
        </form>

        <Link href="/dashboard" className="mt-5 block text-center text-sm font-medium text-slate-400 underline-offset-4 hover:text-white hover:underline">
          {copy.cancel}
        </Link>
      </section>
    </main>
  );
}