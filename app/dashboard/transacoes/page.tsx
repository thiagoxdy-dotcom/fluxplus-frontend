"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Transaction {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  categoria: string;
  descricao: string;
  data: string;
  origem: "dashboard" | "whatsapp";
  created_at: string;
}

const categoriaEmoji: Record<string, string> = {
  alimentacao: "🍽️", transporte: "🚗", saude: "💊",
  lazer: "🎬", moradia: "🏠", educacao: "📚",
  salario: "💼", investimento: "📈", outros: "💰",
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
}

export default function TransacoesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">("todos");
  const [filtroMes, setFiltroMes] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
  });
  const [accountId, setAccountId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [filtroMes]);

  async function loadData() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: membership } = await supabase
      .from("account_users").select("account_id").eq("user_id", session.user.id).maybeSingle();
    if (!membership) { setLoading(false); return; }

    setAccountId(membership.account_id);

    const [year, month] = filtroMes.split("-");
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];

    const { data } = await supabase
      .from("transactions").select("*")
      .eq("account_id", membership.account_id)
      .gte("data", firstDay).lte("data", lastDay)
      .order("data", { ascending: false });

    setTransactions((data ?? []) as Transaction[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    setDeleting(null);
  }

  const filtered = filtroTipo === "todos" ? transactions : transactions.filter(t => t.tipo === filtroTipo);
  const totalEntradas = filtered.filter(t => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
  const totalSaidas = filtered.filter(t => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transações</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova transação
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input type="month" value={filtroMes} onChange={e => setFiltroMes(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(["todos", "entrada", "saida"] as const).map(f => (
            <button key={f} onClick={() => setFiltroTipo(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filtroTipo === f ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"
              }`}>
              {f === "todos" ? "Todos" : f === "entrada" ? "Entradas" : "Saídas"}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Entradas</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Saídas</p>
          <p className="text-lg font-bold text-red-500">{formatCurrency(totalSaidas)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Saldo</p>
          <p className={`text-lg font-bold ${totalEntradas - totalSaidas >= 0 ? "text-blue-600" : "text-red-500"}`}>
            {formatCurrency(totalEntradas - totalSaidas)}
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Descrição</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">Categoria</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">Data</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">Origem</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Valor</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{categoriaEmoji[tx.categoria] ?? "💰"}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                        {tx.descricao || tx.categoria}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 capitalize">
                      {tx.categoria}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">
                    {formatDate(tx.data)}
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      tx.origem === "whatsapp"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                    }`}>
                      {tx.origem === "whatsapp" ? "WhatsApp" : "Dashboard"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-sm font-bold ${tx.tipo === "entrada" ? "text-green-600" : "text-red-500"}`}>
                      {tx.tipo === "entrada" ? "+" : "-"}{formatCurrency(tx.valor)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(tx.id)} disabled={deleting === tx.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                      {deleting === tx.id ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && accountId && (
        <NovaTransacaoModal accountId={accountId} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); loadData(); }} />
      )}
    </div>
  );
}

function NovaTransacaoModal({ accountId, onClose, onSuccess }: { accountId: string; onClose: () => void; onSuccess: () => void }) {
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("outros");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categorias = ["alimentacao","transporte","saude","lazer","moradia","educacao","salario","investimento","outros"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valorNum = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) { setError("Valor inválido."); return; }
    setLoading(true);
    const { error: err } = await supabase.from("transactions").insert({ account_id: accountId, tipo, valor: valorNum, descricao, categoria, data, origem: "dashboard" });
    if (err) { setError("Erro ao salvar."); setLoading(false); return; }
    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Nova transação</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <button type="button" onClick={() => setTipo("saida")} className={`py-2 rounded-lg text-sm font-semibold transition-all ${tipo === "saida" ? "bg-red-500 text-white shadow" : "text-slate-600 dark:text-slate-400"}`}>💸 Saída</button>
            <button type="button" onClick={() => setTipo("entrada")} className={`py-2 rounded-lg text-sm font-semibold transition-all ${tipo === "entrada" ? "bg-green-500 text-white shadow" : "text-slate-600 dark:text-slate-400"}`}>💰 Entrada</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Valor (R$)</label>
            <input type="text" required value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Descrição</label>
            <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Almoço, Salário..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              {categorias.map(c => <option key={c} value={c}>{categoriaEmoji[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all">
            {loading ? "Salvando..." : "Salvar transação"}
          </button>
        </form>
      </div>
    </div>
  );
}
