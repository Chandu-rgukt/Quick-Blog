import { useContext, createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
});

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [blog, setBlog] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try {
      const {data} = await axiosInstance.get("/api/blogs/all");
      data.success ? setBlog(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
    const token = localStorage.getItem("token");
    if(token){
      setToken(token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const value = {
    axios: axiosInstance,
    navigate,
    token,
    setToken,
    blog,
    setBlog,
    input,
    setInput,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};