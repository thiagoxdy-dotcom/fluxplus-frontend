"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const plans = [
  {
    id: "pro",
    name: "Personal",
    price: "24,90",
    desc: "Para quem quer organizar as finanças sozinho com simplicidade.",
    highlight: false,
    badge: null,
    features: [
      "1 usuário",
      "1 número de WhatsApp",
      "Transações ilimitadas",
      "Categorização automática",
      "Dashboard completo",
      "Resumo pelo WhatsApp",
      "Suporte por e-mail",
    ],
  },
  {
    id: "casal",
    name: "Casal",
    price: "34,90",
    desc: "Para casais que querem gerenciar as finanças juntos com transparência.",
    highlight: true,
    badge: "Mais popular",
    features: [
      "2 usuários",
      "2 números de WhatsApp",
      "Transações ilimitadas",
      "Categorização automática",
      "Dashboard compartilhado",
      "Resumo pelo WhatsApp",
      "Visão individual e conjunta",
      "Suporte prioritário",
    ],
  },
];

export default function PlanosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCheckout(plano: string) {
    setError("");
    setLoading(plano);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plano }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao iniciar checkout. Tente novamente.");
      setLoading(null);
      return;
    }

    // Redirecionar para o Stripe Checkout
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navbar simples */}
      <nav className="border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Flux<span className="text-blue-600">plus</span>
            </span>
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
            Voltar ao dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Planos</span>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
            Escolha seu plano
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            7 dias grátis. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>

        {/* Erro global */}
        {error && (
          <div className="max-w-md mx-auto mb-8 flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex-1 rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-blue-600 border-blue-500 shadow-2xl shadow-blue-500/30 lg:scale-105"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-white rounded-full shadow-lg border border-blue-100">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h2 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                {plan.name}
              </h2>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                {plan.desc}
              </p>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className={`text-sm font-medium ${plan.highlight ? "text-blue-100" : "text-slate-500"}`}>R$</span>
                  <span className={`text-5xl font-extrabold leading-none ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-medium mb-1 ${plan.highlight ? "text-blue-100" : "text-slate-500"}`}>/mês</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading !== null}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-70"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-70"
                }`}
              >
                {loading === plan.id ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecionando...
                  </>
                ) : "Assinar agora"}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-blue-200" : "text-blue-600"}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${plan.highlight ? "text-blue-50" : "text-slate-600 dark:text-slate-300"}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Garantia */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Garantia de 7 dias.</strong>{" "}
              Não ficou satisfeito? Devolvemos 100% do valor.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
