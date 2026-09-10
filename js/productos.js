
let productosBase = [

  {
    codigo: "AL-001",
    nombre: "Alimento Perro Adulto Raza Grande 15 kg",
    categoria: "Alimento",
    mascota: "Perro",
    precioAnterior: 52990,   // precio normal; si existe, el producto esta en oferta
    precio: 42990,
    stock: 24,
    stockCritico: 5,
    imagen: "img/productos/al-001.jpg",
    descripcion: "Alimento completo y balanceado para perros adultos de raza grande. Con proteina de pollo como primer ingrediente y condroitina para el cuidado de las articulaciones.",
    caracteristicas: ["Peso: 15 kg", "Sabor: pollo y arroz", "Etapa: adulto", "Tamanio: raza grande"]
  },

  {
    codigo: "AL-002",
    nombre: "Alimento Gato Esterilizado 3 kg",
    categoria: "Alimento",
    mascota: "Gato",
    precio: 18490,
    stock: 3,
    stockCritico: 5,
    imagen: "img/productos/al-002.jpg",
    descripcion: "Formulado para gatos esterilizados, con menos grasa para ayudar a controlar el peso y fibra que reduce la formacion de bolas de pelo.",
    caracteristicas: ["Peso: 3 kg", "Sabor: salmon", "Etapa: adulto", "Especial: control de peso"]
  },

  {
    codigo: "JU-001",
    nombre: "Pelota Mordedora de Caucho Talla M",
    categoria: "Juguetes",
    mascota: "Perro",
    precio: 5990,
    stock: 40,
    stockCritico: 8,
    imagen: "img/productos/ju-001.jpg",
    descripcion: "Pelota de caucho natural resistente a la mordida. Rebota de forma irregular, lo que mantiene al perro entretenido por mas tiempo. Flota en el agua.",
    caracteristicas: ["Talla: M (7 cm)", "Material: caucho natural", "Uso: interior y exterior", "Lavable: si"]
  },

  {
    codigo: "JU-002",
    nombre: "Rascador Torre de Sisal 60 cm",
    categoria: "Juguetes",
    mascota: "Gato",
    precioAnterior: 39990,   // precio normal; si existe, el producto esta en oferta
    precio: 29990,
    stock: 12,
    stockCritico: 4,
    imagen: "img/productos/ju-002.jpg",
    descripcion: "Torre rascadora de tres niveles forrada en sisal natural, con una plataforma superior para dormir. Base ancha que evita que se vuelque.",
    caracteristicas: ["Altura: 60 cm", "Material: sisal y felpa", "Niveles: 3", "Armado: incluye herramienta"]
  },

  {
    codigo: "AC-001",
    nombre: "Collar y Correa de Nylon Talla M",
    categoria: "Accesorios",
    mascota: "Perro",
    precio: 9990,
    stock: 30,
    stockCritico: 6,
    imagen: "img/productos/ac-001.jpg",
    descripcion: "Set de collar regulable y correa de 1,2 metros en nylon reforzado, con costuras dobles y broche metalico. Incluye una banda reflectante para pasear de noche.",
    caracteristicas: ["Talla: M (30 a 45 cm)", "Material: nylon reforzado", "Largo correa: 1,2 m", "Reflectante: si"]
  },

  {
    codigo: "AC-002",
    nombre: "Cama Acolchada Talla L",
    categoria: "Accesorios",
    mascota: "Perro",
    precioAnterior: 32990,   // precio normal; si existe, el producto esta en oferta
    precio: 24990,
    stock: 2,
    stockCritico: 4,
    imagen: "img/productos/ac-002.jpg",
    descripcion: "Cama con borde acolchado que sirve de apoyo para la cabeza y base antideslizante. La funda se saca con cierre y se puede lavar en lavadora.",
    caracteristicas: ["Talla: L (90 x 70 cm)", "Relleno: fibra siliconada", "Funda: desmontable", "Lavable: en lavadora"]
  }

];

// Numero de version del catalogo.
// Cada vez que cambiemos los productos de arriba, subimos este numero.
// Asi el navegador de quien ya visito el sitio bota la copia vieja que
// tenia guardada y vuelve a leer la lista nueva.
let versionCatalogo = "2";

function cargarProductos() {
  let guardados = localStorage.getItem("productosPatitas");
  let versionGuardada = localStorage.getItem("versionCatalogo");

  if (guardados === null || versionGuardada !== versionCatalogo) {
    localStorage.setItem("productosPatitas", JSON.stringify(productosBase));
    localStorage.setItem("versionCatalogo", versionCatalogo);
    return productosBase.slice();
  }

  try {
    let lista = JSON.parse(guardados);
    return Array.isArray(lista) ? lista : productosBase.slice();
  } catch (error) {
    return productosBase.slice();
  }
}

function guardarProductos(productosActualizados) {
  localStorage.setItem("productosPatitas", JSON.stringify(productosActualizados));
}

let productos = cargarProductos();
let categorias = ["Todos"];

for (let i = 0; i < productos.length; i++) {
  if (categorias.indexOf(productos[i].categoria) === -1) {
    categorias.push(productos[i].categoria);
  }
}
