import { loadHeaderFooter } from "./utils.mjs";

const API_KEY = "e246cc08-eb1c-4847-9b96-e7ed8cdd50c6";

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
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

        document.getElementById("artworkTitle").textContent = artwork.title || "Untitled";
        document.getElementById("artworkImage").src = artwork.primaryimageurl || "../images/img_not_available.webp";
        document.getElementById("artworkArtist").textContent = artwork.people?.[0]?.name || "Unknown Artist";
        document.getElementById("artworkYear").textContent = artwork.accessionyear || "N/A";
        document.getElementById("artworkClassification").textContent = artwork.classification || "N/A";
        document.getElementById("detailsDescription").textContent = artwork.description || "No description available.";
    }
    catch (error) {
        console.error(error);
    }
}