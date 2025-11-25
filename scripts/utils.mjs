export function loadHeaderFooter() {
    loadHeader();
    loadFooter();
}

async function loadHeader() {
    const header = document.getElementById("header");
    const response = await fetch("partials/header.html");
    const html = await response.text();
    header.innerHTML = html;
}

async function loadFooter() {
    const footer = document.getElementById("footer");
    const response = await fetch("partials/footer.html");
    const html = await response.text();
    footer.innerHTML = html;
}