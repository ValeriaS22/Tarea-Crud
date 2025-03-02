//variables globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let descripcionInput = d.querySelector(".descripcion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table > tbody");
let buscador = d.querySelector("#buscador");
let btnBuscar = d.querySelector("#btn-buscar");

btnGuardar.addEventListener("click", () =>{
    let datos = validarFormulario();
    if( datos != null){
        guardarDatos(datos);
    };
    borrarTabla();
    mostrarDatos();
});

//funcion para validar el formulario
function validarFormulario(){
    let datosForm;

    if(clienteInput.value == "" || productoInput.value == "" || precioInput.value == "" || imagenInput.value == ""){
        alert("Todos los campos del formulario son obligatorios");
        return;
    }else{
        datosForm = {
            cliente : clienteInput.value,
            producto : productoInput.value,
            precio : precioInput.value,
            imagen : imagenInput.value,
            descripcion : descripcionInput.value
        }
    };
    console.log(datosForm);
    clienteInput.value ="";
    productoInput.value ="";
    precioInput.value ="";
    imagenInput.value="";
    descripcionInput.value="";

    return datosForm;
};

// funcion guardar datos en localStorage
const listadoPedidos = "Pedidos";
function guardarDatos( datos ){
    let pedidos = [];
    //extraer datos guardados previamente en el localStorage
    let pedidosPrevios =  JSON.parse(localStorage.getItem(listadoPedidos));
    //validar datos guardados previamente en el localStorage
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    //agregar el pedido al array
    pedidos.push(datos);

    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    //validar que los datos fueron guardados
    alert("Datos guardados con éxito");
};

//funcion para extraer los datos guardados en el localStorage
function mostrarDatos(){
    let pedidos = [];
    let pedidosPrevios =  JSON.parse(localStorage.getItem(listadoPedidos));
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }

    //mostrar los datos en la tabla 
    pedidos.forEach((p,i)=>{
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td> ${i+1} </td>
            <td> ${ p.cliente } </td>
            <td> ${ p.producto } </td>
            <td> ${ p.precio } </td>
            <td> <img src ="${ p.imagen }" width="100%"> </td>
            <td> ${ p.descripcion } </td>
            <td>
                <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning"> 🗒️ </span>
                <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-primary"> ❎ </span>
            </td>
        `;
        tabla.appendChild(fila);
    });
};

//no se dupliquen los datos de la tabla
function borrarTabla(){
    let filas = d.querySelectorAll(".table tbody tr");
    filas.forEach((f)=>{
        f.remove();
    });
};

//funcion eliminar un pedido
function eliminarPedido( pos ){
    let pedidos = [];
    let pedidosPrevios =  JSON.parse(localStorage.getItem(listadoPedidos));
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    //confirmar pedido para eliminar 
    let confirmar = confirm("¿Deseas eliminar el pedido " + pedidos[pos].cliente + "?");
    if( confirmar ){
        pedidos.splice(pos,1);
        alert("El pedido ha sido eliminado");

        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();
    };
};

function actualizarPedido( pos ){
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];

    clienteInput.value = pedidos[pos].cliente;
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    imagenInput.value = pedidos[pos].imagen;
    descripcionInput.value = pedidos[pos].descripcion;

    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.remove("d-none");
    btnGuardar.classList.add("d-none");

    // Eliminar eventos previos antes de agregar uno nuevo
    let nuevoBoton = btnActualizar.cloneNode(true);
    btnActualizar.replaceWith(nuevoBoton);

    nuevoBoton.addEventListener("click", function(){
        pedidos[pos] = {
            cliente: clienteInput.value,
            producto: productoInput.value,
            precio: precioInput.value,
            imagen: imagenInput.value,
            descripcion: descripcionInput.value
        };

        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        alert("El pedido fue actualizado 🥗");

        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        imagenInput.value = "";
        descripcionInput.value = "";

        nuevoBoton.classList.add("d-none");
        btnGuardar.classList.remove("d-none");

        borrarTabla();
        mostrarDatos();
    });
};

btnBuscar.addEventListener("click", filtrarPedidos);

// Funcion para filtrar los pedidos
function filtrarPedidos() {
    let filtro = buscador.value.trim().toLowerCase();
    let pedidos = JSON.parse(localStorage.getItem(listadoPedidos)) || [];
    
    borrarTabla();

    let pedidosFiltrados = pedidos.filter(p => p.cliente.toLowerCase().includes(filtro));
    pedidosFiltrados.forEach((p, i) => agregarFila(p, i));
}

// Función para agregar una fila a la tabla
function agregarFila(p, i) {
    let fila = d.createElement("tr");
    fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.cliente}</td>
        <td>${p.producto}</td>
        <td>${p.precio}</td>
        <td><img src="${p.imagen}" width="100%"></td>
        <td>${p.descripcion}</td>
        <td>
            <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning"> 🗒️ </span>
            <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-primary"> ❎ </span>
        </td>
    `;
    tabla.appendChild(fila);
}

document.addEventListener("DOMContentLoaded", function(){
    borrarTabla();
    mostrarDatos();
});

//Descargar el PDF
document.addEventListener("DOMContentLoaded", () => {
    const { jsPDF } = window.jspdf; // para poder importar
    
    document.querySelector(".btn-descargarPedidos").addEventListener("click", () => {
        let pedidos = JSON.parse(localStorage.getItem("Pedidos")) || [];
        if (!pedidos.length) return alert("No hay pedidos para descargar.");
        
        let doc = new jsPDF();
        pedidos.forEach((p, i) => doc.text(`${i + 1}. ${p.cliente} - ${p.producto} - $${p.precio}`, 10, 10 + i * 10));
        doc.save("Pedidos.pdf");
    });
});