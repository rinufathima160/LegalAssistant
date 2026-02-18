const API_URL = "http://localhost:8000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // merge headers
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((v, k) => (headers[k] = v));
    } else if (!Array.isArray(options.headers)) {
      Object.assign(headers, options.headers);
    }
  }

  // attach JWT automatically
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // better error
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API Error");
  }

  // prevent crash when empty body
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}