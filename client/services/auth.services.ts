import type { LoginProps } from "../types/LoginSignup";

const API = 'https://jwt-project-wpry.onrender.com' //import.meta.env.SERVER_URL;

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
      return response;
    }
    catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
}