// Variables Globales

let subTotalProductos = 0;
let totalProductos = 0;

let subTotal = 0;
let totalPagar = 0;

const iva = 1.21;
const codigoPromo = "ENVIO";
let codigoConfirmado = false;

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
};

// Funciones Basicas

let calcularSubTotalProducto = (precio, cantidad) => { return precio * cantidad };

let calcularSubTotalProductos = () => {

    subTotalProductos = 0;

    carrito.forEach(producto => {

        subTotalProductos += (producto.cantidad * producto.precio);

    })

    return subTotalProductos;
};

let confirmarCodigoPromo = (codigo) => {


    if(codigoConfirmado){
        mensajeCodigoYaReclamado();

    } else {

        if (codigo == codigoPromo) {
            mensajeCodigoCorrecto();
            codigoConfirmado = true;
        } else if (codigo == "") {
            mensajeCodigoVacio();
            // codigoConfirmado = false;
        } else {
            mensajeCodigoInCorrecto();
            // codigoConfirmado = false;
        }
    }

   

};

let calcularEnvio = () => {

    subTotal = 0;

    if (codigoConfirmado) {
        return 0;
    } else {
        subTotal += 200;
        return 200;
    }
};

let calcularDescuento = () => {

    if (subTotalProductos >= 1000) {
        totalProductos = subTotalProductos - (subTotalProductos * 0.2);
        return 20;
    } else {
        totalProductos = subTotalProductos;
        return 0;
    }
};

let calcularSubTotal = () => {

    subTotal += totalProductos;
    return subTotal;
};

let calcularIVA = () => {

    totalPagar = subTotal * iva;

    return totalPagar;
};

// Mostrar por el HTML los Productos

const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = () => {

    mensajePopupPromo();

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
            <button class="col-3" id="btn-${producto.id}">-</button>
            <div class="col-3 d-flex justify-content-center">
                <p class="m-0">${producto.cantidad}</p>
            </div>
            <button class="col-3" id="btn+${producto.id}">+</button>
        </div>

        <div class="col-2 m-0 p-0">
            <p class="text-center m-0">$${calcularSubTotalProducto(producto.precio, producto.cantidad)}</p>
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

    // Mostrar SubTotal de los Productos

    let precioTotalProductos = document.createElement("div");
    precioTotalProductos.classList.add("row", "justify-content-end", "align-items-center");

    precioTotalProductos.innerHTML = `

    <p class="m-0 col-3 text-end">SubTotal Productos =</p>
    
    <p class="m-0 col-2 text-center">$${calcularSubTotalProductos()}</p>`;

    contenedorCarrito.appendChild(precioTotalProductos);

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

// Botones para Mostrar, Cerrar Y Finalizar el Pago

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

// Mostrar Modal de Pago

const contenedorPago = document.getElementById("contenedorPago");

const mostrarPago = () => {

    // Mostrar Precio Final Iva + Descuento

    let contenedorInfoPago = document.createElement("div");

    contenedorInfoPago.innerHTML = `
    
    <div class="d-flex row">
        <p class="m-0 col-3 text-end">SubTotal Productos =</p>
        <p class="m-0 col-2 text-end">$${calcularSubTotalProductos()}</p>
    </div>

    <div class="d-flex row">
    <p class="m-0 col-3 text-end">Descuento =</p>
    <p class="m-0 col-2 text-end">${calcularDescuento()}%</p>
    </div>

    <div class="d-flex row">
    <p class="m-0 col-3 text-end">Total Productos =</p>
    <p class="m-0 col-2 text-end">$${totalProductos}</p>
    </div>

    <div class="d-flex row">
        <p class="m-0 col-3 text-end">Envio =</p>
        <p class="m-0 col-2 text-end">$${calcularEnvio()}</p>
        <input type="text" id="inputPromo" placeholder="Ingrese Su codigo Promocional" class="m-0 col-4">
    </div>

    <div class="d-flex row">
        <p class="m-0 col-3 text-end">Subtotal =</p>
        <p class="m-0 col-2 text-end">$${calcularSubTotal().toFixed(2)}</p>
    </div>

    <div class="d-flex row">
        <p class="m-0 col-3 text-end">Total a Pagar =</p>
        <p class="m-0 col-2 text-end">$${calcularIVA().toFixed(2)}</p>
    </div>
    `;

    contenedorPago.appendChild(contenedorInfoPago);

    // Input 

    const input = document.getElementById("inputPromo");

    input.addEventListener("keyup", (e) => {

        e.preventDefault();

        if (e.code === "Enter") {

            let inputValor = document.getElementById("inputPromo").value.toUpperCase();

            confirmarCodigoPromo(inputValor);
            borrarDOM(contenedorPago);
            inputValor = "";
            mostrarPago();
        }
    })
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
        mensajePopupPromo();
        codigoConfirmado = false;
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

const mensajeCompra = () => {
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

// Mensaje Promocion

const mensajeCodigoCorrecto = () => {

    Toastify({
        text: "Codigo Correto",
        duration: 3000,
        className: "mensajeCompraFinalizada text-center",
        gravity: "top",
        position: "center",
        style: {
            background: "#000046",
        },

        offset: {
            y: 30,
        },

    }).showToast();
};

const mensajeCodigoInCorrecto = () => {

    Toastify({
        text: "Codigo Incorreto",
        duration: 3000,
        className: "mensajeCompraFinalizada text-center",
        gravity: "top",
        position: "center",
        style: {
            background: "#000046",
        },

        offset: {
            y: 30,
        },

    }).showToast();
};

const mensajeCodigoVacio = () => {

    Toastify({
        text: "Ingrese su Codigo",
        duration: 3000,
        className: "mensajeCompraFinalizada text-center",
        gravity: "top",
        position: "center",
        style: {
            background: "#000046",
        },

        offset: {
            y: 30,
        },

    }).showToast();
};

const mensajeCodigoYaReclamado = () => {

    Toastify({
        text: "Ya reclamo su Codigo",
        duration: 3000,
        className: "mensajeCompraFinalizada text-center",
        gravity: "top",
        position: "center",
        style: {
            background: "#000046",
        },

        offset: {
            y: 30,
        },

    }).showToast();
};

//      Asincronia

// Pop-up de Codigo Promocional

/* Este pop-up no lo hice con la libreria "Toastify" porque se me acoplaba con los mensajes de "Producto agregado",
investigue en la documentacion propia de la libreria, pero no encontre forma de solucionar mi problema,
asi que me hice un "Toast" propio.*/

const mensajePopupPromo = () => {

    const contenedorToast = document.getElementById("contenedorToast");

    const intervalo = setInterval(() => {

        // Toastify({
        //     text: "Codigo: Envio",
        //     duration: 3000,
        //     className: "mensajePromo text-center d-flex align-items-center justify-content-center",
        //     gravity: "top",
        //     position: "right",
        //     style: {
        //         background: "#000046",
        //     },
        // }).showToast();

        

        let toastPrueba = document.createElement("div");

        toastPrueba.id = "toastPrueba";

        toastPrueba.classList.add("text-center", "d-flex", "align-items-center", "justify-content-center", "row");

        toastPrueba.innerHTML= `
        
        <p class="col-12 m-0">Codigo:</p>
        <p class="col-12 m-0">"ENVIO"</p>

        `

        contenedorToast.appendChild(toastPrueba);
        
        setTimeout(() =>{
            borrarDOM(contenedorToast);
        }, 3000)

        if (codigoConfirmado) {
            clearInterval(intervalo);
        }

    }, 6000)

}