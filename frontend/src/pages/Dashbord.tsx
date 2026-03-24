import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import logoCt from "../assets/ct-bicas-removebg-preview.png";

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
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

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

  async function handleCancelBooking(id: string) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja cancelar este jogo?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/bookings/${id}`);

      // Atualiza a lista na tela removendo apenas o jogo que foi cancelado
      setBookings(bookings.filter((booking) => booking.id !== id));

      alert("Jogo cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar o jogo:", error);
      alert("Não foi possível cancelar o jogo. Tente novamente.");
    }
  }

  function handleLogout() {
    // Remove o token do navegador
    localStorage.removeItem("@CTBicas:token");
    // Manda o usuário de volta para o login
    navigate("/");
  }

  // Função simples para formatar a data que vem do banco
  function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  // Função para pegar só a hora da string do banco
  function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src={logoCt}
              alt="Logo CT Bicas"
              // O object-contain garante que a imagem não fique distorcida
              className="w-24 h-24 object-contain mb-5 drop-shadow-md"
            />
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Meus Horários Marcados ⚽🎾
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50">
            <span className="text-5xl">📅</span>
            <p className="mt-5 text-slate-600 font-medium">
              Você ainda não tem jogos marcados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-2">
                  <span className="text-xl">🏟️</span>
                  {booking.court.name}
                </h3>

                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">📅</span>
                    <strong>Data:</strong> {formatDate(booking.date)}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">🕒</span>
                    <strong>Horário:</strong> {formatTime(booking.startTime)} às{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>

                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="mt-5 w-full px-4 py-2 bg-transparent text-red-500 border border-red-500 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-red-50"
                >
                  Cancelar Horário
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
