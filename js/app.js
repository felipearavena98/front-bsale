// Variables del contenido HTML
// El orden de estas variables esta establecido por su posicion en el HTML
//

const busqueda = document.getElementById('formularioBusqueda');
const busquedaBoton = document.getElementById('botonBusqueda');
const productos = document.getElementById('items');
const paginacionDiv = document.getElementById('paginacion');
const first = document.getElementById('first');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const last = document.getElementById('last');
const templateProducto = document.getElementById('template-product').content;

const fragment = document.createDocumentFragment();

// Header

let paginaActual =  1;
let paginaFinal;


// EJECUTAR EL Contenido del DOM
document.addEventListener("DOMContentLoaded", () => {
    obtenerProducto(1);
    // busqueda.addEventListener('keyup', filtroBusqueda);
    busquedaBoton.addEventListener('click', filtroBusqueda);
    next.addEventListener('click', siguiente)
    previous.addEventListener('click', atras)
    last.addEventListener('click', pagFin)
    first.addEventListener('click', pagInicio)
});


// contenedor con la informacion de APIS
//https://backsale.herokuapp.com/



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


// Filtro Busqueda


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



// Const Mostrar Productos

const pintarProductos = (data) => {

    limpiarHTML();

    data.data.forEach(producto => {
        
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


function limpiarHTML() {
    while(productos.firstChild) {
        productos.removeChild(productos.firstChild);
    }
}
