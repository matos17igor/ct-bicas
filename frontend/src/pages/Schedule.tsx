import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

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
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      }
    }

    if (courtId && date) {
      fetchBookings();
    }
  }, [courtId, date]);

  // Função disparada ao clicar em um horário livre
  async function handleSchedule(hour: number) {
    const confirm = window.confirm(
      `Confirmar agendamento para as ${hour}:00h?`
    );
    if (!confirm) return;

    try {
      const startTime = new Date(
        `${date}T${hour.toString().padStart(2, "0")}:00:00`
      ).toISOString();
      const endTime = new Date(
        `${date}T${(hour + 1).toString().padStart(2, "0")}:00:00`
      ).toISOString();

      await api.post("/bookings", {
        courtId,
        date,
        startTime,
        endTime,
      });

      alert("Horário agendado com sucesso! 🎾");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao agendar o horário.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Horários da Quadra 🕒
          </h2>
          <button
            onClick={() => navigate("/courts")}
            className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            ← Voltar para Quadras
          </button>
        </div>

        {/* O Calendário (Input de Data) */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Escolha o dia:
          </label>
          <input
            type="date"
            value={date}
            min={localToday} // Impede de agendar no passado
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Grid de Horários */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {operatingHours.map((hour) => {
            const isBooked = bookedHours.includes(hour);

            const currentHour = new Date().getHours();
            const isPast = date === localToday && hour <= currentHour;
            const isDisabled = isBooked || isPast;

            return (
              <button
                key={hour}
                disabled={isDisabled}
                onClick={() => handleSchedule(hour)}
                className={`py-3 rounded-xl font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center border
                    ${
                      isDisabled
                        ? "bg-slate-200 text-slate-500 border-slate-300 opacity-60 cursor-not-allowed"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-md cursor-pointer"
                    }
                  `}
              >
                {hour}:00
                {isBooked && (
                  <span className="block text-[10px] font-normal mt-1">
                    Ocupado
                  </span>
                )}
                {!isBooked && (
                  <span className="block text-[10px] font-normal mt-1 text-inherit opacity-70">
                    Livre
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
