class SiteHeader extends HTMLElement {
    connectedCallback() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const links = [
            { href: 'index.html', label: 'INICIO' },
            { href: 'bancos.html', label: 'BANCOS' },
            { href: 'utensilios.html', label: 'UTENSILIOS' },
            { href: 'FAQ.html', label: 'FAQ' },
        ];

        const navLinks = links
            .map(({ href, label }) => {
                const isActive = currentPage === href;
                return `<a href="${href}"${isActive ? ' class="active"' : ''}>${label}</a>`;
            })
            .join('\n');

        this.innerHTML = `
        <header>
            <a href="index.html"><h1>HeistCraft</h1></a>
            <nav>
                ${navLinks}
            </nav>
        </header>
        `;
    }
}

customElements.define('site-header', SiteHeader);
