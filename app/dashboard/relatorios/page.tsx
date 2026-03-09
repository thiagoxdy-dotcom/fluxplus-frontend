"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const categoriaEmoji: Record<string, string> = {
  alimentacao: "🍽️", transporte: "🚗", saude: "💊",
  lazer: "🎬", moradia: "🏠", educacao: "📚",
  salario: "💼", investimento: "📈", outros: "💰",
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export default function RelatoriosPage() {
  const [data, setData] = useState<{ mes: string; entradas: number; saidas: number }[]>([]);
  const [categorias, setCategorias] = useState<{ nome: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: membership } = await supabase
        .from("account_users").select("account_id").eq("user_id", session.user.id).maybeSingle();
      if (!membership) { setLoading(false); return; }

      // Últimos 6 meses
      const meses: { mes: string; entradas: number; saidas: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const first = `${year}-${month}-01`;
        const last = new Date(year, d.getMonth() + 1, 0).toISOString().split("T")[0];

        const { data: txs } = await supabase.from("transactions").select("tipo, valor")
          .eq("account_id", membership.account_id).gte("data", first).lte("data", last);

        const entradas = (txs ?? []).filter(t => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
        const saidas = (txs ?? []).filter(t => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
        meses.push({ mes: d.toLocaleDateString("pt-BR", { month: "short" }), entradas, saidas });
      }
      setData(meses);

      // Categorias do mês atual
      const now = new Date();
      const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const { data: txsCat } = await supabase.from("transactions").select("categoria, valor")
        .eq("account_id", membership.account_id).eq("tipo", "saida").gte("data", firstDay);

      const catMap: Record<string, number> = {};
      (txsCat ?? []).forEach(t => { catMap[t.categoria] = (catMap[t.categoria] ?? 0) + t.valor; });
      setCategorias(Object.entries(catMap).map(([nome, total]) => ({ nome, total })).sort((a, b) => b.total - a.total));

      setLoading(false);
    }
    load();
  }, []);

  const maxBar = Math.max(...data.map(d => Math.max(d.entradas, d.saidas)), 1);
  const maxCat = categorias[0]?.total ?? 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Relatórios</h1>

      {/* Gráfico — últimos 6 meses */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-6">Evolução — últimos 6 meses</h2>
        <div className="flex items-end gap-3 h-48">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: "160px" }}>
                <div className="flex-1 bg-green-500 rounded-t-lg transition-all duration-500 opacity-80"
                  style={{ height: `${(d.entradas / maxBar) * 100}%` }} title={formatCurrency(d.entradas)} />
                <div className="flex-1 bg-red-400 rounded-t-lg transition-all duration-500 opacity-80"
                  style={{ height: `${(d.saidas / maxBar) * 100}%` }} title={formatCurrency(d.saidas)} />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{d.mes}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500" /><span className="text-xs text-slate-500">Entradas</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-400" /><span className="text-xs text-slate-500">Saídas</span></div>
        </div>
      </div>

      {/* Gastos por categoria — mês atual */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-6">Gastos por categoria — mês atual</h2>
        {categorias.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível.</p>
        ) : (
          <div className="space-y-4">
            {categorias.map(({ nome, total }) => (
              <div key={nome}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{categoriaEmoji[nome] ?? "💰"}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{Math.round((total / maxCat) * 100)}%</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(total / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
