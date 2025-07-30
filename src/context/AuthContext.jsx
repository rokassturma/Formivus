import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/me`, { withCredentials: true })
      .then((res) => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
