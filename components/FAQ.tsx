"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Precisa instalar algum aplicativo?",
    a: "Não. O Fluxplus funciona direto pelo WhatsApp que você já tem no celular. Basta cadastrar seu número e começar a usar.",
  },
  {
    q: "Como funciona o período de trial?",
    a: "Você tem 7 dias grátis para testar o plano escolhido sem precisar informar cartão de crédito. Só cobramos se você decidir continuar.",
  },
  {
    q: "O casal precisa de dois celulares diferentes?",
    a: "Sim. Cada pessoa vincula seu número de WhatsApp à conta compartilhada. Ambos registram separadamente e tudo aparece no mesmo dashboard.",
  },
  {
    q: "E se eu quiser cancelar?",
    a: "Cancele quando quiser direto no painel, sem burocracia. Se cancelar nos primeiros 7 dias após a contratação, devolvemos 100% do valor.",
  },
  {
    q: "Meus dados financeiros são seguros?",
    a: "Sim. Seus dados são criptografados e completamente isolados da conta de outros usuários. Seguimos as diretrizes da LGPD.",
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim. Você pode fazer upgrade ou downgrade do seu plano a qualquer momento pelo painel.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Dúvidas frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
