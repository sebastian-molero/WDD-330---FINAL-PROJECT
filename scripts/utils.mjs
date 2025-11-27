export async function loadHeaderFooter() {
    await loadHeader();
    await loadFooter();
    toggleNav();
}

async function loadHeader() {
    const header = document.getElementById("header");
    const path = resolvePath("partials/header.html");
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("Failed to fetch header partial");
        const html = await response.text();
        header.innerHTML = html;
    }
    catch (error) {
        console.error(error);
    }
}

async function loadFooter() {
    const footer = document.getElementById("footer");
    const path = resolvePath("partials/footer.html");
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("Failed to fetch footer partial");
        const html = await response.text();
        footer.innerHTML = html;
    }
    catch (error) {
        console.error(error);
    }
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

function resolvePath(file) {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const repoName = pathParts.length > 1 ? pathParts[0] : null;

    const isIndex = window.location.pathname.endsWith("index.html");
    const isRootRepo = repoName !== null && window.location.pathname === `/${repoName}/`;
    const isRootLocal = window.location.pathname === "/";

    if (isIndex || isRootRepo || isRootLocal) {
        return file;
    }

    return "../" + file;
}