"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ConfiguracoesPage() {
  const [email, setEmail] = useState("");
  const [nomeExibicao, setNomeExibicao] = useState("");
  const [phones, setPhones] = useState<{ id: string; phone_number: string; verified: boolean }[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [novoTelefone, setNovoTelefone] = useState("");
  const [subscription, setSubscription] = useState<{ plano: string; status: string; data_fim: string | null } | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setEmail(session.user.email ?? "");

    const { data: membership } = await supabase
      .from("account_users")
      .select("account_id, accounts(nome_exibicao, subscriptions(plano, status, data_fim), accounts_phone_numbers(id, phone_number, verified))")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!membership?.accounts) return;
    const acc = membership.accounts as any;
    setAccountId(membership.account_id);
    setNomeExibicao(acc.nome_exibicao ?? "");
    setPhones(acc.accounts_phone_numbers ?? []);
    setSubscription(acc.subscriptions?.[0] ?? null);
  }

  async function handleSaveNome(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) return;
    setSaving(true);
    await supabase.from("accounts").update({ nome_exibicao: nomeExibicao }).eq("id", accountId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleAddPhone(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId || !novoTelefone) return;
    const digits = novoTelefone.replace(/\D/g, "");
    const normalized = novoTelefone.startsWith("+") ? `+${digits}` : `+55${digits}`;
    await supabase.from("accounts_phone_numbers").insert({ account_id: accountId, phone_number: normalized });
    setNovoTelefone("");
    load();
  }

  async function handleRemovePhone(id: string) {
    await supabase.from("accounts_phone_numbers").delete().eq("id", id);
    setPhones(prev => prev.filter(p => p.id !== id));
  }

  const statusLabel: Record<string, string> = {
    trial: "Trial gratuito", active: "Ativo", grace: "Período de graça",
    canceled: "Cancelado", expired: "Expirado",
  };
  const statusColor: Record<string, string> = {
    trial: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    active: "text-green-600 bg-green-100 dark:bg-green-900/30",
    grace: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    canceled: "text-red-600 bg-red-100 dark:bg-red-900/30",
    expired: "text-red-600 bg-red-100 dark:bg-red-900/30",
  };

  return (
    <div className="space-y-6 pt-10 lg:pt-0 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>

      {/* Conta */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Dados da conta</h2>
        <form onSubmit={handleSaveNome} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail</label>
            <input type="email" value={email} disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome de exibição</label>
            <input type="text" value={nomeExibicao} onChange={e => setNomeExibicao(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all">
            {saved ? "✓ Salvo!" : saving ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>

      {/* WhatsApp */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Números do WhatsApp</h2>
        <ul className="space-y-2 mb-4">
          {phones.map(p => (
            <li key={p.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-green-500">📱</span>
                <span className="text-sm text-slate-900 dark:text-white font-mono">{p.phone_number}</span>
                {p.verified && <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Verificado</span>}
              </div>
              <button onClick={() => handleRemovePhone(p.id)}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">Remover</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddPhone} className="flex gap-2">
          <input type="tel" value={novoTelefone} onChange={e => setNovoTelefone(e.target.value)}
            placeholder="+55 11 99999-9999"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          <button type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all">
            Adicionar
          </button>
        </form>
      </div>

      {/* Assinatura */}
      {subscription && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Assinatura</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Plano atual</p>
              <p className="font-semibold text-slate-900 dark:text-white capitalize">{subscription.plano}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColor[subscription.status]}`}>
              {statusLabel[subscription.status] ?? subscription.status}
            </span>
          </div>
          {subscription.data_fim && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
              Válido até: {new Date(subscription.data_fim).toLocaleDateString("pt-BR")}
            </p>
          )}
          <a href="/planos"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            Gerenciar plano →
          </a>
        </div>
      )}
    </div>
  );
}
