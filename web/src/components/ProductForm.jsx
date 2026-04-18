import { useEffect, useState } from "react";

const initialState = {
  name: "",
  barcode: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
};

export function ProductForm({ onSave, initialValues }) {
  const [form, setForm] = useState(initialValues || initialState);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialValues || initialState);
    setFile(null);
  }, [initialValues]);

  function handleChange(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="card form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
          await onSave(form, file);
          setForm(initialState);
          setFile(null);
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="section-header">
        <h3>{initialValues ? "Editar produto" : "Novo produto"}</h3>
      </div>

      <label>
        Nome
        <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </label>

      <label>
        Codigo de barras
        <input value={form.barcode} onChange={(e) => handleChange("barcode", e.target.value)} required />
      </label>

      <label>
        Preco
        <input type="number" step="0.01" value={form.price} onChange={(e) => handleChange("price", e.target.value)} required />
      </label>

      <label>
        Estoque
        <input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} />
      </label>

      <label>
        Categoria
        <input value={form.category} onChange={(e) => handleChange("category", e.target.value)} />
      </label>

      <label>
        Imagem URL
        <input value={form.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} />
      </label>

      <label>
        Upload de imagem
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>

      <label>
        Descricao
        <textarea rows="4" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
      </label>

      <button className="primary-button" type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}
