import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

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
    <div style={{ padding: "50px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Meus Jogos Marcados 🎾</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#ff4444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {bookings.length === 0 ? (
        <p>Você ainda não tem jogos marcados.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{booking.court.name}</h3>
              <p style={{ margin: "5px 0" }}>
                <strong>Data:</strong> {formatDate(booking.date)}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Horário:</strong> {formatTime(booking.startTime)} às{" "}
                {formatTime(booking.endTime)}
              </p>
              <button
                onClick={() => handleCancelBooking(booking.id)}
                className="mt-2.5 px-3 py-2 bg-transparent text-red-500 border border-red-500 rounded cursor-pointer transition-colors duration-200 hover:bg-red-50"
              >
                Cancelar Jogo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
