const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length >= 1)
      this.menu = store.getLocalStorage();
    renderTemplate();
  };
  const $ = (selector) => document.querySelector(selector);

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const renderTemplate = () => {
    const template = this.menu
      .map((item, index) => {
        return `
      <li data-menu-id = "${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
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

    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
  };

  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;
    if (espressoMenuName === "") return alert("값을 입력해주세요.");

    this.menu.push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    renderTemplate();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const editedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    this.menu[menuId].name = editedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = editedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      e.target.closest("li").remove();
      this.menu.splice(menuId, 1);
      store.setLocalStorage(this.menu);
      updateMenuCount();
    }
  };

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;
    addMenuName();
  });

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) updateMenuName(e);
    if (e.target.classList.contains("menu-remove-button")) removeMenuName(e);
  });
}

const app = new App();
app.init();
