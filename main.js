// Constructores

class Producto {
    constructor(objeto) {
        this.id = objeto.id;
        this.nombre = objeto.nombre;
        this.precio = objeto.precio;
        this.img = objeto.img;
        this.cantidad = 1;
        this.descripcion = objeto.descripcion;
    }
}

class ProductoCargado {
    constructor(producto) {
        this.id = producto.id;
        this.nombre = producto.nombre;
        this.precio = producto.precio;
        this.img = producto.img;
        this.cantidad = 1;
        this.descripcion = producto.descripcion;
    }
}

// Array Productos

let productos = [];
const stockProductos = "Json/productos.json";

fetch(stockProductos)
    .then(respuesta => respuesta.json())
    .then(datos => {

        datos.forEach(objeto => {

            productos.push(new Producto(objeto));
        })
        // Funcion principal

        mostrarProductos();

    })
    .catch(error => console.log(error))

// Array Carrito 

let carrito = [];

// Recuperar el Carrito del Local Storage

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

// Guardar el Carrito en el Local Storage

const guardarCarrito = () => {

    localStorage.setItem("carrito", JSON.stringify(carrito));

}

// Funciones Basicas

let calcularSubTotal = (a, b) => { return a * b };

let calcularIVA = (a) => { return a * iva };

let calcularDescuento = (a) => { return a - (a * 0.2) };

let total = 0;

let calcularTotal = () => {

    total = 0;

    carrito.forEach(producto => {

        total += (producto.cantidad * producto.precio);

    })
    return total;
};

const iva = 1.21;

let precioFinal = 0;

const calcularPrecioFinal = () => {

    precioFinal = 0;

    if (total >= 1000) {
        precioFinal = calcularIVA(calcularDescuento(total));
        return precioFinal;
    } else {
        precioFinal = calcularIVA(total);
        return precioFinal;
    }

};

// Mostrar por el HTML los Productos

const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = () => {

    productos.forEach(producto => {

        const card = document.createElement("div");
        card.classList.add("col-12", "col-sm-12", "col-md-6", "col-lg-6", "col-xl-4", "col-xxl-4", "mb-3", "d-flex", "justify-content-center");
        card.innerHTML = `
            <div class="card tarjetaProducto">
    
                <div class="filtroBlur">
                    <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                    <p class="filtroTexto p-1 text-center">${producto.descripcion}</p>
                </div>
    
                <div class="card-body text-center">
                    <h5 class="card-title">${producto.nombre}</h5>
                </div>
    
                <div class="d-flex justify-content-center mb-3">
                    <button type="button" class="btn btn-outline-light"  id="btn${producto.id}">
                        Agregar al Carrito
                    </button>
                </div>
            </div>`

        contenedorProductos.appendChild(card);

        // Boton Agregar al Carrito
        const boton = document.getElementById(`btn${producto.id}`);
        boton.addEventListener("click", () => {
            agregarProducto(producto.id);
            mensajeProductoAgregado();
        })
    })
}

// Agregar productos al Carrito

const agregarProducto = (id) => {

    const productoEncotrado = carrito.find(producto => producto.id === id);

    if (productoEncotrado) {
        productoEncotrado.cantidad++;
    } else {
        carrito.push(new ProductoCargado(productos[id]));
    }

    guardarCarrito();
    console.log(carrito);
}

// Disminuir cantidad o eliminar un producto

const eliminarProducto = (id) => {

    const productoEncotrado = carrito.find(producto => producto.id === id);

    productoEncotrado.cantidad--;

    if (productoEncotrado.cantidad <= 0) {

        let indice = carrito.indexOf(productoEncotrado);
        carrito.splice(indice, 1);

    }

    guardarCarrito();
    console.log(carrito);

}




/*               TODO LO RELACIONADO AL MODAL POR EL CUAL SE MUESTRA EL CARRITO             */

// Botones para Mostrar, Cerrar Y Vaciar el Carrito

const btnabrirCarrito = document.getElementById('abrirCarrito');
const modalCarrito = document.getElementById('myModal');
const btnCerrarCarrito = document.getElementById('cerrarCarrito');
const btnVaciarCarrito = document.getElementById("vaciarCarrito");

//Boton Abrir

btnabrirCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    modalCarrito.classList.add('modalVisible');
    mostrarCarrito();
});

//Boton Cerrar

btnCerrarCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    modalCarrito.classList.remove('modalVisible');
    borrarDOM(contenedorCarrito);
});

// Boton Vaciar Carrito

btnVaciarCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    carrito = [];
    localStorage.clear();
    borrarDOM(contenedorCarrito);
    mostrarCarrito();
});

// Constante del DOM del carrito

const contenedorCarrito = document.getElementById("contenedorProductosCargados");

// Generador de los productos cargados en el carrito

const mostrarCarrito = () => {

    let plantilla = document.createElement("div");
    plantilla.classList.add("d-flex", "align-items-center", "row", "justify-content-end");

    plantilla.innerHTML = `

    <p class="col-5 m-0 p-0 text-center">Producto</p>
    <p class="col-2 m-0 p-0 text-center">Precio Unitario</p>
    <p class="col-3 m-0 p-0 text-center">Cantidad</p>
    <p class="col-2 m-0 p-0 text-center">SubTotal</p>

    `

    contenedorCarrito.appendChild(plantilla);

    carrito.forEach(producto => {

        const item = document.createElement("div");

        item.classList.add("d-flex", "align-items-center", "row", "justify-content-end");

        item.innerHTML = `

        <div class="col-2 m-0 p-0">
            <img src="${producto.img}" alt="${producto.nombre}" class="imgCarrito">
        </div>
        
        <div class="col-3 m-0 p-0">
            <p class="m-0">${producto.nombre}</p>
        </div>
        
        <div class="col-2 m-0 p-0">
            <p class="text-center m-0">$${producto.precio}</p>
        </div>
        
        
        <div class="col-3 m-0 p-0 d-flex align-items-center justify-content-center row">
            <button class="col-3" id="btn+${producto.id}">+</button>
            <div class="col-3 d-flex justify-content-center">
                <p class="m-0">${producto.cantidad}</p>
            </div>
            <button class="col-3" id="btn-${producto.id}">-</button>
        </div>

        <div class="col-2 m-0 p-0">
            <p class="text-center m-0">$${calcularSubTotal(producto.precio, producto.cantidad)}</p>
        </div>
        
        
        `

        contenedorCarrito.appendChild(item);

        // Boton Sumar producto

        const btnSuma = document.getElementById(`btn+${producto.id}`);

        btnSuma.addEventListener("click", () => {
            agregarProducto(producto.id);
            borrarDOM(contenedorCarrito);
            mostrarCarrito();
        })

        //Boton de restar producto

        const btnResta = document.getElementById(`btn-${producto.id}`);

        btnResta.addEventListener("click", () => {
            eliminarProducto(producto.id);
            borrarDOM(contenedorCarrito);
            mostrarCarrito();
        })

    })

    // Mostrar Total

    let precioTotal = document.createElement("div");
    precioTotal.classList.add("row", "justify-content-end", "align-items-center");

    precioTotal.innerHTML = `
    
    <p class="m-0 col-8 text-end">Se aplicara el IVA en el Precio Final</p>

    <p class="m-0 col-2 text-end">Total =</p>
    
    <p class="m-0 col-2 text-center">$${calcularTotal()}</p>`;

    contenedorCarrito.appendChild(precioTotal);

    // Mostrar Precio Final Iva + Descuento

    let precioFinal = document.createElement("div");
    precioFinal.classList.add("row", "justify-content-end", "align-items-center");

    if (total >= 1000) {

        precioFinal.innerHTML = `
    
            <p class="m-0 col-8 text-end">Descuento del 20% aplicado</p>

            <p class="m-0 col-2 text-end" > Precio Final =</p >

            <p class="m-0 col-2 text-center">$${calcularPrecioFinal().toFixed(2)}</p>`;

    } else {

        precioFinal.innerHTML = `


            <p class="m-0 col-2 text-end" > Precio Final =</p >

            <p class="m-0 col-2 text-center">$${calcularPrecioFinal().toFixed(2)}</p>`;


    }


    contenedorCarrito.appendChild(precioFinal);


}

// Destructor del DOM pasado por parametro

const borrarDOM = (contenedor) => {

    if (contenedor.hasChildNodes()) {
        while (contenedor.childNodes.length >= 1) {
            contenedor.removeChild(contenedor.firstChild);
        }
    }

}

// Modal Pago

// Botones para Mostrar, Cerrar Y Vaciar el Pago

const btnabrirPago = document.getElementById('pagarCarrito');
const modalPago = document.getElementById('modalPago');
const btnCerrarPago = document.getElementById('cerrarPago');
const btnFinalizarCompra = document.getElementById("finalizarCompra");

//Boton Abrir

btnabrirPago.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarPago();
    modalPago.classList.add('modalVisiblePago');
});

//Boton Cerrar

btnCerrarPago.addEventListener('click', (e) => {
    e.preventDefault();
    modalPago.classList.remove('modalVisiblePago');
    borrarDOM(contenedorPago);
});

// Mostrar Mensaje de Pago

const contenedorPago = document.getElementById("contenedorPago");

const mostrarPago = () => {

    const mensaje = document.createElement("div");

    mensaje.innerHTML = `
    
    <p class="m-0 text-start">Total a Pagar = $${precioFinal.toFixed(2)}</p>`;

    contenedorPago.appendChild(mensaje);

}

// Finalizar Compra

btnFinalizarCompra.addEventListener("click", (e) => {

    if (carrito.length === 0) {
        mensajeCarritoVacio();

    } else {
        e.preventDefault();
        modalPago.classList.remove('modalVisiblePago');
        modalCarrito.classList.remove('modalVisible');
        borrarDOM(contenedorCarrito);
        borrarDOM(contenedorPago);
        carrito = [];
        localStorage.clear();
        mensajeCompra();
    }

   
})

//              Libreria Toastify

// Mensaje de producto agregado
const mensajeProductoAgregado = () => {

    Toastify({
        text: "Producto agregado al carrito",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
            background: "#000046",
        },

    }).showToast();

};

// Mensaje de Carrito Vacio
const mensajeCarritoVacio = () => {

    Toastify({
        text: "Su carrito esta vacio",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
            background: "#000046",
        },

    }).showToast();

};

// Mensaje de compra finalizada

const mensajeCompra = () =>{
    Toastify({
        text: "Gracias por su compra",
        duration: 3000,
        className: "mensajeCompraFinalizada text-center",
        gravity: "bottom",
        position: "center",
        style: {
            background: "#000046",
        },

        offset: {
            y: 30,
        },

    }).showToast();
};