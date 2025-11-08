export async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const res = await fetch("http://localhost:8000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      if (data.error || data.detail) {
        console.error(data.error || data.detail);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  }