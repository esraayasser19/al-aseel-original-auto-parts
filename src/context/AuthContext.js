import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "@/data/mockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Default to demo admin user so all pages (including protected profile, orders, admin dashboard) work out of the box
  const [user, setUser] = useState(mockUsers[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user stored in local storage
    const saved = localStorage.getItem("demo_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const login = async (email, password) => {
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    const loggedUser = found || {
      id: `usr-${Date.now()}`,
      name: email.split("@")[0] || "Demo Customer",
      email: email,
      phone: "+91 98765 43210",
      role: email.includes("admin") ? "admin" : "user",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    };
    setUser(loggedUser);
    localStorage.setItem("demo_user", JSON.stringify(loggedUser));
    return { user: loggedUser, session: { user: loggedUser } };
  };

  const register = async (name, email, password, phone) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || "Demo Customer",
      email: email,
      phone: phone || "+91 98765 43210",
      role: "user",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    };
    setUser(newUser);
    localStorage.setItem("demo_user", JSON.stringify(newUser));
    return { user: newUser, session: { user: newUser } };
  };

  const logout = async () => {
    setUser(false);
    localStorage.removeItem("demo_user");
  };

  const loginWithGoogle = async () => {
    return login("google.user@example.com", "password");
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("demo_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
