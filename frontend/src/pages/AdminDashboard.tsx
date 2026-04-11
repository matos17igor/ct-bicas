import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AdminSidebar } from "../components/AdminSidebar";

interface AdminBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  court: {
    name: string;
  };
  user: {
    name: string ;
    email: string;
    phone?: string | null;
  };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [error, setError] = useState("");

  const [slotToCancel, setSlotToCancel] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    async function fetchAllBookings() {
      try {
        const response = await api.get("/admin/bookings");
        setBookings(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar os horarios:", error);
        // Se retornar 403, o usuario nao e ADMIN
        if (error.response?.status === 403) {
          setError("Acesso negado. Esta area e exclusiva para o dono.");
        } else {
          setError("Erro ao carregar os dados do sistema.");
        }
      }
    }
    fetchAllBookings();
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
      setBookings(bookings.filter((b) => b.id !== slotToCancel));
      setSlotToCancel(null);
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      setCancelError("Não foi possível cancelar a reserva. Tente novamente.");
    } finally {
      setIsCanceling(false);
    }
  }

  function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ct-dark flex flex-col items-center justify-center p-4">
        <div className="bg-ct-card p-10 rounded-3xl shadow-2xl max-w-md text-center border-t-4 border-red-500">
          <span className="text-6xl">🛑</span>
          <h2 className="mt-6 text-2xl font-black text-ct-text">{error}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 px-8 py-3 bg-ct-gold text-ct-dark font-bold rounded-xl hover:bg-ct-gold-hover cursor-pointer w-full"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold text-ct-text tracking-tight">
              Agenda Completa <span className="text-ct-gold">📊</span>
            </h2>
            <p className="text-ct-muted mt-2">
              Visão geral de todos os horários reservados na arena.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-24 bg-ct-card rounded-3xl border border-slate-800 shadow-2xl">
              <span className="text-6xl opacity-80">📭</span>
              <p className="mt-6 text-ct-muted text-lg font-medium">
                A arena não tem nenhum jogo marcado no momento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-ct-card p-5 rounded-2xl border border-slate-700 shadow-lg hover:border-ct-gold/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-center w-full">
                    {/* Bloco de Horário em Destaque Dourado */}
                    <div className="bg-ct-dark text-ct-gold font-black p-4 rounded-xl border border-ct-gold/20 text-center min-w-[110px] shadow-inner mb-4 sm:mb-0">
                      <div className="text-xs uppercase tracking-widest opacity-80 mb-1">
                        {formatDate(booking.date).slice(0, 5)}
                      </div>
                      <div className="text-2xl">
                        {formatTime(booking.startTime)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ct-text flex items-center gap-2 mb-2">
                        <span className="text-ct-gold">🏟️</span>{" "}
                        {booking.court.name}
                      </h3>
                      <div className="text-sm text-ct-muted flex flex-col sm:flex-row sm:gap-5 bg-ct-dark/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="flex items-center gap-2">
                          <span className="text-ct-gold text-base">👤</span>{" "}
                          <strong className="text-ct-text font-medium">
                            {booking.user?.name || "Usuário Removido"}
                          </strong>
                        </span>
                        {booking.user?.email && (
                          <span className="flex items-center gap-2">
                            <span className="text-ct-gold text-base">✉️</span>{" "}
                            {booking.user.email}
                          </span>
                        )}
                        {booking.user?.phone && (
                          <span className="flex items-center gap-2">
                            <span className="text-ct-gold text-base">📱</span>{" "}
                            {booking.user.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 self-start md:self-center">
                    <div className="text-right text-xs text-slate-500 font-mono bg-ct-dark px-3 py-2 rounded-lg whitespace-nowrap border border-slate-800">
                      ID: {booking.id.slice(0, 8)}
                    </div>
                    {booking.user.phone && (
                      <a
                        href={`https://wa.me/55${booking.user.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${booking.user.name}! Tudo certo com sua reserva no CT Bicas na ${booking.court.name} no dia ${formatDate(booking.date)} às ${formatTime(booking.startTime)}. Qualquer dúvida, estamos à disposição! 🎾`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-400 border border-green-600/30 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-green-600/20 hover:border-green-500 whitespace-nowrap"
                      >
                        <span>💬</span> WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-transparent text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:bg-red-500/10 hover:border-red-400 whitespace-nowrap"
                    >
                      Cancelar Horario
                    </button>
                  </div>
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
            <h3 className="text-2xl font-black text-ct-text mt-4">Confirmar Cancelamento</h3>
            <p className="text-ct-muted text-sm mt-2 mb-8">Tem certeza que deseja cancelar esta reserva do sistema?</p>
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
                {isCanceling ? "Cancelando..." : "Cancelar ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
