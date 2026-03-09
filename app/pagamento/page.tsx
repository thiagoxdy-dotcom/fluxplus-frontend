"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function PagamentoContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // "success" ou "canceled"
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = "/dashboard";
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  if (status === "canceled") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pagamento cancelado</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Nenhuma cobrança foi realizada. Você pode tentar novamente quando quiser.
        </p>
        <Link href="/planos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
          Voltar aos planos
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pagamento confirmado!</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-2">
        Sua assinatura foi ativada com sucesso. Bem-vindo ao Fluxplus!
      </p>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
        Redirecionando para o dashboard em <strong>{countdown}s</strong>...
      </p>
      <Link href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
        Ir para o dashboard agora
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 px-4">
      <div className="w-full max-w-md">
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          <Suspense fallback={<div className="text-center text-slate-500">Carregando...</div>}>
            <PagamentoContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
