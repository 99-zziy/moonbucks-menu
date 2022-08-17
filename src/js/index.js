const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
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

  this.init = () => {
    if (store.getLocalStorage()) this.menu = store.getLocalStorage();
    renderTemplate();
  };

  const $ = (selector) => document.querySelector(selector);

  const updateMenuCount = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const renderTemplate = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `
      <li data-menu-id = "${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">
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

  const addMenuName = () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") return alert("값을 입력해주세요.");

    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
    renderTemplate();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const editedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = editedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = editedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      e.target.closest("li").remove();
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      updateMenuCount();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    renderTemplate();
  };

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

  $("nav").addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      renderTemplate();
    }
  });
}

const app = new App();
app.init();
