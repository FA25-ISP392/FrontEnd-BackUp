const API_CONFIG = {
  USE_PROXY: true,

  BASE_URL: "https://isp392-production.up.railway.app",

  ENDPOINTS: {},
};

API_CONFIG.ENDPOINTS = {
  LOGIN: API_CONFIG.USE_PROXY ? "/api/auth/token" : "/isp392/auth/token",
};

const LOGIN_API_URL = API_CONFIG.USE_PROXY
  ? API_CONFIG.ENDPOINTS.LOGIN
  : API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN;

export const createApiUrl = (endpointKey) => {
  if (API_CONFIG.USE_PROXY) {
    return API_CONFIG.ENDPOINTS[endpointKey];
  } else {
    return API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS[endpointKey];
  }
};

export const createCustomApiUrl = (customEndpoint) => {
  if (API_CONFIG.USE_PROXY) {
    return customEndpoint.replace(/^\/isp392\/staff/, "/api");
  } else {
    return API_CONFIG.BASE_URL + customEndpoint;
  }
};

export { API_CONFIG };

export const roleRoutes = {
  ADMIN: "/admin",
  MANAGER: "/manager",
  STAFF: "/staff",
  CHEF: "/chef",
};

export const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const determineRedirectPath = (username) => {
  if (username.toLowerCase().includes("admin")) {
    return "/admin";
  } else if (username.toLowerCase().includes("manager")) {
    return "/manager";
  } else if (username.toLowerCase().includes("staff")) {
    return "/staff";
  } else if (username.toLowerCase().includes("chef")) {
    return "/chef";
  }
  return "/admin"; // Default
};

export const apiLogin = async (username, password) => {
  console.log("🔍 DEBUG - Starting API login for:", username);

  console.log("🔍 DEBUG - Calling API:", LOGIN_API_URL);
  const response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!response.ok) {
    console.log("🔍 DEBUG - Error Response Status:", response.status);
    let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";

    try {
      const errorData = await response.json();
      console.log("🔍 DEBUG - Error Response Data:", errorData);
      errorMessage = errorData.message || errorMessage;
    } catch (parseError) {
      console.log("🔍 DEBUG - Cannot parse error response:", parseError);
      errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
    }

    throw new Error(errorMessage);
  }

  const userData = await response.json();
  console.log("🔍 DEBUG - Full API Response:", userData);
  console.log("🔍 DEBUG - Response code:", userData.code);
  console.log("🔍 DEBUG - Response result:", userData.result);

  if (
    (userData.code !== 1000 && userData.code !== 0) ||
    !userData.result ||
    !userData.result.authenticated ||
    !userData.result.token
  ) {
    console.log("🔍 DEBUG - Authentication failed or no token");
    console.log("🔍 DEBUG - Code:", userData.code);
    console.log("🔍 DEBUG - Result:", userData.result);
    throw new Error("Xác thực thất bại. Vui lòng thử lại.");
  }

  console.log("🔍 DEBUG - Authentication successful, token received");

  const decodedToken = decodeJWT(userData.result.token);
  console.log("🔍 DEBUG - Decoded JWT:", decodedToken);

  return {
    username,
    authenticated: userData.result.authenticated,
    token: userData.result.token,
    decodedToken,
  };
};

export const saveUserInfo = (userInfo) => {
  localStorage.setItem("user", JSON.stringify(userInfo));
  localStorage.setItem("token", userInfo.token);
  console.log("🔍 DEBUG - User info saved to localStorage");
};

export const redirectUser = (username) => {
  const redirectPath = determineRedirectPath(username);
  console.log("🔍 DEBUG - Redirecting to:", redirectPath);
  window.location.href = redirectPath;
};
