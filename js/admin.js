let usuarios = typeof obtenerUsuarios === "function" ? obtenerUsuarios() : [];
let sesionPanel = typeof obtenerSesion === "function" ? obtenerSesion() : null;

function formatoPrecio(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}

function esAdministrador() {
  return sesionPanel !== null && sesionPanel.tipo === "Administrador";
}

function pintarTablaProductos() {
  let cuerpo = document.getElementById("cuerpoTablaProductos");
  if (cuerpo === null) {
    return;
  }

  let html = "";

  for (let i = 0; i < productos.length; i++) {
    let p = productos[i];
    let claseFila = "";
    let etiqueta = "<span class='etiqueta-stock stock-ok'>Stock normal</span>";

    if (p.stock <= p.stockCritico) {
      claseFila = "fila-critica";
      etiqueta = "<span class='etiqueta-stock stock-critico'>Stock crítico</span>";
    }

    let editar = esAdministrador()
      ? `<a class="btn btn-mini-texto" href="producto-form.html?codigo=${encodeURIComponent(p.codigo)}">Editar</a>`
      : "";

    html = html + `
      <tr class="${claseFila}">
        <td><strong>${p.codigo}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${formatoPrecio(p.precio)}</td>
        <td>${p.stock}</td>
        <td>${etiqueta}</td>
        <td class="acciones-tabla">
          <a class="btn btn-mini-texto" href="producto-detalle.html?codigo=${encodeURIComponent(p.codigo)}">Ver</a>
          ${editar}
        </td>
      </tr>`;
  }

  cuerpo.innerHTML = html;
}

function pintarTablaUsuarios() {
  let cuerpo = document.getElementById("cuerpoTablaUsuarios");
  if (cuerpo === null) {
    return;
  }

  let html = "";
  for (let i = 0; i < usuarios.length; i++) {
    let u = usuarios[i];
    html = html + `
      <tr>
        <td><strong>${u.run}</strong></td>
        <td>${u.nombre} ${u.apellidos}</td>
        <td>${u.correo}</td>
        <td>${u.comuna}</td>
        <td><span class="etiqueta-rol">${u.tipo}</span></td>
        <td><a class="btn btn-mini-texto" href="usuario-form.html?run=${encodeURIComponent(u.run)}">Editar</a></td>
      </tr>`;
  }
  cuerpo.innerHTML = html;
}

function pintarResumen() {
  let cajaProductos = document.getElementById("totalProductos");
  if (cajaProductos === null) {
    return;
  }

  let criticos = 0;
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].stock <= productos[i].stockCritico) {
      criticos = criticos + 1;
    }
  }

  cajaProductos.textContent = productos.length;
  document.getElementById("totalUsuarios").textContent = usuarios.length;
  document.getElementById("totalCriticos").textContent = criticos;

  let totalOrdenes = document.getElementById("totalOrdenes");
  if (totalOrdenes !== null) {
    totalOrdenes.textContent = obtenerOrdenes().length;
  }
}

function buscarProductoAdmin(codigo) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === codigo) {
      return productos[i];
    }
  }
  return null;
}

function rutaImagenAdmin(imagen) {
  if (imagen.indexOf("data:") === 0 || imagen.indexOf("http") === 0) {
    return imagen;
  }
  return "../" + imagen;
}

function pintarDetalleProductoAdmin() {
  let caja = document.getElementById("detalleProductoAdmin");
  if (caja === null) {
    return;
  }

  let codigo = new URLSearchParams(window.location.search).get("codigo");
  let producto = buscarProductoAdmin(codigo);

  if (producto === null) {
    caja.innerHTML = "<p>No se encontró el producto.</p>";
    return;
  }

  let caracteristicas = "";
  for (let i = 0; i < producto.caracteristicas.length; i++) {
    caracteristicas = caracteristicas + "<li>" + producto.caracteristicas[i] + "</li>";
  }

  caja.innerHTML = `
    <div class="row align-items-center">
      <div class="col-md-5 mb-3">
        <img class="img-fluid detalle-imagen" src="${rutaImagenAdmin(producto.imagen)}" alt="${producto.nombre}">
      </div>
      <div class="col-md-7">
        <span class="categoria">${producto.categoria} · ${producto.mascota}</span>
        <h2 class="h3 mt-2">${producto.nombre}</h2>
        <p class="precio">${formatoPrecio(producto.precio)}</p>
        <p>${producto.descripcion}</p>
        <ul>${caracteristicas}</ul>
        <p><strong>Código:</strong> ${producto.codigo}</p>
        <p><strong>Stock:</strong> ${producto.stock} · <strong>Stock crítico:</strong> ${producto.stockCritico}</p>
      </div>
    </div>`;
}

let formProducto = document.getElementById("formProducto");
let codigoOriginal = null;

function guardarProductoFormulario(datos, archivoImagen) {
  function terminarGuardado(imagen) {
    let productoExistente = buscarProductoAdmin(codigoOriginal);
    let productoNuevo = {
      codigo: datos.codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      stock: datos.stock,
      stockCritico: datos.stockCritico,
      categoria: datos.categoria,
      mascota: datos.mascota,
      imagen: imagen,
      caracteristicas: productoExistente !== null
        ? productoExistente.caracteristicas
        : ["Categoría: " + datos.categoria, "Para: " + datos.mascota]
    };

    if (productoExistente !== null) {
      let posicion = productos.indexOf(productoExistente);
      productos[posicion] = productoNuevo;
    } else {
      productos.push(productoNuevo);
    }

    guardarProductos(productos);
    document.getElementById("mensajeOk").style.display = "block";
    document.getElementById("mensajeOk").textContent = "Producto guardado correctamente.";
    codigoOriginal = productoNuevo.codigo;
    window.history.replaceState({}, "", "producto-form.html?codigo=" + encodeURIComponent(productoNuevo.codigo));
    window.scrollTo(0, 0);
  }

  let productoActual = buscarProductoAdmin(codigoOriginal);
  let imagenAnterior = productoActual !== null ? productoActual.imagen : "img/logo.svg";

  if (archivoImagen === undefined) {
    terminarGuardado(imagenAnterior);
    return;
  }

  if (archivoImagen.size > 1200000) {
    mostrarError("errorImagen", "La imagen debe pesar menos de 1,2 MB");
    return;
  }

  let lector = new FileReader();
  lector.onload = function () {
    terminarGuardado(lector.result);
  };
  lector.readAsDataURL(archivoImagen);
}

if (formProducto !== null) {
  codigoOriginal = new URLSearchParams(window.location.search).get("codigo");
  let productoEditar = buscarProductoAdmin(codigoOriginal);

  if (productoEditar !== null) {
    document.querySelector(".admin-titulo h1").textContent = "Editar producto";
    document.title = "Editar producto | Admin Patitas Store";
    document.getElementById("codigo").value = productoEditar.codigo;
    document.getElementById("nombre").value = productoEditar.nombre;
    document.getElementById("descripcion").value = productoEditar.descripcion;
    document.getElementById("precio").value = productoEditar.precio;
    document.getElementById("stock").value = productoEditar.stock;
    document.getElementById("stockCritico").value = productoEditar.stockCritico;
    document.getElementById("categoria").value = productoEditar.categoria;
    document.getElementById("mascota").value = productoEditar.mascota;
  }

  formProducto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;
    let codigo = document.getElementById("codigo").value.trim().toUpperCase();
    let nombre = document.getElementById("nombre").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();
    let precioTexto = document.getElementById("precio").value;
    let stockTexto = document.getElementById("stock").value;
    let criticoTexto = document.getElementById("stockCritico").value;
    let categoria = document.getElementById("categoria").value;
    let mascota = document.getElementById("mascota").value;

    if (codigo === "" || codigo.length < 3) {
      mostrarError("errorCodigo", "Código obligatorio de mínimo 3 caracteres");
      todoOk = false;
    } else {
      let repetido = buscarProductoAdmin(codigo);
      if (repetido !== null && repetido.codigo !== codigoOriginal) {
        mostrarError("errorCodigo", "Ya existe otro producto con este código");
        todoOk = false;
      } else {
        mostrarError("errorCodigo", "");
      }
    }

    if (nombre === "" || nombre.length > 100) {
      mostrarError("errorNombre", "Nombre obligatorio de máximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    if (descripcion.length > 500) {
      mostrarError("errorDescripcion", "Máximo 500 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorDescripcion", "");
    }

    if (precioTexto === "" || isNaN(precioTexto) || Number(precioTexto) < 0) {
      mostrarError("errorPrecio", "Ingresa un precio igual o mayor que 0");
      todoOk = false;
    } else {
      mostrarError("errorPrecio", "");
    }

    if (stockTexto === "" || isNaN(stockTexto) || Number(stockTexto) < 0 || Number(stockTexto) % 1 !== 0) {
      mostrarError("errorStock", "Ingresa un número entero igual o mayor que 0");
      todoOk = false;
    } else {
      mostrarError("errorStock", "");
    }

    if (criticoTexto !== "" && (isNaN(criticoTexto) || Number(criticoTexto) < 0 || Number(criticoTexto) % 1 !== 0)) {
      mostrarError("errorStockCritico", "Debe ser un entero igual o mayor que 0");
      todoOk = false;
    } else {
      mostrarError("errorStockCritico", "");
    }

    if (categoria === "") {
      mostrarError("errorCategoria", "Elige una categoría");
      todoOk = false;
    } else {
      mostrarError("errorCategoria", "");
    }

    if (mascota === "") {
      mostrarError("errorMascota", "Elige una mascota");
      todoOk = false;
    } else {
      mostrarError("errorMascota", "");
    }

    if (todoOk === true) {
      let archivo = document.getElementById("imagen").files[0];
      guardarProductoFormulario({
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion,
        precio: Number(precioTexto),
        stock: Number(stockTexto),
        stockCritico: criticoTexto === "" ? 0 : Number(criticoTexto),
        categoria: categoria,
        mascota: mascota
      }, archivo);
    }
  });

  let entradasProducto = formProducto.querySelectorAll("input, textarea, select");
  for (let i = 0; i < entradasProducto.length; i++) {
    entradasProducto[i].addEventListener("input", function () {
      let idError = "error" + this.id.charAt(0).toUpperCase() + this.id.slice(1);
      mostrarError(idError, "");
    });
  }

  function avisoStockEnVivo() {
    let stock = Number(document.getElementById("stock").value);
    let critico = Number(document.getElementById("stockCritico").value);
    let aviso = document.getElementById("avisoStock");
    if (aviso !== null && document.getElementById("stock").value !== "" && document.getElementById("stockCritico").value !== "") {
      aviso.textContent = stock <= critico ? "Aviso: el producto está en stock crítico." : "";
    }
  }
  document.getElementById("stock").addEventListener("input", avisoStockEnVivo);
  document.getElementById("stockCritico").addEventListener("input", avisoStockEnVivo);
  avisoStockEnVivo();
}

let formUsuario = document.getElementById("formUsuario");
let runOriginal = null;

if (formUsuario !== null) {
  runOriginal = new URLSearchParams(window.location.search).get("run");
  let usuarioEditar = null;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].run === runOriginal) {
      usuarioEditar = usuarios[i];
    }
  }

  if (usuarioEditar !== null) {
    document.querySelector(".admin-titulo h1").textContent = "Editar usuario";
    document.title = "Editar usuario | Admin Patitas Store";
    document.getElementById("run").value = usuarioEditar.run;
    document.getElementById("tipoUsuario").value = usuarioEditar.tipo;
    document.getElementById("nombre").value = usuarioEditar.nombre;
    document.getElementById("apellidos").value = usuarioEditar.apellidos;
    document.getElementById("correo").value = usuarioEditar.correo;
    document.getElementById("fechaNacimiento").value = usuarioEditar.fechaNacimiento || "";
    document.getElementById("region").value = usuarioEditar.region || "";
    cargarComunas();
    document.getElementById("comuna").value = usuarioEditar.comuna || "";
    document.getElementById("direccion").value = usuarioEditar.direccion || "";
    document.getElementById("password").placeholder = "Déjala vacía para conservarla";
  }

  formUsuario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;
    let run = document.getElementById("run").value.trim().toUpperCase();
    let tipo = document.getElementById("tipoUsuario").value;
    let nombre = document.getElementById("nombre").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let correo = document.getElementById("correo").value.trim().toLowerCase();
    let clave = document.getElementById("password").value;
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;
    let direccion = document.getElementById("direccion").value.trim();

    if (run === "" || runValido(run) === false) {
      mostrarError("errorRun", "RUN válido, sin puntos ni guion, de 7 a 9 caracteres");
      todoOk = false;
    } else {
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].run === run && usuarios[i].run !== runOriginal) {
          mostrarError("errorRun", "Ya existe otro usuario con este RUN");
          todoOk = false;
        }
      }
      if (todoOk === true) {
        mostrarError("errorRun", "");
      }
    }

    if (tipo === "") {
      mostrarError("errorTipoUsuario", "Elige el tipo de usuario");
      todoOk = false;
    } else {
      mostrarError("errorTipoUsuario", "");
    }

    if (nombre === "" || nombre.length > 50) {
      mostrarError("errorNombre", "Nombre obligatorio de máximo 50 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    if (apellidos === "" || apellidos.length > 100) {
      mostrarError("errorApellidos", "Apellidos obligatorios de máximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorApellidos", "");
    }

    if (correo === "" || correo.length > 100 || correoValido(correo) === false || correoPermitido(correo) === false) {
      mostrarError("errorCorreo", "Usa un correo válido @duoc.cl, @profesor.duoc.cl o @gmail.com");
      todoOk = false;
    } else {
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo.toLowerCase() === correo && usuarios[i].run !== runOriginal) {
          mostrarError("errorCorreo", "Ya existe otro usuario con este correo");
          todoOk = false;
        }
      }
    }

    if ((usuarioEditar === null && clave === "") || (clave !== "" && passwordValida(clave) === false)) {
      mostrarError("errorPassword", "Entre 4 y 10 caracteres, con letra, número y símbolo");
      todoOk = false;
    } else {
      mostrarError("errorPassword", "");
    }

    if (region === "" || comuna === "") {
      mostrarError("errorRegion", region === "" ? "Elige una región" : "");
      mostrarError("errorComuna", comuna === "" ? "Elige una comuna" : "");
      todoOk = false;
    } else {
      mostrarError("errorRegion", "");
      mostrarError("errorComuna", "");
    }

    if (direccion === "" || direccion.length > 300) {
      mostrarError("errorDireccion", "Dirección obligatoria de máximo 300 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorDireccion", "");
    }

    if (todoOk === true) {
      let usuarioNuevo = {
        run: run,
        tipo: tipo,
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        password: clave,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        region: region,
        comuna: comuna,
        direccion: direccion
      };

      if (usuarioEditar !== null) {
        usuarioNuevo.password = clave === "" ? usuarioEditar.password : clave;
        usuarios[usuarios.indexOf(usuarioEditar)] = usuarioNuevo;
      } else {
        usuarios.push(usuarioNuevo);
      }

      guardarUsuarios(usuarios);
      document.getElementById("mensajeOk").style.display = "block";
      document.getElementById("mensajeOk").textContent = "Usuario guardado correctamente.";
      runOriginal = usuarioNuevo.run;
      usuarioEditar = usuarioNuevo;
      window.history.replaceState({}, "", "usuario-form.html?run=" + encodeURIComponent(usuarioNuevo.run));
      window.scrollTo(0, 0);
    }
  });

  let entradasUsuario = formUsuario.querySelectorAll("input, select");
  for (let i = 0; i < entradasUsuario.length; i++) {
    entradasUsuario[i].addEventListener("input", function () {
      let idError = "error" + this.id.charAt(0).toUpperCase() + this.id.slice(1);
      mostrarError(idError, "");
    });
  }
}

function fechaBonita(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function pintarTablaOrdenes() {
  let cuerpo = document.getElementById("cuerpoTablaOrdenes");
  if (cuerpo === null) {
    return;
  }

  let ordenes = obtenerOrdenes();
  if (ordenes.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="6" class="text-center ayuda py-4">Todavía no hay órdenes registradas.</td></tr>';
    return;
  }

  let html = "";
  for (let i = ordenes.length - 1; i >= 0; i--) {
    let orden = ordenes[i];
    html = html + `
      <tr>
        <td><strong>${orden.id}</strong></td>
        <td>${fechaBonita(orden.fecha)}</td>
        <td>${orden.cliente}</td>
        <td>${orden.items.length}</td>
        <td>${formatoPrecio(orden.total)}</td>
        <td><a class="btn btn-mini-texto" href="orden-detalle.html?id=${encodeURIComponent(orden.id)}">Ver detalle</a></td>
      </tr>`;
  }
  cuerpo.innerHTML = html;
}

function pintarDetalleOrden() {
  let caja = document.getElementById("detalleOrden");
  if (caja === null) {
    return;
  }

  let id = new URLSearchParams(window.location.search).get("id");
  let ordenes = obtenerOrdenes();
  let orden = null;

  for (let i = 0; i < ordenes.length; i++) {
    if (ordenes[i].id === id) {
      orden = ordenes[i];
    }
  }

  if (orden === null) {
    caja.innerHTML = "<p>No se encontró la orden.</p>";
    return;
  }

  let filas = "";
  for (let i = 0; i < orden.items.length; i++) {
    let item = orden.items[i];
    filas = filas + `
      <tr>
        <td>${item.codigo}</td>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>${formatoPrecio(item.precio)}</td>
        <td><strong>${formatoPrecio(item.precio * item.cantidad)}</strong></td>
      </tr>`;
  }

  caja.innerHTML = `
    <div class="orden-encabezado">
      <div><span class="ayuda">Orden</span><strong>${orden.id}</strong></div>
      <div><span class="ayuda">Fecha</span><strong>${fechaBonita(orden.fecha)}</strong></div>
      <div><span class="ayuda">Estado</span><strong>${orden.estado}</strong></div>
    </div>
    <p class="mt-4"><strong>Cliente:</strong> ${orden.cliente} · ${orden.correo}</p>
    <div class="table-responsive mt-3">
      <table class="tabla-simple">
        <thead><tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
    <h2 class="h4 text-end mt-4">Total: ${formatoPrecio(orden.total)}</h2>`;
}

function prepararMenuPanel() {
  let menu = document.querySelector(".admin-menu .enlaces");
  if (menu === null) {
    return;
  }

  let enlaces = menu.querySelectorAll("a");
  let enlaceProductos = null;

  for (let i = 0; i < enlaces.length; i++) {
    let destino = enlaces[i].getAttribute("href");
    if (destino === "productos.html") {
      enlaceProductos = enlaces[i];
    }
    if (destino === "index.html" || destino === "usuarios.html" || destino === "usuario-form.html") {
      enlaces[i].setAttribute("data-solo-admin", "");
    }
    if (enlaces[i].textContent.trim().toLowerCase().indexOf("cerrar") === 0) {
      enlaces[i].href = "#";
      enlaces[i].addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
      });
    }
  }

  if (enlaceProductos !== null && menu.querySelector("a[href='ordenes.html']") === null) {
    let enlaceOrdenes = document.createElement("a");
    enlaceOrdenes.href = "ordenes.html";
    enlaceOrdenes.textContent = "Órdenes";
    if (window.location.pathname.indexOf("orden") !== -1) {
      enlaceOrdenes.className = "activo";
    }
    enlaceProductos.insertAdjacentElement("afterend", enlaceOrdenes);
  }

  let botonNuevo = document.querySelector("a[href='producto-form.html']");
  if (botonNuevo !== null) {
    botonNuevo.setAttribute("data-solo-admin", "");
  }
}

prepararMenuPanel();

if (typeof protegerPanel !== "function" || protegerPanel()) {
  pintarTablaProductos();
  pintarTablaUsuarios();
  pintarResumen();
  pintarDetalleProductoAdmin();
  pintarTablaOrdenes();
  pintarDetalleOrden();
}
