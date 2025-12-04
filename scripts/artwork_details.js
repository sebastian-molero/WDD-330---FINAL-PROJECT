import { toggleNav, addFavorite } from "./utils.mjs";

const API_KEY = "e246cc08-eb1c-4847-9b96-e7ed8cdd50c6";

document.addEventListener("DOMContentLoaded", () => {
    toggleNav();
    displayArtworkDetails();
});

function getArtworkId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function displayArtworkDetails() {
    const id = getArtworkId();
    if (!id) return;

    try {
        const response = await fetch(`https://api.harvardartmuseums.org/object/${id}?apikey=${API_KEY}`);
        const artwork = await response.json();

        const title = artwork.title || "Untitled";
        const image = artwork.primaryimageurl || "../images/img_not_available.webp";
        const artist = artwork.people?.[0]?.name || "Unknown Artist";
        const year = artwork.accessionyear || "N/A";
        const classification = artwork.classification || "N/A";
        const description = artwork.description || "No description available.";

        document.getElementById("artworkTitle").textContent = title;
        const imgEl = document.getElementById("artworkImage");
        imgEl.src = image;
        imgEl.alt = title || "Artwork image";
        document.getElementById("artworkArtist").textContent = artist;
        document.getElementById("artworkYear").textContent = year;
        document.getElementById("artworkClassification").textContent = classification;
        document.getElementById("detailsDescription").textContent = description;

        const favBtn = document.getElementById("favArtworkBtn");
        if (favBtn) {
            favBtn.addEventListener("click", () => {
                const imgUrl = document.getElementById("artworkImage").src;
                addFavorite("artwork", id, title, imgUrl);
                favBtn.textContent = "Added to Favorites";
                favBtn.disabled = true;
            })
        }

    } catch (error) {
        console.error(error);
        document.getElementById("artworkTitle").textContent = "Failed to load artwork details.";
    }
}