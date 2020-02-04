$(document).ready(() => {
    setTimeout(() => cargaFavoritos(), 2000);
});

var firebaseConfig = {
    apiKey: "AIzaSyBpWpxwVE8JMNhAniMWW1xTEUQbnb5ge4k",
    authDomain: "marvel-api-95026.firebaseapp.com",
    databaseURL: "https://marvel-api-95026.firebaseio.com",
    projectId: "marvel-api-95026",
    storageBucket: "marvel-api-95026.appspot.com",
    messagingSenderId: "794540644539",
    appId: "1:794540644539:web:a7655da5ce418a346bf19e"
};

firebase.initializeApp(firebaseConfig);

let favComics = {};
let favPersonajes = {};

let comicsDB = firebase.database().ref().child('comics');
comicsDB.on('value', snap => favComics = snap.val());

let personajesDB = firebase.database().ref().child('personajes');
personajesDB.on('value', snap => favPersonajes = snap.val());

function addPersonajeFav(idPersonaje){
    $('#info').modal('hide');
    favPersonajes[idPersonaje] = 1;
    personajesDB.set(favPersonajes);
    cargaFavoritos();
}

function removePersonajeFav(idPersonaje){
    $('#info').modal('hide');
    favPersonajes[idPersonaje] = 0;
    personajesDB.set(favPersonajes);
    cargaFavoritos();
}

function addComicFav(idComic){
    $('#info').modal('hide');
    favComics[idComic] = 1;
    comicsDB.set(favComics);
    cargaFavoritos();
}

function removeComicFav(idComic){
    $('#info').modal('hide');
    favComics[idComic] = 0;
    comicsDB.set(favComics);
    cargaFavoritos();
}

const API_KEY = 'ff885254d664fbb3984491682abb81af';

$.ajax({
    url: 'https://gateway.marvel.com:443/v1/public/characters',
    data: {
        apikey : API_KEY,
        limit: 10
    },
    success: (res) => {
        paginacion('personajes', 'characters', res.data.total);      

        $('<br/>').appendTo(`#personajes`);
        $('<div id="personajesR"></div>').appendTo(`#personajes`);

        res.data.results.forEach(pers => {
            templatePersonaje(pers)
        });
    }
});

$.ajax({
    url: 'https://gateway.marvel.com:443/v1/public/comics',
    data: {
        apikey : API_KEY,
        limit: 10
    },
    success: (res) => {
        paginacion('comics', 'comics', res.data.total); 
        
        $('<br/>').appendTo('#comics');
        $('<div id="comicsR"></div>').appendTo(`#comics`);
        res.data.results.forEach(comic => templateComic(comic));
    }
});


function cargaFavoritos(){
    let comics = [];
    let personajes = [];

    Object.keys(favComics).forEach(idComic => {
        if(favComics[idComic] == 1) comics.push(idComic);
    });

    Object.keys(favPersonajes).forEach(idPersonaje => {
        if(favPersonajes[idPersonaje] == 1) personajes.push(idPersonaje);
    });

    $('#fav-comics').empty();

    if(comics.length > 0){
        comics.forEach(comic => {
            $.ajax({
                url: `https://gateway.marvel.com:443/v1/public/comics/${comic}`,
                data:{
                    apikey: API_KEY
                },
                success: (res) => {
                    let resultado = res.data.results[0];
                    $('#fav-comics').append(`
                        <div class="p-1 border border-danger rounded m-2">
                            <img src="${resultado.thumbnail.path}.${resultado.thumbnail.extension}" alt="img favorita" width="50" height="50"/>
                            
                            ${(resultado.urls.length > 0) ?
                                '<a class="m-2 text-danger"  target="_blank" href="'+resultado.urls[0].url+'">'+resultado.title+'</a>':
                                '<p class="font-weight-bold m-2">'+resultado.title+'</p>'
                            }                            
                        </div>
                    `);
                }
            })
        });
    }else{
        $('#fav-comics').html('<p class="ml-2 font-weight-bold">No se han seleccionado personajes favoritos aún.</p>');
    }
    

    $('#fav-personajes').empty();

    if(personajes.length > 0){
        personajes.forEach(personaje => {
            $.ajax({
                url: `https://gateway.marvel.com:443/v1/public/characters/${personaje}`,
                data: {
                    apikey: API_KEY
                },
                success: (res) => {
                    let resultado = res.data.results[0];
                    $('#fav-personajes').append(`
                        <div class="p-1 border border-danger rounded m-2">
                            <img src="${resultado.thumbnail.path}.${resultado.thumbnail.extension}" alt="img favorita" width="50" height="50"/>
                            

                            ${(resultado.urls.length > 0) ?
                                '<a class="m-2 text-danger" target="_blank" href="'+resultado.urls[0].url+'">'+resultado.name+'</a>':
                                '<p class="font-weight-bold m-2">'+resultado.name+'</p>'
                            }
                        </div>
                    `);
                }
            });
        });
    }else{
        $('#fav-personajes').html('<p class="ml-2 font-weight-bold">No se han seleccionado comics favoritos aún.<p>');
    }
    
}


$(document).ajaxStop(function() {
    applyMasInfo();    
});

function applyMasInfo(){
    $('.masInfo').each((index, item) => {
        $(item).unbind("click");
        $(item).on('click', (event) => {
            event.preventDefault();
            let p = $(event.target).prev()[0];
            let desc_larga = p.dataset.desc;
            $(p).html(`${desc_larga}<br/>`);

            $(event.target).removeClass('masInfo');
            $(event.target).addClass('menosInfo');

            $(event.target).html('Ver menos');
            applyMenosInfo();
        });
    });
}

function applyMenosInfo(){
    $('.menosInfo').each((index2, item2) => {
        $(item2).unbind("click");
        $(item2).on('click', (event2) => {
            event2.preventDefault();
            let p2 = $(event2.target).prev()[0];
            let desc_corta2 = p2.dataset.shortdesc;
            $(p2).html(desc_corta2);

            $(event.target).removeClass('menosInfo');
            $(event.target).addClass('masInfo');

            $(event.target).html('Ver mas');
            applyMasInfo();
        });
    });
}

$('#filtro').on('keyup', (event) => {
    if(event.keyCode === 13){
        event.preventDefault();
        $('#filtroBuscador').click();
    }
});

$('#filtroBuscador').on('click', () => filtrado());

function filtrado(){
    let filtro = $('#filtro').val();

    let paramPersonajes = {};
    let paramComics = {};

    if(filtro != ''){
        paramPersonajes = {
            apikey : API_KEY,
            limit: 10,
            nameStartsWith: filtro
        };

        paramComics = {
            apikey : API_KEY,
            limit: 10,
            titleStartsWith: filtro
        };
    }else{
        paramPersonajes = {
            apikey : API_KEY,
            limit: 10
        };

        paramComics = {
            apikey : API_KEY,
            limit: 10
        }
    }
    
    $.ajax({
        url: 'https://gateway.marvel.com:443/v1/public/characters',
        data: paramPersonajes,
        success: (res) => {
            paginacion('personajes', 'characters', res.data.total, filtro);      
    
            $('<br/>').appendTo(`#personajes`);
            $('<div id="personajesR"></div>').appendTo(`#personajes`);
    
            res.data.results.forEach(pers => templatePersonaje(pers));
        }
    });

    $.ajax({
        url: 'https://gateway.marvel.com:443/v1/public/comics',
        data: paramComics,
        success: (res) => {
            paginacion('comics', 'comics', res.data.total, filtro); 
            
            $('<br/>').appendTo('#comics');
            $('<div id="comicsR"></div>').appendTo(`#comics`);
            res.data.results.forEach(comic => templateComic(comic));
        }
    });
}

function paginacion(target, datos, total, filtro){

    let parametros = {};

    if(arguments[3] == undefined){
        parametros = {
            apikey: API_KEY,
            limit: 10,
            offset: 0
        }
    }else{
        if(target == 'personajes'){
            parametros = {
                apikey: API_KEY,
                limit: 10,
                offset: 0,
                nameStartsWith: filtro
            }
        }else if(target == 'comics'){
            parametros = {
                apikey: API_KEY,
                limit: 10,
                offset: 0,
                titleStartsWith: filtro
            }
        }
    }

    $(`#${target}`).pagination({
        items: total,
        itemsOnPage: 10,
        cssStyle: 'dark-theme',
        displayedPages: 3,
        onPageClick: (pageNumber, event) => {
            event.preventDefault();

            parametros.offset = (pageNumber * 10) - 10;
    
            $.ajax({
                url: `https://gateway.marvel.com:443/v1/public/${datos}`,
                data: parametros,
                beforeSend: () => {
                    $('#personajes').append('<img class="spinner" src="images/spinner.svg" width="100" height="100"/>');
                    $('#comics').append('<img class="spinner" src="images/spinner.svg" width="100" height="100"/>');
                },
                success: (res) => {

                    let div = document.getElementById(target);

                    while(div.childNodes.length > 1){
                        div.removeChild(div.lastChild);
                    }

                    $('<br/>').appendTo(`#${target}`);

                    if(target == 'personajes'){      
                        $('<div id="personajesR"></div>').appendTo(`#${target}`);
                        res.data.results.forEach((pers) => templatePersonaje(pers));
                    }else if(target == 'comics'){
                        $('<div id="comicsR"></div>').appendTo(`#${target}`);    
                        res.data.results.forEach((comic) => templateComic(comic));
                    }
                }
            });
        }
    });
}

function templateComic(comic){
    let descripcion = comic.description;
    let descripcionCorta = descripcion != null ? `${descripcion.substring(0, 20)}...` : descripcion;

    $(`
        <div class="row">
            <div class="col-3">   
                <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" width="100%"  alt="imagen de ${comic.title}"/>
            </div>
            <div class="col-9">   
                <p class="font-weight-bold pName">${comic.title}</p>
                <p><span class="pInfo" data-shortDesc="${descripcionCorta != null ? descripcionCorta : null}" data-desc="${descripcion != null ? descripcion : null}">${descripcionCorta != null ? descripcionCorta : 'No se ha encontrado una descripción para este comic'}</span>
                ${descripcionCorta != null ? '<a class="masInfo">Ver mas</a>' : ''}
                </p>
                
                <button class="btn btn-danger mt-3" onclick="infoComic('${comic.id}')">Ver Info</button>
            </div>
        </div>                                               
        <hr/>
    `).appendTo('#comicsR');
}

function templatePersonaje(personaje){
    let descripcion = personaje.description;
    let descripcionCorta = descripcion != '' ? `${descripcion.substring(0, 20)}...` : descripcion;

    $(`
        <div class="row">
            <div class="col-3">   
                <img src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" width="100%"  alt="imagen de ${personaje.name}"/>
            </div>
            <div class="col-9">   
                <p class="font-weight-bold mt-2 pName">${personaje.name}</p>
                <p>
                <p><span class="pInfo" data-shortDesc="${descripcionCorta != '' ? descripcionCorta : null}" data-desc="${descripcion != '' ? descripcion : null}">${descripcionCorta != '' ? descripcionCorta : 'No se ha encontrado una descripción para este personaje'}</span>
                ${descripcionCorta != '' ? '<a class="masInfo">Ver mas</a>' : ''}
                </p>
                <button class="btn btn-danger mt-3" onclick="infoPersonaje('${personaje.id}')">Ver Info</button>
            </div>
        </div>
        <hr/>     
    `).appendTo('#personajesR');
}

function infoComic(idComic){
    $('#info').modal('show');

    $.ajax({
        url: 'https://gateway.marvel.com:443/v1/public/comics',
        data: {
            apikey: API_KEY,
            id: idComic
        },
        beforeSend: () => {
            $('#modal-title').html('<img class="spinner" src="images/spinner.svg" width="40" height="40"/>');
            $('#modal-body').html('<img class="spinner" src="images/spinner.svg" width="100" height="100"/>');
        },
        success: (res) => {
            let comic = res.data.results[0];

            $('#modal-title').html(comic.title.toUpperCase());
            $('#modal-body').html(`
                <div>
                    <img class="centrado" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" width="300"  alt="imagen de ${comic.name}"/>

                    <h2 class="text-center font-weight-bold text-danger">${comic.title}</h2>

                    ${
                       (favComics[idComic] == undefined || favComics[idComic] == 0) ? 

                       '<button class="btn btn-warning fav" onclick="addComicFav('+idComic+')">Marcar Favorito</button>' :

                       '<button class="btn btn-danger fav" onclick="removeComicFav('+idComic+')">Quitar Favorito</button>'
                    }
                    <p>${(comic.description) != null ? comic.description : 'No se ha encontrado una descripción para este comic'}</p>

                    
                </div>
            `);


            if(comic.creators.available > 0){
                $('#modal-body').append('<h2 class="text-center text-info">Creadores:</h2>');

                comic.creators.items.forEach(creador => {
                    $('#modal-body').append(`
                        <div>
                            <p><span class="font-weight-bold">${creador.name}</span> - ${creador.role}</p>                        
                        </div>
                    `);
                });
            }
            


            if(comic.characters.available > 0){
                $('#modal-body').append(`
                    <h2 class="text-center text-info">Personajes: <h2>
                `);


                $.ajax({
                    url: comic.characters.collectionURI,
                    data: {
                        apikey: API_KEY
                    },
                    beforeSend: () => {
                        $('#modal-body').append('<img id="spinnerComic" class="spinner" src="images/spinner.svg" width="100" height="100"/>');
                    },
                    success: (res) => {
                        $('#spinnerComic').remove();
                        let personajes = res.data.results;

                        personajes.forEach(personaje => {
                            $('#modal-body').append(`
                                <div class="d-flex mt-2 border border-info p-1 rounded">
                                    <img src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" width="150"  alt="imagen de ${personaje.name}"/>              
                                    <h2 class="text-center font-weight-bold text-danger ml-2">${personaje.name}</h2>
                                </div>
                            `);
                        });
                    }
                }); 
            }
                  
        }
    });
}

function infoPersonaje(idPersonaje){
    $('#info').modal('show');

    $.ajax({
        url: 'https://gateway.marvel.com:443/v1/public/characters',
        data: {
            apikey: API_KEY,
            id: idPersonaje
        },
        beforeSend: () => {
            $('#modal-title').html('<img class="spinner" src="images/spinner.svg" width="40" height="40"/>');
            $('#modal-body').html('<img class="spinner" src="images/spinner.svg" width="100" height="100"/>');
        },
        success: (res) => {
            let personaje = res.data.results[0];
            let comics = personaje.comics.items;

            $('#modal-title').html(personaje.name.toUpperCase());
            $('#modal-body').html(`
            <div>
                <img class="centrado" src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" width="300"  alt="imagen de ${personaje.name}"/>              
                
                <h2 class="text-center font-weight-bold text-danger">${personaje.name}</h2>
                ${
                    (favPersonajes[idPersonaje] == undefined || favPersonajes[idPersonaje] == 0) ? 

                    '<button class="btn btn-warning fav" onclick="addPersonajeFav('+idPersonaje+')">Marcar Favorito</button>' :

                    '<button class="btn btn-danger fav" onclick="removePersonajeFav('+idPersonaje+')">Quitar Favorito</button>'
                 }
                <p>${personaje.description}</p>
            </div>
            `);

            

            
            if(personaje.comics.available > 0){
                $('<h2 class="text-center text-info">Comics:</h2>').appendTo('#modal-body');

                comics.forEach(comic => {
                    let url = comic.resourceURI;
    
                    $.ajax({
                        url: url,
                        data: {
                            apikey: API_KEY
                        },
                        beforeSend: () => {
                            $('#modal-body').append('<img id="spinnerPersonaje" class="spinner" src="images/spinner.svg" width="100" height="100"/>');
                        },
                        success: (res) => {
                            $('#spinnerPersonaje').remove();
                            let comic = res.data.results[0];
    
                            $(`
                                <div class="d-flex mt-2 border border-info p-1 rounded">
                                    <div>
                                        <img class="border border-info rounded" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" width="150"  alt="imagen de ${comic.title}"/>
                                    </div>
                                    <div>
                                        <h5 class="ml-2 mt-2">${comic.title}</h5>
                                        <p class="mt-2 ml-2 justified">${(comic.description) != null ? comic.description : 'No se ha encontrado una descripción para este comic'}</p>
                                    </div>
                                </div>
                            `).appendTo('#modal-body');
                        }
                    });
                });           
            }             
        }
    });
}