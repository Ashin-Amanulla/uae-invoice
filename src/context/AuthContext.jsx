import { createContext, useContext, useState, useEffect } from "react";

// Initial user for demo purposes
const demoUser = {
  id: "1",
  name: "Demo User",
  email: "demo@example.com",
  company: "UAE Chemicals Ltd.",
  address: "Dubai, UAE",
  phone: "+971 4 123 4567",
  trn: "123456789012345", // Tax Registration Number
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login for demo purposes
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // For demonstration purposes, we'll use a simple login/logout
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating successful login
      if (email === "demo@example.com" && password === "password") {
        setUser(demoUser);
        localStorage.setItem("user", JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
