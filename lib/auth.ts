export const ALLOWED_DOMAIN = "pila.com.vn";
export const AUTH_KEY = "pila_auth_user";

export type AuthUser = {
  email: string;
  name: string;
  picture: string;
  token: string;
  exp: number;
};

export function saveUser(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    // Check token not expired
    if (Date.now() / 1000 > user.exp) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function removeUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function isAllowedDomain(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}
