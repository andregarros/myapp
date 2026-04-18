import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginForm } from "./components/LoginForm";
import { useAuth } from "./contexts/AuthContext";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then((module) => ({ default: module.ProductsPage })));
const HistoryPage = lazy(() => import("./pages/HistoryPage").then((module) => ({ default: module.HistoryPage })));
const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage").then((module) => ({ default: module.NotificationsPage }))
);

function ProtectedApp() {
  return (
    <Layout>
      <Suspense fallback={<p>Carregando pagina...</p>}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <ProtectedApp /> : <LoginForm />;
}
