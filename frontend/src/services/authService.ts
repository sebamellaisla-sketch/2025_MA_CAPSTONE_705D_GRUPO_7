export const getCurrentUser = async (token: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("No autorizado");
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};