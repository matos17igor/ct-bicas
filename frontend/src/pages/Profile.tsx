import { useEffect, useState } from "react";
import { api } from "../services/api";
import { UserSidebar } from "../components/UserSidebar";

export function Profile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState<{type:"success"|"error", text:string} | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{type:"success"|"error", text:string} | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/me");
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
      } catch {
        console.error("Erro ao carregar perfil");
      }
    }
    fetchProfile();
  }, []);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await api.patch("/me", { name, phone });
      setProfileMsg({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Erro ao atualizar." });
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "A nova senha e a confirmação não coincidem." });
      return;
    }
    try {
      await api.patch("/me/password", { currentPassword, newPassword });
      setPasswordMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.response?.data?.error || "Erro ao alterar senha." });
    }
  }

  return (
    <div className="flex min-h-screen bg-ct-dark text-ct-text">
      <UserSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="pb-6 border-b border-slate-800">
            <h2 className="text-3xl font-extrabold tracking-tight">Meu Perfil</h2>
            <p className="text-ct-muted mt-2">Gerencie suas informações pessoais.</p>
          </div>

          {/* Dados pessoais */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-ct-card p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-ct-gold">👤</span> Dados Pessoais
            </h3>

            <div>
              <label className="block text-sm font-semibold text-ct-text mb-2">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ct-text mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-5 py-3 bg-ct-dark border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">O e-mail não pode ser alterado.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ct-text mb-2">Celular (WhatsApp)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(99) 99999-9999"
                className="w-full px-5 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            {profileMsg && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${profileMsg.type === "success" ? "bg-green-950/50 text-green-400 border-green-800" : "bg-red-950/50 text-red-300 border-red-800"}`}>
                {profileMsg.type === "success" ? "✅" : "⚠️"} {profileMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-ct-gold text-ct-dark font-bold rounded-xl hover:bg-ct-gold-hover transition-all cursor-pointer"
            >
              Salvar Alterações
            </button>
          </form>

          {/* Troca de senha */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-ct-card p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-ct-gold">🔐</span> Alterar Senha
            </h3>

            <div>
              <label className="block text-sm font-semibold text-ct-text mb-2">Senha Atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ct-text mb-2">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ct-text mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-ct-dark border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold outline-none"
              />
            </div>

            {passwordMsg && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${passwordMsg.type === "success" ? "bg-green-950/50 text-green-400 border-green-800" : "bg-red-950/50 text-red-300 border-red-800"}`}>
                {passwordMsg.type === "success" ? "✅" : "⚠️"} {passwordMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-transparent border border-ct-gold text-ct-gold font-bold rounded-xl hover:bg-ct-gold hover:text-ct-dark transition-all cursor-pointer"
            >
              Alterar Senha
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
