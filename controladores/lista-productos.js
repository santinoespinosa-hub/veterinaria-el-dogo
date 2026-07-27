import { productos as productosIniciales } from "../modelos/productos.js";

// Elementos del DOM
const listaProductos = document.querySelector('#lista-productos');
const btnNuevo = document.querySelector('#btn-nuevo-producto');
const dialogo = document.querySelector('#dialogo-producto');
const formProducto = document.querySelector('#form-producto');
const btnCancelar = document.querySelector('#btn-cancelar');
const dialogoTitulo = document.querySelector('#dialogo-titulo');
const inputCodigo = document.querySelector('#prod-codigo');
const inputModoEdicion = document.querySelector('#modo-edicion');

document.addEventListener("DOMContentLoaded", ()=> {
    mostrarProductos();
    inicializarEventos();
})

const inicializarEventos = () => {
    // Abrir el modal de creación
    btnNuevo.addEventListener('click', () => {
        dialogoTitulo.textContent = 'Cargar Producto';
        formProducto.reset();
        inputCodigo.disabled = false; // Asegura que esté habilitado al crear nuevo
        inputModoEdicion.value = 'false';
        dialogo.showModal();
    });

    // Cerrar Modal
    btnCancelar.addEventListener('click', () => {
        dialogo.close();
    });

    // Envío del formulario
    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const codigo = Number(inputCodigo.value);
        const productoData = {
            codigo,
            nombre: document.getElementById('prod-nombre').value,
            categoria: document.getElementById('prod-categoria').value,
            precio: Number(document.getElementById('prod-precio').value),
            imagen: document.getElementById('prod-imagen').value || 'nodisponible.png',
            descripcion: {
                marca: document.getElementById('prod-marca').value,
                presentacion: document.getElementById('prod-presentacion').value,
                tipo_contenido: document.getElementById('prod-tipo-contenido').value,
                especificacion: document.getElementById('prod-especificacion').value
            }
        };

        const esEdicion = inputModoEdicion.value === 'true';
        let exito = false;

        if (esEdicion) {
            exito = modificar(codigo, productoData);
        } else {
            exito = insertar(productoData);
        }

        if(exito) {
            dialogo.close();
        }

    });
}

const obtenerProductos = () => {
    const prodStr = localStorage.getItem('productos');
    if(!prodStr) {
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return JSON.parse(prodStr);
}

/**
 * Muestra la lista de productos con formato veterinario
 */
const mostrarProductos = () => {
    listaProductos.innerHTML = '';
    const productos = obtenerProductos();
    productos.map(producto => (
        listaProductos.innerHTML += `
            <article class="servicio">
                <h3><span name="codigo">${producto.codigo}</span> - <span name="nombre">${producto.nombre}</span></h3>
                <div class="servicio-icono">
                    <img src="./imagenes/productos/${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="servicio-contenido">
                    <p>
                        <strong>Marca:</strong> ${producto.descripcion.marca} <br>
                        <strong>Presentación:</strong> ${producto.descripcion.presentacion} <br>
                        <strong>Contenido:</strong> ${producto.descripcion.tipo_contenido} <br>
                        <strong>Detalle:</strong> ${producto.descripcion.especificacion}
                    </p>
                    <h4>$ <span name="precio">${producto.precio}</span>.-</h4>

                    <button class="boton" onclick="agregar(this)">Comprar</button>
                    
                    <div class="admin-opciones">
                        <button class="boton-card-editar" data-codigo="${producto.codigo}">Editar</button>
                        <button class="boton-card-eliminar" data-codigo="${producto.codigo}">Eliminar</button>
                    </div>
                </div>
            </article>
        `
    ))
}

// Guardar productos en localStorage
const guardarProductos = (lista) => {
    localStorage.setItem('productos', JSON.stringify(lista));
};

/**
 * Agrega un nuevo producto a localStorage
 */
export const insertar = (productoNuevo) => {
    const productos = obtenerProductos();
    const existe = productos.some(p => Number(p.codigo) === Number(productoNuevo.codigo));
    if (existe) {
        alert('Ya existe un producto con el código ' + productoNuevo.codigo);
        return false;
    }
    productos.push(productoNuevo);
    guardarProductos(productos);
    mostrarProductos();
    return true;
};

/**
 * Modifica un producto del localStorage
 */
export const modificar = (codigo, productoModificado) => {
    const productos = obtenerProductos();
    const index = productos.findIndex(p => Number(p.codigo) === Number(codigo));

    if(index !== -1) {
        productos[index] = { ...productos[index], ...productoModificado };
        guardarProductos(productos);
        mostrarProductos();
        return true;
    }

    return false;
}

/**
 * Elimina un producto del localStorage
 */
export const eliminar = (codigo) => {
    if(confirm(`¿Está seguro que desea eliminar al producto código ${codigo}`)) {
        const productos = obtenerProductos();
        const filtrados = productos.filter(p => Number(p.codigo) !== Number(codigo));
        guardarProductos(filtrados);
        mostrarProductos();
        return true;
    }
    return false;
}

// Delegación de eventos para los botones Editar y Eliminar
listaProductos.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('boton-card-editar')) {
        const codigo = target.dataset.codigo;
        abrirModalModificar(codigo);
    } else if(target.classList.contains('boton-card-eliminar')) {
        const codigo = target.dataset.codigo;
        eliminar(codigo);
    }
})

const abrirModalModificar = (codigo) => {
    const productos = obtenerProductos();
    const producto = productos.find(p => Number(p.codigo) === Number(codigo));

    if(!producto) return;

    dialogoTitulo.textContent = 'Modificar Producto';
    inputModoEdicion.value = true;

    inputCodigo.value = producto.codigo;
    inputCodigo.disabled = true;

    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-categoria').value = producto.categoria;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-imagen').value = producto.imagen;
    
    // Vinculación de los nuevos campos de texto
    document.getElementById('prod-marca').value = producto.descripcion.marca;
    document.getElementById('prod-presentacion').value = producto.descripcion.presentacion;
    document.getElementById('prod-tipo-contenido').value = producto.descripcion.tipo_contenido;
    document.getElementById('prod-especificacion').value = producto.descripcion.especificacion;

    dialogo.showModal();
}
