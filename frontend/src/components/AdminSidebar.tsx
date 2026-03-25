import { useNavigate, useLocation } from "react-router-dom";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("@CTBicas:token");
    navigate("/");
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col text-slate-300">
      {/* Logo / Título do Sidebar */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold">CT</span>
        </div>
        <span className="text-white font-bold text-lg tracking-wide">
          Painel Gerencial
        </span>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
        <button
          onClick={() => navigate("/admin")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
            isActive("/admin")
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span>📊</span> Visão Geral
        </button>

        <button
          onClick={() => alert("Em breve: Tela de gerenciar quadras!")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
            isActive("/admin/courts")
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span>🏟️</span> Gerenciar Quadras
        </button>

        <button
          onClick={() => alert("Em breve: Bloquear horários para manutenção!")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer hover:bg-slate-800 hover:text-white`}
        >
          <span>📅</span> Bloquear Horários
        </button>
      </nav>

      {/* Rodapé do Sidebar com botão de sair */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-red-400 rounded-lg hover:bg-slate-700 hover:text-red-300 transition-colors cursor-pointer"
        >
          <span>🚪</span> Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
