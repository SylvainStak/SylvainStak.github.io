//  Acceso a token https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3lsdmFpbnN0YWsiLCJhIjoiY2s0d3B5Z3IwMDh1ajNqbXpmcjczZGVpMSJ9.JYRytfwLGTsczeFAnD21DQ

// Token = pk.eyJ1Ijoic3lsdmFpbnN0YWsiLCJhIjoiY2s0d3B5Z3IwMDh1ajNqbXpmcjczZGVpMSJ9.JYRytfwLGTsczeFAnD21DQ

var myIcon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [38, 30],
    iconAnchor: [10, 30]
    
});
var mymap = L.map('mapid').setView([ 28.2682400, -16.4546200], 10)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3lsdmFpbnN0YWsiLCJhIjoiY2s0d3B5Z3IwMDh1ajNqbXpmcjczZGVpMSJ9.JYRytfwLGTsczeFAnD21DQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoic3lsdmFpbnN0YWsiLCJhIjoiY2s0d3B5Z3IwMDh1ajNqbXpmcjczZGVpMSJ9.JYRytfwLGTsczeFAnD21DQ'
}).addTo(mymap);
//Filtrados por siglas
var siglas=[];
//Mensaje que se muestra del resultado 
var mensaje;
var mens = document.getElementById("resultado");
//Marcadores que se mostraran en el mapa
var marker=[];


//Función para el input de texto
function direccion(){
    var filtro = document.getElementById("direccion").value;
    var filtrado = filtro.toLowerCase();
    var dirFiltr= lista.filter(obj =>obj.properties.dir.toLowerCase().includes(filtrado));
    if (dirFiltr.length==0)
    {
        mensaje = "No se han encontrado resultados";
        //Borrar marcadores
        for(i=0;i<marker.length;i++) {
            mymap.removeLayer(marker[i]);
        }
    }
    else{
        mensaje = "Se han encontrado "+dirFiltr.length+" resultados";
        //Borrar marcadores
        for(i=0;i<marker.length;i++) {
        mymap.removeLayer(marker[i]);
        }
        //Añadir marcadores  
        for(i=0;i<dirFiltr.length;i++){
        var LamMarker = new L.marker([dirFiltr[i].geometry.coordinates[1], dirFiltr[i].geometry.coordinates[0]],{icon: myIcon});
        LamMarker.bindPopup("<p>"+dirFiltr[i].properties.nombre+"</p>").openPopup(); 
        marker.push(LamMarker);
        mymap.addLayer(marker[i]);
        }
    
    }
console.log(mensaje);

}

//Creador del dropdown de las siglas 
function dropdown(){
    var div = document.getElementById("form");
    lista.forEach(obj=>{
        if(!siglas.includes(obj.properties.sigla))
        {
            siglas.push(obj.properties.sigla);
        }
    })
    var listasiglas = document.createElement("select");
    listasiglas.setAttribute('class', 'form-control');
    listasiglas.id ="siglas";
    var label = document.createElement("label");
    var labelText = document.createTextNode("Siglas:");
    label.setAttribute("for","siglas");
    label.appendChild(labelText);
    document.getElementById('siglasLabel').appendChild(label);
    siglas.forEach(si=>{
        var opcion = document.createElement("option");
    opcion.value=si;
    opcion.text=si;
    listasiglas.appendChild(opcion);
    })

    document.getElementById('siglasSelect').appendChild(listasiglas);
    var botonselect = document.createElement("button");
    botonselect.setAttribute('class', 'btn btn-primary');
    botonselect.innerHTML="Enviar";
    document.getElementById('siglasBoton').appendChild(botonselect);
    botonselect.onclick=function () {
    valorselect()
    }
}

//Función para la selección del dropdown
function valorselect(){
    var sel = document.getElementById("siglas");
    var selresult = lista.filter(obj => obj.properties.sigla==sel.value);
    mensaje = "Se han encontrado "+selresult.length+" resultados";

    console.log(mensaje)
        //Borrar todos los marcadores
        for(i=0;i<marker.length;i++) {
            mymap.removeLayer(marker[i]);
        }
        //Añadir marcadores  
        for(i=0;i<selresult.length;i++){
            var LamMarker = new L.marker([selresult[i].geometry.coordinates[1], selresult[i].geometry.coordinates[0]],{icon: myIcon});
            LamMarker.bindPopup("<p>"+selresult[i].properties.nombre+"</p>").openPopup();
            marker.push(LamMarker);
            mymap.addLayer(marker[i]);
        }
}
var range = document.getElementById("zoom");
range.addEventListener('input', function() {
    mymap.setView([28.2682400, -16.4546200], range.value)
});
dropdown();