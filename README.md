# Besale Front - Prueba

El siguiente documento tiene el proposito de explicar el codigo y como se interactua con la pagina


## Autor

- [@felipearavena98](https://github.com/felipearavena98)



## Proyecto Bsale

![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/bstore.png?raw=true)


## Demostración Pagina

https://felipearavena98.github.io/front-bsale/


# Documentación del codigo
## Inicio -- index.html




![App Screenshot](https://github.com/felipearavena98/imagenes/blob/main/img-proyecto-bsale/parte1HTML.png?raw=true)

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


# Documentación del codigo
## Inicio -- app.js

Para comenzar con el archivo de javascript, tenemos en primera instancia los elementos que nos permitiran manejar estilos, etiquetas, framgent, etc. del DOM a traves de JavaScript.

Utilizaremos un un input para realizar la busqueda de productos, tendremos un select para poder ver los productos filtrados por categorias y tambien manejaremos un contenedor en el cual se cargaran las imanges y seran estilizadas con css.
```javascript
const busqueda = document.getElementById('formularioBusqueda')
const templateBusqueda = document.getElementById('template-busqueda').content
const categoryProduct = document.getElementById('categoriaProducto')
const templateCategory = document.getElementById('template-category').content
const productos = document.getElementById('items')
const templateProducto = document.getElementById('template-product').content
const fragment = document.createDocumentFragment();
```

Continuando con una logica estructurada, despues de definir los elementos que nos permitiran modificar el DOM, pasamos a ejecutar el DOMContentLoaded, el cual nos permite inicializar la interfaz de HTML contenida en el DOM, de esta forma estamos indicando que estamos trabajando de manera estructurada mediante nodos.

```javascript

document.addEventListener("DOMContentLoaded", () => {
    obtenerProducto();
    obtenerCategorias();
});

```

Uno de nuestros endpoint estara dentro de una variable, solo par ahorrar algunas lineas de codigo y mantener el orden.

Este endpoint nos permite obtener todos los productos provenientes de la base de datos, mediante una API REST.

```javascript
const productURL = 'https://backsale.herokuapp.com/allproduct';
```


```javascript
const arrProductos = []
```

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

```javascript
const pintarCategorias = (data) => {
    data.forEach( category => {
        templateCategory.querySelector('option').textContent =  category.name
        // templateCategory.querySelector('option').dataset.id =  category.id
        templateCategory.querySelector('option').value =  category.id
        const clone = templateCategory.cloneNode(true);
        fragment.appendChild(clone);
    })
    categoryProduct.appendChild(fragment)
}
```

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

```javascript
function limpiarHTML() {
    while(productos.firstChild) {
        productos.removeChild(productos.firstChild);
    }
}
```
