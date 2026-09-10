

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

// ------------------------------------------------------------
// Dice si un producto esta en oferta.
// La regla es simple: esta en oferta si tiene precioAnterior y
// ese precio anterior es mayor que el que se cobra hoy.
// ------------------------------------------------------------
function estaEnOferta(p) {
  if (p.precioAnterior === undefined) {
    return false;
  }
  if (p.precioAnterior > p.precio) {
    return true;
  }
  return false;
}

// ------------------------------------------------------------
// Calcula cuanto por ciento se descuenta, redondeado.
// Ejemplo: de 52990 a 42990 son 10000 de rebaja, o sea 19%.
// ------------------------------------------------------------
function porcentajeDescuento(p) {
  let rebaja = p.precioAnterior - p.precio;
  let porcentaje = (rebaja / p.precioAnterior) * 100;
  return Math.round(porcentaje);
}

function tarjetaProducto(p) {
  let textoStock = p.stock > 0 ? "Stock: " + p.stock : "Agotado";
  let botonCarrito = p.stock > 0
    ? `<button class="btn btn-principal" onclick="agregarAlCarrito('${p.codigo}')">Añadir</button>`
    : `<button class="btn btn-principal" disabled>Agotado</button>`;

  // Si el producto esta en oferta armamos dos trozos de HTML extra:
  // la etiqueta roja de la esquina y el precio viejo tachado.
  let etiqueta = "";
  let precioViejo = "";

  if (estaEnOferta(p) === true) {
    etiqueta = `<span class="etiqueta-oferta">-${porcentajeDescuento(p)}%</span>`;
    precioViejo = `<span class="precio-antes">${precioBonito(p.precioAnterior)}</span>`;
  }

  return `
    <div class="col-sm-6 col-lg-4 mb-4">
      <div class="card-producto">
        ${etiqueta}
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <span class="categoria">${p.categoria} &middot; ${p.mascota}</span>
        <h3>${p.nombre}</h3>
        <span class="stock-producto">${textoStock}</span>
        <p class="precio">${precioViejo}${precioBonito(p.precio)}</p>
        <div class="acciones">
          <button class="btn btn-secundario" onclick="verDetalle('${p.codigo}')">Ver</button>
          ${botonCarrito}
        </div>
      </div>
    </div>`;
}

function pintarProductos(idContenedor, lista, mensajeVacio) {
  let contenedor = document.getElementById(idContenedor);

  if (contenedor === null) {
    return;
  }

  let html = "";

  for (let i = 0; i < lista.length; i++) {
    html = html + tarjetaProducto(lista[i]);
  }

  if (html === "") {
    if (mensajeVacio === undefined) {
      mensajeVacio = "No hay productos en esta categoria.";
    }
    html = "<div class='estado-vacio'>" + mensajeVacio + "</div>";
  }

  contenedor.innerHTML = html;
}

function verDetalle(codigo) {
  localStorage.setItem("productoElegido", codigo);
  window.location.href = "detalle-producto.html";
}

function filtrarCategoria(categoria) {

  // Si veniamos de una busqueda, borramos el mensaje de arriba:
  // ya no estamos mirando resultados de busqueda.
  mostrarResumen("");

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

// ============================================================
//  BUSCADOR
// ============================================================

// ------------------------------------------------------------
// Deja un texto listo para comparar: todo en minusculas y sin
// tildes. Asi "Alimento" encuentra a "alimento" y "raton" a
// "raton" aunque uno de los dos venga con tilde.
// ------------------------------------------------------------
function normalizar(texto) {
  let limpio = texto.toLowerCase();
  limpio = limpio.replace(/á/g, "a");
  limpio = limpio.replace(/é/g, "e");
  limpio = limpio.replace(/í/g, "i");
  limpio = limpio.replace(/ó/g, "o");
  limpio = limpio.replace(/ú/g, "u");
  return limpio;
}

// ------------------------------------------------------------
// Devuelve los productos que calzan con lo que se escribio.
// Busca en el nombre, en la categoria y en el tipo de mascota,
// asi que "gato" y "juguetes" tambien funcionan.
// ------------------------------------------------------------
function buscarPorTexto(texto) {
  let buscado = normalizar(texto);
  let encontrados = [];

  for (let i = 0; i < productos.length; i++) {
    let p = productos[i];
    let dondeBuscar = normalizar(p.nombre + " " + p.categoria + " " + p.mascota);

    // indexOf devuelve -1 cuando NO encuentra el texto
    if (dondeBuscar.indexOf(buscado) !== -1) {
      encontrados.push(p);
    }
  }

  return encontrados;
}

// ------------------------------------------------------------
// Llena las RECOMENDACIONES del buscador.
// El <datalist> del HTML es la listita que aparece sola debajo
// del campo mientras uno escribe. Aca le metemos el nombre de
// cada producto y ademas las categorias.
// ------------------------------------------------------------
function pintarSugerencias() {
  let caja = document.getElementById("sugerencias");

  if (caja === null) {
    return;
  }

  let html = "";

  for (let i = 0; i < productos.length; i++) {
    html = html + "<option value=\"" + productos[i].nombre + "\">";
  }

  for (let i = 0; i < categorias.length; i++) {
    if (categorias[i] !== "Todos") {
      html = html + "<option value=\"" + categorias[i] + "\">";
    }
  }

  html = html + "<option value=\"Perro\">";
  html = html + "<option value=\"Gato\">";

  caja.innerHTML = html;
}

// ------------------------------------------------------------
// Escribe arriba del listado que fue lo que se busco.
// ------------------------------------------------------------
function mostrarResumen(texto) {
  let caja = document.getElementById("resumenBusqueda");

  if (caja === null) {
    return;
  }

  caja.innerHTML = texto;
}


// ============================================================
//  OFERTAS
// ============================================================

// ------------------------------------------------------------
// Junta todos los productos que tienen precio rebajado.
// ------------------------------------------------------------
function productosEnOferta() {
  let enOferta = [];

  for (let i = 0; i < productos.length; i++) {
    if (estaEnOferta(productos[i]) === true) {
      enOferta.push(productos[i]);
    }
  }

  return enOferta;
}

// ------------------------------------------------------------
// Los tres productos que se muestran en el inicio.
// Primero los que estan en oferta; si faltan, se completan con
// los primeros del catalogo.
// ------------------------------------------------------------
function productosDestacados() {
  let elegidos = productosEnOferta();

  for (let i = 0; i < productos.length; i++) {
    if (elegidos.length >= 3) {
      break;
    }
    if (elegidos.indexOf(productos[i]) === -1) {
      elegidos.push(productos[i]);
    }
  }

  return elegidos.slice(0, 3);
}


// ============================================================
//  ARRANQUE
//  Esto corre una vez, cuando termina de cargar la pagina.
//  Cada funcion revisa sola si el elemento existe, asi que da
//  igual en que pagina estemos.
// ============================================================

pintarProductos("productosDestacados", productosDestacados());
pintarProductos("productosOferta", productosEnOferta(), "Por ahora no hay ofertas activas.");
pintarFiltros();
pintarSugerencias();

// URLSearchParams lee lo que viene despues del ? en la direccion.
// Por ejemplo en productos.html?categoria=juguetes el valor de
// "categoria" es "juguetes".
let parametros = new URLSearchParams(window.location.search);
let textoBuscado = parametros.get("q");
let verOfertas = parametros.get("ofertas");
let categoriaURL = parametros.get("categoria");

if (textoBuscado !== null && textoBuscado !== "") {

  // Llegamos desde el buscador
  let resultados = buscarPorTexto(textoBuscado);
  mostrarResumen("Resultados para <strong>" + textoBuscado + "</strong>: " +
                 resultados.length + " producto(s).");
  pintarProductos("listaProductos", resultados,
                  "No encontramos nada con ese nombre. Prueba con Alimento, Juguetes, Accesorios, Perro o Gato.");

} else if (verOfertas === "true") {

  // Llegamos desde el boton de Ofertas
  mostrarResumen("Mostrando solo los productos <strong>en oferta</strong>.");
  pintarProductos("listaProductos", productosEnOferta(),
                  "Por ahora no hay ofertas activas.");

} else if (categoriaURL === "alimentos") {
  filtrarCategoria("Alimento");
} else if (categoriaURL === "juguetes") {
  filtrarCategoria("Juguetes");
} else if (categoriaURL === "accesorios") {
  filtrarCategoria("Accesorios");
} else {
  filtrarCategoria("Todos");
}

pintarDetalle();
