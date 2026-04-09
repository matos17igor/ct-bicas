import { useEffect, useState } from "react";
import { api } from "../services/api";
import { UserSidebar } from "../components/UserSidebar";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  court: {
    name: string;
  };
}

export function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [slotToCancel, setSlotToCancel] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    async function fetchMyBookings() {
      try {
        const response = await api.get("/me/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Erro ao buscar os jogos:", error);
      }
    }
    fetchMyBookings();
  }, []);

  function handleCancelBooking(id: string) {
    setSlotToCancel(id);
    setCancelError("");
  }

  async function confirmCancel() {
    if (!slotToCancel) return;
    setIsCanceling(true);
    setCancelError("");

    try {
      await api.delete(`/bookings/${slotToCancel}`);
      setBookings(bookings.filter((booking) => booking.id !== slotToCancel));
      setSlotToCancel(null);
    } catch (error) {
      console.error("Erro ao cancelar o jogo:", error);
      setCancelError("Não foi possível cancelar o jogo. Tente novamente.");
    } finally {
      setIsCanceling(false);
    }
  }

  // Função simples para formatar a data que vem do banco
  function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString("pt-BR");
  }

  // Função para pegar só a hora da string do banco
  function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <UserSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight text-ct-text">
              Minhas Partidas
            </h2>
            <p className="text-ct-muted mt-2">
              Gerencie seus próximos horários no CT Bicas.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-24 bg-ct-card rounded-3xl border border-slate-800 shadow-2xl">
              <span className="text-6xl opacity-80">📅</span>
              <p className="mt-6 text-ct-muted text-lg font-medium">
                Você ainda não tem jogos marcados na areia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-ct-card p-6 rounded-2xl border border-slate-700 shadow-xl hover:border-ct-gold/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-black text-ct-text mb-5 flex items-center gap-3">
                      <span className="text-2xl">🏟️</span>
                      {booking.court.name}
                    </h3>

                    <div className="space-y-3 text-ct-muted">
                      <p className="flex items-center gap-3">
                        <span className="text-ct-gold text-lg">📅</span>
                        <strong className="text-ct-text font-semibold">
                          Data:
                        </strong>{" "}
                        {formatDate(booking.date)}
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="text-ct-gold text-lg">🕒</span>
                        <strong className="text-ct-text font-semibold">
                          Horário:
                        </strong>{" "}
                        {formatTime(booking.startTime)} às{" "}
                        {formatTime(booking.endTime)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="mt-8 w-full px-4 py-3 bg-transparent text-red-400 border border-red-500/30 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-red-500/10 hover:border-red-400"
                  >
                    Cancelar Jogo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmação de Cancelamento */}
      {slotToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isCanceling && setSlotToCancel(null)}
          />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in text-center">
            <span className="text-5xl">⚠️</span>
            <h3 className="text-2xl font-black text-ct-text mt-4">Cancelar Agendamento</h3>
            <p className="text-ct-muted text-sm mt-2 mb-8">Tem certeza que deseja cancelar o seu jogo? Esta ação não pode ser desfeita.</p>
            {cancelError && (
              <p className="text-red-400 text-sm mb-4">{cancelError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setSlotToCancel(null)}
                disabled={isCanceling}
                className="flex-1 py-3 bg-transparent border border-slate-600 text-ct-muted rounded-xl font-bold hover:border-slate-400 hover:text-ct-text transition-all cursor-pointer disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={confirmCancel}
                disabled={isCanceling}
                className="flex-1 py-3 bg-red-500/20 text-red-500 font-black rounded-xl hover:bg-red-500/30 border border-red-500/50 transition-all cursor-pointer shadow-lg disabled:opacity-70"
              >
                {isCanceling ? "Cancelando..." : "Cancelar Jogo ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
