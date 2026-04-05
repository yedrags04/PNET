class SiteHeader extends HTMLElement {
    connectedCallback() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        const links = [
            { href: "index.html", label: "INICIO", icon: "house" },
            { href: "bancos.html", label: "BANCOS", icon: "landmark" },
            { href: "utensilios.html", label: "UTENSILIOS", icon: "wrench" },
            { href: "FAQ.html", label: "FAQ", icon: "circle-help" },
        ];

        const navLinks = links
            .map(({ href, label, icon }) => {
                const isActive = currentPage === href;
                return `<a href="${href}"${isActive ? ' class="active"' : ""}><i data-lucide="${icon}"></i> ${label}</a>`;
            })
            .join("\n");

        this.innerHTML = `
        <header>
            <a href="index.html"><h1>HeistCraft</h1></a>
            <button id="menu-toggle" class="menu-toggle">
                <i data-lucide="menu"></i>
            </button>
            <nav id="main-nav"> 
                ${navLinks}
            </nav>
        </header>
        `;

        const renderIcons = () => {
            if (window.lucide?.createIcons) {
                window.lucide.createIcons();
            }
        };

        renderIcons();

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
                if (mainNav.classList.contains("open")) {
                    menuToggle.innerHTML = '<i data-lucide="x"></i>';
                } else {
                    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                }

                renderIcons();
            });
        }
    }
}

customElements.define("site-header", SiteHeader);
