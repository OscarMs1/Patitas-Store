function mostrarError(idDelSpan, mensaje) {
  let span = document.getElementById(idDelSpan);
  if (span !== null) {
    span.textContent = mensaje;
  }
}

function correoValido(correo) {
  let patron = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return patron.test(correo);
}

function correoPermitido(correo) {
  let correoMinuscula = correo.toLowerCase();
  return correoMinuscula.endsWith("@duoc.cl")
      || correoMinuscula.endsWith("@profesor.duoc.cl")
      || correoMinuscula.endsWith("@gmail.com");
}

function passwordValida(clave) {
  if (clave.length < 4 || clave.length > 10) {
    return false;
  }
  let tieneLetra = /[a-zA-Z]/.test(clave);
  let tieneNumero = /[0-9]/.test(clave);
  let tieneSimbolo = /[^a-zA-Z0-9]/.test(clave);
  return tieneLetra && tieneNumero && tieneSimbolo;
}

function runValido(run) {
  run = run.toUpperCase().trim();

  if (run.indexOf(".") !== -1 || run.indexOf("-") !== -1) {
    return false;
  }
  if (run.length < 7 || run.length > 9 || /^[0-9]+[0-9K]$/.test(run) === false) {
    return false;
  }

  let cuerpo = run.substring(0, run.length - 1);
  let digitoEscrito = run.substring(run.length - 1);
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma = suma + Number(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador + 1;
    if (multiplicador === 8) {
      multiplicador = 2;
    }
  }

  let resto = 11 - (suma % 11);
  let digitoEsperado;

  if (resto === 11) {
    digitoEsperado = "0";
  } else if (resto === 10) {
    digitoEsperado = "K";
  } else {
    digitoEsperado = String(resto);
  }

  return digitoEscrito === digitoEsperado;
}

function limpiarErrorAlEscribir(idCampo, idError) {
  let campo = document.getElementById(idCampo);
  if (campo !== null) {
    campo.addEventListener("input", function () {
      mostrarError(idError, "");
    });
  }
}

let formContacto = document.getElementById("formContacto");

if (formContacto !== null) {
  formContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;

    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
      mostrarError("errorNombre", "Escribe tu nombre");
      todoOk = false;
    } else if (nombre.length > 100) {
      mostrarError("errorNombre", "Máximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    let correo = document.getElementById("correo").value.trim();
    if (correo.length > 100) {
      mostrarError("errorCorreo", "Máximo 100 caracteres");
      todoOk = false;
    } else if (correo !== "" && correoValido(correo) === false) {
      mostrarError("errorCorreo", "Ese correo no tiene un formato válido");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
    }

    let comentario = document.getElementById("comentario").value.trim();
    if (comentario === "") {
      mostrarError("errorComentario", "Escribe tu mensaje");
      todoOk = false;
    } else if (comentario.length > 500) {
      mostrarError("errorComentario", "Máximo 500 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorComentario", "");
    }

    if (todoOk === true) {
      document.getElementById("mensajeOk").style.display = "block";
      formContacto.reset();
      document.getElementById("contadorComentario").textContent = "0 de 500 caracteres";
      window.scrollTo(0, 0);
    }
  });

  document.getElementById("comentario").addEventListener("input", function () {
    document.getElementById("contadorComentario").textContent =
      this.value.length + " de 500 caracteres";
    if (this.value.length > 500) {
      mostrarError("errorComentario", "Máximo 500 caracteres");
    } else {
      mostrarError("errorComentario", "");
    }
  });

  limpiarErrorAlEscribir("nombre", "errorNombre");
  limpiarErrorAlEscribir("correo", "errorCorreo");
}

let formLogin = document.getElementById("formLogin");

if (formLogin !== null) {
  let avisoGuardado = localStorage.getItem("avisoLoginPatitas");
  if (avisoGuardado !== null) {
    let aviso = document.createElement("div");
    aviso.className = "aviso-sesion mb-3";
    aviso.textContent = avisoGuardado;
    formLogin.insertBefore(aviso, formLogin.firstChild);
    localStorage.removeItem("avisoLoginPatitas");
  }

  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;
    let correo = document.getElementById("correo").value.trim().toLowerCase();
    let clave = document.getElementById("password").value;

    if (correo === "") {
      mostrarError("errorCorreo", "Escribe tu correo");
      todoOk = false;
    } else if (correo.length > 100) {
      mostrarError("errorCorreo", "Máximo 100 caracteres");
      todoOk = false;
    } else if (correoValido(correo) === false) {
      mostrarError("errorCorreo", "Ese correo no tiene un formato válido");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
    }

    if (clave === "") {
      mostrarError("errorPassword", "Escribe tu contraseña");
      todoOk = false;
    } else if (passwordValida(clave) === false) {
      mostrarError("errorPassword", "Entre 4 y 10 caracteres, con una letra, un número y un símbolo");
      todoOk = false;
    } else {
      mostrarError("errorPassword", "");
    }

    if (todoOk === false) {
      return;
    }

    let usuarios = obtenerUsuarios();
    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].correo.toLowerCase() === correo && usuarios[i].password === clave) {
        usuarioEncontrado = usuarios[i];
      }
    }

    if (usuarioEncontrado === null) {
      mostrarError("errorPassword", "Correo o contraseña incorrectos");
      return;
    }

    iniciarSesion(usuarioEncontrado);
    let volver = new URLSearchParams(window.location.search).get("volver");

    if (volver === "carrito") {
      window.location.href = "carrito.html";
    } else if (usuarioEncontrado.tipo === "Administrador") {
      window.location.href = "admin/index.html";
    } else if (usuarioEncontrado.tipo === "Vendedor") {
      window.location.href = "admin/productos.html";
    } else {
      window.location.href = "index.html";
    }
  });

  limpiarErrorAlEscribir("correo", "errorCorreo");
  limpiarErrorAlEscribir("password", "errorPassword");
}

let formRegistro = document.getElementById("formRegistro");

if (formRegistro !== null) {
  formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;
    let run = document.getElementById("run").value.trim().toUpperCase();
    let nombre = document.getElementById("nombre").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let correo = document.getElementById("correo").value.trim().toLowerCase();
    let clave = document.getElementById("password").value;
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;
    let direccion = document.getElementById("direccion").value.trim();

    if (run === "") {
      mostrarError("errorRun", "Escribe tu RUN");
      todoOk = false;
    } else if (run.length < 7 || run.length > 9) {
      mostrarError("errorRun", "El RUN debe tener entre 7 y 9 caracteres");
      todoOk = false;
    } else if (runValido(run) === false) {
      mostrarError("errorRun", "RUN inválido. Escríbelo sin puntos ni guion");
      todoOk = false;
    } else {
      mostrarError("errorRun", "");
    }

    if (nombre === "") {
      mostrarError("errorNombre", "Escribe tu nombre");
      todoOk = false;
    } else if (nombre.length > 50) {
      mostrarError("errorNombre", "Máximo 50 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    if (apellidos === "") {
      mostrarError("errorApellidos", "Escribe tus apellidos");
      todoOk = false;
    } else if (apellidos.length > 100) {
      mostrarError("errorApellidos", "Máximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorApellidos", "");
    }

    if (correo === "") {
      mostrarError("errorCorreo", "Escribe tu correo");
      todoOk = false;
    } else if (correo.length > 100 || correoValido(correo) === false) {
      mostrarError("errorCorreo", "Escribe un correo válido de máximo 100 caracteres");
      todoOk = false;
    } else if (correoPermitido(correo) === false) {
      mostrarError("errorCorreo", "Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
    }

    if (clave === "") {
      mostrarError("errorPassword", "Crea una contraseña");
      todoOk = false;
    } else if (passwordValida(clave) === false) {
      mostrarError("errorPassword", "Entre 4 y 10 caracteres, con una letra, un número y un símbolo");
      todoOk = false;
    } else {
      mostrarError("errorPassword", "");
    }

    if (region === "") {
      mostrarError("errorRegion", "Elige una región");
      todoOk = false;
    } else {
      mostrarError("errorRegion", "");
    }

    if (comuna === "") {
      mostrarError("errorComuna", "Elige una comuna");
      todoOk = false;
    } else {
      mostrarError("errorComuna", "");
    }

    if (direccion === "") {
      mostrarError("errorDireccion", "Escribe tu dirección");
      todoOk = false;
    } else if (direccion.length > 300) {
      mostrarError("errorDireccion", "Máximo 300 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorDireccion", "");
    }

    let usuarios = obtenerUsuarios();
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].correo.toLowerCase() === correo) {
        mostrarError("errorCorreo", "Ya existe una cuenta con este correo");
        todoOk = false;
      }
      if (usuarios[i].run === run) {
        mostrarError("errorRun", "Ya existe una cuenta con este RUN");
        todoOk = false;
      }
    }

    if (todoOk === true) {
      let usuarioNuevo = {
        run: run,
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        password: clave,
        tipo: "Cliente",
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        region: region,
        comuna: comuna,
        direccion: direccion
      };

      usuarios.push(usuarioNuevo);
      guardarUsuarios(usuarios);
      iniciarSesion(usuarioNuevo);
      document.getElementById("mensajeOk").style.display = "block";

      let volver = new URLSearchParams(window.location.search).get("volver");
      window.location.href = volver === "carrito" ? "carrito.html" : "index.html";
    }
  });

  let camposRegistro = [
    ["run", "errorRun"], ["nombre", "errorNombre"], ["apellidos", "errorApellidos"],
    ["correo", "errorCorreo"], ["password", "errorPassword"], ["region", "errorRegion"],
    ["comuna", "errorComuna"], ["direccion", "errorDireccion"]
  ];
  for (let i = 0; i < camposRegistro.length; i++) {
    limpiarErrorAlEscribir(camposRegistro[i][0], camposRegistro[i][1]);
  }
}
