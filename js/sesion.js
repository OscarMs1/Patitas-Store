// Sesion local para la demostracion academica.
// Los datos se guardan en el navegador con localStorage.

const CLAVE_USUARIOS = "usuariosPatitas";
const CLAVE_SESION = "sesionPatitas";
const CLAVE_ORDENES = "ordenesPatitas";

function leerListaLocal(clave) {
  try {
    let datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function usuariosDeEjemplo() {
  return [
    {
      run: "20153478K",
      nombre: "Camila",
      apellidos: "Rojas Diaz",
      correo: "admin@duoc.cl",
      password: "Admin1!",
      tipo: "Administrador",
      region: "3",
      comuna: "Providencia",
      direccion: "Av. Providencia 1234"
    },
    {
      run: "174567891",
      nombre: "Diego",
      apellidos: "Munoz Silva",
      correo: "vendedor@duoc.cl",
      password: "Venta1!",
      tipo: "Vendedor",
      region: "3",
      comuna: "Maipu",
      direccion: "Av. Pajaritos 850"
    },
    {
      run: "213456784",
      nombre: "Valentina",
      apellidos: "Perez Soto",
      correo: "cliente@gmail.com",
      password: "Cliente1!",
      tipo: "Cliente",
      region: "3",
      comuna: "Nunoa",
      direccion: "Irarrázaval 2450"
    }
  ];
}

function iniciarDatosDeSesion() {
  if (localStorage.getItem(CLAVE_USUARIOS) === null) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosDeEjemplo()));
  }
  if (localStorage.getItem(CLAVE_ORDENES) === null) {
    localStorage.setItem(CLAVE_ORDENES, JSON.stringify([]));
  }
}

function obtenerUsuarios() {
  iniciarDatosDeSesion();
  return leerListaLocal(CLAVE_USUARIOS);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch (error) {
    return null;
  }
}

function iniciarSesion(usuario) {
  let sesion = {
    run: usuario.run,
    nombre: usuario.nombre,
    correo: usuario.correo,
    tipo: usuario.tipo
  };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  let desdeAdmin = window.location.pathname.indexOf("/admin/") !== -1;
  window.location.href = desdeAdmin ? "../login.html" : "login.html";
}

function obtenerOrdenes() {
  iniciarDatosDeSesion();
  return leerListaLocal(CLAVE_ORDENES);
}

function guardarOrdenes(ordenes) {
  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenes));
}

function actualizarNavegacionSesion() {
  let acciones = document.querySelector(".tienda-acciones");
  if (acciones === null) {
    return;
  }

  let sesion = obtenerSesion();
  let enlace = acciones.querySelector(".btn-link-suave");

  if (sesion === null) {
    if (enlace !== null) {
      enlace.textContent = "Ingresar";
      enlace.href = "login.html";
    }
    return;
  }

  if (enlace !== null) {
    enlace.textContent = "Hola, " + sesion.nombre;
    if (sesion.tipo === "Administrador") {
      enlace.href = "admin/index.html";
    } else if (sesion.tipo === "Vendedor") {
      enlace.href = "admin/productos.html";
    } else {
      enlace.href = "index.html";
    }
    enlace.setAttribute("aria-label", "Sesion iniciada como " + sesion.nombre);
  }

  if (acciones.querySelector(".btn-cerrar-sesion") === null) {
    let boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-cerrar-sesion";
    boton.textContent = "Salir";
    boton.addEventListener("click", cerrarSesion);
    acciones.insertBefore(boton, acciones.lastElementChild);
  }
}

function conservarDestinoDelRegistro() {
  let enlace = document.getElementById("enlaceRegistro");
  if (enlace === null) {
    return;
  }
  let volver = new URLSearchParams(window.location.search).get("volver");
  if (volver !== null) {
    enlace.href = "registro.html?volver=" + encodeURIComponent(volver);
  }
}

function protegerPanel() {
  if (window.location.pathname.indexOf("/admin/") === -1) {
    return true;
  }

  let sesion = obtenerSesion();
  if (sesion === null) {
    window.location.href = "../login.html?volver=admin";
    return false;
  }

  if (sesion.tipo === "Cliente") {
    window.location.href = "../index.html";
    return false;
  }

  let pagina = window.location.pathname.split("/").pop() || "index.html";
  let paginasVendedor = ["productos.html", "producto-detalle.html", "ordenes.html", "orden-detalle.html"];

  if (sesion.tipo === "Vendedor" && paginasVendedor.indexOf(pagina) === -1) {
    window.location.href = "productos.html";
    return false;
  }

  if (sesion.tipo === "Vendedor") {
    let elementosAdmin = document.querySelectorAll("[data-solo-admin]");
    for (let i = 0; i < elementosAdmin.length; i++) {
      elementosAdmin[i].style.display = "none";
    }
  }

  let nombrePanel = document.getElementById("usuarioPanel");
  if (nombrePanel !== null) {
    nombrePanel.textContent = sesion.nombre + " · " + sesion.tipo;
  }

  return true;
}

iniciarDatosDeSesion();
actualizarNavegacionSesion();
conservarDestinoDelRegistro();
