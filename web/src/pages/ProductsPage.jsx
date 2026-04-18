import { useState } from "react";
import { api } from "../api/client";
import { ProductForm } from "../components/ProductForm";
import { useAuth } from "../contexts/AuthContext";
import { useProtectedData } from "../hooks/useProtectedData";

export function ProductsPage() {
  const { token, user } = useAuth();
  const { data, setData, loading, error } = useProtectedData("/products");
  const [status, setStatus] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  async function handleSave(values, file) {
    let imageUrl = values.imageUrl;

    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const upload = await api("/products/upload", {
        method: "POST",
        token,
        body: formData,
      });
      imageUrl = upload.imageUrl;
    }

    const payload = {
      ...values,
      imageUrl,
      price: Number(values.price),
      stock: Number(values.stock),
    };

    if (editingProduct) {
      const updated = await api(`/products/${editingProduct.id}`, {
        method: "PUT",
        token,
        body: payload,
      });
      setData((current) => current.map((product) => (product.id === updated.id ? updated : product)));
      setEditingProduct(null);
      setStatus("Produto atualizado com sucesso.");
    } else {
      const created = await api("/products", {
        method: "POST",
        token,
        body: payload,
      });
      setData((current) => [created, ...(current || [])]);
      setStatus("Produto cadastrado com sucesso.");
    }
  }

  async function removeProduct(id) {
    await api(`/products/${id}`, {
      method: "DELETE",
      token,
    });
    setData((current) => current.filter((product) => product.id !== id));
  }

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-grid two-columns">
      {(user?.role === "admin" || user?.role === "employee") && (
        <ProductForm onSave={handleSave} initialValues={editingProduct} />
      )}

      <section className="card">
        <div className="section-header">
          <h3>Catalogo</h3>
          {status ? <span className="status-pill">{status}</span> : null}
        </div>
        <div className="products-grid">
          {data.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.imageUrl || "https://via.placeholder.com/300x200"} alt={product.name} />
              <div>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span>{product.category}</span>
                  <span>{product.barcode}</span>
                </div>
                <div className="product-footer">
                  <strong>R$ {product.price}</strong>
                  <span>{product.stock} em estoque</span>
                </div>
                {(user?.role === "admin" || user?.role === "employee") && (
                  <button className="secondary-button" onClick={() => setEditingProduct(product)}>
                    Editar
                  </button>
                )}
                {user?.role === "admin" && (
                  <button className="danger-button" onClick={() => removeProduct(product.id)}>
                    Excluir
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
