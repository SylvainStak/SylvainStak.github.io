const setFechaActual = () => {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day);

    document.getElementById('fecha-input').value = today;
};

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

aplicarSelectNinos();
aplicarNumeroNoches();