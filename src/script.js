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
			console.log('Buscar con:', { ubicacion: ubic, dificultad: dif, recompensa: val });
			// Aquí puedes implementar la lógica real de filtrado
		});
	}

	// masInfo: manejo básico para todos los botones de más información
	document.querySelectorAll('.masInfo').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const card = e.target.closest('.card');
			const nombre = card?.querySelector('h3')?.textContent || 'este banco';
			alert('Más información del banco: ' + nombre);
		});
	});
});
