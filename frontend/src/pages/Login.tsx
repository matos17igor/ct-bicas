import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

import logoCt from "../assets/ct-bicas-removebg-preview.png";
import backgroundCt from "../assets/ct-background.jpeg";

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: string;
}

export function Login() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<"EMAIL" | "CODE">("EMAIL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyEmailTarget, setVerifyEmailTarget] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("@CTBicas:token", token);

      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.code === "UNVERIFIED") {
        setVerifyEmailTarget(email);
        setShowVerifyModal(true);
        setError("Sua conta não confirmada. Novo código enviado ao seu e-mail.");
        try {
          await api.post("/auth/resend-code", { email });
        } catch (resendErr) {
          console.error("Erro ao reenviar código:", resendErr);
        }
        setIsLoading(false);
        return;
      }
      setError(err.response?.data?.error || "E-mail ou senha inválidos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await api.post("/users", { name, email, password, phone });
      
      setVerifyEmailTarget(email);
      setShowVerifyModal(true);
      setSuccessMsg("");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "Erro ao criar conta. Verifique os dados."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await api.post("/auth/verify-email", { email: verifyEmailTarget, code: verifyCode });
      setShowVerifyModal(false);
      setIsRegistering(false);
      setEmail(verifyEmailTarget);
      setPassword("");
      setSuccessMsg("Conta ativada com sucesso! Agora você pode fazer login.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Código inválido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    setError("");
    setSuccessMsg("");
    try {
      await api.post("/auth/resend-code", { email: verifyEmailTarget });
      setSuccessMsg("Reenviamos um novo código para o seu e-mail.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao reenviar o código.");
    }
  }

  async function handleForgotPassword(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccessMsg("Se o e-mail existir, você receberá o código em breve.");
      setForgotStep("CODE");
    } catch (err: any) {
      setError("Erro ao solicitar nova senha. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { email, code: forgotCode, newPassword });
      setIsForgotPassword(false);
      setForgotStep("EMAIL");
      setForgotCode("");
      setNewPassword("");
      setPassword("");
      setSuccessMsg("Sua senha foi redefinida com sucesso! Faça login abaixo.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Código inválido ou erro ao resetar senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex bg-ct-dark overflow-hidden relative">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto items-center relative z-10">
        <div className="mb-10 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl mb-8 shadow-lg shadow-black/50">
            <img
              src={logoCt}
              alt="Logo CT Bicas"
              className="w-24 h-24 object-contain brightness-105 contrast-105"
            />
          </div>

          <h2 className="text-4xl font-extrabold text-ct-text tracking-tighter text-center">
            {isForgotPassword 
              ? "Recuperar Senha" 
              : isRegistering 
                ? "Crie sua conta." 
                : "Bem-vindo ao CT Bicas."}
          </h2>
          <p className="mt-3 text-lg text-ct-muted text-center">
            {isForgotPassword
              ? "Insira o e-mail ou o código de verificação."
              : isRegistering
              ? "Junte-se ao CT Bicas e venha conhecer as melhores quadras!"
              : "Faça login para reservar sua quadra e entrar no jogo."}
          </p>
        </div>

        {/* FORGOT PASSWORD FORM */}
        {isForgotPassword ? (
          <form
            onSubmit={forgotStep === "EMAIL" ? handleForgotPassword : handleResetPassword}
            className="flex flex-col gap-5 w-full max-w-md"
          >
            {forgotStep === "EMAIL" ? (
              <div>
                <label className="text-sm font-semibold text-ct-text block mb-2">Qual seu e-mail cadastrado?</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu.email@exemplo.com"
                  className="w-full px-5 py-3.5 bg-ct-card border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:border-ct-gold outline-none"
                />
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="text-sm font-semibold text-ct-text block mb-2">Código recebido no E-mail</label>
                  <input
                    type="text"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    required
                    placeholder="Ex: 123456"
                    maxLength={6}
                    className="w-full px-5 py-3.5 bg-ct-card border border-slate-700 rounded-xl text-ct-text tracking-widest uppercase font-mono text-center focus:ring-2 focus:border-ct-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ct-text block mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-ct-card border border-slate-700 rounded-xl text-ct-text focus:ring-2 focus:border-ct-gold outline-none"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-950/50 text-red-300 text-sm p-4 rounded-xl border border-red-800">
                ⚠️ {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-950/50 text-green-400 text-sm p-4 rounded-xl border border-green-800">
                ✅ {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ct-gold text-ct-dark font-bold py-4 rounded-xl hover:bg-ct-gold-hover transition-all cursor-pointer shadow-lg disabled:opacity-70 mt-2"
            >
              {isLoading ? "Aguarde..." : (forgotStep === "EMAIL" ? "Enviar Código" : "Redefinir Senha")}
            </button>
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setForgotStep("EMAIL"); setError(""); setSuccessMsg(""); }}
              className="w-full bg-transparent text-ct-muted font-bold py-3 hover:text-ct-text cursor-pointer transition-colors mt-2"
            >
              Voltar ao Login
            </button>
          </form>
        ) : (
          /* LOGIN OR REGISTER FORM */
          <form
            onSubmit={isRegistering ? handleRegister : handleLogin}
            className="flex flex-col gap-5 w-full max-w-md"
          >
            {isRegistering && (
              <div className="animate-fade-in">
                <label className="text-sm font-semibold text-ct-text block mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Seu nome"
                  className="w-full px-5 py-3.5 bg-ct-card border border-slate-700 rounded-xl text-ct-text placeholder:text-slate-500 focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold transition-all outline-none"
                />
              </div>
            )}
            {isRegistering && (
              <div className="animate-fade-in">
                <label className="text-sm font-semibold text-ct-text block mb-2">
                  Celular (WhatsApp com DDD)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="Ex: (32) 99999-9999"
                  maxLength={11}
                  minLength={11}
                  required
                  className="w-full px-5 py-3.5 bg-ct-card border border-slate-700 rounded-xl text-ct-text placeholder:text-slate-500 focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold transition-all outline-none"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-ct-text block mb-2">
                Seu E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu.email@exemplo.com"
                className="w-full px-5 py-3.5 bg-ct-card border border-slate-700 rounded-xl text-ct-text placeholder:text-slate-500 focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold transition-all outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-ct-text">
                  Sua Senha
                </label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(""); setSuccessMsg(""); }}
                    className="text-xs text-ct-gold bg-transparent border-none p-0 cursor-pointer hover:text-ct-gold-hover hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-ct-card border border-slate-300/10 rounded-xl text-ct-text placeholder:text-slate-500 focus:ring-2 focus:ring-ct-gold/50 focus:border-ct-gold transition-all outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-950/50 text-red-300 text-sm p-4 rounded-xl border border-red-800">
                ⚠️ {error}
              </div>
            )}
            {successMsg && !isRegistering && (
              <div className="bg-green-950/50 text-green-400 text-sm p-4 rounded-xl border border-green-800">
                ✅ {successMsg}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-ct-gold text-ct-dark font-bold py-4 px-6 rounded-xl hover:bg-ct-gold-hover focus:outline-none focus:ring-4 focus:ring-ct-gold/30 transition-all duration-150 cursor-pointer text-lg shadow-lg shadow-ct-gold/20 disabled:opacity-75"
            >
              {isLoading ? "Aguarde..." : (isRegistering ? "Cadastrar" : "Entrar")}
            </button>
          </form>
        )}

        {/* BOTTOM TOGGLER */}
        {!isForgotPassword && (
          <div className="mt-12 text-center text-sm text-ct-muted w-full max-w-md">
            {isRegistering ? (
              <p>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-ct-gold font-medium hover:text-ct-gold-hover hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Faça login
                </button>
                .
              </p>
            ) : (
              <p>
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-ct-gold font-medium hover:text-ct-gold-hover hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Cadastre-se grátis
                </button>
                .
              </p>
            )}
          </div>
        )}
      </div>

      {/* VERIFY EMAIL MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 bg-ct-card border border-slate-700 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md p-8 animate-fade-in text-center flex flex-col items-center">
            <span className="text-5xl text-ct-gold">✉️</span>
            <h3 className="text-2xl font-black text-ct-text mt-5">Verifique seu E-mail</h3>
            <p className="text-ct-muted text-sm mt-3 leading-relaxed mb-6">
              Enviamos um código de 6 dígitos para o e-mail: <b className="text-white block mt-1">{verifyEmailTarget}</b>
            </p>
            
            <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                maxLength={6}
                required
                placeholder="000000"
                className="w-full px-5 py-4 bg-ct-dark border border-slate-700 rounded-xl text-ct-gold text-2xl tracking-[12px] font-black text-center focus:ring-2 focus:border-ct-gold outline-none"
              />
              {error && <p className="text-red-400 text-sm text-left">⚠️ {error}</p>}
              {successMsg && <p className="text-green-400 text-sm text-left">✅ {successMsg}</p>}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-ct-gold text-ct-dark font-black text-lg py-4 rounded-xl hover:bg-ct-gold-hover transition-all cursor-pointer shadow-lg disabled:opacity-75"
              >
                {isLoading ? "Verificando..." : "Confirmar Código"}
              </button>
            </form>

            <button 
              onClick={handleResendCode}
              type="button" 
              className="mt-6 text-sm text-ct-muted underline hover:text-ct-text cursor-pointer bg-transparent border-none"
            >
              Não recebeu o código? Reenviar
            </button>
            <button 
              onClick={() => { setShowVerifyModal(false); setError(""); setSuccessMsg(""); }}
              type="button" 
              className="mt-3 text-sm text-red-400/80 hover:text-red-400 cursor-pointer bg-transparent border-none"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:block w-1/2 relative overflow-hidden bg-slate-900">
        <img
          src={backgroundCt}
          alt="Arena de Futevôlei / Beach Tennis"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ct-dark via-ct-dark/70 to-transparent"></div>

        <div className="absolute inset-x-0 bottom-0 p-16 pb-24 text-center">
          <h1 className="text-6xl font-black text-ct-gold tracking-tighter leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            FORÇA NO ESPORTE.
            <br />
            LEVEZA NA AREIA.
          </h1>
          <p className="mt-6 text-xl text-ct-text/80 max-w-xl mx-auto drop-shadow-md">
            No CT Bicas, a sua resenha está garantida. Agende seu horário e
            sinta a energia da arena.
          </p>
        </div>
      </div>
    </div>
  );
}
