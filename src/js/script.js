document.addEventListener('DOMContentLoaded', function() {
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

	updateReservationStatus();

	const rango = document.getElementById('reward');
	const out = document.getElementById('reward-output');
	if (rango && out) {
		out.textContent = rango.value;
		rango.addEventListener('input', () => {
			out.textContent = rango.value;
			filterBanks();
		});
	}

	const locationInput = document.getElementById('location');
	const difficultySelect = document.getElementById('difficulty');
	const availabilitySelect = document.getElementById('availability');

	if (locationInput) locationInput.addEventListener('input', filterBanks);
	if (difficultySelect) difficultySelect.addEventListener('change', filterBanks);
	if (availabilitySelect) availabilitySelect.addEventListener('change', filterBanks);

	const btnSearch = document.getElementById('btn-remove-filters');
	if (btnSearch) {
		btnSearch.addEventListener('click', () => {
			if (locationInput) locationInput.value = '';
			if (difficultySelect) difficultySelect.value = '';
			if (availabilitySelect) availabilitySelect.value = 'todos';
			if (rango) {
				rango.value = rango.max || 1000;
				if (out) out.textContent = rango.value;
			}
			filterBanks();
		});
	}

	function filterBanks() {
		const location = document.getElementById('location')?.value.toLowerCase() || '';
		const difficulty = document.getElementById('difficulty')?.value || '';
		const maxReward = parseInt(document.getElementById('reward')?.value) || 0;
		const availability = document.getElementById('availability')?.value || 'todos';

		const cards = document.querySelectorAll('main > .card');

		cards.forEach(card => {
			const cardAddress = card.dataset.address?.toLowerCase() || '';
			const cardDifficulty = card.dataset.difficulty?.toLowerCase() || '';
			const cardReward = parseInt(card.dataset.reward) || 0;
			const cardAvailable = card.dataset.available?.toLowerCase() || '';

			const matches =
				(!location || cardAddress.includes(location)) &&
				(!difficulty || cardDifficulty === difficulty) &&
				(cardReward <= maxReward) &&
				(availability === 'todos' || cardAvailable === availability);

			card.classList.toggle('hidden', !matches);
		});
	}

	function isReserved(bankName) {
		const reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
		return reservations.some(r => r.bankName === bankName);
	}

	// Sincroniza el estado visual de cada tarjeta con localStorage y re-aplica los filtros.
	// data-original-available guarda la disponibilidad real del banco (sin reservas) para
	// poder restaurarla si el usuario cancela, sin tener que recargar el HTML.
	function updateReservationStatus() {
		const cards = document.querySelectorAll('main > .card');

		cards.forEach(card => {
			const bankName = card.querySelector('h3').textContent;

			if (!card.hasAttribute('data-original-available')) {
				card.setAttribute('data-original-available', card.dataset.available);
			}

			const reserved = isReserved(bankName);
			card.classList.toggle('reserved', reserved);
			card.dataset.available = reserved
				? 'no'
				: card.getAttribute('data-original-available');

			const moreInfoBtn = card.querySelector('.more-info');
			moreInfoBtn.classList.toggle('reserved-btn', reserved);
			moreInfoBtn.textContent = reserved ? 'CANCELAR RESERVA' : 'Más info';
		});

		filterBanks();
	}

	// --- MODALES (solo en bancos.html) ---
	const modal = document.getElementById('modal-bank');

	if (modal) {
		const closeBtn = document.querySelector('.close-btn');

		function closeDialog(dialog) {
			dialog.classList.add('is-closing');
			dialog.addEventListener('animationend', () => {
				dialog.classList.remove('is-closing');
				dialog.close();
			}, { once: true });
		}

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

				const difficulty = card.dataset.difficulty || 'no disponible';
				modalDifficulty.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

				modalReward.textContent = card.dataset.reward || 'No disponible';

				const available = card.dataset.available || '';
				modalAvailable.textContent = available === 'si' ? 'Disponible' : available === 'no' ? 'Ocupado' : available;

				modal.classList.toggle('is-reserved', isReserved(bankName));
				modal.showModal();
			});
		});

		if (closeBtn) closeBtn.addEventListener('click', () => closeDialog(modal));

		// El evento 'cancel' se dispara cuando el navegador cierra el dialog con Escape.
		// Sin preventDefault(), el cierre es inmediato y saltaría la animación de salida.
		modal.addEventListener('cancel', (e) => {
			e.preventDefault();
			closeDialog(modal);
		});

		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeDialog(modal);
		});

		// --- MODAL DEL FORMULARIO ---
		const modalFormOverlay = document.getElementById('modal-form-overlay');
		const heistForm = document.getElementById('heist-form');
		const closeFormBtn = document.querySelector('.close-form-btn');
		const btnCancelForm = document.getElementById('btn-cancel-form');
		let pendingReservationData = {};

		if (btnBook) {
			btnBook.addEventListener('click', () => {
				pendingReservationData = {
					bankName: modalName.textContent,
					address: modalAddress.textContent,
					reward: modalReward.textContent,
					difficulty: modalDifficulty.textContent
				};

				// Pre-seleccionar el banco en el select del formulario
				const bankSelect = document.getElementById('bank-select');
				if (bankSelect) {
					Array.from(bankSelect.options).forEach(opt => {
						opt.selected = opt.text.trim() === pendingReservationData.bankName.trim();
					});
				}

				modal.close();
				modalFormOverlay.showModal();
			});
		}

		const closeForm = () => {
			closeDialog(modalFormOverlay);
			if (heistForm) heistForm.reset();
		};

		if (closeFormBtn) closeFormBtn.addEventListener('click', closeForm);
		if (btnCancelForm) btnCancelForm.addEventListener('click', closeForm);

		modalFormOverlay.addEventListener('cancel', (e) => {
			e.preventDefault();
			closeForm();
		});

		modalFormOverlay.addEventListener('click', (e) => {
			if (e.target === modalFormOverlay) closeForm();
		});

		if (heistForm) {
			heistForm.addEventListener('submit', (e) => {
				e.preventDefault();

				const bankSelect = document.getElementById('bank-select');
				const selectedBankName = bankSelect.options[bankSelect.selectedIndex].text;

				const reservation = {
					id: Date.now(),
					bankName: selectedBankName,
					address: pendingReservationData.address || 'Dirección no especificada',
					reward: pendingReservationData.reward || '0',
					difficulty: pendingReservationData.difficulty || 'No especificada',
					date: document.getElementById('operation-date').value,
					time: document.getElementById('operation-time').value
				};

				let reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
				reservations.push(reservation);
				localStorage.setItem('heistcraft_reservations', JSON.stringify(reservations));

				updateReservationStatus();
				closeForm();
				alert(`✓ RESERVA CONFIRMADA\n\n${reservation.bankName}\nFecha: ${reservation.date}\nHora: ${reservation.time}`);
			});
		}

		if (btnCancel) {
			btnCancel.addEventListener('click', () => {
				const bankName = modalName.textContent;
				let reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
				reservations = reservations.filter(r => r.bankName !== bankName);
				localStorage.setItem('heistcraft_reservations', JSON.stringify(reservations));
				alert(`✓ RESERVA CANCELADA\n\n${bankName}`);
				updateReservationStatus();
				closeDialog(modal);
			});
		}
	}

	// --- CARRUSEL ---
	const track = document.querySelector('.carousel-track');
	const prev = document.querySelector('.carousel-btn.prev');
	const next = document.querySelector('.carousel-btn.next');
	const slides = track ? track.querySelectorAll('.carousel-slide') : [];

	if (track && prev && next && slides.length) {
		let currentIndex = 0;

		function goTo(index) {
			currentIndex = (index + slides.length) % slides.length;
			track.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
		}

		prev.addEventListener('click', () => goTo(currentIndex - 1));
		next.addEventListener('click', () => goTo(currentIndex + 1));

		// Avanza automáticamente cada 3 s; se pausa al pasar el ratón por encima.
		let autoScrollInterval = setInterval(() => goTo(currentIndex + 1), 3000);
		track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
		track.addEventListener('mouseleave', () => {
			autoScrollInterval = setInterval(() => goTo(currentIndex + 1), 3000);
		});
	}

	// --- FAQ ACCORDION ---
	// La animación de max-height requiere JS porque CSS no puede animar desde/hacia 'auto'.
	// Se usa un reflow forzado (offsetHeight) entre los dos cambios de max-height para que
	// el navegador registre el valor inicial antes de aplicar la transición.
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

// --- CARRITO EN UTENSILIOS ---
document.addEventListener('DOMContentLoaded', () => {
	const btnCart = document.querySelector('.btn-cart');
	const btnClose = document.getElementById('btn-close-panel');

	const backdrop = document.getElementById('cart-backdrop');

	function openCart(btn) {
		const panel = document.getElementById('side-panel');
		panel.classList.add('open');
		backdrop.classList.add('open');
		btn.disabled = true;
		btn._keydownHandler = (e) => { if (e.key === 'Escape') closeCart(btn); };
		document.addEventListener('keydown', btn._keydownHandler);
	}

	function closeCart(btn) {
		const panel = document.getElementById('side-panel');
		panel.classList.remove('open');
		backdrop.classList.remove('open');
		document.removeEventListener('keydown', btn._keydownHandler);
		btn._keydownHandler = null;
		btn.disabled = false;
	}

	btnCart.addEventListener('click', () => openCart(btnCart));
	btnClose.addEventListener('click', () => closeCart(btnCart));
	backdrop.addEventListener('click', () => closeCart(btnCart));
});
