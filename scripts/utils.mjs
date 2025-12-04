export function toggleNav() {
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

const STORAGE_KEY = "favorites";

export function getFavorites() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function addFavorite(type, idOrName, title, image="../images/img_not_available.webp") {
    const favorites = getFavorites();

    if (favorites.some(f => f.idOrName === idOrName && f.type === type)) return;

    favorites.push({ type, idOrName, title, image });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function removeFavorite(type, idOrName) {
    const favorites = getFavorites().filter(
        f => !(f.type === type && f.idOrName === idOrName)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function clearFavorites() {
    localStorage.removeItem(STORAGE_KEY);
}