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
    name: string;
    email: string;
  };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [error, setError] = useState("");

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

  function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString("pt-BR");
  }

  function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-4 border-red-500">
          <span className="text-5xl">🛑</span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">{error}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Voltar para Meus Jogos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. O Menu Lateral Fixo na Esquerda */}
      <AdminSidebar />

      {/* 2. A Área Central de Conteúdo que preenche o resto da tela (flex-1) */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 pb-6 border-b border-slate-200">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Agenda de Hoje
            </h2>
            <p className="text-slate-500 mt-1">
              Acompanhe todos os agendamentos das quadras.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-5xl">📭</span>
              <p className="mt-5 text-slate-600 font-medium">
                A arena não tem nenhum jogo marcado ainda.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* O mesmo map dos bookings que você já tinha feito antes */}
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* ... conteúdo dos cards do agendamento (pode manter exatamente o que estava aqui) ... */}
                  <div className="flex gap-6 items-center">
                    <div className="bg-blue-50 text-blue-700 font-bold p-4 rounded-lg text-center min-w-[100px]">
                      <div className="text-sm uppercase tracking-wider">
                        {formatDate(booking.date).slice(0, 5)}
                      </div>
                      <div className="text-xl">
                        {formatTime(booking.startTime)}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        🏟️ {booking.court.name}
                      </h3>
                      <div className="mt-1 text-sm text-slate-600 flex flex-col sm:flex-row sm:gap-4">
                        <span className="flex items-center gap-1">
                          👤 {booking.user.name}
                        </span>
                        <span className="flex items-center gap-1">
                          ✉️ {booking.user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-md self-start md:self-center">
                    ID: {booking.id.slice(0, 8)}...
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
