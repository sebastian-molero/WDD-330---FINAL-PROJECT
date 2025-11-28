import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const API_BASE = "https://api.harvardartmuseums.org/object";
const API_KEY = "e246cc08-eb1c-4847-9b96-e7ed8cdd50c6";

let currentPage = 1;
let lastQuery = "";
let lastClassification = "";

const searchForm = document.getElementById("searchForm");
const grid = document.getElementById("resultsGrid");
const pagination = document.getElementById("pagination");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  lastQuery = document.getElementById("query").value;
  lastClassification = document.getElementById("classification").value;
  currentPage = 1;
  await fetchResults();
});

async function fetchResults() {
    const orderBy = document.getElementById("orderBy").value;
    const orderDirection = document.getElementById("orderDirection").value;

    const params = new URLSearchParams({
        apikey: API_KEY,
        size: "20",
        page: currentPage,
        hasimage: "1",
        keyword: lastQuery,
        classification: lastClassification,
        sort: orderBy,
        sortorder: orderDirection,
    });

    const url = `${API_BASE}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch results");

    const data = await response.json();
    let records = Array.isArray(data.records) ? data.records : [];

    if (records.length === 0) {
        grid.innerHTML = "<p>No results found.</p>";
        return;
    }
    grid.innerHTML = data.records.map(toCardHTML).join("");
    renderPagination(data.info.pages);
}

function toCardHTML(record) {
    return `
    <a href="../details/artwork_details.html?id=${record.id}" class="result-card">
      <img src="${record.primaryimageurl || '../images/img_not_available.webp'}" alt="${record.title}">
      <h3>${record.title}</h3>
      <p>${record.people?.[0]?.name ?? "Unknown Artist"}</p>
    </a>
  `;
}

function renderPagination(totalPages) {
  pagination.innerHTML = "";


  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", () => {
      currentPage--;
      fetchResults();
    });
    pagination.appendChild(prevBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      currentPage++;
      fetchResults();
    });
    pagination.appendChild(nextBtn);
  }
}