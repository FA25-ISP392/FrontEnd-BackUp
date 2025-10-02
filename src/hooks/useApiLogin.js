import { useState } from "react";
import { apiLogin, saveUserInfo, redirectUser } from "../lib/apiLogin";

export const useApiLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (username, password) => {
    // Reset state
    setError("");
    setIsLoading(true);
    
    // Validation
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      setIsLoading(false);
      return;
    }

    try {
      // Call API login function from lib
      const userInfo = await apiLogin(username, password);
      
      // Save user info to localStorage
      saveUserInfo(userInfo);
      
      // Redirect user to appropriate page
      redirectUser(username);
      
    } catch (error) {
      // Handle all errors (API errors, network errors, etc.)
      console.log("🔍 DEBUG - Login Error:", error.message);
      
      if (error.message.includes("Failed to fetch")) {
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error
  };
};
