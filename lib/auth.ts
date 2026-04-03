const KEY = "pila_auth";

export const isAuthenticated = () =>
  typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1";

export const setAuth = () => sessionStorage.setItem(KEY, "1");

export const clearAuth = () => sessionStorage.removeItem(KEY);
