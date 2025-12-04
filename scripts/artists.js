import { toggleNav, addFavorite } from "./utils.mjs";

const API_BASE = "https://api.harvardartmuseums.org/person";
const API_KEY = "e246cc08-eb1c-4847-9b96-e7ed8cdd50c6";

let currentPage = 1;
let totalPages = 1;
let currentQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    toggleNav();
    
    const searchForm = document.getElementById("artistSearchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", e => {
            e.preventDefault();
            currentQuery = document.getElementById("artistSearchInput").value.trim();
            currentPage = 1;
            fetchArtists();
        });
    }
    
    fetchArtists();
});

document.addEventListener("click", e => {
    if (e.target.classList.contains("fav-btn")) {
        const { type, id, title, image } = e.target.dataset;
        addFavorite(type, id, title, image);

        e.target.textContent = "Added to Favorites";
        e.target.disabled = true;
    }
})

async function fetchArtists() {
    const grid = document.getElementById("resultsGrid");
    const pagination = document.getElementById("pagination");
    if (!grid || !pagination) return;

    grid.innerHTML = "<p>Loading...</p>";

    try {
        const params = new URLSearchParams({
            apikey: API_KEY,
            size: "20",
            page: String(currentPage),
        });
        if (currentQuery) params.set("q", currentQuery);

        const url = `${API_BASE}?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch artists");

        const data = await response.json();
        const records = Array.isArray(data.records) ? data.records : [];
        totalPages = data.info?.pages || 1;

        if (records.length === 0) {
            grid.innerHTML = "<p>No artists found.</p>";
            pagination.innerHTML = "";
            return;
        }

        const cards = await Promise.all(records.map(async (artist) => {
            const name = artist.displayname || "Unknown Artist";
            const culture = artist.culture || "Culture not available";

            let dates = "";
            if (artist.birthyear || artist.deathyear) {
                dates = `${artist.birthyear || "?"} - ${artist.deathyear || "?"}`;
            } else {
                dates = "Dates unknown";
            }

            const imgUrl = await fetchArtistImage(name);

            return `
                <div class="result-card">
                    <a href="../details/artist_details.html?name=${encodeURIComponent(name)}" target="_blank">
                        <img src="${imgUrl}" alt="${escapeHTML(name) || "Artist potrait"}">
                        <h3>${escapeHTML(name)}</h3>
                        <p>${escapeHTML(culture)}</p>
                        <p>${dates}</p>
                    </a>
                    <button class="fav-btn"
                        data-type="artist"
                        data-id="${escapeHTML(name)}" 
                        data-title="${escapeHTML(name)}" 
                        data-image="${imgUrl}">
                        Add to Favorites
                    </button>
                </div>
            `;
        }));

        grid.innerHTML = cards.join("");
        renderPagination();
    } catch (error) {
        console.error(error);
        grid.innerHTML = "<p>Sorry, we couldn't load artists. Please try again later.</p>";
        document.getElementById("pagination").innerHTML = "";
    }
}

function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (currentPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.addEventListener("click", () => {
            currentPage--;
            fetchArtists();
        });
        pagination.appendChild(prevBtn);
    }

    if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.addEventListener("click", () => {
            currentPage++;
            fetchArtists();
        });
        pagination.appendChild(nextBtn);
    }
}

async function fetchArtistImage(name) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
        );
        if (!response.ok) return "../images/img_not_available.webp";

        const data = await response.json();
        return data.thumbnail?.source || "../images/img_not_available.webp";
    } catch {
        return "../images/img_not_available.webp";
    }
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[s]);
}
