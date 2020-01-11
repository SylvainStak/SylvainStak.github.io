var ddData = [];

//Peticion ajax a una API externa para conseguir un array 
//con los datos de codigo, bandera y nombre de todos los paises
$.ajax({
    url: "https://restcountries.eu/rest/v2/all", 
    success: result => {    
        result.forEach((country, index) => {
            ddData.push({
                text: country.name,
                value: index+1,
                selected: country.name === 'Spain' ? true : false,
                description: `<span class="text-success font-weight-bold">+${country.callingCodes[0]}</span>`,
                imageSrc: country.flag,
                callingCode: `+${country.callingCodes[0]}`
            });
        });
        
        //Plugin externo que genera un select permitiendo meter imagenes dentro
        $('#countryCodes').ddslick({
            data: ddData,
            width: 150,
            imagePosition: "right",
            selectText: "Country Code",
            onSelected: data => prefix = data.selectedData.callingCode
        });
    }
});