import type { UserInfo } from "../types/LoginSignup";

const API = "http://localhost:3000";

export default class UserService {
  async getUserInfo(token: string) {
    try {
      const response = await fetch(`${API}/api/user/info`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Get user info error:", error);
      throw error;
    }
  }

  async updateUserInfo(token: string, userInfo: Omit<UserInfo, "_id" | "__v">) {
    try {
      const response = await fetch(`${API}/api/user/info`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Update user info error:", error);
      throw error;
    }
  }
}
