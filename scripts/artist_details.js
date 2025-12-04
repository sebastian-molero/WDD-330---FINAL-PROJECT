import { toggleNav, addFavorite } from "./utils.mjs";

const API_BASE = "https://api.harvardartmuseums.org/person";
const API_KEY = "e246cc08-eb1c-4847-9b96-e7ed8cdd50c6";

document.addEventListener("DOMContentLoaded", () => {
    toggleNav();
    showArtistDetails();
});

async function showArtistDetails() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    const imgEl = document.getElementById("artistImage");
    const nameEl = document.getElementById("artistName");
    const cultureEl = document.getElementById("artistCulture");
    const datesEl = document.getElementById("artistDates");
    const bioEl = document.getElementById("artistBio");
    const favBtn = document.getElementById("favArtistBtn");

    if (!name) {
        nameEl.textContent = "No artist selected.";
        return;
    }


    try {
        const harvardUrl = `${API_BASE}?apikey=${API_KEY}&q=${encodeURIComponent(name)}&size=1`;
        const harvardRes = await fetch(harvardUrl);
        const harvardData = await harvardRes.json();
        const artist = harvardData.records?.[0] || {};

        const culture = artist.culture || "Culture not available";
        let dates = "Dates unknown";
        if (artist.birthyear || artist.deathyear) {
            dates = `${artist.birthyear || "?"} - ${artist.deathyear || "?"}`;
        }


        const wikiRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
        );
        const wikiData = await wikiRes.json();
        const imgUrl = wikiData.thumbnail?.source || "../images/img_not_available.webp";
        const bio = wikiData.extract || "No biography available.";

        imgEl.src = imgUrl;
        imgEl.alt = escapeHTML(name) || "Artist portrait"; 
        nameEl.textContent = escapeHTML(name);
        cultureEl.textContent = escapeHTML(culture);
        datesEl.textContent = escapeHTML(dates);
        bioEl.textContent = escapeHTML(bio);

        if (favBtn) {
            favBtn.addEventListener("click", () => {
                const imgUrl = document.getElementById("artistImage").src;
                addFavorite("artist", name, name, imgUrl);
                favBtn.textContent = "Added to Favorites";
                favBtn.disabled = true;
            })
        }
    } catch (error) {
        console.error(error);
        nameEl.textContent = "Sorry, we couldn't load artist details.";
    };
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[s]);
}
