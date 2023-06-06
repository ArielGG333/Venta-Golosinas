window.onload = inicio;

// ----------------------------------------------------------------------------------
let varCaja=0;
let ID_Producto;
let ID_Cliente;
let ID_Movimiento;
let varProducto;
let varPrecioVenta;
let varPrecioCompra;
let varCantidad;
let varStock;
let varMonto;

// ----------------------------------------------------------------------------------
function inicio() {
    navegacionFija();
    cargarDatosProductos();
    cargarDatosClientes();
    cargarDatosMovimientos();
    document.getElementById('caja').innerHTML = `<a><i class="fa-solid fa-cash-register"></i> Caja: $${varCaja}</a>`
    document.getElementById('btnBuscar').addEventListener('click', buscar)
    document.getElementById('btnMostrar').addEventListener('click', mostrarTodo)
    document.getElementById('btnStockCritico').addEventListener('click', stockCritico)
    document.getElementById('btnResetear').addEventListener('click', resetearMovimientos)
}

// ----------------------------------------------------------------------------------
function navegacionFija() {
    const nav = document.querySelector('.nav-main');

    window.addEventListener('scroll', function () {
        nav.classList.toggle('active', window.scrollY > 0)
    });
}

// ----------------------------------------------------------------------------------
function cargarDatosProductos() {
    axios({
        method: 'GET',
        url: 'http://localhost:3000/productos'
    }).then(res => {
        // console.log(res.data)
        const list = document.getElementById('listarProductos');
        const fragment = document.createDocumentFragment();
        list.innerHTML = "";
        for (const userInfo of res.data) {
            const listItem = document.createElement('TR');
            listItem.innerHTML =
                `<td>${userInfo.id}</td> 
                <td>${userInfo.nombre}</td> 
                <td>$${userInfo.precioVenta}</td> 
                <td>${userInfo.stock}</td> 
                <td><button class="btnVerde" onclick="verificarVentas(${userInfo.id}, '${userInfo.nombre}', '${userInfo.precioCompra}', '${userInfo.precioVenta}', '${userInfo.stock}')">Vender <i class="fas fa-dollar-sign"></i></button> 
                <button class="btnRojo" onclick="verificarCompras(${userInfo.id}, '${userInfo.nombre}', '${userInfo.precioCompra}', '${userInfo.precioVenta}', '${userInfo.stock}')">Comprar <i class="fas fa-shopping-cart"></i></button></td>`;
            fragment.appendChild(listItem);
        }
        list.appendChild(fragment);
    }).catch(err => console.log(err));
}

// ----------------------------------------------------------------------------------
function cargarDatosClientes() {
    axios({
        method: 'GET',
        url: 'http://localhost:3000/clientes'
    }).then(res => {
        // console.log(res.data)
        const list = document.getElementById('listarClientes');
        const fragment = document.createDocumentFragment();
        let contador = 0;
        for (const userInfo of res.data) {
            list.innerHTML = "";
            const listItem = document.createElement('TR');
            contador += 1;
            listItem.classList.add('contador' + contador);
            listItem.innerHTML =
                `<td>${userInfo.id}</td> 
                <td>${userInfo.nombre}</td> 
                <td>${userInfo.telefono}</td> 
                <td>${userInfo.deudas}</td> 
                <td><button class="btnVerde" onclick="editar(${userInfo.id}, '${userInfo.nombre}', '${userInfo.telefono}')">Editar <i class="fas fa-edit"></i></button> 
                <button class="btnRojo" onclick="eliminar(${userInfo.id})">Eliminar <i class="fas fa-trash-alt"></i></button>
                <button class="btnAzul" onclick="estadoCliente(${userInfo.id}, '${userInfo.nombre}', '${userInfo.telefono}')"><i class="fa-solid fa-ban"></i></button></td>`;
                traerClientes(userInfo.id, userInfo.nombre);
            fragment.appendChild(listItem);
        }
        list.appendChild(fragment);
    }).catch(err => console.log(err));
}

// ----------------------------------------------------------------------------------
function cargarDatosMovimientos() {
    axios({
        method: 'GET',
        url: 'http://localhost:3000/movimientos'
    }).then(res => {
        const list = document.getElementById('listarMovimientos');
        const fragment = document.createDocumentFragment();
        for (const userInfo of res.data) {
            list.innerHTML = "";
            const listItem = document.createElement('TR');
            listItem.innerHTML =
                `<td>${userInfo.id}</td> 
                <td>${userInfo.tipo}</td> 
                <td>${userInfo.clienteProveedor}</td> 
                <td>${userInfo.medio}</td>
                <td>${userInfo.concepto}</td>
                <td>${userInfo.monto}</td>`;
            fragment.appendChild(listItem);
            ID_Movimiento = userInfo.id;
        }
        list.appendChild(fragment);
    }).catch(err => console.log(err));
}

// ----------------------------------------------------------------------------------
function agregarDinero() {
    varCaja = varCaja + 50;

    //axios.post("http://localhost:3000/movimientos", { tipo: "Ingreso", clienteProveedor: "-", medio: "Efectivo", concepto: "Caja", monto: "$" + varCaja })

    inicio();
}

// ----------------------------------------------------------------------------------
async function buscar() {
    ID_Buscar = document.getElementById('inputBuscar').value
    if (ID_Buscar == "") {
        alert('Ingrese código')
    }
    else {
        try {
            let buscar = await axios.get("http://localhost:3000/productos/" + ID_Buscar)
            // console.log(buscar.data)
            document.getElementById("listarProductos").innerHTML =
                `<td>${buscar.data.id}</td> 
            <td>${buscar.data.nombre}</td>
            <td>$${buscar.data.precioVenta}</td>
            <td>${buscar.data.stock}</td>
            <td><button class="btnVerde" onclick="verificarVentas(${buscar.data.id}, '${buscar.data.nombre}', '${buscar.data.precioCompra}', '${buscar.data.precioVenta}', '${buscar.data.stock}')">Vender <i class="fas fa-dollar-sign"></i></button> <button class="btnRojo" onclick="verificarCompras(${buscar.data.id}, '${buscar.data.nombre}', '${buscar.data.precioCompra}', '${buscar.data.precioVenta}', '${buscar.data.stock}')">Comprar <i class="fas fa-shopping-cart"></i></button></td>`
        } catch (error) {
            console.log(error.request.status)
        }
    }
}

// ----------------------------------------------------------------------------------
function mostrarTodo() {
    cargarDatosProductos();
}

// ----------------------------------------------------------------------------------
async function stockCritico() {
    try {
        document.getElementById("listarProductos").innerHTML = ""
        for (var i = 1; i <= 14; i++) {
            let stockCritico = await axios.get("http://localhost:3000/productos/" + i)
            if (stockCritico.data.stock <= 15) {
                document.getElementById("listarProductos").innerHTML +=
                    `<td>${stockCritico.data.id}</td> 
                <td>${stockCritico.data.nombre}</td>
                <td>$${stockCritico.data.precioVenta}</td>
                <td>${stockCritico.data.stock}</td>
                <td><button class="btnVerde" onclick="verificarVentas(${stockCritico.data.id}, '${stockCritico.data.nombre}', '${stockCritico.data.precioCompra}', '${stockCritico.data.precioVenta}', '${stockCritico.data.stock}')">Vender <i class="fas fa-dollar-sign"></i></button> <button class="btnRojo" onclick="verificarCompras(${stockCritico.data.id}, '${stockCritico.data.nombre}', '${stockCritico.data.precioCompra}', '${stockCritico.data.precioVenta}', '${stockCritico.data.stock}')">Comprar <i class="fas fa-shopping-cart"></i></button></td>`
                console.log(stockCritico.data)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

function resetearMovimientos() {
    ID_Movimiento = ID_Movimiento + 1;
    for (var i = 1; i < ID_Movimiento; i++) {
        axios.delete("http://localhost:3000/movimientos/" + i)
    }
    
    alert('Movimientos borrados');
    inicio();
}

// ----------------------------------------------------------------------------------
const buttonRegistrarCliente = document.getElementById('btnRegistrarCliente');
buttonRegistrarCliente.addEventListener('click', async () => {
    try {
        let res = await axios.post("http://localhost:3000/clientes", { nombre: document.getElementById('nombreCliente').value, telefono: document.getElementById('telefono').value });
        alert("Datos registrados correctamente");
        cargarDatosClientes();
    } catch (err) {
        console.log(err);
    }
})

// ----------------------------------------------------------------------------------
function editar(id, nombre, telefono) {
    document.getElementById("nombreCliente").value = nombre;
    document.getElementById("telefono").value = telefono;
    ID_Cliente = id;
}

// ----------------------------------------------------------------------------------
const buttonGuardarEdit = document.getElementById('btnGuardarEdit');
buttonGuardarEdit.addEventListener('click', () => {
    axios.put("http://localhost:3000/clientes/" + ID_Cliente, { nombre: document.getElementById("nombreCliente").value, telefono: document.getElementById("telefono").value })
        .then(res => alert("Datos modificados correctamente"))
        .catch(err => console.log(err));
    cargarDatosClientes();
})

// ----------------------------------------------------------------------------------
/* function eliminar(id) {
    axios.delete("http://localhost:3000/clientes/" + id)
        .then(res => alert("Datos borrados correctamente"))
        .catch(err => console.log(err));
    cargarDatosClientes();
} */

// ----------------------------------------------------------------------------------
async function eliminar(id) {
    try {
        await axios.delete("http://localhost:3000/clientes/" + id)
        alert("Datos borrados correctamente")
    } catch (err) {
        console.log(err)
    }
}

// ----------------------------------------------------------------------------------
function verificarVentas(id, nombre, precioCompra, precioVenta, stock) {
    if (stock <= 0) {
        alert('Producto agotado, sin Stock');
    }
    else abrirVentas(id, nombre, precioCompra, precioVenta, stock);
}
// VENTANA MODAL DE VENTAS
const modal_Container1 = document.getElementById('modalContainer1');
const btnVender = document.getElementById('btnVender');
const cancelar1 = document.getElementById('btnCancelar1');
function abrirVentas(id, producto, compra, venta, stock) {
    modal_Container1.classList.add('show');

    document.getElementById("ventanaVentas").innerHTML =
        `<p><b>Producto selecionado: </b>${producto} <br> 
        <b>Precio de Compra: </b>${compra} <br> 
        <b>Precio de Venta: </b>${venta} <br>
        <b>Stock Actual: </b>${stock} <br>
        <b>Cantidad a vender: </b><input type="number" id="cantidadVender" placeholder="Ingrese cantidad"> <br>
        <b>Tipo de pago: </b><input type="checkbox" id="check1">Efectivo <input type="checkbox" id="check2">Tarjeta <br></p>`
    ID_Producto = id;
    varProducto = producto;
    varPrecioCompra = compra;
    varPrecioVenta = venta;
    varStock = stock;
}

btnVender.addEventListener('click', () => {
    if (document.getElementById('cantidadVender').value == "" || document.getElementById('cantidadVender').value < 1) {
        alert('Falta rellenar el campo "cantidad"')
    }
    else {
        var num = document.getElementById("llenarSelect").value;

        varCantidad = document.getElementById('cantidadVender').value;
        varCaja = varCaja + (parseFloat(varPrecioVenta) * parseFloat(varCantidad));
        varStock = varStock - varCantidad;
        varMonto = parseFloat(varPrecioVenta) * parseFloat(varCantidad);

        axios.put("http://localhost:3000/productos/" + ID_Producto, { nombre: varProducto, precioCompra: varPrecioCompra, precioVenta: varPrecioVenta, stock: varStock })

        if (document.getElementById("check1").checked){
            axios.post("http://localhost:3000/movimientos", { tipo: "Ingreso", clienteProveedor: num, medio: "Efectivo", concepto: "Venta", monto: "$" + varMonto })
        }
        else {
            axios.post("http://localhost:3000/movimientos", { tipo: "Ingreso", clienteProveedor: num, medio: "Tarjeta", concepto: "Venta", monto: "$" + varMonto })
        }

        mostrarMensaje1();
        inicio();
        modal_Container1.classList.remove('show');
    }
})

cancelar1.addEventListener('click', () => {
    modal_Container1.classList.remove('show');
});

// ----------------------------------------------------------------------------------
function verificarCompras(id, nombre, precioCompra, precioVenta, stock) {
    if (varCaja <= 0) {
        alert('No hay dinero en caja');
    }
    else abrirCompras(id, nombre, precioCompra, precioVenta, stock);
}
// VENTANA MODAL DE COMPRAS
const modal_Container2 = document.getElementById('modalContainer2');
const btnComprar = document.getElementById('btnComprar');
const cancelar2 = document.getElementById('btnCancelar2');
function abrirCompras(id, producto, compra, venta, stock) {
    modal_Container2.classList.add('show');
    document.getElementById('ventanaCompras').innerHTML =
        `<p><b>Producto selecionado:</b> ${producto} <br> 
        <b>Precio de Compra:</b> ${compra} <br> 
        <b>Cantidad a Comprar:</b> <input type="number" id="cantidadComprar" placeholder="Ingrese cantidad"> <br> </p>`
    ID_Producto = id;
    varProducto = producto;
    varPrecioCompra = compra;
    varPrecioVenta = venta;
    varStock = stock;
}

btnComprar.addEventListener('click', () => {
    if (document.getElementById('cantidadComprar').value == "" || document.getElementById('cantidadComprar').value < 1) {
        alert('Falta rellenar el campo "cantidad"')
    }
    if (varPrecioCompra > varCaja) {
        alert('No hay dinero en caja');
    }
    else {
        varCantidad = document.getElementById('cantidadComprar').value;
        varCaja = varCaja - (parseFloat(varPrecioCompra) * parseFloat(varCantidad));
        varStock = parseFloat(varStock) + parseFloat(varCantidad);
        varMonto = parseFloat(varPrecioCompra) * parseFloat(varCantidad);

        axios.put("http://localhost:3000/productos/" + ID_Producto, { nombre: varProducto, precioCompra: varPrecioCompra, precioVenta: varPrecioVenta, stock: varStock })

        axios.post("http://localhost:3000/movimientos", { tipo: "Salida", clienteProveedor: "Golosinas sur", medio: "Tarjeta", concepto: "Compra", monto: "- $" + varMonto })

        mostrarMensaje2();
        inicio();
        modal_Container2.classList.remove('show');
    }
})

cancelar2.addEventListener('click', () => {
    modal_Container2.classList.remove('show');
});

// ----------------------------------------------------------------------------------
// MOSTRAR Y OCULTAR MENSAJES VENTA
const mensaje1 = document.getElementById('mensaje1');
function mostrarMensaje1() {
    mensaje1.classList.add('showMensaje');
    window.setTimeout(quitarMensaje1, 2000);
}
function quitarMensaje1() {
    mensaje1.classList.remove('showMensaje');
}

// ----------------------------------------------------------------------------------
// MOSTRAR Y OCULTAR MENSAJES COMPRA
const mensaje2 = document.getElementById('mensaje2');
function mostrarMensaje2() {
    mensaje2.classList.add('showMensaje');
    window.setTimeout(quitarMensaje2, 2000);
}
function quitarMensaje2() {
    mensaje2.classList.remove('showMensaje');
}

// ----------------------------------------------------------------------------------
// CARGAR CLIENTES EN EL SELECT
let varCliente = [];
let cont = -1;
function traerClientes(id, nombre) {
    ID_Cliente = id;
    cont = cont + 1;
    varCliente[cont] = nombre;
    // console.log(varCliente)

    var selector = document.getElementById("llenarSelect");

    for (var i=0; i<(cont + 1); i++){
        selector.options[i] = new Option(varCliente[i], varCliente[i]);
    }
}

/* function estadoCliente(id, nombre, telefono) {
    document.getElementById('listarClientes').innerHTML += `<td style="background:red;">${id}</td><td>${nombre}</td><td>${telefono}</td><td>undefined</td>`
} */
