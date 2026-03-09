"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [tipoConta, setTipoConta] = useState<"personal" | "casal" | "">("");
  const [nomeExibicao, setNomeExibicao] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFinish() {
    setError("");
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tipo_conta: tipoConta,
          nome_exibicao: nomeExibicao,
          phone_number: phoneNumber,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Flux<span className="text-blue-600">plus</span>
            </span>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
              }`} />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">

          {/* STEP 1 — Tipo de conta */}
          {step === 1 && (
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Como você vai usar o Fluxplus?
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Escolha o tipo de conta que melhor se encaixa na sua situação.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Personal */}
                <button
                  onClick={() => setTipoConta("personal")}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    tipoConta === "personal"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-600 hover:border-blue-300"
                  }`}
                >
                  <div className="text-2xl mb-3">👤</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Personal</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Para você gerenciar suas finanças sozinho.
                  </p>
                  <p className="text-xs font-semibold text-blue-600 mt-2">R$ 24,90/mês</p>
                </button>

                {/* Casal */}
                <button
                  onClick={() => setTipoConta("casal")}
                  className={`p-5 rounded-xl border-2 text-left transition-all relative ${
                    tipoConta === "casal"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-600 hover:border-blue-300"
                  }`}
                >
                  <span className="absolute top-3 right-3 text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                  <div className="text-2xl mb-3">💑</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Casal</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gerencie as finanças juntos com seu parceiro(a).
                  </p>
                  <p className="text-xs font-semibold text-blue-600 mt-2">R$ 34,90/mês</p>
                </button>
              </div>

              <button
                onClick={() => tipoConta && setStep(2)}
                disabled={!tipoConta}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
              >
                Continuar
              </button>
            </div>
          )}

          {/* STEP 2 — Nome */}
          {step === 2 && (
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Como quer ser chamado?
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {tipoConta === "casal"
                  ? "Use um nome que identifique vocês dois. Ex: João & Maria"
                  : "Seu nome ou apelido para aparecer no app."}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {tipoConta === "casal" ? "Nome do casal" : "Seu nome"}
                </label>
                <input
                  type="text"
                  value={nomeExibicao}
                  onChange={(e) => setNomeExibicao(e.target.value)}
                  placeholder={tipoConta === "casal" ? "Ex: João & Maria" : "Ex: João Silva"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={() => nomeExibicao.trim() && setStep(3)}
                  disabled={!nomeExibicao.trim()}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Telefone */}
          {step === 3 && (
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Qual seu número do WhatsApp?
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                É pelo WhatsApp que você vai registrar seus gastos e receitas.
                Use o formato com código do país.
              </p>

              <div className="mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Número do WhatsApp
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                Inclua o código do país. Ex: +5511999999999
              </p>

              {/* Erro */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!phoneNumber.trim() || loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Criando...
                    </span>
                  ) : "Começar agora"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
