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