import { toggleNav } from "./utils.mjs";
import { fetchFeatured } from "./api.harvard.mjs";

async function loadTemplate(path, parentElement) {
    const response = await fetch(path);
    const html = await response.text();
    parentElement.innerHTML = html;
}

async function loadHeaderFooter() {
    const headerPath = "partials/header.html";
    const footerPath = "partials/footer.html";

    const header = document.getElementById("header");
    const footer = document.getElementById("footer");

    await loadTemplate(headerPath, header);
    await loadTemplate(footerPath, footer);

    toggleNav();
}

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("featuredWorks");
    if (!grid) return;

    grid.innerHTML = "<p>Loading...</p>";

    try {
        const record = await fetchFeatured();
        grid.innerHTML = record.map(toCardHTML).join("");
    }
    catch (error) {
        console.error(error);
        grid.innerHTML = "<p>Failed to load featured artworks.</p>";
    }
});

function toCardHTML(record) {
    const title = record.title ?? "Untitled";
    const artist = record.people?.[0]?.name ?? "Unknown Artist";
    const image = record.primaryimageurl;
    const date = record.dated ?? "";

    return `
        <article class="featured-card">
            <img src="${image}" alt="${escapeHTML(title)}">
            <div class="meta">
                <h3>${escapeHTML(title)}</h3>
                <p><strong>Artist:</strong> ${escapeHTML(artist)}</p>
                <p><strong>Date:</strong> ${escapeHTML(date)}</p>
            </div>
        </article>
    `
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[s])
}