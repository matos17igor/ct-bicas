import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface Court {
  id: string;
  name: string;
}

export function Courts() {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    async function fetchCourts() {
      try {
        const response = await api.get("/courts");
        setCourts(response.data);
      } catch (error) {
        console.log("Erro ao buscar as quadras: ", error);
      }
    }
    fetchCourts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-black">A</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Escolha uma Quadra 🏟️
            </h2>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Voltar para Meus Jogos
          </button>
        </div>

        {/* Grid de Quadras */}
        {courts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50">
            <span className="text-5xl">🚧</span>
            <p className="mt-5 text-slate-600 font-medium">
              Nenhuma quadra cadastrada ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court) => (
              <div
                key={court.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-950 mb-2">
                    {court.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Quadra de alta qualidade, pronta para o seu jogo.
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/courts/${court.id}`)}
                  className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Ver Horários
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
