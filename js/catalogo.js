

function precioBonito(numero) {
  return "$" + numero.toLocaleString("es-CL");
}

function buscarProducto(codigo) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === codigo) {
      return productos[i];
    }
  }
  return null;
}

function tarjetaProducto(p) {
  let textoStock = p.stock > 0 ? "Stock: " + p.stock : "Agotado";
  let botonCarrito = p.stock > 0
    ? `<button class="btn btn-principal" onclick="agregarAlCarrito('${p.codigo}')">Añadir</button>`
    : `<button class="btn btn-principal" disabled>Agotado</button>`;

  return `
    <div class="col-sm-6 col-lg-4 mb-4">
      <div class="card-producto">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <span class="categoria">${p.categoria} &middot; ${p.mascota}</span>
        <h3>${p.nombre}</h3>
        <span class="stock-producto">${textoStock}</span>
        <p class="precio">${precioBonito(p.precio)}</p>
        <div class="acciones">
          <button class="btn btn-secundario" onclick="verDetalle('${p.codigo}')">Ver</button>
          ${botonCarrito}
        </div>
      </div>
    </div>`;
}

function pintarProductos(idContenedor, lista) {
  let contenedor = document.getElementById(idContenedor);

  if (contenedor === null) {
    return;
  }

  let html = "";

  for (let i = 0; i < lista.length; i++) {
    html = html + tarjetaProducto(lista[i]);
  }

  if (html === "") {
    html = "<p class='text-center'>No hay productos en esta categoria.</p>";
  }

  contenedor.innerHTML = html;
}

function verDetalle(codigo) {
  localStorage.setItem("productoElegido", codigo);
  window.location.href = "detalle-producto.html";
}

function filtrarCategoria(categoria) {

  let filtrados = [];

  for (let i = 0; i < productos.length; i++) {
    if (categoria === "Todos" || productos[i].categoria === categoria) {
      filtrados.push(productos[i]);
    }
  }

  pintarProductos("listaProductos", filtrados);

  let botones = document.getElementsByClassName("boton-filtro");
  for (let i = 0; i < botones.length; i++) {
    if (botones[i].textContent === categoria) {
      botones[i].className = "boton-filtro activo";
    } else {
      botones[i].className = "boton-filtro";
    }
  }
}

function pintarFiltros() {
  let caja = document.getElementById("filtros");
  if (caja === null) {
    return;
  }

  let html = "";
  for (let i = 0; i < categorias.length; i++) {
    let clase = "boton-filtro";
    if (categorias[i] === "Todos") {
      clase = "boton-filtro activo";
    }
    html = html + `<button class="${clase}" onclick="filtrarCategoria('${categorias[i]}')">${categorias[i]}</button>`;
  }

  caja.innerHTML = html;
}

function pintarDetalle() {
  let caja = document.getElementById("detalleProducto");
  if (caja === null) {
    return;
  }

  let codigo = localStorage.getItem("productoElegido");
  let p = buscarProducto(codigo);

  if (p === null) {
    window.location.href = "productos.html";
    return;
  }

  let listaCaracteristicas = "";
  for (let i = 0; i < p.caracteristicas.length; i++) {
    listaCaracteristicas = listaCaracteristicas + "<li>" + p.caracteristicas[i] + "</li>";
  }

  caja.innerHTML = `
    <div class="row">
      <div class="col-md-5 mb-3">
        <img src="${p.imagen}" alt="${p.nombre}" class="img-fluid detalle-imagen">
      </div>
      <div class="col-md-7">
        <span class="categoria">${p.categoria} &middot; Para ${p.mascota}</span>
        <h1>${p.nombre}</h1>
        <p class="precio">${precioBonito(p.precio)}</p>
        <p>${p.descripcion}</p>
        <h2 class="h6 mt-4">Características</h2>
        <ul>${listaCaracteristicas}</ul>
        <p class="ayuda">Codigo: ${p.codigo} &middot; Stock disponible: ${p.stock}</p>
        ${p.stock > 0
          ? `<button class="btn btn-principal mt-2" onclick="agregarAlCarrito('${p.codigo}')">Añadir al carrito</button>`
          : `<button class="btn btn-principal mt-2" disabled>Producto agotado</button>`}
        <a class="btn btn-secundario mt-2" href="productos.html">Volver</a>
      </div>
    </div>`;
}

pintarProductos("productosDestacados", [productos[0], productos[2], productos[3]]);
pintarFiltros();
pintarProductos("listaProductos", productos);
pintarDetalle();
