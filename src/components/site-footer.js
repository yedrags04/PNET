class SiteFooter extends HTMLElement {
    connectedCallback() {
        const year = new Date().getFullYear();

        this.innerHTML = `
        <footer>
            <p>&copy; ${year} HeistCraft. Todos los derechos reservados.</p>
        </footer>`;
    }
}

customElements.define('site-footer', SiteFooter);
