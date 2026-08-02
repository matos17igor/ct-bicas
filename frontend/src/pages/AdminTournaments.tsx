import { useEffect, useState } from "react";
import { api } from "../services/api";
import { AdminSidebar } from "../components/AdminSidebar";

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

export function AdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit modal
  const [tournamentToEdit, setTournamentToEdit] = useState<Tournament | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editError, setEditError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    try {
      const r = await api.get("/tournaments");
      setTournaments(r.data);
    } catch {
      console.error("Erro ao buscar torneios");
    }
  }

  // Criar torneio
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim() || !category || !date || !startTime) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.post("/tournaments", {
        title,
        description,
        category,
        date,
        startTime,
        status,
      });
      setSuccess("Torneio criado com sucesso!");
      setTitle("");
      setDescription("");
      setCategory("");
      setDate("");
      setStartTime("");
      setStatus("UPCOMING");
      fetchTournaments();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar torneio.");
    }
  }

  // Abrir modal de edição
  function handleOpenEdit(t: Tournament) {
    setTournamentToEdit(t);
    setEditTitle(t.title);
    setEditDescription(t.description);
    setEditCategory(t.category);
    setEditDate(t.date.slice(0, 10));
    setEditStartTime(t.startTime);
    setEditStatus(t.status);
    setEditError("");
  }

  // Salvar atualização
  async function confirmUpdate() {
    if (!tournamentToEdit) return;
    setIsUpdating(true);
    setEditError("");

    try {
      await api.patch(`/tournaments/${tournamentToEdit.id}`, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        date: editDate,
        startTime: editStartTime,
        status: editStatus,
      });
      fetchTournaments();
      setTournamentToEdit(null);
    } catch (err: any) {
      setEditError(err.response?.data?.error || "Não foi possível atualizar o torneio.");
    } finally {
      setIsUpdating(false);
    }
  }

  // Abrir modal de exclusão
  function handleOpenDelete(t: Tournament) {
    setTournamentToDelete(t);
    setDeleteError("");
  }

  // Confirmar exclusão
  async function confirmDelete() {
    if (!tournamentToDelete) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      await api.delete(`/tournaments/${tournamentToDelete.id}`);
      fetchTournaments();
      setTournamentToDelete(null);
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || "Não foi possível excluir o torneio.");
    } finally {
      setIsDeleting(false);
    }
  }

  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text pt-14 md:pt-0">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Gerenciar Torneios <span className="text-ct-gold">🏆</span>
            </h2>
            <p className="text-ct-muted mt-2">
              Cadastre, edite ou remova torneios do CT Bicas.
            </p>
          </div>

          {/* Formulário de Cadastro */}
          <form
            onSubmit={handleCreate}
            className="bg-ct-card p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6"
          >
            <h3 className="text-lg font-bold text-ct-text">Novo Torneio</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Torneio de Beach Tenis - Verão 2026"
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o torneio, regras, premiação..."
                  rows={3}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                >
                  <option value="">Selecione a categoria</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Data</label>
                <input
                  type="date"
                  value={date}
                  min={localToday}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Horário de Início</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl text-sm font-medium bg-red-950/50 text-red-300 border border-red-800">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl text-sm font-medium bg-green-950/50 text-green-400 border border-green-800">
                ✅ {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-ct-gold text-ct-dark font-black rounded-xl hover:bg-ct-gold-hover transition-all cursor-pointer"
            >
              🏆 Cadastrar Torneio
            </button>
          </form>

          {/* Lista de Torneios */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-ct-text">
              Torneios Cadastrados
            </h3>
            {tournaments.length === 0 ? (
              <div className="text-center py-16 bg-ct-card rounded-2xl border border-slate-800">
                <span className="text-4xl opacity-50">🏆</span>
                <p className="mt-4 text-ct-muted">
                  Nenhum torneio cadastrado no momento.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {tournaments.map((t) => (
                  <div
                    key={t.id}
                    className="bg-ct-card p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="bg-ct-dark text-ct-gold font-black p-4 rounded-xl border border-ct-gold/20 text-center min-w-[80px]">
                        <div className="text-xs opacity-70 mb-1">
                          {formatDateBR(t.date)}
                        </div>
                        <div className="text-lg">{t.startTime}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-ct-text text-lg truncate">
                          {getCategoryEmoji(t.category)} {t.title}
                        </p>
                        <p className="text-sm text-ct-muted mt-1 truncate">
                          {t.description}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusStyle(t.status)}`}
                          >
                            {getStatusLabel(t.status)}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border bg-ct-gold/20 text-ct-gold border-ct-gold/50">
                            {getCategoryLabel(t.category)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="px-4 py-2 text-xs font-bold text-ct-gold border border-ct-gold/30 rounded-xl hover:bg-ct-gold/10 transition-all cursor-pointer"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleOpenDelete(t)}
                        className="px-4 py-2 text-xs font-bold text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Edição */}
      {tournamentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isUpdating && setTournamentToEdit(null)}
          />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-ct-text text-center mb-6">
              Editar Torneio
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Título</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Categoria</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Data</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Horário</label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                  />
                </div>
              </div>
            </div>

            {editError && (
              <p className="text-red-400 text-sm mt-4 text-center">
                ⚠️ {editError}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setTournamentToEdit(null)}
                disabled={isUpdating}
                className="flex-1 py-3 bg-transparent border border-slate-600 text-ct-muted rounded-xl font-bold hover:border-slate-400 hover:text-ct-text transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUpdate}
                disabled={isUpdating}
                className="flex-1 py-3 bg-ct-gold text-ct-dark font-black rounded-xl hover:bg-ct-gold-hover transition-all cursor-pointer disabled:opacity-70"
              >
                {isUpdating ? "Salvando..." : "Salvar ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {tournamentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setTournamentToDelete(null)}
          />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in text-center">
            <span className="text-5xl">⚠️</span>
            <h3 className="text-2xl font-black text-ct-text mt-4">
              Confirmar Exclusão
            </h3>
            <p className="text-ct-muted text-sm mt-2 mb-8">
              Tem certeza que deseja excluir o torneio{" "}
              <strong>"{tournamentToDelete.title}"</strong>? Esta ação é
              permanente.
            </p>

            {deleteError && (
              <p className="text-red-400 text-sm mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setTournamentToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-transparent border border-slate-600 text-ct-muted rounded-xl font-bold hover:border-slate-400 hover:text-ct-text transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500/20 text-red-500 font-black rounded-xl hover:bg-red-500/30 border border-red-500/50 transition-all cursor-pointer shadow-lg disabled:opacity-70"
              >
                {isDeleting ? "Excluindo..." : "Excluir ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
