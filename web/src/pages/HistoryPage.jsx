import { useProtectedData } from "../hooks/useProtectedData";

export function HistoryPage() {
  const { data, loading, error } = useProtectedData("/history");

  if (loading) return <p>Carregando historico...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-grid">
      <section className="card">
        <div className="section-header">
          <h3>Leituras recentes</h3>
        </div>
        <div className="table-like">
          {data.scans.map((scan) => (
            <div className="table-row" key={scan.id}>
              <span>{scan.productName}</span>
              <span>{scan.barcode}</span>
              <strong>{new Date(scan.createdAt).toLocaleString("pt-BR")}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <h3>Compras</h3>
        </div>
        <div className="table-like">
          {data.purchases.map((purchase) => (
            <div className="table-row" key={purchase.id}>
              <span>{purchase.items.length} itens</span>
              <span>{purchase.paymentMethod}</span>
              <strong>R$ {purchase.total}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

