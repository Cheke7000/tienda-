// ==========================================================
//  NÚMERO DE WHATSAPP DEL NEGOCIO (formato internacional, sin + ni espacios)
// ==========================================================
const NUMERO_WHATSAPP = "50375762718";

// ==========================================================
//  ESTADO DEL CARRITO
//  Ejemplo de un item: { nombre: "Camisa Azul", precio: 15, cantidad: 2 }
// ==========================================================
let carrito = [];

// ==========================================================
//  REFERENCIAS A ELEMENTOS DEL DOM
// ==========================================================
const contadorCarrito   = document.getElementById("contador-carrito");
const itemsCarritoUL    = document.getElementById("items-carrito");
const totalCarritoSpan  = document.getElementById("total-carrito");
const panelCarrito      = document.getElementById("panel-carrito");
const fondoOscuro       = document.getElementById("fondo-oscuro");

const btnVerCarrito     = document.getElementById("btn-ver-carrito");
const btnCerrarCarrito  = document.getElementById("btn-cerrar-carrito");
const btnFinalizar      = document.getElementById("btn-finalizar-compra");

// ==========================================================
//  1. AGREGAR PRODUCTOS AL CARRITO
//     (funciona para todos los .producto que existan, sin
//      importar cuántos agregues en el HTML)
// ==========================================================
document.querySelectorAll(".producto").forEach((producto) => {
  const btnAgregar = producto.querySelector(".btn-agregar");

  btnAgregar.addEventListener("click", () => {
    const nombre = producto.dataset.nombre;
    const precio = parseFloat(producto.dataset.precio);

    agregarAlCarrito(nombre, precio);
    abrirCarrito();
  });
});

function agregarAlCarrito(nombre, precio) {
  const itemExistente = carrito.find((item) => item.nombre === nombre);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

// ==========================================================
//  2. QUITAR / CAMBIAR CANTIDAD
// ==========================================================
function cambiarCantidad(nombre, delta) {
  const item = carrito.find((i) => i.nombre === nombre);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    carrito = carrito.filter((i) => i.nombre !== nombre);
  }

  actualizarCarrito();
}

function quitarDelCarrito(nombre) {
  carrito = carrito.filter((i) => i.nombre !== nombre);
  actualizarCarrito();
}

// ==========================================================
//  3. RENDERIZAR EL CARRITO EN PANTALLA
// ==========================================================
function actualizarCarrito() {
  // Vaciamos la lista visual
  itemsCarritoUL.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    totalItems += item.cantidad;

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="item-nombre">${item.nombre}</span>

      <span class="item-cantidad">
        <button class="btn-restar" aria-label="Restar">-</button>
        <span>${item.cantidad}</span>
        <button class="btn-sumar" aria-label="Sumar">+</button>
      </span>

      <span>$${subtotal.toFixed(2)}</span>

      <button class="btn-quitar" aria-label="Quitar">🗑</button>
    `;

    // Botones de esa fila
    li.querySelector(".btn-sumar").addEventListener("click", () => cambiarCantidad(item.nombre, 1));
    li.querySelector(".btn-restar").addEventListener("click", () => cambiarCantidad(item.nombre, -1));
    li.querySelector(".btn-quitar").addEventListener("click", () => quitarDelCarrito(item.nombre));

    itemsCarritoUL.appendChild(li);
  });

  totalCarritoSpan.textContent = total.toFixed(2);
  contadorCarrito.textContent = totalItems;
}

// ==========================================================
//  4. ABRIR / CERRAR PANEL DEL CARRITO
// ==========================================================
function abrirCarrito() {
  panelCarrito.classList.remove("oculto");
  fondoOscuro.classList.remove("oculto");
}

function cerrarCarrito() {
  panelCarrito.classList.add("oculto");
  fondoOscuro.classList.add("oculto");
}

btnVerCarrito.addEventListener("click", abrirCarrito);
btnCerrarCarrito.addEventListener("click", cerrarCarrito);
fondoOscuro.addEventListener("click", cerrarCarrito);

// ==========================================================
//  5. FINALIZAR COMPRA -> ARMAR MENSAJE Y ABRIR WHATSAPP
// ==========================================================
btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega algún producto antes de finalizar la compra.");
    return;
  }

  let mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n\n";
  let total = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• ${item.cantidad}x ${item.nombre} - $${subtotal.toFixed(2)}\n`;
  });

  mensaje += `\nTotal: $${total.toFixed(2)}`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;

  window.open(url, "_blank");
});
