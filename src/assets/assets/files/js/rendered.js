let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let navList = document.querySelector(".nav-list");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    navList.classList.toggle("scroll");
    menuBtnChange(); //calling the function(optional)
});

searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search icon
    sidebar.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
});

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the icons class
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the icons class
    }
}