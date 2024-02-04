let pagina = 1;

const cita = { 
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded',function(){
    iniciarApp();
});

function iniciarApp(){
    mostarServicios();

    // Resalta el div actual segun el tab que se presiona
    mostrarSeccion();

    // Oculta o muestra una seccion segun el tab que se presione
    cambiarSeccion();

    // Paginacion Siguiente y Anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita o error en caso de no estar completo
    mostrarResumen();

    // Nombre cita
    nombreCita();

    // Almacena la fecha de la cita
    fechaCita();

    // Deshabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita
    horaCita();
}

function mostrarSeccion(){

    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Elimina la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    
    enlaces.forEach( enlace =>{
        enlace.addEventListener('click', event =>{
            event.preventDefault();
            pagina = parseInt(event.target.dataset.paso);

            // Invocar mostrarSeccion
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostarServicios(){
    //console.log('Consultando...');
    try{

        const url = 'http://localhost:3000/AppSalon_inicio/servicios.php';

        const resultado = await fetch(url);
        const db = await resultado.json()
        console.log(db);
        // Destructuring
        const {servicios} = db;

        // Generar HTML
        db.forEach(servicio =>{
            const { id, nombre, precio } = servicio;
            // DOM SCRIPTING

            // Generar nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            // Selecciona un servicio para la cita
            // onclick -> Event Handler
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar Precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    }
    catch(error){
        console.log(error);
    }
}

function seleccionarServicio(event){
    // Forzar que el elemento al cual le damos click sea el ID
    let elemento;
    if (event.target.tagName === 'P'){
        elemento = event.target.parentElement;
    }else{
        elemento = event.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');
        

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        //console.log(servicioObj)
        agregarServicio(servicioObj);
    }
}

// CARGAR DATOS DEL FORMULARIO

function eliminarServicio(id){
    console.log('Eliminando',id);
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios,servicioObj];
    console.log(cita);
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', event =>{
        // .trim() ignora los espacios en blanco al inicio y al final del texto
        const nombreTexto = event.target.value.trim(); 
        console.log(nombreTexto);

        // validacion del nombre
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido','error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            //console.log(cita);
        }
    });
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', event=>{

        const dia = new Date(event.target.value).getUTCDay();

        console.log(dia);
        if([0,6].includes(dia)){
            event.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no disponibles','error');
        }
        else{
            cita.fecha = fechaInput.value;
            //console.log(cita);
        }
    });

}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    // Formato deseado: AAAA-MM-DD
    const year = fechaAhora.getFullYear();
    const month = fechaAhora.getMonth() + 1;
    const day = fechaAhora.getDate() + 1;

    const fechaDeshabilitar = `${year}-${month}-${day}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input',event=>{
        const horaCita = event.target.value;
        const hora = horaCita.split(':');
        if (hora[0] < 10 || hora[0] > 18){
            mostrarAlerta('Hora no valida','error');
            setTimeout(()=>{
                inputHora.value = '';
            },3000);
        }else{
            cita.hora = horaCita;
        }
    });
}

// MOSTRAR RESUMEN

function mostrarResumen(){
    // destructuring
    const { nombre, fecha, hora, servicios } = cita;
    
    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia HTML previo
    //resumenDiv.innerHTML = '';
    // Mas eficiente que el innerHTML
    while (resumenDiv.firstChild){ 
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    // validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre.';
        noServicios.classList.add('invalidar-cita');
        // Agregar a resumen div
        resumenDiv.appendChild(noServicios);
        return;
    }
    console.log('Mostrando Resumen');

    console.log(Object.values(cita));
    // Mostrar Resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumenDiv.appendChild(headingCita);

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent= 'Resumen de Servicios';
    serviciosCita.appendChild(headingServicios);

    // Iterar sobre el arrehlo de servicios 
    let totalServicio = 0;
    let total=0;

    servicios.forEach(servicio =>{
        const {nombre, precio} = servicio;
        console.log(servicio);

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio');
        precioServicio.textContent = precio;

        totalServicio = precio.split('$');
        console.log(textoServicio);
        console.log(parseInt(totalServicio[1].trim()));
        total += parseInt(totalServicio[1].trim());

        // Agregar P a DIV 
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    })
    console.log(`Total pagar: ${total}`);
    const cantidadPagar = document.createElement('P');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> $${total}`;
    cantidadPagar.classList.add('precio');

    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);
    resumenDiv.appendChild(cantidadPagar);

}

// MOSTRAR ALERTA

function mostrarAlerta(mensaje,tipo){

    // Si hay una alerta -> NO crear otra

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error'){
        alerta.classList.add('error');
    }

    // Insertar en el HTML 

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar alerta despues de 3 seg

    setTimeout(()=>{
        alerta.remove();
    },3000);
}

// PAGINACION -> CAMBIAR DE PAGINA

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click',()=>{
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(pagina===3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        // En la pagina 3 carga el resumen de la cita
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

/*
    // Eliminar mostrar-seccion de la seccion anterior
    //document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

    // Agrega mostrar-seccion a la nueva seccion
    const seccion = document.querySelector(`#paso-${pagina}`);
    seccion.classList.add('mostrar-seccion');
    //console.log(seccion);

    // Elimina la clase actual en el tab anterior
    //document.querySelector('.tabs .actual').classList.remove('actual');

    // Agrega la clase actual en el nuevo tab
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
    //console.log(tab);
*/