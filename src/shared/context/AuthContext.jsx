import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginRequest } from "@/features/auth/api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser && storedUser !== "undefined")
      setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await loginRequest(credentials);

      const isAdmin = data.user?.roles?.includes("admin");

      if (!isAdmin) {
        throw "Invalid credentials";
      }

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      throw (
        error.response?.data?.message ??
        error.message ??
        "An error occurred during login."
      );
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  /**
   * Returns true if the logged-in user has ALL of the supplied permission
   * strings. Pass a single string or an array of strings.
   * When no permissions are configured on the user object every check
   * returns true so existing behaviour is preserved for super-admins.
   */
  const hasPermission = useCallback(
    (...perms) => {
      const flat = perms.flat();
      const userPerms = user?.permissions;
      // No permission list on the user → treat as unrestricted (super-admin).
      if (!userPerms || !Array.isArray(userPerms)) return true;
      return flat.every((p) => userPerms.includes(p));
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
