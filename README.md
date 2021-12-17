# Besale Front - Prueba

El siguiente documento tiene el propósito de explicar el código y cómo se interactúa con la página.


## Autor

- [@felipearavena98](https://github.com/felipearavena98)



## 🛠 Este desarrollo fue realizado con
JavaScript
-CCS
-HTML 

## Introducción 
El propósito del desarrollo de esta página es construir una tienda online que pueda desplegar los productos, filtrarlos por categorías y que se puedan buscar productos.

Desarrollar el ejercicio, implica el consumo de una construir un backend con una tecnología “x” y consumir API REST con los recursos entregados para el desarrollo.

## Proyecto Bsale

![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte1BACK.png?raw=true)


## Usabilidad

La página es simple, solo muestra la información de los productos y se presentan los filtros de búsqueda.

El filtro de búsqueda funciona escribiendo en él y presionando el boton de busqueda, para reestablecerlo, se debe quedar en blanco o vacio y presionar enter o el botón.


## Demostración Pagina

https://felipearavena98.github.io/front-bsale/


## Estructura de la página

![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte3HTML.png?raw=true)
- css: La carpeta de css contiene los estilos que utiliza nuestro front, para cambiar la apariencia al html
- img: Esta carpeta contiene las imágenes estáticas de la página.
- js: En esta carpeta se encuentra el archivo de JavaScript que contiene las funcionalidades de la página.
- index.html: El archivo de HTML es el que posee toda la estructura y contenido visible.

# Documentación y Explicación del código
## Inicio -- index.html


![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte1BACK2.0.png?raw=true)
Al ingresar a la página, lo primero que veremos es el navbar y abajo estarán nuestras primeras funcionalidades, las cual es son el input de búsqueda.
```html
    <div class="search search__contenedor">
      <div class="productos__search">
        <div class="search">
          <div class="container-busqueda">
            <p>Buscar Producto</p>
            <input type="text" id="formularioBusqueda" />
            <button id="botonBusqueda">Buscar</button>
          </div>
        </div>
      </div>
    </div>
```
Para poder utilizar sin problemas el fragment, podemos utilizar templates para asignar elementos y modificar sus etiquetas para poder pasarle funcionalidades.

La parte más importante de la página es el contenedor de los productos, ya que es dinámico y su contenido puede variar, ya sea por los factores de la búsqueda de algún producto o el filtro de categorías.
![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte2HTML.png?raw=true)

```html
    <main class="productos productos__contenedor">
      <h2 class="productos__heading">Nuestros Productos</h2>
      <div class="productos__grid" id="items"></div>
      <!--./productos__grid-->
    </main>

    <template id="template-product">
      <div class="producto">
        <img class="producto__imagen" src="" alt="" />

        <div class="producto__contenido">
          <h3 class="producto__nombre"></h3>
          <p class="producto__descripcion"></p>
          <p class="producto__precio"></p>
          <button class="producto__agregar producto__enlace">
            Agregar al Carrito
          </button>
        </div>
      </div>
      <!--./producto-->
    </template>
```
Lo que se repite es crear primero las etiquetas importantes y/o contenedores y después sus respectivos templates, los cuales contienen los elementos que serán modificados y pasados a las clases de html.

# Documentación del codigo
## Inicio -- app.js

Para comenzar con el archivo de javascript, tenemos en primera instancia los elementos que nos permitirán manejar estilos, etiquetas, fragment, etc. del DOM a través de JavaScript.

Utilizaremos un un input para realizar la búsqueda de productos, tendremos un select para poder ver los productos filtrados por categorías y también manejaremos un contenedor en el cual se cargan las imágenes y serán estilizadas con css.

```javascript
const busqueda = document.getElementById('formularioBusqueda');
const busquedaBoton = document.getElementById('botonBusqueda');
const productos = document.getElementById('items');
const paginacionDiv = document.getElementById('paginacion');
const first = document.getElementById('first');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const last = document.getElementById('last');
const templateProducto = document.getElementById('template-product').content;
```
Inicializamos las variables del menu de paginación.
```javascript
let paginaActual =  1;
let paginaFinal;

```


Continuando con una lógica estructurada, después de definir los elementos que nos permitirán modificar el DOM, pasamos a ejecutar el DOMContentLoaded, el cual nos permite inicializar la interfaz de HTML contenida en el DOM, de esta forma estamos indicando que estamos trabajando de manera estructurada mediante nodos.

Le pasamos por parametros que queremos que inicie en la página 1.
```javascript

document.addEventListener("DOMContentLoaded", () => {
    obtenerProducto(1);
    // busqueda.addEventListener('keyup', filtroBusqueda);
    busquedaBoton.addEventListener('click', filtroBusqueda);
    next.addEventListener('click', siguiente)
    previous.addEventListener('click', atras)
    last.addEventListener('click', pagFin)
    first.addEventListener('click', pagInicio)
});

```

La función siguiente lo que hace es hacer el llamado a la api y obtener productos, a esta le tenemos que pasar un parámetro, el cual contiene la página en la cual queremos estar para que nos muestre un producto, por defecto carga la primera página.
```javascript
const obtenerProducto = async (numeroPagina) => {
    
    try {
        const resp = await fetch(`https://backsale.herokuapp.com/allproduct?page=${numeroPagina}`);

        if( !resp.ok ) throw 'No se puedo realizar la petición';
        const data = await resp.json();
        paginaFinal = data.numberOfPages;
        pintarProductos(data);

    } catch (error) {
        throw error;
    }
}

```

El filtro de búsqueda funciona mediante un elemento del HTML, funciona directamente con una búsqueda en la base de datos, solo necesitamos pasar el parámetro de búsqueda en el input y presionar el botón, y este lo comparara con algún resultado de la base de datos.
```javascript
const filtroBusqueda = async () => {
    const texto = busqueda.value.toLowerCase();
    try {
        if(texto !== '') {
            const resp = await fetch(`https://backsale.herokuapp.com/producto/${texto}`)
            if( !resp.ok ) throw 'No se puedo realizar la petición';
            const data = await resp.json();
            console.log(data)
            pintarProductos(data);
        } else {
            obtenerProducto(1)
        }

    } catch (error) {
        throw error;
    }  
}
```

Esta es la función principal, la cual pinta en el HTML todos los productos que se encontraron en la API, esto se realiza con los elementos provenientes del HTML, todo se realiza con nodos para modificar las etiquetas y fragment el cual almacena temporalmente la información lo cual permite que no se produzca un reflow.

```javascript
const pintarProductos = (data) => {

    limpiarHTML();

    data.forEach(producto => {
        
        templateProducto.querySelector('h3').textContent = producto.name
        templateProducto.querySelector('.producto__precio').textContent = '$' + producto.price
        if(producto.discount > 0){
            templateProducto.querySelector('.producto__descripcion').textContent = producto.discount + '% descuento'
        } else {
            templateProducto.querySelector('.producto__descripcion').textContent = producto.discount = ''
        }

        if(producto.url_image === null) {
            templateProducto.querySelector('img').setAttribute('src', 'https://cdnx.jumpseller.com/todo-ssangyong/image/5630731/resize/635/635?1602074367')
        } else if (producto.url_image === ''){
            templateProducto.querySelector('img').setAttribute('src', 'https://cdnx.jumpseller.com/todo-ssangyong/image/5630731/resize/635/635?1602074367')
        } else {
            templateProducto.querySelector('img').setAttribute('src', producto.url_image)
        }
        templateProducto.querySelector('.producto__agregar').dataset.id =  producto.id
        const clone = templateProducto.cloneNode(true);
        fragment.appendChild(clone);
    });

    productos.appendChild(fragment);
}
```


![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte4HTML.png?raw=true)
Funciones de paginación:
Desde el backend obtenemos un arreglo que tiene lista la cantidad de páginas en total, la página principal y la última página, en el front solo debemos pasar esas características a unas funciones y podremos manejar una paginación.
```javascript
const siguiente = async () => {
    if(paginaActual < paginaFinal ) {
        paginaActual += 1;
        obtenerProducto(paginaActual)
    } 
}

const atras = async () => {
    if(paginaActual > 1){
        paginaActual -= 1;
        obtenerProducto(paginaActual)
    }
}

const pagInicio = async () => {
    obtenerProducto(1)
}

const pagFin = async () => {
    obtenerProducto(paginaFinal)
}
```

Para evitar que se siga ejecutando más de una vez la función de obtener productos, se realiza un reinicio del HTML para no tener duplicados.
```javascript
function limpiarHTML() {
    while(productos.firstChild) {
        productos.removeChild(productos.firstChild);
    }
}
```
