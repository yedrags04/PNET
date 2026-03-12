document.addEventListener('DOMContentLoaded', function() {
	// Inicializar reservas por defecto si no existen
	const existingReservations = localStorage.getItem('heistcraft_reservations');
	if (!existingReservations) {
		const defaultReservations = [
			{
				id: 1,
				bankName: 'BANCO DE BARCELONA',
				address: 'Paseo 2, Barcelona',
				reward: '800',
				difficulty: 'Alta',
				date: '01/03/2026',
				time: '14:30:00'
			},
			{
				id: 2,
				bankName: 'BANCO BANKINTER',
				address: 'C/ de Bankinter 1, Madrid',
				reward: '600',
				difficulty: 'Media',
				date: '28/02/2026',
				time: '10:15:00'
			}
		];
		localStorage.setItem('heistcraft_reservations', JSON.stringify(defaultReservations));
	}

	// Actualizar estado de reservas al cargar la página
	updateReservationStatus();

	// Mostrar el valor del range
	const rango = document.getElementById('reward');
	const out = document.getElementById('reward-output');
	if (rango && out) {
		out.textContent = rango.value;
		rango.addEventListener('input', () => {
			out.textContent = rango.value;
			filterBanks(); // Filtrar en tiempo real
		});
	}

	// Filtrar en tiempo real cuando cambien otros inputs
	const locationInput = document.getElementById('location');
	const difficultySelect = document.getElementById('difficulty');
	const availabilitySelect = document.getElementById('availability');

	if (locationInput) {
		locationInput.addEventListener('input', filterBanks);
	}
	if (difficultySelect) {
		difficultySelect.addEventListener('change', filterBanks);
	}
	if (availabilitySelect) {
		availabilitySelect.addEventListener('change', filterBanks);
	}

	// Botón reiniciar filtros
	const btnSearch = document.getElementById('btn-search');
	if (btnSearch) {
		btnSearch.addEventListener('click', () => {
			// Limpiar filtros
			if (locationInput) locationInput.value = '';
			if (difficultySelect) difficultySelect.value = '';
			if (availabilitySelect) availabilitySelect.value = 'todos';
			if (rango) {
				rango.value = rango.max || 1000; // Asumir máximo 1000 si no está definido
				if (out) out.textContent = rango.value;
			}
			filterBanks();
		});
	}

	// Función para filtrar bancos
	function filterBanks() {
		const location = document.getElementById('location')?.value.toLowerCase() || '';
		const difficulty = document.getElementById('difficulty')?.value || '';
		const maxReward = parseInt(document.getElementById('reward')?.value) || 0;
		const availability = document.getElementById('availability')?.value || 'todos';

		const cards = document.querySelectorAll('main > .card');
		let visibleCount = 0;

		cards.forEach(card => {
			const cardAddress = card.dataset.address?.toLowerCase() || '';
			const cardDifficulty = card.dataset.difficulty?.toLowerCase() || '';
			const cardReward = parseInt(card.dataset.reward) || 0;
			const cardAvailable = card.dataset.available?.toLowerCase() || '';

			// Verificar si cumple con todos los filtros
			let matches = true;

			// Filtro de localización (búsqueda parcial)
			if (location && !cardAddress.includes(location)) {
				matches = false;
			}

			// Filtro de dificultad
			if (difficulty && cardDifficulty !== difficulty) {
				matches = false;
			}

			// Filtro de recompensa (mostrar si es menor o igual al valor del rango)
			if (cardReward > maxReward) {
				matches = false;
			}

			// Filtro de disponibilidad
			if (availability !== 'todos' && cardAvailable !== availability) {
				matches = false;
			}

			// Mostrar u ocultar la tarjeta
			if (matches) {
				card.style.display = 'flex';
				visibleCount++;
			} else {
				card.style.display = 'none';
			}
		});

		// Opcional: mostrar mensaje si no hay resultados
		if (visibleCount === 0) {
			console.log('No se encontraron bancos con los criterios especificados');
		}
	}

	// Función para verificar si un banco está reservado
	function isReserved(bankName) {
		const reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
		return reservations.some(reservation => reservation.bankName === bankName);
	}

	// Función para mostrar estado de reserva en las tarjetas
	function updateReservationStatus() {
		const cards = document.querySelectorAll('main > .card');
		cards.forEach(card => {
			const bankName = card.querySelector('h3').textContent;
			if (isReserved(bankName)) {
				card.classList.add('reserved');
				const moreInfoBtn = card.querySelector('.more-info');
				if (!moreInfoBtn.classList.contains('reserved-btn')) {
					moreInfoBtn.classList.add('reserved-btn');
					moreInfoBtn.textContent = 'CANCELAR RESERVA';
				}
			} else {
				card.classList.remove('reserved');
				const moreInfoBtn = card.querySelector('.more-info');
				moreInfoBtn.classList.remove('reserved-btn');
				moreInfoBtn.textContent = 'Más info';
			}
		});
	}

	// --- LÓGICA DEL MODAL (POP-UP) ---
	const modal = document.getElementById('modal-bank');
	const closeBtn = document.querySelector('.close-btn');

	const modalImg = document.getElementById('modal-img');
	const modalName = document.getElementById('modal-name');
	const modalAddress = document.getElementById('modal-address');
	const modalDifficulty = document.getElementById('modal-difficulty');
	const modalReward = document.getElementById('modal-reward');
	const modalAvailable = document.getElementById('modal-available');
	const btnBook = document.querySelector('.btn-book');
	const btnCancel = document.querySelector('.btn-cancel');

	document.querySelectorAll('.more-info').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const card = e.target.closest('.card');
			if (!card) return;

			const img = card.querySelector('img');
			modalImg.src = img?.src || '';
			modalImg.alt = img?.alt || '';

			const bankName = card.querySelector('h3')?.textContent || 'Banco';
			modalName.textContent = bankName;
			modalAddress.textContent = card.dataset.address || 'No disponible';

			// Formatear dificultad
			const difficulty = card.dataset.difficulty || 'No disponible';
			const difficultyFormatted = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
			modalDifficulty.textContent = difficultyFormatted;

			modalReward.textContent = card.dataset.reward || 'No disponible';

			// Formatear disponibilidad
			const available = card.dataset.available || 'No disponible';
			const availableFormatted = available === 'si' ? 'Disponible' : available === 'no' ? 'Ocupado' : available;
			modalAvailable.textContent = availableFormatted;

			// Verificar si ya está reservado y actualizar botones
			if (isReserved(bankName)) {
				btnBook.style.display = 'none';
				btnCancel.style.display = 'block';
				btnBook.disabled = false;
				btnBook.classList.remove('disabled');
			} else {
				btnBook.style.display = 'block';
				btnCancel.style.display = 'none';
				btnBook.disabled = false;
				btnBook.classList.remove('disabled');
			}

			modal.style.display = 'flex';
		});
	});

	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			modal.style.display = 'none';
		});
	}

	window.addEventListener('click', (e) => {
		if (e.target === modal) {
			modal.style.display = 'none';
		}
	});

	// Botón RESERVAR
	// --- LÓGICA DE APERTURA DEL FORMULARIO ---
    const modalFormOverlay = document.getElementById('modal-form-overlay');
    const heistForm = document.getElementById('heist-form');
    const closeFormBtn = document.querySelector('.close-form-btn');
    const btnCancelForm = document.getElementById('btn-cancel-form');
    let pendingReservationData = {}; // Guardaremos los datos del banco temporalmente aquí

    // Al pulsar RESERVAR en el primer modal
    if (btnBook) {
        btnBook.addEventListener('click', () => {
            if (btnBook.disabled) return;

            // Guardamos los datos del banco que estamos viendo
            pendingReservationData = {
                bankName: modalName.textContent,
                address: modalAddress.textContent,
                reward: modalReward.textContent,
                difficulty: modalDifficulty.textContent
            };

            // Intentamos pre-seleccionar el banco en el select del formulario
            const bankSelect = document.getElementById('bank-select');
            if (bankSelect) {
                Array.from(bankSelect.options).forEach(opt => {
                    if (opt.text.trim() === pendingReservationData.bankName.trim()) {
                        opt.selected = true;
                    }
                });
            }

            // Cerramos el primer modal y abrimos el del formulario
            modal.style.display = 'none';
            modalFormOverlay.style.display = 'flex';
        });
    }

    // Funciones para cerrar el modal del formulario
    const closeForm = () => {
        modalFormOverlay.style.display = 'none';
        if(heistForm) heistForm.reset();
    };

    if (closeFormBtn) closeFormBtn.addEventListener('click', closeForm);
    if (btnCancelForm) btnCancelForm.addEventListener('click', closeForm);
    
    window.addEventListener('click', (e) => {
        if (e.target === modalFormOverlay) closeForm();
    });

    // --- ENVÍO DEL FORMULARIO (CONFIRMAR RESERVA) ---
    if (heistForm) {
        heistForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // Obtenemos el nombre del banco desde el select del formulario
            const bankSelect = document.getElementById('bank-select');
            const selectedBankName = bankSelect.options[bankSelect.selectedIndex].text;

            // Crear objeto de reserva
            const reservation = {
                id: Date.now(),
                bankName: selectedBankName,
                address: pendingReservationData.address || 'Dirección no especificada',
                reward: pendingReservationData.reward || '0',
                difficulty: pendingReservationData.difficulty || 'No especificada',
                date: document.getElementById('operation-date').value,
                time: document.getElementById('operation-time').value
            };

            // Obtener reservas existentes del localStorage
            let reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];

            // Agregar nueva reserva
            reservations.push(reservation);

            // Guardar en localStorage
            localStorage.setItem('heistcraft_reservations', JSON.stringify(reservations));

            // Actualizar estado de las tarjetas en pantalla
            updateReservationStatus();

            // Cerrar modal y limpiar
            closeForm();

            // Mostrar confirmación
            alert(`✓ RESERVA CONFIRMADA\n\n${reservation.bankName}\nFecha: ${reservation.date}\nHora: ${reservation.time}`);
        });
    }

    // Botón CANCELAR RESERVA (desde la tarjeta o el primer modal)
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            const bankName = modalName.textContent;
            let reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
            reservations = reservations.filter(reservation => reservation.bankName !== bankName);
            localStorage.setItem('heistcraft_reservations', JSON.stringify(reservations));
            alert(`✓ RESERVA CANCELADA\n\n${bankName}`);
            updateReservationStatus();
            modal.style.display = 'none';
        });
    }

	// carrusel de “top bancos”
	const track = document.querySelector('.carousel-track');
	const prev = document.querySelector('.carousel-btn.prev');
	const next = document.querySelector('.carousel-btn.next');
	const slides = track ? track.querySelectorAll('.carousel-slide') : [];

	if (track && prev && next && slides.length) {
		let currentIndex = 0;

		function goTo(index) {
			currentIndex = (index + slides.length) % slides.length;
			const left = slides[currentIndex].offsetLeft;
			track.scrollTo({ left, behavior: 'smooth' });
		}

		prev.addEventListener('click', () => goTo(currentIndex - 1));
		next.addEventListener('click', () => goTo(currentIndex + 1));

		// autoplay: avanza una slide cada 3s y vuelve al principio al llegar al
		// final; se pausa al pasar el ratón por encima
		let autoScrollInterval = setInterval(() => goTo(currentIndex + 1), 3000);

		track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
		track.addEventListener('mouseleave', () => {
			autoScrollInterval = setInterval(() => goTo(currentIndex + 1), 3000);
		});
	}

	// FAQ Accordion — animación max-height + solo uno abierto a la vez
	function closeFaqItem(details) {
		const answer = details.querySelector('.faq-answer');
		answer.style.maxHeight = answer.scrollHeight + 'px';
		answer.offsetHeight; // fuerza reflow
		answer.style.maxHeight = '0';
		answer.addEventListener('transitionend', () => {
			details.removeAttribute('open');
			answer.style.maxHeight = '';
		}, { once: true });
	}

	function openFaqItem(details) {
		details.setAttribute('open', '');
		const answer = details.querySelector('.faq-answer');
		answer.style.maxHeight = '0';
		answer.offsetHeight; // fuerza reflow
		answer.style.maxHeight = answer.scrollHeight + 'px';
		answer.addEventListener('transitionend', () => {
			answer.style.maxHeight = '';
		}, { once: true });
	}

	document.querySelector('.faq-container')?.querySelectorAll('details.faq-item').forEach(details => {
		details.querySelector('summary').addEventListener('click', e => {
			e.preventDefault();
			const isOpen = details.hasAttribute('open');

			// Cerrar todos los demás
			document.querySelectorAll('.faq-container details[open]').forEach(d => {
				if (d !== details) closeFaqItem(d);
			});

			if (isOpen) {
				closeFaqItem(details);
			} else {
				openFaqItem(details);
			}
		});
	});
});

function openCart(btn) {
	const panel = document.getElementById('side-panel');
	panel.classList.add('open'); // Añade la clase y el panel se muestra
	btn.disabled = true; // Deshabilita el botón
}

function closeCart(btn) {
	const panel = document.getElementById('side-panel');
	panel.classList.remove('open'); // Quita la clase y el panel se esconde
	setTimeout(() => {
		btn.disabled = false; // Rehabilita el botón
	}, 300);
}

document.addEventListener('DOMContentLoaded', () => {
	const btnComprar = document.querySelector('.btn-comprar');
	const btnClose = document.getElementById('btn-close-panel');

	btnComprar.addEventListener('click', () => {
		openCart(btnComprar);

		document.addEventListener('keydown', (e) => {
			if (e.key === "Escape") {
				closeCart(btnComprar);
			}
		}, { once: true });
	});

	btnClose.addEventListener('click', () => {
		closeCart(btnComprar);
	});
});
