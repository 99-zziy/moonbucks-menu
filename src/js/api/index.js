const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "GET",
    });
    return response.json();
  },
  async createMenu(category, name) {
    await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
  },
  async updateMenu(category, menuId, name) {
    await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
  },
  async toggleSoldOutMenu(category, menuId) {
    await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
      method: "PUT",
    });
  },
  async removeMenu(category, menuId) {
    await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: "DELETE",
    });
  },
};

export default MenuApi;
