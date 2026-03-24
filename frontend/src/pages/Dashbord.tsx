import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    // Remove o token do navegador
    localStorage.removeItem("@ArenaSaaS:token");
    // Manda o usuário de volta para o login
    navigate("/");
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1>Bem-vindo à Arena CT Bicas! 🎾</h1>
      <p>Aqui ficará o calendário e a lista de quadras.</p>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px",
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </div>
  );
}
