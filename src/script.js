document.addEventListener('DOMContentLoaded', function () {
	// Mostrar el valor del range
	const rango = document.getElementById('reward');
	const out = document.getElementById('reward-output');
	if (rango && out) {
		out.textContent = rango.value;
		rango.addEventListener('input', () => {
			out.textContent = rango.value;
		});
	}

	// Botón buscar (ejemplo: sólo filtra en consola)
	const btnSearch = document.getElementById('btn-search');
	if (btnSearch) {
		btnSearch.addEventListener('click', () => {
			const ubic = document.getElementById('location')?.value || '';
			const dif = document.getElementById('difficulty')?.value || '';
			const val = document.getElementById('reward')?.value || '';
			const disp = document.getElementById('availability')?.value || 'todos';
            console.log('Buscar con:', { location: ubic, difficulty: dif, reward: val, availability: disp });
			// Aquí puedes implementar la lógica real de filtrado
		});
	}

	// more-info: manejo básico para todos los botones de más información
	// --- LÓGICA DEL MODAL (POP-UP) ---
    const modal = document.getElementById('modal-bank');
    const closeBtn = document.querySelector('.close-btn');
    
    // Elementos dentro del modal que vamos a cambiar
    const modalImg = document.getElementById('modal-img');
    const modalName = document.getElementById('modal-name');

    // Al hacer clic en "Más Info"
    document.querySelectorAll('.more-info').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            
            // 1. Extraer los datos de la tarjeta clickeada
            const bankName = card.querySelector('h3').textContent;
            const imgSrc = card.querySelector('img').src; 

            // 2. Inyectar esos datos en el modal
            modalName.textContent = bankName;
            modalImg.src = imgSrc;

            // 3. Mostrar el modal (cambiamos de 'none' a 'flex' para centrarlo)
            modal.style.display = 'flex';
        });
    });

    // Cerrar el modal al hacer clic en la "X"
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cerrar el modal si el usuario hace clic fuera de la caja (en el fondo oscuro)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

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
