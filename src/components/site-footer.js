class SiteFooter extends HTMLElement {
    connectedCallback() {
        const year = new Date().getFullYear();

        this.innerHTML = `
        <footer>
            <p>Contacto: <a href="mailto:contact@heistcraft.com">contact@heistcraft.com</a><p/>
            <p>&copy; ${year} HeistCraft. Todos los derechos reservados.</p>
        </footer>`;
    }
}

customElements.define("site-footer", SiteFooter);
