document.addEventListener('DOMContentLoaded', function () {
	// Mostrar el valor del range
	const rango = document.getElementById('recompensa');
	const out = document.getElementById('recompensaOutput');
	if (rango && out) {
		out.textContent = rango.value;
		rango.addEventListener('input', () => {
			out.textContent = rango.value;
		});
	}

	// Botón buscar (ejemplo: sólo filtra en consola)
	const btnBuscar = document.getElementById('btnBuscar');
	if (btnBuscar) {
		btnBuscar.addEventListener('click', () => {
			const ubic = document.getElementById('ubicacion')?.value || '';
			const dif = document.getElementById('dificultad')?.value || '';
			const val = document.getElementById('recompensa')?.value || '';
			const disp = document.getElementById('disponibilidad')?.value || 'todos';
            console.log('Buscar con:', { ubicacion: ubic, dificultad: dif, recompensa: val, disponibilidad: disp });
			// Aquí puedes implementar la lógica real de filtrado
		});
	}

	// masInfo: manejo básico para todos los botones de más información
	// --- LÓGICA DEL MODAL (POP-UP) ---
    const modal = document.getElementById('modalBanco');
    const closeBtn = document.querySelector('.close-btn');
    
    // Elementos dentro del modal que vamos a cambiar
    const modalImg = document.getElementById('modal-img');
    const modalNombre = document.getElementById('modal-nombre');

    // Al hacer clic en "Más Info"
    document.querySelectorAll('.masInfo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            
            // 1. Extraer los datos de la tarjeta clickeada
            const nombreBanco = card.querySelector('h3').textContent;
            const imgSrc = card.querySelector('img').src; 

            // 2. Inyectar esos datos en el modal
            modalNombre.textContent = nombreBanco;
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
});
