import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function LoginForm() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegister) {
        await register({ ...form, role: "customer" });
      } else {
        await login(form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Varejo inteligente</p>
        <h1>Controle seu mercado em tempo real</h1>
        <p className="muted">Scanner, estoque, vendas, historico e operacao multiempresa em uma unica plataforma.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                Nome do admin
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>

              <label>
                Nome da empresa
                <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

          {error ? <div className="error-banner">{error}</div> : null}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <button className="text-button" type="button" onClick={() => setIsRegister((value) => !value)}>
          {isRegister ? "Ja tenho conta" : "Criar empresa e admin"}
        </button>
      </div>
    </div>
  );
}
