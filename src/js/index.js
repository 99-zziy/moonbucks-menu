import { $ } from "./utils/dom.js";
import store from "./store/index.js";

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

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    renderTemplate();
    initEventListeners();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const renderTemplate = () => {
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `
      <li data-menu-id = "${
        item.id
      }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">
          ${item.name}
        </span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
          삭제
        </button>
      </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") return alert("값을 입력해주세요.");

    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    renderTemplate();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const editedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, menuId, editedMenuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    renderTemplate();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.removeMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      );
      renderTemplate();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    renderTemplate();
  };

  const initEventListeners = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;
      addMenuName();
    });

    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button"))
        return updateMenuName(e);
      if (e.target.classList.contains("menu-remove-button"))
        return removeMenuName(e);
      if (e.target.classList.contains("menu-sold-out-button"))
        return soldOutMenu(e);
    });

    $("nav").addEventListener("click", async (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory
        );
        renderTemplate();
      }
    });
  };
}

const app = new App();
app.init();
