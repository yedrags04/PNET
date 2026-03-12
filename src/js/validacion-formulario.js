document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('heist-form');

	if (!form) return;

	// Validar y enviar formulario
	form.addEventListener('submit', function(e) {
		e.preventDefault();

		// Obtener todos los valores del formulario
		const formData = {
			leaderName: document.getElementById('leader-name').value,
			leaderEmail: document.getElementById('leader-email').value,
			experience: document.getElementById('experience').value,
			bankSelect: document.getElementById('bank-select').value,
			operationDate: document.getElementById('operation-date').value,
			operationTime: document.getElementById('operation-time').value,
			teamSize: document.getElementById('team-size').value,
			riskLevel: document.getElementById('risk-level').value,
			budget: document.getElementById('budget').value,
			equipment: document.getElementById('equipment').value,
			plan: document.getElementById('plan').value,
			specialties: Array.from(document.querySelectorAll('input[name="specialties"]:checked')).map(el => el.value),
			timestamp: new Date().toLocaleString('es-ES')
		};

		// Validar que se hayan seleccionado especialidades
		if (formData.specialties.length === 0) {
			alert('⚠️ Debes seleccionar al menos una especialidad para tu equipo');
			return;
		}

		// Guardar en localStorage
		let heistOperations = JSON.parse(localStorage.getItem('heistcraft_operations')) || [];
		formData.id = Date.now();
		heistOperations.push(formData);
		localStorage.setItem('heistcraft_operations', JSON.stringify(heistOperations));

		// Mostrar confirmación
		const bankName = document.querySelector(`#bank-select option[value="${formData.bankSelect}"]`).textContent;
		alert(`✓ OPERACIÓN REGISTRADA\n\nLíder: ${formData.leaderName}\nBanco Objetivo: ${bankName}\nFecha: ${formData.operationDate}\nHora: ${formData.operationTime}\nEquipo: ${formData.teamSize} miembros\nPresupuesto: €${formData.budget}\n\n¡Buena suerte en tu operación!`);

		// Limpiar formulario
		form.reset();
	});

	// Actualizar presupuesto en tiempo real (opcional)
	const budgetInput = document.getElementById('budget');
	if (budgetInput) {
		budgetInput.addEventListener('input', function() {
			// Podría agregar validación de presupuesto aquí
		});
	}
});
