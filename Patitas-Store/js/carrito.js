

function obtenerCarrito() {
  let guardado = localStorage.getItem("carrito");
  if (guardado === null) {
    return [];
  }
  return JSON.parse(guardado);
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function agregarAlCarrito(codigo) {
  let carrito = obtenerCarrito();
  let encontrado = false;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === codigo) {
      carrito[i].cantidad = carrito[i].cantidad + 1;
      encontrado = true;
    }
  }

  if (encontrado === false) {
    carrito.push({ codigo: codigo, cantidad: 1 });
  }

  guardarCarrito(carrito);
  alert("Producto anadido al carrito");
}

function cambiarCantidad(codigo, cuanto) {
  let carrito = obtenerCarrito();
  let nuevo = [];

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === codigo) {
      carrito[i].cantidad = carrito[i].cantidad + cuanto;
    }
    if (carrito[i].cantidad > 0) {
      nuevo.push(carrito[i]);
    }
  }

  guardarCarrito(nuevo);
  pintarCarrito();
}

function eliminarDelCarrito(codigo) {
  let carrito = obtenerCarrito();
  let nuevo = [];

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo !== codigo) {
      nuevo.push(carrito[i]);
    }
  }

  guardarCarrito(nuevo);
  pintarCarrito();
}

function vaciarCarrito() {
  guardarCarrito([]);
  pintarCarrito();
}

function actualizarContador() {
  let contador = document.getElementById("contadorCarrito");
  if (contador === null) {
    return;
  }

  let carrito = obtenerCarrito();
  let total = 0;

  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].cantidad;
  }

  contador.textContent = total;
}

function pintarCarrito() {
  let caja = document.getElementById("tablaCarrito");
  if (caja === null) {
    return;
  }

  let carrito = obtenerCarrito();

  if (carrito.length === 0) {
    caja.innerHTML = `
      <div class="caja text-center">
        <h2 class="h5">Tu carrito esta vacio</h2>
        <p class="ayuda">Todavia no has anadido productos.</p>
        <a class="btn btn-principal mt-2" href="productos.html">Ver productos</a>
      </div>`;
    return;
  }

  let filas = "";
  let total = 0;

  for (let i = 0; i < carrito.length; i++) {

    let p = buscarProducto(carrito[i].codigo);
    let subtotal = p.precio * carrito[i].cantidad;
    total = total + subtotal;

    filas = filas + `
      <tr>
        <td>
          <img src="${p.imagen}" alt="${p.nombre}" width="56" class="me-2">
          ${p.nombre}
        </td>
        <td>${precioBonito(p.precio)}</td>
        <td>
          <button class="btn-mini" onclick="cambiarCantidad('${p.codigo}', -1)">-</button>
          <strong class="mx-2">${carrito[i].cantidad}</strong>
          <button class="btn-mini" onclick="cambiarCantidad('${p.codigo}', 1)">+</button>
        </td>
        <td><strong>${precioBonito(subtotal)}</strong></td>
        <td>
          <button class="btn-eliminar" onclick="eliminarDelCarrito('${p.codigo}')">Eliminar</button>
        </td>
      </tr>`;
  }

  caja.innerHTML = `
    <div class="caja">
      <div class="table-responsive">
        <table class="tabla-simple">
          <thead>
            <tr>
              <th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between align-items-center flex-wrap mt-4 gap-2">
        <button class="btn btn-secundario" onclick="vaciarCarrito()">Vaciar carrito</button>
        <h2 class="h4 mb-0">Total: ${precioBonito(total)}</h2>
      </div>

      <button class="btn btn-principal w-100 mt-3" onclick="finalizarCompra()">
        Finalizar compra
      </button>
    </div>`;
}

function finalizarCompra() {
  alert("Compra simulada correctamente. Gracias por preferir Patitas Store.");
  vaciarCarrito();
}

actualizarContador();
pintarCarrito();
