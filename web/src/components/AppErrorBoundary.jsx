import { Component } from "react";

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Erro ao renderizar a aplicacao:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="auth-page">
          <div className="auth-card">
            <p className="eyebrow">Falha na interface</p>
            <h1>Não conseguimos carregar a aplicação.</h1>
            <p className="muted">
              Atualize a página. Se continuar, limpe os dados do site no navegador e tente novamente.
            </p>
            <div className="error-banner">{this.state.error.message || "Erro inesperado."}</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
