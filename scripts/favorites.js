import { toggleNav, getFavorites, removeFavorite, clearFavorites } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
    toggleNav();
    renderFavorites();

    document.getElementById("clearFavorites").addEventListener("click", () => {
        clearFavorites();
        renderFavorites();
    });
});

function renderFavorites() {
    const grid = document.getElementById("favoritesGrid");
    if (!grid) return;

    const favorites = getFavorites();
    if (favorites.length === 0) {
        grid.innerHTML = "<p>No favorites found.</p>";
        return;
    }

    grid.innerHTML = favorites.map(fav => `
            <div class="favorite-card">
                <img src="${fav.image}" alt="${fav.title || "Favorite image"}" class="fav-image">
                <h3>${fav.title}</h3>
                <p>Type: ${fav.type}</p>
                <button class="remove-btn" data-type="${fav.type}" data-id="${fav.idOrName}">Remove</button>
            </div>
        `).join("");
    
    grid.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            removeFavorite(btn.dataset.type, btn.dataset.id);
            renderFavorites();
        });
    });
}

