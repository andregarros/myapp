import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useProtectedData } from "../hooks/useProtectedData";

export function NotificationsPage() {
  const { token } = useAuth();
  const { data, setData, loading, error } = useProtectedData("/notifications");

  async function markAsRead(id) {
    const updated = await api(`/notifications/${id}/read`, {
      method: "PATCH",
      token,
    });
    setData((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  if (loading) return <p>Carregando notificacoes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="card">
      <div className="section-header">
        <h3>Alertas operacionais</h3>
      </div>

      <div className="notifications-list">
        {data.map((notification) => (
          <article className={`notification-card ${notification.read ? "read" : ""}`} key={notification.id}>
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>
            {!notification.read && (
              <button className="secondary-button" onClick={() => markAsRead(notification.id)}>
                Marcar como lida
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

