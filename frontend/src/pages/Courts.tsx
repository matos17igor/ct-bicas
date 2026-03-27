import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { UserSidebar } from "../components/UserSidebar";

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
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <UserSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Escolha sua Quadra
            </h2>
            <p className="text-ct-muted mt-2">
              Selecione o espaço ideal para o seu próximo jogo.
            </p>
          </div>

          {courts.length === 0 ? (
            <div className="text-center py-24 bg-ct-card rounded-3xl border border-slate-800 shadow-2xl">
              <span className="text-6xl opacity-80">🚧</span>
              <p className="mt-6 text-ct-muted text-lg font-medium">
                Nenhuma quadra cadastrada no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="bg-ct-card p-8 rounded-3xl border border-slate-700 shadow-xl hover:shadow-ct-gold/10 hover:border-ct-gold/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl font-black text-ct-text mb-3">
                      {court.name}
                    </h3>
                    <p className="text-ct-muted text-sm mb-8 leading-relaxed">
                      Quadra de areia com padrão profissional, pronta para o seu
                      treino de futevôlei ou beach tennis.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/courts/${court.id}`)}
                    className="w-full bg-ct-gold text-ct-dark font-black py-3.5 px-4 rounded-xl hover:bg-ct-gold-hover transition-colors cursor-pointer shadow-lg shadow-ct-gold/20 text-lg"
                  >
                    Ver Horários Livres
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
