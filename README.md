# Patitas Store

Patitas Store es una tienda online de artículos para mascotas desarrollada para la asignatura DSY1104 de Duoc UC.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- localStorage para persistencia académica de carrito, usuarios, sesión, productos y órdenes

## Funcionalidades principales

- Inicio con productos destacados
- Catálogo de productos y filtro por categoría
- Vista de detalle de producto
- Carrito persistente con control de cantidad y stock
- Compra bloqueada hasta registrarse o iniciar sesión
- Registro, inicio de sesión y contacto con validaciones en JavaScript
- Regiones y comunas dependientes
- Blog y sección Nosotros
- Panel protegido con permisos de Administrador, Vendedor y Cliente
- Mantenedores funcionales de productos y usuarios
- Listado y detalle de órdenes para Administrador y Vendedor
- Fotografías realistas de productos y diseño adaptable a celular

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | Admin1! |
| Vendedor | vendedor@duoc.cl | Venta1! |
| Cliente | cliente@gmail.com | Cliente1! |

El Administrador tiene acceso total. El Vendedor solo puede consultar productos y órdenes. El Cliente compra desde la tienda y no puede entrar al panel.

## Equipo

- Oscar Muñoz
- Ángel Vergara
- Felipe Zapata

## Ejecución

Abrir `index.html` en un navegador moderno. El proyecto no requiere instalación ni compilación.

Esta autenticación usa `localStorage` porque corresponde a un prototipo de frontend para la evaluación. En un sistema real las contraseñas y permisos deben validarse en un servidor.

## Estructura

- `index.html`: página principal
- `productos.html`: catálogo
- `detalle-producto.html`: detalle de producto
- `carrito.html`: carrito de compras
- `registro.html`, `login.html`, `contacto.html`: formularios
- `blogs.html`, `blog-1.html`, `blog-2.html`: contenidos del blog
- `nosotros.html`: información de la tienda y del equipo
- `admin/`: panel administrativo
- `css/`: estilos del sitio
- `js/`: lógica de catálogo, carrito, validaciones y administración
- `img/`: recursos gráficos
