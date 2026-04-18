import { useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useProtectedData } from "../hooks/useProtectedData";

export function DashboardPage() {
  const { token, user, updateSession } = useAuth();
  const [renewing, setRenewing] = useState(false);
  const { data, loading, error, setData } = useProtectedData("/dashboard");

  async function renewSubscription() {
    setRenewing(true);

    try {
      const subscription = await api("/subscription/renew", {
        method: "POST",
        token,
      });

      setData((current) => ({
        ...current,
        subscription,
      }));
      updateSession({ subscription });
    } finally {
      setRenewing(false);
    }
  }

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p>{error}</p>;

  const metrics = useMemo(
    () => [
      { label: "Produtos", value: data.metrics.totalProducts },
      { label: "Vendas", value: `R$ ${data.metrics.totalSales}` },
      { label: "Estoque baixo", value: data.metrics.lowStock },
      { label: "Scans hoje", value: data.metrics.scansToday },
    ],
    [data.metrics]
  );

  return (
    <div className="page-grid">
      <section className="hero-banner">
        <div>
          <p className="eyebrow">Operacao em tempo real</p>
          <h2>{data.company.name}</h2>
        </div>
        <div>
          <p className="muted">
            Assinatura {data.subscription.plan} - status {data.subscription.status} - renova em{" "}
            {new Date(data.subscription.renewAt).toLocaleDateString("pt-BR")}
          </p>
          {user?.role === "admin" && (
            <button className="secondary-button" onClick={renewSubscription} disabled={renewing}>
              {renewing ? "Renovando..." : "Renovar assinatura"}
            </button>
          )}
        </div>
      </section>

      <section className="metrics-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="card">
        <div className="section-header">
          <h3>Estoque baixo</h3>
        </div>
        <div className="table-like">
          {data.lowStockProducts.map((product) => (
            <div className="table-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.category}</span>
              <strong>{product.stock} un.</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <h3>Compras recentes</h3>
        </div>
        <div className="table-like">
          {data.recentPurchases.map((purchase) => (
            <div className="table-row" key={purchase.id}>
              <span>{new Date(purchase.createdAt).toLocaleString("pt-BR")}</span>
              <span>{purchase.items.length} itens</span>
              <strong>R$ {purchase.total}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
