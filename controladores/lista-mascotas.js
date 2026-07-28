let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [
    { nombre: "Rocko", especie: "Perro / Dogo Argentino", dniDueno: "38123456", dueno: "Juan Pérez" }
];

const tabla = document.getElementById('lista-mascotas');
const dialogo = document.getElementById('dialogo-mascota');
const btnNuevo = document.getElementById('btn-nueva-mascota');
const btnCancelar = document.getElementById('btn-cancelar-mascota');
const form = document.getElementById('form-mascota');
const tituloDialogo = document.getElementById('dialogo-titulo-mascota');
const inputIndex = document.getElementById('mas-index');

function renderMascotas() {
    tabla.innerHTML = '';
    mascotas.forEach((mas, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Mascota">${mas.nombre}</td>
            <td data-label="Especie / Raza">${mas.especie}</td>
            <td data-label="DNI Dueño">${mas.dniDueno}</td>
            <td data-label="Nombre Dueño">${mas.dueno}</td>
            <td data-label="Acciones">
                <button onclick="editarMascota(${index})">Editar</button>
                <button onclick="eliminarMascota(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(tr);
    });
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

// Abrir modal para NUEVA mascota
btnNuevo.addEventListener('click', () => {
    form.reset();
    inputIndex.value = "-1";
    if (tituloDialogo) tituloDialogo.textContent = "Cargar Mascota";
    dialogo.showModal();
});

btnCancelar.addEventListener('click', () => dialogo.close());

// Guardar (Crear o Modificar)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(inputIndex.value);
    const mascotaData = {
        nombre: document.getElementById('mas-nombre').value,
        especie: document.getElementById('mas-especie').value,
        dniDueno: document.getElementById('mas-dni-dueno').value,
        dueno: document.getElementById('mas-nombre-dueno').value,
    };

    if (index === -1) {
        mascotas.push(mascotaData);
    } else {
        mascotas[index] = mascotaData;
    }

    renderMascotas();
    form.reset();
    dialogo.close();
});

// Cargar datos en modal para Editar
window.editarMascota = function(index) {
    const mas = mascotas[index];
    document.getElementById('mas-nombre').value = mas.nombre;
    document.getElementById('mas-especie').value = mas.especie;
    document.getElementById('mas-dni-dueno').value = mas.dniDueno;
    document.getElementById('mas-nombre-dueno').value = mas.dueno;

    inputIndex.value = index;
    if (tituloDialogo) tituloDialogo.textContent = "Editar Mascota";
    dialogo.showModal();
};

window.eliminarMascota = function(index) {
    if (confirm("¿Estás seguro de eliminar esta mascota?")) {
        mascotas.splice(index, 1);
        renderMascotas();
    }
};

renderMascotas();