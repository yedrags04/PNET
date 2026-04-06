document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("heist-form");

    if (!form) return;

    // Validar y enviar formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const bankSelect = document.getElementById("bank-select");
        const selectedOption = bankSelect.options[bankSelect.selectedIndex];
        const selectedBankName = selectedOption ? selectedOption.textContent.trim() : "";

        const card = Array.from(document.querySelectorAll("main .card")).find((item) => {
            return item.querySelector("h3")?.textContent.trim() === selectedBankName;
        });

        // Obtener todos los valores del formulario
        const formData = {
            id: Date.now(),
            leaderName: document.getElementById("leader-name").value,
            leaderEmail: document.getElementById("leader-email").value,
            experience: Number.parseInt(document.getElementById("experience").value, 10) || 0,
            bankId: bankSelect.value,
            bankName: selectedBankName,
            address: card?.dataset.address || "",
            difficulty: card?.dataset.difficulty || "",
            reward: Number.parseInt(card?.dataset.reward || "0", 10) || 0,
            operationDate: document.getElementById("operation-date").value,
            operationTime: document.getElementById("operation-time").value,
            teamSize: Number.parseInt(document.getElementById("team-size").value, 10) || 1,
            riskLevel: document.getElementById("risk-level").value,
            budget: Number.parseInt(document.getElementById("budget").value, 10) || 0,
            equipment: document.getElementById("equipment").value,
            plan: document.getElementById("plan").value,
            specialties: Array.from(
                document.querySelectorAll('input[name="specialties"]:checked'),
            ).map((el) => el.value),
            termsAccepted: Boolean(form.querySelector('input[name="terms"]')?.checked),
            status: "confirmada",
            createdAt: new Date().toISOString(),
        };

        // Validar que se hayan seleccionado especialidades
        if (formData.specialties.length === 0) {
            alert("⚠️ Debes seleccionar al menos una especialidad para tu equipo");
            return;
        }

        // Guardar en localStorage
        let heistOperations = JSON.parse(localStorage.getItem("heistcraft_operations")) || [];
        heistOperations.push(formData);
        localStorage.setItem("heistcraft_operations", JSON.stringify(heistOperations));

        // Mostrar confirmación
        alert(
            `✓ OPERACIÓN REGISTRADA\n\nLíder: ${formData.leaderName}\nBanco Objetivo: ${formData.bankName}\nFecha: ${formData.operationDate}\nHora: ${formData.operationTime}\nEquipo: ${formData.teamSize} miembros\nPresupuesto: €${formData.budget}\n\n¡Buena suerte en tu operación!`,
        );

        // Limpiar formulario
        form.reset();
    });

    // Actualizar presupuesto en tiempo real (opcional)
    const budgetInput = document.getElementById("budget");
    if (budgetInput) {
        budgetInput.addEventListener("input", function () {
            // Podría agregar validación de presupuesto aquí
        });
    }
});
