

function mostrarError(idDelSpan, mensaje) {
  let span = document.getElementById(idDelSpan);
  if (span !== null) {
    span.textContent = mensaje;
  }
}

function correoValido(correo) {
  let patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo);
}

function correoPermitido(correo) {
  return correo.endsWith("@duoc.cl")
      || correo.endsWith("@profesor.duoc.cl")
      || correo.endsWith("@gmail.com");
}

function passwordValida(clave) {
  if (clave.length < 4 || clave.length > 10) {
    return false;
  }
  let tieneLetra   = /[a-zA-Z]/.test(clave);
  let tieneNumero  = /[0-9]/.test(clave);
  let tieneSimbolo = /[^a-zA-Z0-9]/.test(clave);
  return tieneLetra && tieneNumero && tieneSimbolo;
}

function runValido(run) {

  run = run.toUpperCase();
  run = run.split(".").join("");
  run = run.split("-").join("");

  if (run.length < 7 || run.length > 9) {
    return false;
  }

  let cuerpo = run.substring(0, run.length - 1);
  let digitoEscrito = run.substring(run.length - 1);

  if (isNaN(cuerpo)) {
    return false;
  }

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
      mostrarError("errorNombre", "Maximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    let correo = document.getElementById("correo").value.trim();
    if (correo === "") {
      mostrarError("errorCorreo", "Escribe tu correo");
      todoOk = false;
    } else if (correo.length > 100) {
      mostrarError("errorCorreo", "Maximo 100 caracteres");
      todoOk = false;
    } else if (correoValido(correo) === false) {
      mostrarError("errorCorreo", "Ese correo no tiene un formato valido");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
    }

    let comentario = document.getElementById("comentario").value.trim();
    if (comentario === "") {
      mostrarError("errorComentario", "Escribe tu mensaje");
      todoOk = false;
    } else if (comentario.length > 500) {
      mostrarError("errorComentario", "Maximo 500 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorComentario", "");
    }

    if (todoOk === true) {
      document.getElementById("mensajeOk").style.display = "block";
      formContacto.reset();
    }
  });

  document.getElementById("comentario").addEventListener("input", function () {
    let usados = this.value.length;
    document.getElementById("contadorComentario").textContent =
      usados + " de 500 caracteres";
  });
}

let formLogin = document.getElementById("formLogin");

if (formLogin !== null) {

  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;

    let correo = document.getElementById("correo").value.trim();
    if (correo === "") {
      mostrarError("errorCorreo", "Escribe tu correo");
      todoOk = false;
    } else if (correo.length > 100) {
      mostrarError("errorCorreo", "Maximo 100 caracteres");
      todoOk = false;
    } else if (correoValido(correo) === false) {
      mostrarError("errorCorreo", "Ese correo no tiene un formato valido");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
    }

    let clave = document.getElementById("password").value;
    if (clave === "") {
      mostrarError("errorPassword", "Escribe tu contrasena");
      todoOk = false;
    } else if (passwordValida(clave) === false) {
      mostrarError("errorPassword",
        "Entre 4 y 10 caracteres, con al menos una letra, un numero y un simbolo");
      todoOk = false;
    } else {
      mostrarError("errorPassword", "");
    }

    if (todoOk === true) {
      alert("Bienvenido a Patitas Store");
      window.location.href = "index.html";
    }
  });
}

let formRegistro = document.getElementById("formRegistro");

if (formRegistro !== null) {

  formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoOk = true;

    let run = document.getElementById("run").value.trim();
    if (run === "") {
      mostrarError("errorRun", "Escribe tu RUN");
      todoOk = false;
    } else if (run.length < 7 || run.length > 9) {
      mostrarError("errorRun", "El RUN debe tener entre 7 y 9 caracteres");
      todoOk = false;
    } else if (runValido(run) === false) {
      mostrarError("errorRun", "El RUN no es valido. Escribelo sin puntos ni guion, por ejemplo 20153478K");
      todoOk = false;
    } else {
      mostrarError("errorRun", "");
    }

    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
      mostrarError("errorNombre", "Escribe tu nombre");
      todoOk = false;
    } else if (nombre.length > 50) {
      mostrarError("errorNombre", "Maximo 50 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorNombre", "");
    }

    let apellidos = document.getElementById("apellidos").value.trim();
    if (apellidos === "") {
      mostrarError("errorApellidos", "Escribe tus apellidos");
      todoOk = false;
    } else if (apellidos.length > 100) {
      mostrarError("errorApellidos", "Maximo 100 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorApellidos", "");
    }

    let correo = document.getElementById("correo").value.trim();
    if (correo === "") {
      mostrarError("errorCorreo", "Escribe tu correo");
      todoOk = false;
    } else if (correo.length > 100) {
      mostrarError("errorCorreo", "Maximo 100 caracteres");
      todoOk = false;
    } else if (correoValido(correo) === false) {
      mostrarError("errorCorreo", "Ese correo no tiene un formato valido");
      todoOk = false;
    } else if (correoPermitido(correo) === false) {
      mostrarError("errorCorreo", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
      todoOk = false;
    } else {
      mostrarError("errorCorreo", "");
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
      mostrarError("errorDireccion", "Escribe tu direccion");
      todoOk = false;
    } else if (direccion.length > 300) {
      mostrarError("errorDireccion", "Maximo 300 caracteres");
      todoOk = false;
    } else {
      mostrarError("errorDireccion", "");
    }

    if (todoOk === true) {
      document.getElementById("mensajeOk").style.display = "block";
      formRegistro.reset();
      cargarComunas();
      window.scrollTo(0, 0);
    }
  });

  document.getElementById("run").addEventListener("blur", function () {
    let valor = this.value.trim();
    if (valor !== "" && runValido(valor) === true) {
      mostrarError("errorRun", "");
    }
  });
}
