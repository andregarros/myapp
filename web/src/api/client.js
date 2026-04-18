const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function api(path, { method = "GET", token, body, signal } = {}) {
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const hasJsonBody = contentType.includes("application/json");
  const data = hasJsonBody ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Erro na requisicao.");
  }

  return data;
}
