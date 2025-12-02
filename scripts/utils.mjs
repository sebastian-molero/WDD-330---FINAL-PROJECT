export async function loadHeaderFooter() {
    await loadHeader();
    await loadFooter();
    toggleNav();
}

const basePath = window.location.pathname.includes("/") ? "../" : "./";

async function loadHeader() {
    const header = document.getElementById("header");
    const response = await fetch(`${basePath}partials/header.html`);
    const html = await response.text();
    header.innerHTML = html;
}

async function loadFooter() {
    const footer = document.getElementById("footer");
    const response = await fetch(`${basePath}partials/footer.html`);
    const html = await response.text();
    footer.innerHTML = html;
}

function toggleNav() {
    const nav = document.getElementById("nav");
    const navToggle = document.getElementById("nav-toggle");

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle("active");
        nav.classList.toggle("active");
    })

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            navToggle.classList.remove("active");
            nav.classList.remove("active");
        }
        
    })
}