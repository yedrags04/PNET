class SiteHeader extends HTMLElement {
    connectedCallback() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        const links = [
            { href: "index.html", label: "INICIO" },
            { href: "bancos.html", label: "BANCOS" },
            { href: "utensilios.html", label: "UTENSILIOS" },
            { href: "FAQ.html", label: "FAQ" },
        ];

        const navLinks = links
            .map(({ href, label }) => {
                const isActive = currentPage === href;
                return `<a href="${href}"${isActive ? ' class="active"' : ""}>${label}</a>`;
            })
            .join("\n");

        this.innerHTML = `
        <header>
            <a href="index.html"><h1>HeistCraft</h1></a>
            <button id="menu-toggle" class="menu-toggle">
                <i class="hgi hgi-stroke hgi-menu-01"></i>
            </button>
            <nav id="main-nav"> 
                ${navLinks}
            </nav>
        </header>
        `;

        // --- MAGIA DEL MENÚ HAMBURGUESA ---
        // Buscamos el botón y el menú recién creados
        const menuToggle = this.querySelector("#menu-toggle");
        const mainNav = this.querySelector("#main-nav");

        // Si los encuentra, le decimos qué hacer al hacer clic
        if (menuToggle && mainNav) {
            menuToggle.addEventListener("click", () => {
                // Abre o cierra el menú
                mainNav.classList.toggle("open");

                // Cambia el icono de las 3 rayitas a la X
                const icon = menuToggle.querySelector("i");
                if (mainNav.classList.contains("open")) {
                    icon.className = "hgi hgi-stroke hgi-cancel-01";
                } else {
                    icon.className = "hgi hgi-stroke hgi-menu-01";
                }
            });
        }
    }
}

customElements.define("site-header", SiteHeader);
