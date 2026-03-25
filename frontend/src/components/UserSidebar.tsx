import { useNavigate, useLocation } from "react-router-dom";

export function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("@ArenaSaaS:token");
    navigate("/");
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Logo da Arena */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-bold">CT</span>
        </div>
        <span className="text-slate-900 font-bold text-lg tracking-wide">
          Área do Atleta
        </span>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 flex flex-col gap-2 mt-2">
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors cursor-pointer 
            ${
              location.pathname === "/dashboard"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
          <span className="text-xl">🎾</span> Meus Jogos
        </button>

        <button
          onClick={() => navigate("/courts")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors cursor-pointer 
            ${
              isActive("/courts")
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
          <span className="text-xl">🏟️</span> Agendar Quadra
        </button>
      </nav>

      {/* Rodapé com botão de Sair */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
        >
          <span className="text-lg">🚪</span> Sair
        </button>
      </div>
    </aside>
  );
}
