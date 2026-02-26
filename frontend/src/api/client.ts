const BASE_URL = "http://localhost:5000";

export async function apiFetch(
  path: string,
  userId: string,
  role: string,
  options?: {
    method?: string;
    body?: any;
  }
) {
  const response = await fetch(`http://localhost:5000${path}`, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
      "x-user-role": role,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}