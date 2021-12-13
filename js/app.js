// Variables del contenido HTML
// El orden de estas variables esta establecido por su posicion en el HTML
//

// const btnTermino = document.getElementById('btn-termino')
// // const search = document.getElementById('termino')
// const contenedorBusqueda = document.getElementById('contenedor-Busqueda').content
const busqueda = document.getElementById('formularioBusqueda')
const templateBusqueda = document.getElementById('template-busqueda').content
const categoryProduct = document.getElementById('categoriaProducto')
const templateCategory = document.getElementById('template-category').content
const productos = document.getElementById('items')
const templateProducto = document.getElementById('template-product').content
const fragment = document.createDocumentFragment();

// Header

// EJECUTAR EL Contenido del DOM
document.addEventListener("DOMContentLoaded", () => {
    obtenerProducto();
    obtenerCategorias();
});

productos.addEventListener('click', e => {
    addCarrito(e)
})


// contenedor con la informacion de APIS

const productURL = 'https://backsale.herokuapp.com/allproduct';

const arrProductos = []

// Llamado de APIS
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

// Llamar a las categorias

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

//  FILTRO POR CATEGORIA
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


// Filtro Busqueda

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
 
// Const Mostrar Productos

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
            templateProducto.querySelector('img').setAttribute('src', '../img/sinfoto.png')
        } else if (producto.url_image === ''){
            templateProducto.querySelector('img').setAttribute('src', '../img/sinfoto.png')
        } else {
            templateProducto.querySelector('img').setAttribute('src', producto.url_image)
        }
        templateProducto.querySelector('.producto__agregar').dataset.id =  producto.id
        const clone = templateProducto.cloneNode(true);
        fragment.appendChild(clone);
    });

    productos.appendChild(fragment);
}



// Cargar Select de CATEGORIAS

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


// // SEARCH

const pintarBusqueda = (data) => {
    data.forEach( search => {
        templateBusqueda.querySelector('input').textContent =  search.name
        const clone = templateBusqueda.cloneNode(true);
        fragment.appendChild(clone);
    })
    busqueda.appendChild(fragment)
}


function limpiarHTML() {
    while(productos.firstChild) {
        productos.removeChild(productos.firstChild);
    }
}

