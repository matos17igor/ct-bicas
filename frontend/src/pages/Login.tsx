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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");

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
    } catch (err) {
      console.error(err);
      setError("E-mail ou senha inválidos. Tente novamente.");
    }
  }

  async function handleRegister(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      await api.post("/users", { name, email, password, phone });

      setIsRegistering(false);
      setSuccessMsg(
        "Conta criada com sucesso! Faça seu login para entrar na arena."
      );
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "Erro ao criar conta. Verifique os dados."
      );
    }
  }

  return (
    <div className="h-screen w-full flex bg-ct-dark overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto items-center">
        <div className="mb-19 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl mb-8 shadow-lg shadow-black/50">
            <img
              src={logoCt}
              alt="Logo CT Bicas"
              className="w-24 h-24 object-contain brightness-105 contrast-105"
            />
          </div>

          <h2 className="text-4xl font-extrabold text-ct-text tracking-tighter">
            {isRegistering ? "Crie sua conta." : "Bem-vindo ao CT Bicas."}
          </h2>
          <p className="mt-3 text-lg text-ct-muted">
            {isRegistering
              ? "Junte-se ao CT Bicas e venha conhecer as melhores quadras da região!"
              : "Faça login para reservar sua quadra e entrar no jogo."}
          </p>
        </div>

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
                Celular (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(99) 99999-9999"
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
                <a
                  href="#"
                  className="text-xs text-ct-gold hover:text-ct-gold-hover hover:underline"
                >
                  Esqueceu a senha?
                </a>
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
            className="w-full mt-2 bg-ct-gold text-ct-dark font-bold py-4 px-6 rounded-xl hover:bg-ct-gold-hover focus:outline-none focus:ring-4 focus:ring-ct-gold/30 transition-all duration-150 cursor-pointer text-lg shadow-lg shadow-ct-gold/20"
          >
            {isRegistering ? "Cadastrar" : "Entrar no Sistema"}
          </button>
        </form>

        <div className="mt-12 text-center md:text-left text-sm text-ct-muted w-full max-w-md">
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
      </div>

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
