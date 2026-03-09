"use client";

const plans = [
  {
    name: "Personal",
    price: "24,90",
    desc: "Para quem quer organizar as finanças sozinho com simplicidade.",
    highlight: false,
    features: [
      "1 usuário",
      "1 número de WhatsApp",
      "Registro ilimitado de transações",
      "Categorização automática",
      "Dashboard completo",
      "Resumo pelo WhatsApp",
      "Histórico completo",
      "Suporte por e-mail",
    ],
    cta: "Começar 7 dias grátis",
    badge: null,
  },
  {
    name: "Casal",
    price: "34,90",
    desc: "Para casais que querem gerenciar as finanças juntos, com transparência.",
    highlight: true,
    features: [
      "2 usuários",
      "2 números de WhatsApp",
      "Registro ilimitado de transações",
      "Categorização automática",
      "Dashboard compartilhado",
      "Resumo pelo WhatsApp",
      "Histórico completo",
      "Visão individual e conjunta",
      "Suporte prioritário",
    ],
    cta: "Começar 7 dias grátis",
    badge: "Mais popular",
  },
];

export function Pricing() {
  return (
    <section id="planos" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Planos
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Simples e transparente
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            7 dias grátis em qualquer plano. Cancele quando quiser, sem burocracia.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex-1 rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-blue-600 border-blue-500 shadow-2xl shadow-blue-500/30 scale-105"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-white rounded-full shadow-lg border border-blue-100">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Nome */}
              <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                {plan.desc}
              </p>

              {/* Preço */}
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className={`text-sm font-medium ${plan.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                    R$
                  </span>
                  <span className={`text-5xl font-extrabold leading-none ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-medium mb-1 ${plan.highlight ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                    /mês
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="/cadastro"
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${
                  plan.highlight
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                }`}
              >
                {plan.cta}
              </a>

              {/* Features */}
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
    </section>
  );
}
