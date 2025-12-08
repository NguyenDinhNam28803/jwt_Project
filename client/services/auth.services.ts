import type { LoginProps, SignupProps } from "../types/LoginSignup";

const API = import.meta.env.VITE_SERVER_URL;

export default class AuthServices {
  async login(data: LoginProps) {
    try {
      const response = await fetch(`${API}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      return result;
    }
    catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API}/api/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return response;
    }
    catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async signup(data: SignupProps) {
    try {
      const response = await fetch(`${API}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async getUserInfo(token: string) {
    try {
      const response = await fetch(`${API}/api/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result;
    }
    catch (error) {
      console.error("Get user info error:", error);
      throw error;
    }
  }
}