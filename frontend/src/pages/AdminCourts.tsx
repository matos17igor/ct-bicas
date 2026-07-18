import { useEffect, useState } from "react";
import { api } from "../services/api";
import { AdminSidebar } from "../components/AdminSidebar";

interface Court {
  id: string;
  name: string;
}

export function AdminCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados para Edição e Exclusão
  const [courtToEdit, setCourtToEdit] = useState<Court | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [courtToDelete, setCourtToDelete] = useState<Court | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchCourts();
  }, []);

  async function fetchCourts() {
    try {
      const r = await api.get("/courts");
      setCourts(r.data);
    } catch {
      console.error("Erro ao buscar quadras");
    }
  }

  // Criar nova quadra
  async function handleCreateCourt(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("O nome da quadra é obrigatório.");
      return;
    }

    try {
      await api.post("/courts", { name });
      setSuccess("Quadra cadastrada com sucesso!");
      setName("");
      fetchCourts();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar quadra.");
    }
  }

  // Abrir modal de edição
  function handleOpenEdit(court: Court) {
    setCourtToEdit(court);
    setEditName(court.name);
    setEditError("");
  }

  // Salvar atualização
  async function confirmUpdate() {
    if (!courtToEdit || !editName.trim()) return;
    setIsUpdating(true);
    setEditError("");

    try {
      await api.put(`/courts/${courtToEdit.id}`, { name: editName });
      fetchCourts();
      setCourtToEdit(null);
    } catch (err: any) {
      setEditError(
        err.response?.data?.error || "Não foi possível atualizar a quadra."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // Abrir modal de exclusão
  function handleOpenDelete(court: Court) {
    setCourtToDelete(court);
    setDeleteError("");
  }

  // Salvar exclusão
  async function confirmDelete() {
    if (!courtToDelete) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      await api.delete(`/courts/${courtToDelete.id}`);
      fetchCourts();
      setCourtToDelete(null);
    } catch (err: any) {
      setDeleteError(
        err.response?.data?.error || "Não foi possível excluir a quadra."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Gerenciar Quadras <span className="text-ct-gold">🎾</span>
            </h2>
            <p className="text-ct-muted mt-2">
              Cadastre, edite ou remova as quadras disponíveis para agendamento
              no CT Bicas.
            </p>
          </div>

          {/* Formulário de Cadastro */}
          <form
            onSubmit={handleCreateCourt}
            className="bg-ct-card p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6"
          >
            <h3 className="text-lg font-bold text-ct-text">Nova Quadra</h3>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Nome Identificador
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Quadra 1 - Futevôlei, Quadra 2 - Beach Tennis..."
                className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
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
              ➕ Cadastrar Quadra
            </button>
          </form>

          {/* Lista de Quadras */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-ct-text">
              Quadras Existentes
            </h3>
            {courts.length === 0 ? (
              <div className="text-center py-16 bg-ct-card rounded-2xl border border-slate-800">
                <span className="text-4xl opacity-50">🏟️</span>
                <p className="mt-4 text-ct-muted">
                  Nenhuma quadra cadastrada no momento.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className="bg-ct-card p-5 rounded-2xl border border-slate-700 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-ct-dark text-ct-gold font-black p-4 rounded-xl border border-ct-gold/20 text-center min-w-[50px]">
                        <span className="text-xl">🎾</span>
                      </div>
                      <div>
                        <p className="font-bold text-ct-text text-lg">
                          {court.name}
                        </p>
                        <p className="text-xs text-ct-muted mt-0.5">
                          ID: {court.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(court)}
                        className="px-4 py-2 text-xs font-bold text-ct-gold border border-ct-gold/30 rounded-xl hover:bg-ct-gold/10 transition-all cursor-pointer"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleOpenDelete(court)}
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

      {/* Modal de Confirmação de Edição */}
      {courtToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isUpdating && setCourtToEdit(null)}
          />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <h3 className="text-2xl font-black text-ct-text text-center mb-6">
              Alterar Nome da Quadra
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Novo Nome
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            {editError && (
              <p className="text-red-400 text-sm mb-4 text-center">
                ⚠️ {editError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCourtToEdit(null)}
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

      {/* Modal de Confirmação de Exclusão */}
      {courtToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setCourtToDelete(null)}
          />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in text-center">
            <span className="text-5xl">⚠️</span>
            <h3 className="text-2xl font-black text-ct-text mt-4">
              Confirmar Exclusão
            </h3>
            <p className="text-ct-muted text-sm mt-2 mb-8">
              Tem certeza que deseja excluir a{" "}
              <strong>{courtToDelete.name}</strong>? Esta ação é permanente e
              pode afetar agendamentos já vinculados a ela.
            </p>

            {deleteError && (
              <p className="text-red-400 text-sm mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCourtToDelete(null)}
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
