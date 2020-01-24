let islas = ['El-Hierro', 'La-Palma', 'La-Gomera', 'Tenerife', 'Gran-Canaria', 'Fuerteventura', 'Lanzarote']
let dificultades = [4, 6, 8];
let imagenes = [
    '41-Traje-tipico-de-El-Hierro-hombre-min',
    '42-Traje-tipico-de-El-Hierro-mujer-min',
    '43-Traje-tipico-de-Fuerteventura-hombre-min',
    '44-Traje-tipico-de-Fuerteventura-mujer-min',
    '45-Traje-tipico-de-la-Gomera-hombre-min',
    '46-Traje-tipico-de-La-Gomera-mujer-min',
    '47-Traje-tipico-de-La-Palma-hombre-min',
    '48-Traje-tipico-de-La-Palma-mujer-min',
    '49-Traje-tipico-de-Lanzarote-hombre-min',
    '50-Traje-tipico-de-Lanzarote-mujer-min',
    '51-Traje-Tipico-Gran-Canaria-hombre-min',
    '52-Traje-tipico-Gran-Canaria-mujer-min',
    '53-Traje-tipico-Tenerife-hombre-min',
    '54-Traje-tipico-Tenerife-mujer-min'
]
let islasRonda = [];
let listaImages = [];
let puntuacion = 0;
let audioCorrect = $('#correct')[0];
let audioError = $('#error')[0];

toastr.options.timeOut = 800;

function nuevoJuego(){
    let nIslas = Math.floor(Math.random() * (8 - 4) ) + 4;
    islasRonda = [];

    //Selecciona tantas islas como hayan tocado
    //aleatoriamente
    for (let i = 0; i < nIslas; i++) {
        let indiceIsla;

        do{
            indiceIsla = Math.floor(Math.random() * 7);
        }while(islasRonda.includes(islas[indiceIsla]));

        islasRonda.push(islas[indiceIsla]);
    }

    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Si, volver a jugar": function() {            
            $( this ).dialog( "close" );
            puntuacion = 0;
            generaImagenes();
            $("#trajes").css("visibility", "visible");
            $('#slider').slider('enable');
          }
        }
    });

    $("#dialog-confirm").dialog("close");

    $('#dialog-confirm').on('dialogclose', event =>{
        $('#slider').slider('disable');
        $('<h1 id="mensajeFinal" class="text-primary">Hasta otra!!</h1>').appendTo($('body'));
    });
}

function generaIslas(){
    $('#islas').empty();

    //Genera un div por cada isla seleccionada
    //para la ronda actual
    islasRonda.forEach(isla => {
        $(`<div id='${isla}' class='border text-center border-primary bg-success rounded'>
            <span class='text-warning font-weight-bold unselectable'>${isla}</span><br/>
            <img src='recursos/images/${isla}.png' class='unselectable' width='70' height='70' alt='traje de canarias'/>
        </div>`)
        .appendTo($('#islas'));



        //Hace que el div creado previamente sea droppable
        $(`#${isla}`).droppable({
            drop: function(event, ui) {
                $('#slider').slider('disable');
                
                let nombreImg = ui.draggable[0].src.split('/')[ui.draggable[0].src.split('/').length-1];
                nombreImg = nombreImg.slice(0, nombreImg.length-4);

                if(nombreImg.includes(this.id)){
                    toastr.success('+1 Punto!!');
                    audioError.pause();
                    audioCorrect.currentTime = 0;
                    audioCorrect.play();
                    puntuacion++;
                    $('#puntuacion').html(puntuacion);
                }else{                    
                    toastr.error('+0 Puntos');
                    audioCorrect.pause();
                    audioError.currentTime = 0;
                    audioError.play();
                }

                ui.draggable.remove(); 

                listaImages.pop();  
                
                if(listaImages.length == 0){
                    $('#slider').slider('enable');
                    
                    
                    $("#dialog-confirm").dialog("open");
                    $("#trajes").css("visibility", "hidden");
                }
            }
          });
    });
}

function generaSlider(){
    $('#slider').slider({
        orientation: 'vertical',
        min: 0,
        max: 2,
        value: 1,
        step: 1,
        slide: (ev, nivel) => {
            let niveles = ['Fácil', 'Medio', 'Experto'];
            $('#lvlDificultad').html(niveles[nivel.value]);

            if(niveles[nivel.value] == 'Fácil'){
                $('#lvlDificultad').removeClass('text-warning');
                $('#lvlDificultad').addClass('text-success');
            }else if(niveles[nivel.value] == 'Medio'){
                $('#lvlDificultad').removeClass('text-success');
                $('#lvlDificultad').removeClass('text-danger');
                $('#lvlDificultad').addClass('text-warning');
            }else{
                $('#lvlDificultad').removeClass('text-warning');
                $('#lvlDificultad').addClass('text-danger');
            }

            generaImagenes();
        }
      });
}

function generaImagenes(){
    $('#mensajeFinal').remove();
    let nImagenes = 0;
    listaImages = [];

    switch($('#lvlDificultad').html()){
        case 'Fácil': nImagenes = dificultades[0]; break;
        case 'Medio': nImagenes = dificultades[1]; break;
        case 'Experto': nImagenes = dificultades[2]; break;
    }


    //Mezcla el array de los nombres de las imagenes
    //para que no este en orden
    let copiaImagenes = imagenes.sort(() => Math.random() - 0.5);

    
    copiaImagenes.forEach(img => {
        let islaExiste = false;

        //Comprueba que la imagen es de alguna
        //de las islas seleccionadas
        islasRonda.forEach(isla => {
            if(img.toLowerCase().includes(isla.toLowerCase()))
                islaExiste = true;
        });

        if(islaExiste)
            if(listaImages.length < nImagenes)
                listaImages.push(img);
    });

    $('#trajes').empty();

    //Por cada imagen que se haya seleccionado para la ronda
    //se crea una etiqueta img y se le hace draggable
    listaImages.forEach(img => {
        $(`<img src='recursos/images/${img}.png' id='${img}' class='unselectable' width='150' height='150' alt='traje de canarias'/>`)
        .appendTo('#trajes');

        $(`#${img}`).draggable({
            revert:  true,
            cursor: 'move'
        });
    });    
}

nuevoJuego();
generaIslas();
generaSlider();
generaImagenes();