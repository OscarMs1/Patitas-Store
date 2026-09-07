
let regiones = [
  {
    nombre: "Arica y Parinacota",
    comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
  },
  {
    nombre: "Antofagasta",
    comunas: ["Antofagasta", "Mejillones", "Taltal", "Calama", "Tocopilla"]
  },
  {
    nombre: "Valparaiso",
    comunas: ["Valparaiso", "Vina del Mar", "Quilpue", "Villa Alemana", "San Antonio", "Quillota"]
  },
  {
    nombre: "Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Nunoa", "Maipu", "Puente Alto", "La Florida", "Las Condes", "Recoleta"]
  },
  {
    nombre: "Biobio",
    comunas: ["Concepcion", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Los Angeles"]
  },
  {
    nombre: "Los Lagos",
    comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas"]
  }
];

function cargarRegiones() {
  let selectRegion = document.getElementById("region");
  if (selectRegion === null) {
    return;
  }

  let html = "<option value=''>Selecciona una region</option>";

  for (let i = 0; i < regiones.length; i++) {
    html = html + "<option value='" + i + "'>" + regiones[i].nombre + "</option>";
  }

  selectRegion.innerHTML = html;
}

function cargarComunas() {
  let selectRegion = document.getElementById("region");
  let selectComuna = document.getElementById("comuna");

  if (selectRegion === null || selectComuna === null) {
    return;
  }

  let posicion = selectRegion.value;

  if (posicion === "") {
    selectComuna.innerHTML = "<option value=''>Primero elige una region</option>";
    return;
  }

  let comunas = regiones[posicion].comunas;
  let html = "<option value=''>Selecciona una comuna</option>";

  for (let i = 0; i < comunas.length; i++) {
    html = html + "<option>" + comunas[i] + "</option>";
  }

  selectComuna.innerHTML = html;
}

cargarRegiones();

let selectRegionInicial = document.getElementById("region");
if (selectRegionInicial !== null) {
  selectRegionInicial.addEventListener("change", cargarComunas);
  cargarComunas();
}
