import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

import logoCt from "../assets/ct-bicas-removebg-preview.png";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      localStorage.setItem("@ArenaSaaS:token", token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("E-mail ou senha inválidos. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50">
        <div className="text-center mb-10 flex flex-col items-center">
          <img
            src={logoCt}
            alt="Logo CT BICAS"
            className="w-24 h-24 object-contain mb-5 drop-shadow-md"
          />
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
            CT BICAS
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Entre para agendar sua partida.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 cursor-pointer"
          >
            Entrar no Sistema
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Cadastre-se grátis
          </a>
          .
        </p>
      </div>
    </div>
  );
}
