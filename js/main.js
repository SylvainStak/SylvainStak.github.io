/**
 * Obtiene la fecha actual y la muestra en el input de fecha del formulario
 */
const setFechaActual = () => {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day);

    document.getElementById('fecha-input').value = today;
};


/**
 * Función que genera la plantilla del div para las habitaciones
 */
const generaPrimeraHabitacion = () => {
    let div_titulo = document.createElement('div');
    let div_titulo_p = document.createElement('p');
    div_titulo_p.appendChild(document.createTextNode('Nueva Habitación'));
    div_titulo_p.setAttribute('class', 'text-center mt-4 text-success font-weight-bold');
    div_titulo.appendChild(div_titulo_p);

    let div_adultos_1 = document.createElement('div');
    div_adultos_1.setAttribute('class', 'row mt-1');

    let div_adultos_2 = document.createElement('div');
    div_adultos_2.setAttribute('class', 'col-12');
    div_adultos_1.appendChild(div_adultos_2);

    let label_adultos = document.createElement('label');
    label_adultos.appendChild(document.createTextNode('Adultos:'));
    label_adultos.setAttribute('class', 'ml-1');
    div_adultos_2.appendChild(label_adultos);

    let select_adultos = document.createElement('select');
    select_adultos.setAttribute('class', 'float-right mr-1 select_adultos');
    for (let i = 1; i <= 4; i++) { // Genera el combobox para el numero de adultos
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(i));

        if(i == 2){
            option.setAttribute('selected', 'selected');
        }

        select_adultos.appendChild(option);
    }

    div_adultos_2.appendChild(select_adultos);


    let div_ninos_1 = document.createElement('div');
    div_ninos_1.setAttribute('class', 'row mt-3');

    let div_ninos_2 = document.createElement('div');
    div_ninos_2.setAttribute('class', 'col-12');
    div_ninos_1.appendChild(div_ninos_2);

    let label_ninos = document.createElement('label');
    label_ninos.setAttribute('class', 'ml-1');
    label_ninos.appendChild(document.createTextNode('Niños:'));
    div_ninos_2.appendChild(label_ninos);

    let select_ninos = document.createElement('select');
    select_ninos.setAttribute('class', 'float-right mr-1 select_ninos');

    
    for (let i = 0; i <= 8; i++) { //genera el combobox para el numero de niños
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(i));

        if(i == 0){
            option.setAttribute('selected', 'selected');
        }

        select_ninos.appendChild(option);
    }

    div_ninos_2.appendChild(select_ninos);

    let div_edades = document.createElement('div');
    div_edades.setAttribute('class', 'edades_ninos pl-1');

    let padre = document.getElementById('div_room');
    padre.appendChild(div_titulo);
    padre.appendChild(div_adultos_1);
    padre.appendChild(div_ninos_1);
    padre.appendChild(div_edades);
}

/**
 * Funcion que genera el div para añadir habitaciones
 */
const generaAddRoom = () => {
    let div_contenedor = document.createElement('div');
    let div_addRoom = document.createElement('div');
    div_addRoom.setAttribute('id', 'addRoom');
    div_addRoom.setAttribute('class', 'addRoom');
    div_contenedor.appendChild(div_addRoom);

    let div_span = document.createElement('div');
    let span = document.createElement('span');
    span.appendChild(document.createTextNode('+'));
    div_addRoom.appendChild(div_span);
    div_span.appendChild(span);

    let p = document.createElement('p');
    p.appendChild(document.createTextNode('AÑADIR\nHABITACIÓN'));
    p.setAttribute('class', 'text-center');
    div_addRoom.appendChild(p);

    let boton_span = document.createElement('span');
    boton_span.appendChild(document.createTextNode('HECHO'));
    boton_span.setAttribute('id', 'done_boton');
    div_contenedor.appendChild(boton_span);
    


    let padre = document.getElementById('div_addRoom');
    padre.appendChild(div_contenedor);
}

/**
 * Funcion que genera el combobox para seleccionar el numero de noches
 */
const aplicarNumeroNoches = () => {
    let noches_populares = [4, 7, 10, 14];
    let div_noches = document.getElementById('div_noches');

    let select = document.createElement('select');
    select.setAttribute('class', 'form-control');
    select.setAttribute('id', 'dias-input');

    let titulo_populares = document.createElement('option');
    titulo_populares.setAttribute('disabled', 'disabled');
    titulo_populares.appendChild(document.createTextNode('Populares'));
    select.appendChild(titulo_populares);

    noches_populares.forEach(num => {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(`${num} Noches`));
        select.appendChild(option);
    });

    let titulo_dias = document.createElement('option');
    titulo_dias.setAttribute('disabled', 'disabled');
    titulo_dias.appendChild(document.createTextNode('Dias'));
    select.appendChild(titulo_dias);

    for (let i = 1; i <= 20; i++) {
        let option = document.createElement('option');
        if(i > 1){
            option.appendChild(document.createTextNode(`${i} Noches`)); 
        }else{
            option.appendChild(document.createTextNode(`${i} Noche`)); 
        }
          
        select.appendChild(option);  
    }

    div_noches.appendChild(select);

}

/**
 * Funcion que se llama al clonarse un nuevo nodo para que aplica a cada select de 
 * edad de los niños el contenido adecuado y sus Event Listeners
 */
const aplicarSelectNinos = () => {
    let selects = document.getElementsByClassName('select_ninos');

    for(let select of selects){
        select.addEventListener('change', () => {
            let div_actualRoom = select.parentNode.parentNode.parentNode;
            let numNinos = parseInt(select.value);

            let div_edades = div_actualRoom.querySelector(".edades_ninos");

            while(div_edades.firstChild)
                div_edades.removeChild(div_edades.firstChild);

            if(numNinos > 0){
                let titulo = document.createElement('h6');
                titulo.setAttribute('class', 'text-center mt-2');
                titulo.appendChild(document.createTextNode('Edades (en la vuelta):'));
    
                div_edades.appendChild(titulo);
            }
            


            for (let i = 0; i < numNinos; i++) {
                let div_edad = document.createElement("select");
                div_edad.setAttribute('class', 'select_edad');
                let option_defecto = document.createElement('option');
                option_defecto.appendChild(document.createTextNode('Edad'));
                option_defecto.setAttribute('selected', '');
                option_defecto.setAttribute('disabled', 'disabled');
                div_edad.appendChild(option_defecto);
                for (let j = 1; j < 18; j++) {
                    let option = document.createElement('option');
                    let edad = document.createTextNode(j);
                    option.appendChild(edad);
                    div_edad.appendChild(option);
                } 
                div_actualRoom.querySelector(".edades_ninos").appendChild(div_edad);        
            }

            
        });
    }
}

setFechaActual();
generaPrimeraHabitacion();
generaAddRoom();
aplicarSelectNinos();
aplicarNumeroNoches();



// EVENT LISTENERS
let huespedes_opciones = document.getElementById('huespedes_opciones');
let huespedes_boton = document.getElementById('huespedes-input');
huespedes_opciones.style.display = "none";

huespedes_boton.addEventListener('click', () => {
    if(huespedes_opciones.style.display === "flex"){
        huespedes_opciones.style.display = "none";
    }else{
        huespedes_opciones.style.display = "flex";
    }    
});

let div_addRoom = document.getElementById('addRoom');

var numRooms = 1;

div_addRoom.addEventListener('click', () => {    
    if(numRooms < 5){   
        numRooms++;
        var dupNode = document.getElementById('div_room').cloneNode(true);

        let closeX = document.createElement("span");
        closeX.setAttribute("class", "closeX");
        closeX.appendChild(document.createTextNode("X"));
    
        closeX.addEventListener('click', () => {
            closeX.parentNode.remove();
            numRooms--;
        });
    
        dupNode.insertBefore(closeX, dupNode.firstChild);
    
        let div_edades = dupNode.querySelector(".edades_ninos");
    
        while(div_edades.firstChild)
            div_edades.removeChild(div_edades.firstChild);
    
        huespedes_opciones.insertBefore(dupNode, document.getElementById('div_addRoom'));
        div_addRoom.scrollIntoView();
        aplicarSelectNinos();
    }else{
        alert('Lo sentimos, solo se permite un máximo\n de 5 habitaciones por reserva');
    }
});


document.getElementById('done_boton').addEventListener('click', () => {
    let divs_habitaciones = document.getElementsByClassName('div_habitaciones');
    let numHabitaciones = divs_habitaciones.length;
    let numAdultos = 0;
    let numNinos = 0;
    
    for(let room of divs_habitaciones){
        numAdultos += parseInt(room.querySelector('.select_adultos').value);
        numNinos += parseInt(room.querySelector('.select_ninos').value);
    }

    document.getElementById('numHabitaciones').innerHTML = numHabitaciones;
    document.getElementById('numAdultos').innerHTML = numAdultos;
    document.getElementById('numNinos').innerHTML = numNinos;
    huespedes_opciones.style.display = "none";
});

document.getElementById('boton_buscar').addEventListener('click', () => {
    let destino = document.getElementById('texto-input').value;
    let fecha = document.getElementById('fecha-input').value;
    let noches = document.getElementById('dias-input').value;
    let numHabitaciones = document.getElementById('numHabitaciones').innerHTML;
    let numAdultos = document.getElementById('numAdultos').innerHTML;
    let numNinos = document.getElementById('numNinos').innerHTML;

    let reserva = new Reserva(destino, fecha, noches, numHabitaciones, numAdultos, numNinos);
    reserva.mostrar();
});