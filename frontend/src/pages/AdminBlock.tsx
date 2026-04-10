import { useEffect, useState } from "react";
import { api } from "../services/api";
import { AdminSidebar } from "../components/AdminSidebar";

interface Court {
  id: string;
  name: string;
}

interface BlockedSlot {
  id: string;
  courtId: string;
  court: Court;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  recurringGroupId?: string | null;
}

export function AdminBlock() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [slots, setSlots] = useState<BlockedSlot[]>([]);

  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [reason, setReason] = useState("");
  const [isWeekly, setIsWeekly] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [slotToUnblock, setSlotToUnblock] = useState<{id: string, isSeries?: boolean} | null>(null);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [unblockError, setUnblockError] = useState("");

  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const operatingHours = Array.from({ length: 15 }, (_, i) => i + 8); // 8h a 22h

  useEffect(() => {
    api.get("/courts").then((r) => setCourts(r.data));
    fetchSlots();
  }, []);

  async function fetchSlots() {
    try {
      const r = await api.get("/admin/blocked-slots");
      setSlots(r.data);
    } catch {
      console.error("Erro ao buscar bloqueios");
    }
  }

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!courtId || !date || !startHour || !endHour) {
      setError("Preencha todos os campos.");
      return;
    }
    if (Number(endHour) <= Number(startHour)) {
      setError("O horário de fim deve ser maior que o de início.");
      return;
    }

    try {
      const startTime = new Date(`${date}T${startHour.padStart(2, "0")}:00:00`).toISOString();
      const endTime = new Date(`${date}T${endHour.padStart(2, "0")}:00:00`).toISOString();

      await api.post("/admin/blocked-slots", { courtId, date, startTime, endTime, reason, isWeekly });
      setSuccess("Horário bloqueado com sucesso!");
      setStartHour("");
      setEndHour("");
      setReason("");
      setIsWeekly(false);
      fetchSlots();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao bloquear horário.");
    }
  }

  function handleUnblock(id: string, isSeries?: boolean) {
    setSlotToUnblock({ id, isSeries });
    setUnblockError("");
  }

  async function confirmUnblock() {
    if (!slotToUnblock) return;
    setIsUnblocking(true);
    setUnblockError("");
    try {
      if (slotToUnblock.isSeries) {
        await api.delete(`/admin/blocked-slots/${slotToUnblock.id}?deleteAll=true`);
      } else {
        await api.delete(`/admin/blocked-slots/${slotToUnblock.id}`);
      }
      fetchSlots();
      setSlotToUnblock(null);
    } catch {
      setUnblockError("Não foi possível desbloquear o horário.");
    } finally {
      setIsUnblocking(false);
    }
  }

  function formatDateBR(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR");
  }
  function formatTimeBR(iso: string) {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Bloquear Horários <span className="text-ct-gold">🔒</span>
            </h2>
            <p className="text-ct-muted mt-2">
              Bloqueie horários para manutenção, eventos ou uso interno.
            </p>
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleBlock}
            className="bg-ct-card p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6"
          >
            <h3 className="text-lg font-bold text-ct-text">Novo Bloqueio</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Quadra</label>
                <select
                  value={courtId}
                  onChange={(e) => setCourtId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                >
                  <option value="">Selecione uma quadra</option>
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                  required
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Início</label>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                >
                  <option value="">Horário de início</option>
                  {operatingHours.map((h) => (
                    <option key={h} value={String(h)}>{h}:00</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Fim</label>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
                >
                  <option value="">Horário de fim</option>
                  {operatingHours.filter((h) => !startHour || h > Number(startHour)).map((h) => (
                    <option key={h} value={String(h)}>{h}:00</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Motivo (opcional)</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Manutenção, Torneio interno..."
                className="w-full px-4 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-700 rounded-xl hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={isWeekly}
                onChange={(e) => setIsWeekly(e.target.checked)}
                className="w-5 h-5 accent-ct-gold cursor-pointer"
              />
              <span className="text-sm font-semibold text-ct-text">Repetir semanalmente no mesmo dia da semana (Série de aprox. 6 meses)</span>
            </label>

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
              🔒 Bloquear Horário
            </button>
          </form>

          {/* Lista de bloqueios */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-ct-text">Horários Bloqueados</h3>
            {slots.length === 0 ? (
              <div className="text-center py-16 bg-ct-card rounded-2xl border border-slate-800">
                <span className="text-4xl opacity-50">🔓</span>
                <p className="mt-4 text-ct-muted">Nenhum horário bloqueado no momento.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {(() => {
                  const displaySlots: (BlockedSlot & { isSeries?: boolean })[] = [];
                  const seenSeries = new Set<string>();

                  for (const slot of slots) {
                    if (slot.recurringGroupId) {
                      if (seenSeries.has(slot.recurringGroupId)) continue;
                      seenSeries.add(slot.recurringGroupId);
                      displaySlots.push({ ...slot, isSeries: true });
                    } else {
                      displaySlots.push(slot);
                    }
                  }

                  return displaySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-ct-card p-5 rounded-2xl border border-slate-700 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-5">
                        <div className="bg-ct-dark text-ct-gold font-black p-4 rounded-xl border border-ct-gold/20 text-center min-w-[90px]">
                          <div className="text-xs opacity-70 mb-1">{formatDateBR(slot.date).slice(0, 5)}</div>
                          <div className="text-lg">{formatTimeBR(slot.startTime)}</div>
                        </div>
                        <div>
                          <p className="font-bold text-ct-text">
                            {slot.court.name}
                            {slot.isSeries && (
                              <span className="ml-3 inline-block px-2 py-0.5 bg-ct-gold/20 text-ct-gold text-xs font-bold rounded-full border border-ct-gold/50">
                                Série Semanal
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-ct-muted">
                            {formatTimeBR(slot.startTime)} às {formatTimeBR(slot.endTime)}
                            {slot.reason && <span className="ml-2 opacity-70">· {slot.reason}</span>}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnblock(slot.id, slot.isSeries)}
                        className="px-4 py-2 text-xs font-bold text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {slot.isSeries ? "Remover Série" : "Desbloquear"}
                      </button>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmação de Desbloqueio */}
      {slotToUnblock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isUnblocking && setSlotToUnblock(null)}
          />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in text-center">
            <span className="text-5xl">🔓</span>
            <h3 className="text-2xl font-black text-ct-text mt-4">Confirmar Liberação</h3>
            <p className="text-ct-muted text-sm mt-2 mb-8">
              {slotToUnblock.isSeries 
                ? "Atenção: Isso vai liberar TODOS os horários bloqueados que fazem parte desta série semanal (pelos próximos 6 meses). Tem certeza?" 
                : "Tem certeza que deseja liberar este horário específico na agenda?"}
            </p>
            {unblockError && (
              <p className="text-red-400 text-sm mb-4">{unblockError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setSlotToUnblock(null)}
                disabled={isUnblocking}
                className="flex-1 py-3 bg-transparent border border-slate-600 text-ct-muted rounded-xl font-bold hover:border-slate-400 hover:text-ct-text transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUnblock}
                disabled={isUnblocking}
                className="flex-1 py-3 bg-red-500/20 text-red-500 font-black rounded-xl hover:bg-red-500/30 border border-red-500/50 transition-all cursor-pointer shadow-lg disabled:opacity-70"
              >
                {isUnblocking ? "Liberando..." : "Desbloquear ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
