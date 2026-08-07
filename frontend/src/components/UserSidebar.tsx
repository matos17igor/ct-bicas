import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoCt from "../assets/ct-bicas-removebg-preview.png";

export function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("@CTBicas:token");
    navigate("/login");
  }

  function goTo(path: string) {
    navigate(path);
    setOpen(false);
  }

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-ct-card border-b border-slate-300/10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ct-gold rounded-lg flex items-center justify-center">
            <img src={logoCt} alt="Logo CT Bicas" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-ct-text font-extrabold text-lg tracking-tighter">CT BICAS</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-ct-text p-2 cursor-pointer"
          aria-label="Menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-68 bg-ct-card border-r border-slate-300/10 min-h-screen flex flex-col text-slate-300 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
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
          {/* Close button on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden ml-auto text-ct-muted hover:text-ct-text cursor-pointer"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-5 flex flex-col gap-2.5">
          <button
            onClick={() => goTo("/dashboard")}
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
            onClick={() => goTo("/courts")}
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
            onClick={() => goTo("/profile")}
            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-semibold transition-colors cursor-pointer text-lg
              ${
                isActive("/profile")
                  ? "bg-ct-dark text-ct-gold shadow-inner border border-slate-700"
                  : "text-slate-400 hover:bg-ct-dark/50 hover:text-ct-gold hover:shadow-sm"
              }`}
          >
            <span className="text-2xl opacity-90">👤</span> Meu Perfil
          </button>

          <button
            onClick={() => goTo("/torneios")}
            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-semibold transition-colors cursor-pointer text-lg
              ${
                isActive("/torneios")
                  ? "bg-ct-dark text-ct-gold shadow-inner border border-slate-700"
                  : "text-slate-400 hover:bg-ct-dark/50 hover:text-ct-gold hover:shadow-sm"
              }`}
          >
            <span className="text-2xl opacity-90">🏆</span> Torneios
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
    </>
  );
}
