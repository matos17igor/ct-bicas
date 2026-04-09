import { useNavigate, useLocation } from "react-router-dom";
import logoCt from "../assets/ct-bicas-removebg-preview.png";

export function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("@CTBicas:token");
    navigate("/login");
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="w-68 bg-ct-card border-r border-slate-300/10 min-h-screen flex flex-col text-slate-300">
      <div className="p-8 flex items-center gap-4 border-b border-slate-300/10 mb-6">
        <div className="w-12 h-12 bg-ct-gold rounded-xl flex items-center justify-center shadow-lg shadow-ct-gold/10">
          <span className="text-ct-dark font-black text-xl">
            <img src={logoCt} alt="Logo CT Bicas" />
          </span>
        </div>
        <div>
          <span className="text-ct-text font-extrabold text-xl tracking-tighter block leading-none">
            ÁREA DO
          </span>
          <span className="text-ct-gold font-medium text-xs uppercase tracking-widest mt-1 block">
            Atleta
          </span>
        </div>
      </div>

      <nav className="flex-1 px-5 flex flex-col gap-2.5">
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-semibold transition-colors cursor-pointer text-lg
            ${
              location.pathname === "/dashboard"
                ? "bg-ct-dark text-ct-gold shadow-inner border border-slate-700"
                : "text-slate-400 hover:bg-ct-dark/50 hover:text-ct-gold hover:shadow-sm"
            }`}
        >
          <span className="text-2xl opacity-90">🎾</span> Meus Jogos
        </button>

        <button
          onClick={() => navigate("/courts")}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-semibold transition-colors cursor-pointer text-lg
            ${
              isActive("/courts")
                ? "bg-ct-dark text-ct-gold shadow-inner border border-slate-700"
                : "text-slate-400 hover:bg-ct-dark/50 hover:text-ct-gold hover:shadow-sm"
            }`}
        >
          <span className="text-2xl opacity-90">🏟️</span> Agendar Quadra
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-semibold transition-colors cursor-pointer text-lg
            ${
              isActive("/profile")
                ? "bg-ct-dark text-ct-gold shadow-inner border border-slate-700"
                : "text-slate-400 hover:bg-ct-dark/50 hover:text-ct-gold hover:shadow-sm"
            }`}
        >
          <span className="text-2xl opacity-90">👤</span> Meu Perfil
        </button>
      </nav>

      <div className="p-5 mt-auto border-t border-slate-300/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-950/20 text-red-400 rounded-xl hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer font-bold"
        >
          <span>🚪</span> Sair
        </button>
      </div>
    </aside>
  );
}
