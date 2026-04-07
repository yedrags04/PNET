document.addEventListener("DOMContentLoaded", function () {
    const renderLucideIcons = () => {
        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }
    };

    // =========================================
    // BANCOS: FILTROS Y ESTADO
    // =========================================
    const filtersToggle = document.getElementById("filters-toggle");
    const filtersContent = document.getElementById("filters-content");

    if (filtersToggle && filtersContent) {
        filtersToggle.addEventListener("click", () => {
            filtersContent.classList.toggle("open");
            filtersToggle.classList.toggle("open");
        });
    }

    // estado en memoria para pintar bancos y reservas.
    const bancosState = [];
    const reservasState = [];
    let reservationByBankId = new Map();

    updateReservationStatus();

    const rango = document.getElementById("reward");
    const out = document.getElementById("reward-output");
    if (rango && out) {
        out.textContent = rango.value;
        rango.addEventListener("input", () => {
            out.textContent = rango.value;
            filterBanks();
        });
    }

    const locationInput = document.getElementById("location");
    const difficultySelect = document.getElementById("difficulty");
    const availabilitySelect = document.getElementById("availability");

    if (locationInput) locationInput.addEventListener("input", filterBanks);
    if (difficultySelect) difficultySelect.addEventListener("change", filterBanks);
    if (availabilitySelect) availabilitySelect.addEventListener("change", filterBanks);

    const btnSearch = document.getElementById("btn-remove-filters");
    if (btnSearch) {
        btnSearch.addEventListener("click", () => {
            if (locationInput) locationInput.value = "";
            if (difficultySelect) difficultySelect.value = "";
            if (availabilitySelect) availabilitySelect.value = "todos";
            if (rango) {
                rango.value = rango.max || 1000;
                if (out) out.textContent = rango.value;
            }
            filterBanks();
        });
    }

    function filterBanks() {
        const location = document.getElementById("location")?.value.toLowerCase() || "";
        const difficulty = document.getElementById("difficulty")?.value || "";
        const maxReward = parseInt(document.getElementById("reward")?.value) || 0;
        const availability = document.getElementById("availability")?.value || "todos";

        const cards = document.querySelectorAll("main .card");

        cards.forEach((card) => {
            const cardAddress = card.dataset.address?.toLowerCase() || "";
            const cardDifficulty = card.dataset.difficulty?.toLowerCase() || "";
            const cardReward = parseInt(card.dataset.reward) || 0;
            const cardAvailable = card.dataset.available?.toLowerCase() || "";

            const matches =
                (!location || cardAddress.includes(location)) &&
                (!difficulty || cardDifficulty === difficulty) &&
                cardReward <= maxReward &&
                (availability === "todos" || cardAvailable === availability);

            card.classList.toggle("hidden", !matches);
        });
    }

    function rebuildReservationsIndex() {
        // índice O(1) para resolver reserva por bankId.
        reservationByBankId = new Map();
        reservasState.forEach((reservation) => {
            if (reservation?.bankId) {
                reservationByBankId.set(String(reservation.bankId), reservation);
            }
        });
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function resetFormEditingState() {
        const $form = $("#heist-form");
        if (!$form.length) return;

        $form.removeAttr("data-editing-id");
        $form.removeAttr("data-created-at");
    }

    function closeFormDialog() {
        const modalFormOverlay = document.getElementById("modal-form-overlay");
        const heistForm = document.getElementById("heist-form");

        if (!modalFormOverlay) return;

        modalFormOverlay.classList.add("is-closing");
        modalFormOverlay.addEventListener(
            "animationend",
            () => {
                modalFormOverlay.classList.remove("is-closing");
                modalFormOverlay.close();
            },
            { once: true },
        );

        if (heistForm) heistForm.reset();
        resetFormEditingState();
    }

    function renderBanksList() {
        const $grid = $("#banks-grid");
        if (!$grid.length) return;

        $grid.empty();

        bancosState.forEach((bank) => {
            const available = bank.available ? "si" : "no";
            const cardHtml = `
                <article
                    class="card"
                    data-bank-id="${escapeHtml(bank._id)}"
                    data-address="${escapeHtml(bank.address)}"
                    data-difficulty="${escapeHtml(bank.difficulty)}"
                    data-reward="${escapeHtml(bank.reward)}"
                    data-available="${available}"
                    data-original-available="${available}"
                >
                    <img
                        class="photos"
                        src="${escapeHtml(bank.image)}"
                        alt="${escapeHtml(bank.name)}"
                        width="300"
                    />
                    <h3>${escapeHtml(bank.name)}</h3>
                    <div class="card-actions">
                        <button class="more-info">Más info</button>
                        <button class="btn-edit" title="Editar reserva">
                            <i data-lucide="pencil"></i>
                        </button>
                    </div>
                </article>
            `;

            $grid.append(cardHtml);
        });

        renderLucideIcons();
    }

    function renderBankSelect() {
        const $bankSelect = $("#bank-select");
        if (!$bankSelect.length) return;

        $bankSelect.empty();
        $bankSelect.append('<option value="">Selecciona un banco</option>');

        bancosState.forEach((bank) => {
            $bankSelect.append(
                `<option value="${escapeHtml(bank._id)}">${escapeHtml(bank.name)}</option>`,
            );
        });
    }

    async function refreshReservations() {
        // tras crear/editar/cancelar, refrescamos desde backend.
        const reservas = await $.ajax({
            url: "/api/reservas",
            method: "GET",
            dataType: "json",
        });

        reservasState.splice(0, reservasState.length, ...(Array.isArray(reservas) ? reservas : []));
        rebuildReservationsIndex();
    }

    async function loadBancosPageData() {
        const $grid = $(".cards-grid");
        if (!$grid.length) return;

        try {
            // carga inicial: bancos -> cards/select -> reservas -> estado visual.
            const bancos = await $.ajax({
                url: "/api/bancos",
                method: "GET",
                dataType: "json",
            });

            bancosState.splice(0, bancosState.length, ...(Array.isArray(bancos) ? bancos : []));
            renderBanksList();
            renderBankSelect();

            await refreshReservations();
            updateReservationStatus();
        } catch (error) {
            console.error("Error al cargar bancos o reservas:", error);
            $grid.html("<p>No se pudieron cargar los bancos desde la API.</p>");
        }
    }

    function updateReservationStatus() {
        const cards = document.querySelectorAll("main .card");

        cards.forEach((card) => {
            const bankId = card.dataset.bankId;
            const reservationFound = reservationByBankId.get(String(bankId));
            const reserved = !!reservationFound;

            card.classList.toggle("reserved", reserved);

            card.dataset.available = reserved ? "no" : card.getAttribute("data-original-available");

            const btnEdit = card.querySelector(".btn-edit");
            if (btnEdit && reserved) {
                // solo permitimos editar si existe una reserva para ese bankId.
                btnEdit.onclick = () => {
                    openEditForm(reservationFound);
                };
            } else if (btnEdit) {
                btnEdit.onclick = null;
            }

            const moreInfoBtn = card.querySelector(".more-info");
            if (moreInfoBtn) {
                moreInfoBtn.classList.toggle("reserved-btn", reserved);
                moreInfoBtn.textContent = reserved ? "CANCELAR RESERVA" : "Más info";
            }
        });

        filterBanks();
        renderLucideIcons();
    }

    function openEditForm(data) {
        const modalFormOverlay = document.getElementById("modal-form-overlay");
        const heistForm = document.getElementById("heist-form");
        if (!modalFormOverlay || !heistForm || !data) return;

        // rellena todos los campos para editar la reserva existente.
        $("#leader-name").val(data.leaderName || "");
        $("#leader-email").val(data.leaderEmail || "");
        $("#experience").val(data.experience ?? "");
        $("#bank-select").val(data.bankId || "");
        $("#operation-date").val(data.operationDate || "");
        $("#operation-time").val(data.operationTime || "");
        $("#team-size").val(data.teamSize ?? "");
        $("#risk-level").val(data.riskLevel || "");
        $("#budget").val(data.budget ?? "");
        $("#equipment").val(data.equipment || "");
        $("#plan").val(data.plan || "");

        $("input[name='specialties']").prop("checked", false);
        (data.specialties || []).forEach((specialty) => {
            $(`input[name='specialties'][value='${specialty}']`).prop("checked", true);
        });

        $("input[name='terms']").prop("checked", true);

        const editingId = data._id;
        if (editingId) {
            heistForm.dataset.editingId = editingId;
        }

        if (data.createdAt) {
            heistForm.dataset.createdAt = data.createdAt;
        }

        modalFormOverlay.showModal();
    }

    loadBancosPageData();

    // =========================================
    // BANCOS: MODALES Y FORMULARIO DE RESERVA
    // =========================================
    const modal = document.getElementById("modal-bank");

    if (modal) {
        const closeBtn = document.querySelector(".close-btn");

        function closeDialog(dialog) {
            dialog.classList.add("is-closing");
            dialog.addEventListener(
                "animationend",
                () => {
                    dialog.classList.remove("is-closing");
                    dialog.close();
                },
                { once: true },
            );
        }

        const modalImg = document.getElementById("modal-img");
        const modalName = document.getElementById("modal-name");
        const modalAddress = document.getElementById("modal-address");
        const modalDifficulty = document.getElementById("modal-difficulty");
        const modalReward = document.getElementById("modal-reward");
        const modalAvailable = document.getElementById("modal-available");
        const btnBook = document.querySelector(".btn-book");
        const btnCancel = document.querySelector(".btn-cancel");

        if (closeBtn) closeBtn.addEventListener("click", () => closeDialog(modal));

        // evitamos el cierre inmediato para respetar la animación de salida.
        modal.addEventListener("cancel", (e) => {
            e.preventDefault();
            closeDialog(modal);
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeDialog(modal);
        });

        const modalFormOverlay = document.getElementById("modal-form-overlay");
        const heistForm = document.getElementById("heist-form");
        const closeFormBtn = document.querySelector(".close-form-btn");
        const btnCancelForm = document.getElementById("btn-cancel-form");
        if (btnBook) {
            btnBook.addEventListener("click", () => {
                const selectedBankId = modal.dataset.bankId;
                if (selectedBankId) {
                    $("#bank-select").val(selectedBankId);
                }

                resetFormEditingState();

                modal.close();
                modalFormOverlay.showModal();
            });
        }

        const closeForm = () => closeFormDialog();

        if (closeFormBtn) closeFormBtn.addEventListener("click", closeForm);
        if (btnCancelForm) btnCancelForm.addEventListener("click", closeForm);

        modalFormOverlay.addEventListener("cancel", (e) => {
            e.preventDefault();
            closeForm();
        });

        modalFormOverlay.addEventListener("click", (e) => {
            if (e.target === modalFormOverlay) closeForm();
        });

        if ($("#heist-form").length > 0) {
            $("#heist-form").on("submit", function (e) {
                e.preventDefault();

                const $form = $(this);
                const editingId = $form.attr("data-editing-id");

                const formData = {
                    leaderName: $("#leader-name").val(),
                    leaderEmail: $("#leader-email").val(),
                    experience: parseInt($("#experience").val()) || 0,
                    bankId: $("#bank-select").val(),
                    operationDate: $("#operation-date").val(),
                    operationTime: $("#operation-time").val(),
                    teamSize: parseInt($("#team-size").val()) || 1,
                    riskLevel: $("#risk-level").val(),
                    budget: parseFloat($("#budget").val()) || 0,
                    equipment: $("#equipment").val(),
                    plan: $("#plan").val(),
                    specialties: $("input[name='specialties']:checked")
                        .map(function () {
                            return this.value;
                        })
                        .get(),
                    status: "pendiente",
                    createdAt: editingId
                        ? $form.attr("data-created-at") || new Date().toISOString()
                        : new Date().toISOString(),
                };

                // con editingId actualizamos (PUT); sin él creamos (POST).
                const url = editingId ? `/api/reservas/${editingId}` : "/api/reservas";
                const method = editingId ? "PUT" : "POST";

                $.ajax({
                    url: url,
                    method: method,
                    contentType: "application/json",
                    data: JSON.stringify(formData),
                    success: function (response) {
                        alert("✅ ¡OPERACIÓN EXITOSA!");
                        $form[0].reset();
                        resetFormEditingState();
                        document.getElementById("modal-form-overlay").close();
                        refreshReservations()
                            .then(() => {
                                updateReservationStatus();
                            })
                            .catch((error) => {
                                console.error("Error al refrescar reservas:", error);
                            });
                    },
                    error: function (xhr) {
                        console.error("Error detallado:", xhr.responseText);
                        alert("❌ Error " + xhr.status + ": Revisa la consola del servidor.");
                    },
                });
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener("click", async () => {
                const bankId = modal.dataset.bankId;
                const reservation = reservationByBankId.get(String(bankId));

                if (!reservation?._id) {
                    alert("No hay reserva activa para este banco.");
                    return;
                }

                try {
                    await $.ajax({
                        url: `/api/reservas/${reservation._id}`,
                        method: "DELETE",
                    });

                    alert(`✓ RESERVA CANCELADA\n\n${modalName.textContent}`);
                    await refreshReservations();
                    updateReservationStatus();
                    closeDialog(modal);
                } catch (error) {
                    console.error("Error al cancelar la reserva:", error);
                    alert("❌ No se pudo cancelar la reserva.");
                }
            });
        }

        // delegación jQuery para cards renderizadas dinámicamente.
        $(document).on("click", ".more-info", function (e) {
            const card = e.target.closest(".card");
            if (!card) return;

            const img = card.querySelector("img");
            modalImg.src = img?.src || "";
            modalImg.alt = img?.alt || "";

            const bankName = card.querySelector("h3")?.textContent || "Banco";
            modalName.textContent = bankName;
            modalAddress.textContent = card.dataset.address || "No disponible";

            const difficulty = card.dataset.difficulty || "no disponible";
            modalDifficulty.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            modalDifficulty.dataset.level = difficulty.toLowerCase();

            modalReward.textContent = card.dataset.reward || "No disponible";

            const available = card.dataset.available || "";
            modalAvailable.dataset.state = available.toLowerCase();
            modalAvailable.textContent =
                available === "si" ? "Disponible" : available === "no" ? "Ocupado" : available;

            modal.dataset.bankId = card.dataset.bankId || "";
            modal.classList.toggle(
                "is-reserved",
                reservationByBankId.has(String(card.dataset.bankId)),
            );
            modal.showModal();
        });
    }

    // =========================================
    // UTILIDADES DE MOVIMIENTO
    // =========================================
    const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const isReducedMotionEnabled = () =>
        document.documentElement.classList.contains("a11y-stop-animations") ||
        localStorage.getItem("a11y-stop-animations") === "true" ||
        Boolean(reducedMotionQuery?.matches);

    // =========================================
    // HOME: CARRUSEL
    // =========================================
    const track = document.querySelector(".carousel-track");
    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");
    const slides = track ? track.querySelectorAll(".carousel-slide") : [];

    if (track && prev && next && slides.length) {
        let currentIndex = 0;
        let autoScrollInterval = null;

        function goTo(index) {
            currentIndex = (index + slides.length) % slides.length;
            track.scrollTo({
                left: slides[currentIndex].offsetLeft,
                behavior: isReducedMotionEnabled() ? "auto" : "smooth",
            });
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function startAutoScroll() {
            if (isReducedMotionEnabled()) {
                stopAutoScroll();
                return;
            }

            stopAutoScroll();
            autoScrollInterval = setInterval(() => goTo(currentIndex + 1), 3000);
        }

        function syncCarouselMotionPreference() {
            if (isReducedMotionEnabled()) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        }

        prev.addEventListener("click", () => goTo(currentIndex - 1));
        next.addEventListener("click", () => goTo(currentIndex + 1));

        startAutoScroll();
        track.addEventListener("mouseenter", stopAutoScroll);
        track.addEventListener("mouseleave", startAutoScroll);
        reducedMotionQuery?.addEventListener("change", syncCarouselMotionPreference);

        new MutationObserver(syncCarouselMotionPreference).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    // =========================================
    // FAQ: ACORDEÓN
    // =========================================
    // usamos un reflow (offsetHeight) para animar max-height desde/hacia valores medidos.
    function closeFaqItem(details) {
        const answer = details.querySelector(".faq-answer");

        if (!answer) return;

        if (isReducedMotionEnabled()) {
            details.removeAttribute("open");
            answer.style.maxHeight = "";
            return;
        }

        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.offsetHeight;
        answer.style.maxHeight = "0";
        answer.addEventListener(
            "transitionend",
            () => {
                details.removeAttribute("open");
                answer.style.maxHeight = "";
            },
            { once: true },
        );
    }

    function openFaqItem(details) {
        details.setAttribute("open", "");
        const answer = details.querySelector(".faq-answer");

        if (!answer) return;

        if (isReducedMotionEnabled()) {
            answer.style.maxHeight = "";
            return;
        }

        answer.style.maxHeight = "0";
        answer.offsetHeight;
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.addEventListener(
            "transitionend",
            () => {
                answer.style.maxHeight = "";
            },
            { once: true },
        );
    }

    document
        .querySelector(".faq-container")
        ?.querySelectorAll("details.faq-item")
        .forEach((details) => {
            details.querySelector("summary").addEventListener("click", (e) => {
                e.preventDefault();
                const isOpen = details.hasAttribute("open");

                document.querySelectorAll(".faq-container details[open]").forEach((d) => {
                    if (d !== details) closeFaqItem(d);
                });

                if (isOpen) {
                    closeFaqItem(details);
                } else {
                    openFaqItem(details);
                }
            });
        });

    renderLucideIcons();
});

// =========================================
// ACCESIBILIDAD: WIDGET GLOBAL
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const a11yWidget = document.createElement("div");
    a11yWidget.innerHTML = `
        <button id="a11y-toggle" class="a11y-btn" aria-label="Abrir menú de accesibilidad" title="Accesibilidad">
            <i data-lucide="user"></i>
        </button>
        <div id="a11y-panel" class="a11y-panel">
            <div class="a11y-header">
                <h3>Accesibilidad</h3>

            </div>
            <div class="a11y-options">
                <button id="a11y-text" class="a11y-option-btn">
                    <i data-lucide="type"></i>
                    <span>Texto más grande</span>
                </button>
                <button id="a11y-dyslexic" class="a11y-option-btn">
                    <i data-lucide="book-open"></i>
                    <span>Dislexia</span>
                </button>
                <button id="a11y-contrast" class="a11y-option-btn">
                    <i data-lucide="contrast"></i>
                    <span>Alto contraste</span>
                </button>
                <button id="a11y-animations" class="a11y-option-btn">
                    <i data-lucide="pause"></i>
                    <span>Detener animaciones</span>
                </button>
                <button id="a11y-reset" class="a11y-option-btn reset">
                    <i data-lucide="rotate-ccw"></i>
                    <span>Restablecer ajustes</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(a11yWidget);

    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }

    const htmlElement = document.documentElement;
    const btnToggle = document.getElementById("a11y-toggle");
    const panel = document.getElementById("a11y-panel");

    const btnText = document.getElementById("a11y-text");
    const btnContrast = document.getElementById("a11y-contrast");
    const btnDyslexic = document.getElementById("a11y-dyslexic");
    const btnAnim = document.getElementById("a11y-animations");
    const btnReset = document.getElementById("a11y-reset");

    function loadA11yPreferences() {
        if (localStorage.getItem("a11y-large-text") === "true") {
            htmlElement.classList.add("a11y-large-text");
            btnText.classList.add("active");
        }
        if (localStorage.getItem("a11y-high-contrast") === "true") {
            htmlElement.classList.add("a11y-high-contrast");
            btnContrast.classList.add("active");
        }
        if (localStorage.getItem("a11y-stop-animations") === "true") {
            htmlElement.classList.add("a11y-stop-animations");
            btnAnim.classList.add("active");
        }
        if (localStorage.getItem("a11y-dyslexic") === "true") {
            htmlElement.classList.add("a11y-dyslexic");
            btnDyslexic.classList.add("active");
        }
    }

    let closeAnimationTimeout;

    function setPanelOpen(isOpen) {
        clearTimeout(closeAnimationTimeout);

        if (isOpen) {
            panel.classList.remove("is-closing");
            panel.classList.add("open");
        } else if (panel.classList.contains("open")) {
            panel.classList.remove("open");
            panel.classList.add("is-closing");

            closeAnimationTimeout = setTimeout(() => {
                panel.classList.remove("is-closing");
            }, 180);
        }

        btnToggle.setAttribute("aria-expanded", String(isOpen));
        panel.setAttribute("aria-hidden", String(!isOpen));
    }

    btnToggle.addEventListener("click", () => {
        setPanelOpen(!panel.classList.contains("open"));
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open")) {
            setPanelOpen(false);
        }
    });

    document.addEventListener("click", (e) => {
        if (!panel.classList.contains("open")) return;
        if (panel.contains(e.target) || btnToggle.contains(e.target)) return;
        setPanelOpen(false);
    });

    btnText.addEventListener("click", () => {
        const isActive = htmlElement.classList.toggle("a11y-large-text");
        btnText.classList.toggle("active");
        localStorage.setItem("a11y-large-text", isActive);
    });

    btnContrast.addEventListener("click", () => {
        const isActive = htmlElement.classList.toggle("a11y-high-contrast");
        btnContrast.classList.toggle("active");
        localStorage.setItem("a11y-high-contrast", isActive);
    });

    btnAnim.addEventListener("click", () => {
        const isActive = htmlElement.classList.toggle("a11y-stop-animations");
        btnAnim.classList.toggle("active");
        localStorage.setItem("a11y-stop-animations", isActive);
    });

    btnDyslexic.addEventListener("click", () => {
        const isActive = htmlElement.classList.toggle("a11y-dyslexic");
        btnDyslexic.classList.toggle("active");
        localStorage.setItem("a11y-dyslexic", isActive);
    });

    btnReset.addEventListener("click", () => {
        htmlElement.classList.remove(
            "a11y-large-text",
            "a11y-high-contrast",
            "a11y-stop-animations",
            "a11y-dyslexic",
        );
        btnText.classList.remove("active");
        btnContrast.classList.remove("active");
        btnAnim.classList.remove("active");
        btnDyslexic.classList.remove("active");

        localStorage.setItem("a11y-large-text", "false");
        localStorage.setItem("a11y-high-contrast", "false");
        localStorage.setItem("a11y-stop-animations", "false");
        localStorage.setItem("a11y-dyslexic", "false");
    });

    setPanelOpen(false);
    loadA11yPreferences();
});

// =========================================
// UTENSILIOS: CARRITO LATERAL
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const btnCart = document.querySelector(".btn-cart");

    if (btnCart) {
        const btnClose = document.getElementById("btn-close-panel");

        const backdrop = document.getElementById("cart-backdrop");

        function openCart(btn) {
            const panel = document.getElementById("side-panel");
            panel.classList.add("open");
            backdrop.classList.add("open");
            btn.disabled = true;
            btn._keydownHandler = (e) => {
                if (e.key === "Escape") closeCart(btn);
            };
            document.addEventListener("keydown", btn._keydownHandler);
        }

        function closeCart(btn) {
            const panel = document.getElementById("side-panel");
            panel.classList.remove("open");
            backdrop.classList.remove("open");
            document.removeEventListener("keydown", btn._keydownHandler);
            btn._keydownHandler = null;
            btn.disabled = false;
        }

        btnCart.addEventListener("click", () => openCart(btnCart));
        btnClose.addEventListener("click", () => closeCart(btnCart));
        backdrop.addEventListener("click", () => closeCart(btnCart));
    }
});

// =========================================
// UTENSILIOS: RENDER DESDE API
// =========================================
async function renderUtensilios() {
    const $contenedor = $("#utensils-grid");
    if (!$contenedor.length) return;

    try {
        const utensilios = await $.ajax({
            url: "/api/utensilios",
            method: "GET",
            dataType: "json",
        });

        $contenedor.empty();

        utensilios.forEach((u) => {
            const $article = $("<article>", { class: "card" }).html(`
                <img class="photos" src="${u.imagen}" alt="${u.nombre}" />
                <h3>${u.nombre}</h3>
                <div class="price-tag">${u.precio} €</div>
                <p>${u.descripcion}</p>
                <button class="btn-add">Añadir al carrito</button>
            `);

            $contenedor.append($article);
        });
    } catch (error) {
        console.error("Error al cargar utensilios:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderUtensilios();
});
