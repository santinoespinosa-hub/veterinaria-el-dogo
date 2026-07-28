let clientes = JSON.parse(localStorage.getItem('clientes')) || [
    { dni: "38123456", nombre: "Juan Pérez", direccion: "Urquiza 123", telefono: "3476123456" }
];

const tabla = document.getElementById('lista-clientes');
const dialogo = document.getElementById('dialogo-cliente');
const btnNuevo = document.getElementById('btn-nuevo-cliente');
const btnCancelar = document.getElementById('btn-cancelar-cliente');
const form = document.getElementById('form-cliente');
const tituloDialogo = document.getElementById('dialogo-titulo');
const inputIndex = document.getElementById('cli-index');

function renderClientes() {
    tabla.innerHTML = '';
    clientes.forEach((cli, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="DNI">${cli.dni}</td>
            <td data-label="Nombre y Apellido">${cli.nombre}</td>
            <td data-label="Dirección">${cli.direccion}</td>
            <td data-label="Teléfono">${cli.telefono}</td>
            <td data-label="Acciones">
                <button onclick="editarCliente(${index})">Editar</button>
                <button onclick="eliminarCliente(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(tr);
    });
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Abrir modal para NUEVO cliente
btnNuevo.addEventListener('click', () => {
    form.reset();
    inputIndex.value = "-1";
    tituloDialogo.textContent = "Cargar Cliente";
    dialogo.showModal();
});

btnCancelar.addEventListener('click', () => dialogo.close());

// Guardar (Crear o Modificar)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(inputIndex.value);
    const clienteData = {
        dni: document.getElementById('cli-dni').value,
        nombre: document.getElementById('cli-nombre').value,
        direccion: document.getElementById('cli-direccion').value,
        telefono: document.getElementById('cli-telefono').value,
    };

    if (index === -1) {
        // Crear nuevo
        clientes.push(clienteData);
    } else {
        // Editar existente
        clientes[index] = clienteData;
    }

    renderClientes();
    form.reset();
    dialogo.close();
});

// Función para cargar los datos en el modal y editar
window.editarCliente = function(index) {
    const cli = clientes[index];
    document.getElementById('cli-dni').value = cli.dni;
    document.getElementById('cli-nombre').value = cli.nombre;
    document.getElementById('cli-direccion').value = cli.direccion;
    document.getElementById('cli-telefono').value = cli.telefono;
    
    inputIndex.value = index;
    tituloDialogo.textContent = "Editar Cliente";
    dialogo.showModal();
};

window.eliminarCliente = function(index) {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
        clientes.splice(index, 1);
        renderClientes();
    }
};

renderClientes();