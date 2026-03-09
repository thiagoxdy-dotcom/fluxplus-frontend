export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950" />

      {/* Círculos decorativos */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            7 dias grátis — sem cartão de crédito
          </span>
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
          Controle suas finanças{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            pelo WhatsApp
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Registre gastos e receitas simplesmente mandando uma mensagem.
          O Fluxplus entende, categoriza e organiza tudo para você — sozinho ou a dois.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#planos"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            Começar gratuitamente
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#funcionalidades"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Ver como funciona
          </a>
        </div>

        {/* Demo de mensagem WhatsApp */}
        <div className="relative max-w-sm mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 text-left">
            {/* Header fake WhatsApp */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">F+</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Fluxplus</p>
                <p className="text-xs text-green-500">online</p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white text-sm px-3 py-2 rounded-xl rounded-tr-sm max-w-[80%]">
                  gastei 45 uber
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm px-3 py-2 rounded-xl rounded-tl-sm max-w-[80%]">
                  💸 <strong>Saída registrada!</strong><br />
                  Valor: R$ 45,00<br />
                  Categoria: Transporte<br />
                  Descrição: Uber
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white text-sm px-3 py-2 rounded-xl rounded-tr-sm max-w-[80%]">
                  recebi 3200 salário
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm px-3 py-2 rounded-xl rounded-tl-sm max-w-[80%]">
                  💰 <strong>Entrada registrada!</strong><br />
                  Valor: R$ 3.200,00<br />
                  Categoria: Salário
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
