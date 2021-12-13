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

![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/bstore.png?raw=true)


## Usabilidad

La página es simple, solo muestra la información de los productos y se presentan los filtros de búsqueda y categorías.

El filtro de búsqueda funciona escribiendo en él y presionando enter, no se reinicia automáticamente al quedar vacío, se le debe dar un enter o simplemente apretar para recargar la página.

El filtro de categorías funciona seleccionando una de las categorías disponibles y se cambia automáticamente, al volver a la posición inicial de las opciones la página vuelve a estar como estaba al principio.

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


![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte1HTML.png?raw=true)
Al ingresar a la página, lo primero que veremos es el navbar y abajo estarán nuestras primeras funcionalidades, las cuales son el input de búsqueda y el selector de categorías.
```html
    <div class="search search__contenedor">
      <div class="productos__search">
        <div class="search">
          <div class="container-busqueda">
            <p>Buscar Producto</p>
            <input
              type="text"
              id="formularioBusqueda"
              onchange="filtroBusqueda()"
            />
          </div>
          <span></span>
          <select
            name=""
            onchange="filtrarxCategoria()"
            class="categoriaProducto"
            id="categoriaProducto"
          >
            <option>Seleccione Categoria</option>
          </select>
        </div>
      </div>
    </div>

    <template id="template-busqueda">
      <input type="text" id="formulario" />
    </template>

    <template id="template-category">
      <option data-id=""></option>
    </template>
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
const busqueda = document.getElementById('formularioBusqueda')
const templateBusqueda = document.getElementById('template-busqueda').content
const categoryProduct = document.getElementById('categoriaProducto')
const templateCategory = document.getElementById('template-category').content
const productos = document.getElementById('items')
const templateProducto = document.getElementById('template-product').content
const fragment = document.createDocumentFragment();
```

Continuando con una lógica estructurada, después de definir los elementos que nos permitirán modificar el DOM, pasamos a ejecutar el DOMContentLoaded, el cual nos permite inicializar la interfaz de HTML contenida en el DOM, de esta forma estamos indicando que estamos trabajando de manera estructurada mediante nodos.

```javascript

document.addEventListener("DOMContentLoaded", () => {
    obtenerProducto();
    obtenerCategorias();
});

```
Uno de nuestros endpoint estará dentro de una variable, solo para ahorrar algunas líneas de código y mantener el orden.

Este endpoint nos permite obtener todos los productos provenientes de la base de datos, mediante una API REST.


```javascript
const productURL = 'https://backsale.herokuapp.com/allproduct';
```

El siguiente arreglo tiene el propósito de almacenar los productos provenientes de la API.
```javascript
const arrProductos = []
```
La función siguiente lo que hace es hacer el llamado a la api y obtener productos.
```javascript
const obtenerProducto = async () => {

    try {
        const resp = await fetch(productURL);

        if( !resp.ok ) throw 'No se puedo realizar la petición';
    
        const data = await resp.json();
        data.forEach( producto => {
            arrProductos.push(producto)
        })
        
        pintarProductos(data);

    } catch (error) {
        throw error;
    }
}

```
La función siguiente lo que hace es hacer el llamado a la api y obtener las categorías.
```javascript
const obtenerCategorias = async () => {

    try {
        const resp = await fetch(`https://backsale.herokuapp.com/category`);

        if( !resp.ok ) throw 'No se puedo realizar la petición';
    
        const data = await resp.json();

        pintarCategorias(data)

    } catch (error) {
        throw error;
    }
}
```
La función para filtrar por categorías, se ejecuta mediante un evento que sucede en el front con el select del front.

Lo que hace es sacar el valor del id de la categoría, compararlo con lo que se selecciona en el select y pintar en la página por los productos que se están seleccionando.

```javascript
const filtrarxCategoria = async () => {
    
    valorId = parseInt(document.getElementById("categoriaProducto").value)

    if(valorId > 0){
        let resultadoBusqueda = arrProductos.filter(producto =>
            producto.category == valorId
        )
        pintarProductos(resultadoBusqueda)
    }else {

        pintarProductos(arrProductos);
    
    }

}

```
El filtro de búsqueda funciona mediante un elemento del HTML, el cual interactúa con el arreglo de objeto que almacena los productos provenientes de la API y lo compara, al realizar lo anterior, se pintan en el HTML los productos que se están buscando en caso de tener similitud con la búsqueda.
```javascript
const filtroBusqueda = () => {

    let variable = busqueda.value

    if(variable !== '') {
        let resultadoBusqueda = arrProductos.filter(producto =>
            producto.name.toLowerCase().includes(variable.toLowerCase())
        )

        pintarProductos(resultadoBusqueda);
    } else {
        pintarProductos(arrProductos);
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
Esta función permite llenar el select que contiene los nombres de las categorías y los id de esta misma.
```javascript
const pintarCategorias = (data) => {
    data.forEach( category => {
        templateCategory.querySelector('option').textContent =  category.name
        templateCategory.querySelector('option').value =  category.id
        const clone = templateCategory.cloneNode(true);
        fragment.appendChild(clone);
    })
    categoryProduct.appendChild(fragment)
}
```
La función de búsqueda cumple con tomar lo que se recibe en el input y mandarlo al filtro de búsqueda para comparar los valores.
```javascript
const pintarBusqueda = (data) => {
    data.forEach( search => {
        templateBusqueda.querySelector('input').textContent =  search.name
        const clone = templateBusqueda.cloneNode(true);
        fragment.appendChild(clone);
    })
    busqueda.appendChild(fragment)
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
