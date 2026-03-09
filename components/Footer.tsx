export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-white">
              Flux<span className="text-blue-400">plus</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/privacidade" className="hover:text-white transition-colors">Privacidade</a>
            <a href="/termos" className="hover:text-white transition-colors">Termos</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-center">
            © {new Date().getFullYear()} Fluxplus. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
