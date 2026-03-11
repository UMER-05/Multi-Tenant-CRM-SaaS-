// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";




  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [token, setToken] = useState(savedToken);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getMe = async () => {
    try {
      const res = await api.get('/api/users/me');
      const updatedUser = res.data.data;
      //console.log('me', updatedUser)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      return updatedUser;
    } catch (error) {
      console.log(error)
  }
}
  useEffect(() => {
  if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      getMe()
    };
    setLoading(false)
    }, []);


  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      console.log("Login Response:", res);
      const token = res.data.data.token;

      if (token) {
        setToken(token);
        localStorage.setItem("token", token);
        await getMe()
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }



  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate('/login');

  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout ,getMe}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);