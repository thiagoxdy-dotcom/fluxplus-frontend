"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Transaction {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  categoria: string;
  descricao: string;
  data: string;
  origem: "dashboard" | "whatsapp";
}

interface Stats {
  entradas: number;
  saidas: number;
  saldo: number;
}

const categoriaEmoji: Record<string, string> = {
  alimentacao: "🍽️",
  transporte: "🚗",
  saude: "💊",
  lazer: "🎬",
  moradia: "🏠",
  educacao: "📚",
  salario: "💼",
  investimento: "📈",
  outros: "💰",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({ entradas: 0, saidas: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: membership } = await supabase
      .from("account_users")
      .select("account_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!membership) { setLoading(false); return; }

    setAccountId(membership.account_id);

    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const { data: txs } = await supabase
      .from("transactions")
      .select("*")
      .eq("account_id", membership.account_id)
      .gte("data", firstDay)
      .order("data", { ascending: false })
      .limit(50);

    const list = (txs ?? []) as Transaction[];
    setTransactions(list);

    const entradas = list.filter(t => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
    const saidas = list.filter(t => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
    setStats({ entradas, saidas, saldo: entradas - saidas });
    setLoading(false);
  }

  // Calcular categorias para gráfico
  const categoryTotals = transactions
    .filter(t => t.tipo === "saida")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] ?? 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCat = topCategories[0]?.[1] ?? 1;

  const mesAtual = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visão geral</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mt-0.5">{mesAtual}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova transação
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Saldo */}
        <div className="sm:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
          <p className="text-blue-100 text-sm font-medium mb-1">Saldo do mês</p>
          <p className={`text-3xl font-extrabold ${stats.saldo < 0 ? "text-red-200" : "text-white"}`}>
            {formatCurrency(stats.saldo)}
          </p>
          <p className="text-blue-200 text-xs mt-2">Entradas − Saídas</p>
        </div>

        {/* Entradas */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Entradas</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.entradas)}</p>
        </div>

        {/* Saídas */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saídas</p>
          </div>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(stats.saidas)}</p>
        </div>
      </div>

      {/* Corpo — duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Últimas transações */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Últimas transações</h2>
            <Link href="/dashboard/transacoes" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Ver todas →
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma transação este mês.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Registre pelo WhatsApp ou clique em "Nova transação".</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {transactions.slice(0, 8).map((tx) => (
                <li key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-lg">
                    {categoriaEmoji[tx.categoria] ?? "💰"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tx.descricao || tx.categoria}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-400">{formatDate(tx.data)}</p>
                      {tx.origem === "whatsapp" && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          WhatsApp
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm font-bold flex-shrink-0 ${tx.tipo === "entrada" ? "text-green-600" : "text-red-500"}`}>
                    {tx.tipo === "entrada" ? "+" : "-"}{formatCurrency(tx.valor)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gastos por categoria */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Gastos por categoria</h2>
          </div>

          {topCategories.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">📊</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sem dados ainda.</p>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {topCategories.map(([cat, total]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{categoriaEmoji[cat] ?? "💰"}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{cat}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(total / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal — Nova transação */}
      {showModal && accountId && (
        <NovaTransacaoModal
          accountId={accountId}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadData(); }}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL — Nova Transação
// ============================================================
function NovaTransacaoModal({
  accountId,
  onClose,
  onSuccess,
}: {
  accountId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("outros");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categorias = [
    "alimentacao", "transporte", "saude", "lazer",
    "moradia", "educacao", "salario", "investimento", "outros",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const valorNum = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) {
      setError("Informe um valor válido.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.from("transactions").insert({
      account_id: accountId,
      tipo,
      valor: valorNum,
      descricao,
      categoria,
      data,
      origem: "dashboard",
    });

    if (err) { setError("Erro ao salvar. Tente novamente."); setLoading(false); return; }
    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Nova transação</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <button type="button" onClick={() => setTipo("saida")}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${tipo === "saida" ? "bg-red-500 text-white shadow" : "text-slate-600 dark:text-slate-400"}`}>
              💸 Saída
            </button>
            <button type="button" onClick={() => setTipo("entrada")}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${tipo === "entrada" ? "bg-green-500 text-white shadow" : "text-slate-600 dark:text-slate-400"}`}>
              💰 Entrada
            </button>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Valor (R$)</label>
            <input type="text" required value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Descrição</label>
            <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Almoço, Salário..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              {categorias.map(c => (
                <option key={c} value={c}>{categoriaEmoji[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
            {loading ? "Salvando..." : "Salvar transação"}
          </button>
        </form>
      </div>
    </div>
  );
}
