export function CTA() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-12 overflow-hidden">
          {/* Decoração */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Comece a controlar suas finanças hoje
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              7 dias grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <a
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 hover:scale-105"
            >
              Criar conta gratuita
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
