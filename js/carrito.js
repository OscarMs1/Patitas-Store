function obtenerCarrito() {
  try {
    let carrito = JSON.parse(localStorage.getItem("carrito"));
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function agregarAlCarrito(codigo) {
  let producto = buscarProducto(codigo);
  if (producto === null || producto.stock <= 0) {
    alert("Este producto no tiene stock disponible.");
    return;
  }

  let carrito = obtenerCarrito();
  let encontrado = false;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === codigo) {
      if (carrito[i].cantidad >= producto.stock) {
        alert("No puedes añadir más unidades que el stock disponible.");
        return;
      }
      carrito[i].cantidad = carrito[i].cantidad + 1;
      encontrado = true;
    }
  }

  if (encontrado === false) {
    carrito.push({ codigo: codigo, cantidad: 1 });
  }

  guardarCarrito(carrito);
  alert("Producto añadido al carrito.");
}

function cambiarCantidad(codigo, cuanto) {
  let carrito = obtenerCarrito();
  let nuevo = [];
  let producto = buscarProducto(codigo);

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === codigo) {
      let cantidadNueva = carrito[i].cantidad + cuanto;
      if (producto !== null && cantidadNueva > producto.stock) {
        alert("Solo quedan " + producto.stock + " unidades disponibles.");
        cantidadNueva = producto.stock;
      }
      carrito[i].cantidad = cantidadNueva;
    }
    if (carrito[i].cantidad > 0 && buscarProducto(carrito[i].codigo) !== null) {
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
  let itemsValidos = [];

  for (let i = 0; i < carrito.length; i++) {
    if (buscarProducto(carrito[i].codigo) !== null && carrito[i].cantidad > 0) {
      itemsValidos.push(carrito[i]);
    }
  }

  if (itemsValidos.length !== carrito.length) {
    guardarCarrito(itemsValidos);
  }

  if (itemsValidos.length === 0) {
    caja.innerHTML = `
      <div class="caja text-center estado-vacio">
        <h2 class="h5">Tu carrito está vacío</h2>
        <p class="ayuda">Todavía no has añadido productos.</p>
        <a class="btn btn-principal mt-2" href="productos.html">Ver productos</a>
      </div>`;
    return;
  }

  let filas = "";
  let total = 0;

  for (let i = 0; i < itemsValidos.length; i++) {
    let p = buscarProducto(itemsValidos[i].codigo);
    let subtotal = p.precio * itemsValidos[i].cantidad;
    total = total + subtotal;

    filas = filas + `
      <tr>
        <td>
          <div class="producto-carrito">
            <img src="${p.imagen}" alt="${p.nombre}" width="64">
            <span>${p.nombre}</span>
          </div>
        </td>
        <td>${precioBonito(p.precio)}</td>
        <td>
          <button class="btn-mini" onclick="cambiarCantidad('${p.codigo}', -1)" aria-label="Restar una unidad">−</button>
          <strong class="mx-2">${itemsValidos[i].cantidad}</strong>
          <button class="btn-mini" onclick="cambiarCantidad('${p.codigo}', 1)" aria-label="Sumar una unidad">+</button>
        </td>
        <td><strong>${precioBonito(subtotal)}</strong></td>
        <td>
          <button class="btn-eliminar" onclick="eliminarDelCarrito('${p.codigo}')">Eliminar</button>
        </td>
      </tr>`;
  }

  let sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;
  let avisoSesion = sesion === null
    ? `<p class="aviso-sesion">Debes iniciar sesión o registrarte antes de finalizar la compra.</p>`
    : `<p class="aviso-sesion aviso-sesion-ok">Comprarás como ${sesion.nombre} (${sesion.correo}).</p>`;
  let textoBoton = sesion === null ? "Iniciar sesión para comprar" : "Finalizar compra";

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

      ${avisoSesion}
      <button class="btn btn-principal w-100 mt-2" onclick="finalizarCompra()">${textoBoton}</button>
    </div>`;
}

function finalizarCompra() {
  let carrito = obtenerCarrito();
  if (carrito.length === 0) {
    return;
  }

  let sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;
  if (sesion === null) {
    localStorage.setItem("avisoLoginPatitas", "Inicia sesión o crea una cuenta para terminar tu compra.");
    window.location.href = "login.html?volver=carrito";
    return;
  }

  let items = [];
  let total = 0;

  for (let i = 0; i < carrito.length; i++) {
    let producto = buscarProducto(carrito[i].codigo);
    if (producto === null || carrito[i].cantidad > producto.stock) {
      alert("Revisa las cantidades: uno de los productos ya no tiene stock suficiente.");
      pintarCarrito();
      return;
    }

    items.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: carrito[i].cantidad
    });
    total = total + producto.precio * carrito[i].cantidad;
  }

  for (let i = 0; i < items.length; i++) {
    let producto = buscarProducto(items[i].codigo);
    producto.stock = producto.stock - items[i].cantidad;
  }
  guardarProductos(productos);

  let ordenes = obtenerOrdenes();
  let ahora = new Date();
  ordenes.push({
    id: "ORD-" + String(ahora.getTime()).slice(-6),
    fecha: ahora.toISOString(),
    cliente: sesion.nombre,
    correo: sesion.correo,
    estado: "Recibida",
    total: total,
    items: items
  });
  guardarOrdenes(ordenes);

  guardarCarrito([]);
  alert("Compra simulada correctamente. Tu orden quedó registrada.");
  pintarCarrito();
}

actualizarContador();
pintarCarrito();
