"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../../../components/Logo";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }
    setSending(true);
    setTimeout(() => { // simula envío real
      setSent(true);
      setSending(false);
    }, 1200);
    // Aquí conecta con tu backend
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7f7fb] via-[#e0e7ff] to-[#a5b4fc] transition-all">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-indigo-100 animate-fadeIn space-y-6">
        <div className="flex flex-col items-center gap-2 mt-2 mb-4">
          <Logo className="h-12 w-auto" />
          <h2 className="text-2xl font-bold text-ultramar text-center">Recupera tu contraseña</h2>
          <span className="text-sm text-gray-500 text-center">
            Te enviaremos un enlace para restablecer tu contraseña.
          </span>
        </div>
        {!sent ? (
          <form className="space-y-4" onSubmit={handleRecover} autoComplete="off">
            <div>
              <label className="block text-sm font-semibold mb-1 text-ultramar" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
                <input
                  className="w-full border border-graphite rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ultramar text-gray-900 transition"
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tucorreo@empresa.com"
                  required
                  disabled={sending}
                  aria-invalid={!!error}
                  aria-describedby={error ? "error-message" : undefined}
                />
              </div>
            </div>
            {error && (
              <div id="error-message" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full flex justify-center items-center gap-2 bg-ultramar text-white rounded-lg py-2 font-bold hover:bg-limelime hover:text-graphite focus:ring-2 focus:ring-limelime focus:outline-none transition disabled:opacity-60"
            >
              {sending && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {sending ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-green-700 bg-green-50 border border-green-200 rounded px-4 py-6 gap-2 text-center animate-fadeIn">
            <CheckCircle className="h-8 w-8" />
            <span className="font-semibold">¡Revisa tu correo!</span>
            <span className="text-green-700 text-sm">
              Te hemos enviado las instrucciones para recuperar tu contraseña.
            </span>
          </div>
        )}
        <div className="text-center mt-4">
          <Link href="/login" className="inline-flex items-center gap-1 text-sky-700 hover:text-ultramar transition text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Volver a login
          </Link>
        </div>
      </div>
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.7s; }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
