document.addEventListener('DOMContentLoaded', function () {
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
				card.style.display = 'block';
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
				moreInfoBtn.textContent = 'Más Info';
			}
		});
	}

	// more-info: manejo básico para todos los botones de más información
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
    if (btnBook) {
        btnBook.addEventListener('click', () => {
            // Evitar reserva si ya está deshabilitado
            if (btnBook.disabled) return;

            const bankName = modalName.textContent;
            const bankAddress = modalAddress.textContent;
            const bankReward = modalReward.textContent;
            const bankDifficulty = modalDifficulty.textContent;
            
            // Crear objeto de reserva
            const reservation = {
                id: Date.now(),
                bankName: bankName,
                address: bankAddress,
                reward: bankReward,
                difficulty: bankDifficulty,
                date: new Date().toLocaleDateString('es-ES'),
                time: new Date().toLocaleTimeString('es-ES')
            };
            
            // Obtener reservas existentes del localStorage
            let reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
            
            // Agregar nueva reserva
            reservations.push(reservation);
            
            // Guardar en localStorage
            localStorage.setItem('heistcraft_reservations', JSON.stringify(reservations));
            
            // Mostrar confirmación
            alert(`✓ RESERVA CONFIRMADA\n\n${bankName}\n${bankAddress}\nRecompensa: ${bankReward}€\nDificultad: ${bankDifficulty}\n\nFecha: ${reservation.date}\nHora: ${reservation.time}`);
            
            // Actualizar estado de las tarjetas
            updateReservationStatus();
            
            // Cerrar modal
            modal.style.display = 'none';
        });
    }

    // Botón CANCELAR RESERVA
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            const bankName = modalName.textContent;
            
            // Obtener reservas del localStorage
            let reservations = JSON.parse(localStorage.getItem('heistcraft_reservations')) || [];
            
            // Filtrar para eliminar la reserva del banco seleccionado
            reservations = reservations.filter(reservation => reservation.bankName !== bankName);
            
            // Guardar en localStorage
            localStorage.setItem('heistcraft_reservations', JSON.stringify(reservations));
            
            // Mostrar confirmación
            alert(`✓ RESERVA CANCELADA\n\n${bankName}`);
            
            // Actualizar estado de las tarjetas
            updateReservationStatus();
            
            // Cerrar modal
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
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            
            // Obtener el estado actual
            const isActive = question.classList.contains('active');
            
            // Cerrar todos los items abiertos
            document.querySelectorAll('.faq-item').forEach(item => {
                item.querySelector('.faq-question').classList.remove('active');
                item.querySelector('.faq-answer').classList.remove('active');
            });
            
            // Si no estaba activo, abrirlo
            if (!isActive) {
                question.classList.add('active');
                faqAnswer.classList.add('active');
            }
        });
    });
    
});
