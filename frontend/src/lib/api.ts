const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("smartplacement_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
};

export const api = {
  async get(path: string) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return parseResponse(response);
  },

  async post(path: string, body: Record<string, unknown>) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parseResponse(response);
  },

  async postForm(path: string, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: formData,
    });
    return parseResponse(response);
  },
};

export default API_BASE_URL;
