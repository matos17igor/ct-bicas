import { useEffect, useState } from "react";
import { api } from "../services/api";
import { UserSidebar } from "../components/UserSidebar";

interface Tournament {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  status: string;
}

const CATEGORY_OPTIONS = [
  { value: "BEACH_TENIS", label: "Beach Tenis" },
  { value: "FUTEVOLEI", label: "Futevôlei" },
  { value: "VOLEI", label: "Vôlei" },
];

const STATUS_OPTIONS = [
  { value: "UPCOMING", label: "Em Breve" },
  { value: "IN_PROGRESS", label: "Em Andamento" },
  { value: "FINISHED", label: "Finalizado" },
  { value: "CANCELED", label: "Cancelado" },
];

function getCategoryLabel(value: string) {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
}
function getStatusLabel(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "UPCOMING":
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    case "IN_PROGRESS":
      return "bg-green-500/20 text-green-400 border-green-500/50";
    case "FINISHED":
      return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    case "CANCELED":
      return "bg-red-500/20 text-red-400 border-red-500/50";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/50";
  }
}

function getCategoryEmoji(cat: string) {
  switch (cat) {
    case "BEACH_TENIS":
      return "🎾";
    case "FUTEVOLEI":
      return "⚽";
    case "VOLEI":
      return "🏐";
    default:
      return "🏆";
  }
}

function formatDateBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const r = await api.get("/tournaments");
        setTournaments(r.data);
      } catch {
        console.error("Erro ao buscar torneios");
      }
    }
    fetchTournaments();
  }, []);

  const filtered = tournaments.filter((t) => {
    if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
    if (filterCategory !== "ALL" && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text pt-14 md:pt-0">
      <UserSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight text-ct-text">
              Torneios <span className="text-ct-gold">🏆</span>
            </h2>
            <p className="text-ct-muted mt-2">
              Confira os torneios do CT Bicas e fique por dentro das competições.
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-ct-card p-6 rounded-2xl border border-slate-700 shadow-xl mb-8">
            <h3 className="text-sm font-bold text-ct-muted uppercase tracking-wider mb-4">
              Filtrar Torneios
            </h3>
            <div className="flex flex-wrap gap-3">
              {/* Filtro por Status */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("ALL")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    filterStatus === "ALL"
                      ? "bg-ct-gold/20 text-ct-gold border-ct-gold/50"
                      : "bg-transparent text-ct-muted border-slate-700 hover:border-slate-500 hover:text-ct-text"
                  }`}
                >
                  Todos
                </button>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setFilterStatus(s.value)}
                    className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                      filterStatus === s.value
                        ? getStatusStyle(s.value)
                        : "bg-transparent text-ct-muted border-slate-700 hover:border-slate-500 hover:text-ct-text"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Separador */}
              <div className="w-px bg-slate-700 self-stretch mx-1 hidden md:block" />

              {/* Filtro por Categoria */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory("ALL")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    filterCategory === "ALL"
                      ? "bg-ct-gold/20 text-ct-gold border-ct-gold/50"
                      : "bg-transparent text-ct-muted border-slate-700 hover:border-slate-500 hover:text-ct-text"
                  }`}
                >
                  Todas
                </button>
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setFilterCategory(c.value)}
                    className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                      filterCategory === c.value
                        ? "bg-ct-gold/20 text-ct-gold border-ct-gold/50"
                        : "bg-transparent text-ct-muted border-slate-700 hover:border-slate-500 hover:text-ct-text"
                    }`}
                  >
                    {getCategoryEmoji(c.value)} {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Torneios */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-ct-card rounded-3xl border border-slate-800 shadow-2xl">
              <span className="text-6xl opacity-80">🏆</span>
              <p className="mt-6 text-ct-muted text-lg font-medium">
                Nenhum torneio encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="bg-ct-card p-6 rounded-2xl border border-slate-700 shadow-xl hover:border-ct-gold/50 transition-colors flex flex-col"
                >
                  {/* Header com Categoria + Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border bg-ct-gold/20 text-ct-gold border-ct-gold/50">
                      {getCategoryEmoji(t.category)} {getCategoryLabel(t.category)}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusStyle(t.status)}`}
                    >
                      {getStatusLabel(t.status)}
                    </span>
                  </div>

                  {/* Título e Descrição */}
                  <h3 className="text-xl font-black text-ct-text mb-2">
                    {t.title}
                  </h3>
                  <p className="text-ct-muted text-sm mb-5 flex-1 line-clamp-3">
                    {t.description}
                  </p>

                  {/* Data e Horário */}
                  <div className="bg-ct-dark rounded-xl p-4 border border-slate-700/50 space-y-2">
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-ct-gold text-lg">📅</span>
                      <strong className="text-ct-text font-semibold">Data:</strong>{" "}
                      <span className="text-ct-muted">{formatDateBR(t.date)}</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-ct-gold text-lg">🕒</span>
                      <strong className="text-ct-text font-semibold">Início:</strong>{" "}
                      <span className="text-ct-muted">{t.startTime}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
