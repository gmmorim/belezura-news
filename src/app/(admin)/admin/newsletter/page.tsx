"use client";

import React, { useState } from "react";
import {
  Mail,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  date: string;
  source: string;
  status: "Ativo" | "Pendente";
}

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: "1", email: "patricia.mendes@vogue.com.br", date: "Hoje, 14:20", source: "Rodapé do Portal", status: "Ativo" },
  { id: "2", email: "camila.albuquerque@natura.net", date: "Hoje, 11:05", source: "Modal de Entrada", status: "Ativo" },
  { id: "3", email: "lucas.venture@boticario.com.br", date: "Ontem, 18:40", source: "Rodapé do Portal", status: "Ativo" },
  { id: "4", email: "bianca.rossi@sephora.com.br", date: "Ontem, 16:15", source: "Fim do Artigo", status: "Ativo" },
  { id: "5", email: "carolina.ferraz@estilo.com.br", date: "11 Out 2026", source: "Rodapé do Portal", status: "Ativo" },
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [search, setSearch] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.source.toLowerCase().includes(search.toLowerCase())
  );

  // Exportação real de CSV para download no navegador
  const handleExportCSV = () => {
    const headers = "ID,E-mail,Data de Inscricao,Origem,Status\n";
    const rows = filtered
      .map((s) => `${s.id},"${s.email}","${s.date}","${s.source}",${s.status}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `belezura-news-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header com Ação de Exportar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Módulo Restrito Admin
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Base de Leads da Newsletter
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Gestão dos assinantes do Belezura Drops e exportação para disparadores de e-mail.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="font-alleron self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Arquivo CSV gerado e baixado com sucesso no seu dispositivo!</span>
        </div>
      )}

      {/* Métricas dos Leads */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-medium text-neutral-400">Total de Assinantes Ativos</span>
          <p className="font-recoleta text-3xl font-bold text-white mt-2">3.850</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.4% este mês
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-medium text-neutral-400">Novos Leads Hoje</span>
          <p className="font-recoleta text-3xl font-bold text-white mt-2">47</p>
          <p className="text-[11px] text-neutral-400 mt-1">Conversão média de 3.2%</p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs font-medium text-neutral-400">Taxa de Abertura Estimada</span>
          <p className="font-recoleta text-3xl font-bold text-white mt-2">44.8%</p>
          <p className="text-[11px] text-[#ff6305] mt-1 font-semibold">Muito acima da média de mercado</p>
        </div>
      </div>

      {/* Busca e Tabela de Inscritos */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por e-mail ou origem..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            Mostrando {filtered.length} leads
          </span>
        </div>

        {/* Lista Adaptável para Mobile */}
        <div className="divide-y divide-neutral-800">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 shrink-0">
                  <Mail className="w-4 h-4 text-[#ff6305]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{sub.email}</p>
                  <p className="text-xs text-neutral-400">Origem: {sub.source}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-neutral-400 pl-12 sm:pl-0">
                <span>{sub.date}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {sub.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
