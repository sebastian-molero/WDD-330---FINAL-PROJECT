const API_BASE = "https://api.harvardartmuseums.org/object";
const API_KEY = "e246cc08-eb1c-4847-9b96-e7ed8cdd50c6";

export async function fetchFeatured() {
    const randomPage = Math.floor(Math.random() * 50);
    const params = new URLSearchParams({
        apikey: API_KEY,
        size: "100",
        hasimage: "1",
        classification: "Paintings",
        sort: "rank",
        sortorder: "desc",
    });

    const url = `${API_BASE}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch featured artworks");

    const data = await response.json(); 
    const records = data.records?.filter(r => r.primaryimageurl) ?? [];

    return shuffle(records).slice(0, 6);
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}