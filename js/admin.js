

let usuarios = [
  { run: "20153478K", nombre: "Camila",  apellidos: "Rojas Diaz",    correo: "camila.rojas@duoc.cl",   tipo: "Administrador", comuna: "Providencia" },
  { run: "174567891", nombre: "Diego",    apellidos: "Munoz Silva",   correo: "diego.munoz@gmail.com",  tipo: "Vendedor",      comuna: "Maipu" },
  { run: "213456784", nombre: "Valentina", apellidos: "Perez Soto",   correo: "vale.perez@gmail.com",   tipo: "Cliente",       comuna: "Nunoa" },
  { run: "167890121", nombre: "Matias",   apellidos: "Gonzalez Lara", correo: "matias.gonzalez@duoc.cl", tipo: "Cliente",      comuna: "Puerto Montt" }
];

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
      etiqueta = "<span class='etiqueta-stock stock-critico'>Stock critico</span>";
    }

    html = html + `
      <tr class="${claseFila}">
        <td><strong>${p.codigo}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>$${p.precio.toLocaleString("es-CL")}</td>
        <td>${p.stock}</td>
        <td>${etiqueta}</td>
        <td>
          <a class="btn btn-mini-texto" href="producto-form.html">Editar</a>
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
        <td>${u.tipo}</td>
        <td><a class="btn btn-mini-texto" href="usuario-form.html">Editar</a></td>
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
}

let formProducto = document.getElementById("formProducto");

if (formProducto !== null) {

  formProducto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;

    let codigo = document.getElementById("codigo").value.trim();
    if (codigo === "") {
      mostrarError("errorCodigo", "Escribe el codigo del producto");
      todoOk = false;
    } else if (codigo.length < 3) {
      mostrarError("errorCodigo", "Minimo 3 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorCodigo", "");
    }

    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
      mostrarError("errorNombre", "Escribe el nombre del producto");
      todoOk = false;
    } else if (nombre.length > 100) {
      mostrarError("errorNombre", "Maximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    let descripcion = document.getElementById("descripcion").value.trim();
    if (descripcion.length > 500) {
      mostrarError("errorDescripcion", "Maximo 500 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorDescripcion", "");
    }

    let precioTexto = document.getElementById("precio").value;
    if (precioTexto === "") {
      mostrarError("errorPrecio", "Escribe el precio");
      todoOk = false;
    } else if (isNaN(precioTexto)) {
      mostrarError("errorPrecio", "El precio debe ser un numero");
      todoOk = false;
    } else if (Number(precioTexto) < 0) {
      mostrarError("errorPrecio", "El precio no puede ser negativo (0 se considera producto gratis)");
      todoOk = false;
    } else {
      mostrarError("errorPrecio", "");
    }

    let stockTexto = document.getElementById("stock").value;
    if (stockTexto === "") {
      mostrarError("errorStock", "Escribe el stock");
      todoOk = false;
    } else if (isNaN(stockTexto)) {
      mostrarError("errorStock", "El stock debe ser un numero");
      todoOk = false;
    } else if (Number(stockTexto) < 0) {
      mostrarError("errorStock", "El stock no puede ser negativo");
      todoOk = false;
    } else if (Number(stockTexto) % 1 !== 0) {
      mostrarError("errorStock", "El stock debe ser un numero entero, sin decimales");
      todoOk = false;
    } else {
      mostrarError("errorStock", "");
    }

    let criticoTexto = document.getElementById("stockCritico").value;
    if (criticoTexto !== "") {
      if (isNaN(criticoTexto)) {
        mostrarError("errorStockCritico", "Debe ser un numero");
        todoOk = false;
      } else if (Number(criticoTexto) < 0) {
        mostrarError("errorStockCritico", "No puede ser negativo");
        todoOk = false;
      } else if (Number(criticoTexto) % 1 !== 0) {
        mostrarError("errorStockCritico", "Debe ser un numero entero");
        todoOk = false;
      } else {
        mostrarError("errorStockCritico", "");
      }
    } else {
      mostrarError("errorStockCritico", "");
    }

    let categoria = document.getElementById("categoria").value;
    if (categoria === "") {
      mostrarError("errorCategoria", "Elige una categoria");
      todoOk = false;
    } else {
      mostrarError("errorCategoria", "");
    }

    if (todoOk === true) {
      document.getElementById("mensajeOk").style.display = "block";
      formProducto.reset();
      window.scrollTo(0, 0);
    }
  });
}

let formUsuario = document.getElementById("formUsuario");

if (formUsuario !== null) {

  formUsuario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;

    let run = document.getElementById("run").value.trim();
    if (run === "") {
      mostrarError("errorRun", "Escribe el RUN");
      todoOk = false;
    } else if (run.length < 7 || run.length > 9) {
      mostrarError("errorRun", "Entre 7 y 9 caracteres");
      todoOk = false;
    } else if (runValido(run) === false) {
      mostrarError("errorRun", "RUN invalido. Sin puntos ni guion, por ejemplo 20153478K");
      todoOk = false;
    } else {
      mostrarError("errorRun", "");
    }

    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
      mostrarError("errorNombre", "Escribe el nombre");
      todoOk = false;
    } else if (nombre.length > 50) {
      mostrarError("errorNombre", "Maximo 50 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    let apellidos = document.getElementById("apellidos").value.trim();
    if (apellidos === "") {
      mostrarError("errorApellidos", "Escribe los apellidos");
      todoOk = false;
    } else if (apellidos.length > 100) {
      mostrarError("errorApellidos", "Maximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorApellidos", "");
    }

    let correo = document.getElementById("correo").value.trim();
    if (correo === "") {
      mostrarError("errorCorreo", "Escribe el correo");
      todoOk = false;
    } else if (correo.length > 100) {
      mostrarError("errorCorreo", "Maximo 100 caracteres");
      todoOk = false;
    } else if (correoValido(correo) === false) {
      mostrarError("errorCorreo", "Formato de correo invalido");
      todoOk = false;
    } else if (correoPermitido(correo) === false) {
      mostrarError("errorCorreo", "Solo @duoc.cl, @profesor.duoc.cl o @gmail.com");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
    }

    let tipo = document.getElementById("tipoUsuario").value;
    if (tipo === "") {
      mostrarError("errorTipoUsuario", "Elige el tipo de usuario");
      todoOk = false;
    } else {
      mostrarError("errorTipoUsuario", "");
    }

    let region = document.getElementById("region").value;
    if (region === "") {
      mostrarError("errorRegion", "Elige una region");
      todoOk = false;
    } else {
      mostrarError("errorRegion", "");
    }

    let comuna = document.getElementById("comuna").value;
    if (comuna === "") {
      mostrarError("errorComuna", "Elige una comuna");
      todoOk = false;
    } else {
      mostrarError("errorComuna", "");
    }

    let direccion = document.getElementById("direccion").value.trim();
    if (direccion === "") {
      mostrarError("errorDireccion", "Escribe la direccion");
      todoOk = false;
    } else if (direccion.length > 300) {
      mostrarError("errorDireccion", "Maximo 300 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorDireccion", "");
    }

    if (todoOk === true) {
      document.getElementById("mensajeOk").style.display = "block";
      formUsuario.reset();
      cargarComunas();
      window.scrollTo(0, 0);
    }
  });
}

pintarTablaProductos();
pintarTablaUsuarios();
pintarResumen();
