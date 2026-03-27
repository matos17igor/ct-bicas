import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { UserSidebar } from "../components/UserSidebar";

export function Schedule() {
  const { courtId } = useParams(); // Pega o ID da quadra que vai estar na URL
  const navigate = useNavigate();

  // Define a data de hoje como padrão para o calendário
  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState(localToday);
  const [bookedHours, setBookedHours] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // Horários de funcionamento (8h às 22h)
  const operatingHours = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  ];

  // Busca os horários ocupados sempre que o usuário mudar a data
  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await api.get(`/courts/${courtId}/bookings`, {
          params: { date },
        });

        // Extrai apenas a hora dos agendamentos que vieram do banco
        const occupied = response.data.map((booking: any) => {
          return new Date(booking.startTime).getHours();
        });

        setBookedHours(occupied);
        setSelectedHour(null);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      }
    }

    if (courtId && date) {
      fetchBookings();
    }
  }, [courtId, date]);

  // Função disparada ao clicar em um horário livre
  async function handleConfirmSchedule() {
    if (selectedHour === null) {
      alert("Por favor, selecione um horário primeiro.");
      return;
    }

    try {
      const startTime = new Date(
        `${date}T${selectedHour.toString().padStart(2, "0")}:00:00`
      ).toISOString();
      const endTime = new Date(
        `${date}T${(selectedHour + 1).toString().padStart(2, "0")}:00:00`
      ).toISOString();

      await api.post("/bookings", { courtId, date, startTime, endTime });
      alert("Jogo agendado com sucesso! 🎾");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao agendar o jogo.");
    }
  }

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <UserSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-ct-card p-10 rounded-3xl shadow-2xl border border-slate-300/5">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className="text-3xl text-ct-gold">🕒</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Reservar Horário
              </h2>
            </div>
            <button
              onClick={() => navigate("/courts")}
              className="text-sm font-semibold text-ct-gold hover:text-ct-gold-hover hover:underline cursor-pointer"
            >
              ← Voltar para Quadras
            </button>
          </div>

          <div className="mb-10 bg-ct-dark p-6 rounded-xl border border-slate-700">
            <label className="block text-sm font-semibold text-ct-text mb-3">
              Escolha o dia da partida:
            </label>
            <input
              type="date"
              value={date}
              min={localToday}
              onChange={(e) => setDate(e.target.value)}
              className="w-full md:w-auto px-6 py-3 bg-ct-card text-ct-text border border-slate-700 rounded-xl focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {operatingHours.map((hour) => {
              const isBooked = bookedHours.includes(hour);
              const currentHour = new Date().getHours();
              const isPast = date === localToday && hour <= currentHour;
              const isDisabled = isBooked || isPast;

              // Verifica se este bloco específico é o selecionado
              const isSelected = selectedHour === hour;

              return (
                <button
                  key={hour}
                  disabled={isDisabled}
                  onClick={() => setSelectedHour(hour)}
                  className={`py-5 rounded-xl font-extrabold text-xl transition-all duration-150 flex flex-col items-center justify-center border-2 shadow-lg
                    ${
                      isDisabled
                        ? "bg-ct-card/60 text-slate-600 border-slate-700 opacity-50 cursor-not-allowed shadow-none"
                        : isSelected
                        ? // SELECIONADO: Dourado Sólido
                          "bg-ct-gold text-ct-dark border-ct-gold-hover cursor-pointer"
                        : // LIVRE: Borda Dourada, texto Dourado
                          "bg-ct-card text-ct-gold border-ct-gold hover:bg-ct-gold hover:text-ct-dark cursor-pointer"
                    }
                  `}
                >
                  <span>{hour}:00</span>
                  {isBooked && (
                    <span className="text-[11px] font-normal mt-1 opacity-70">
                      Ocupado
                    </span>
                  )}
                  {isPast && !isBooked && (
                    <span className="text-[11px] font-normal mt-1 opacity-70">
                      Passou
                    </span>
                  )}
                  {!isDisabled && (
                    <span className="text-[11px] font-normal mt-1 opacity-80">
                      {isSelected ? "Selecionado" : "Livre"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedHour !== null && (
            <div className="mt-12 pt-8 border-t border-slate-700 flex justify-end">
              <button
                onClick={handleConfirmSchedule}
                className="px-10 py-4 bg-ct-gold text-ct-dark font-black rounded-2xl hover:bg-ct-gold-hover transition-all duration-150 cursor-pointer text-xl shadow-2xl shadow-ct-gold/30 flex items-center gap-3"
              >
                Confirmar Agendamento para as {selectedHour}:00h
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
