class Reserva{
    constructor(destino,
                fecha,
                noches,
                numHabitaciones,
                numAdultos,
                numNinos){
        this.destino = destino;
        this.fecha = fecha;
        this.noches = noches;
        this.numHabitaciones = numHabitaciones;
        this.numAdultos = numAdultos;
        this.numNinos = numNinos;
    }

    mostrar(){
        console.log('------------');
        if(this.destino === "")
            console.log('Destino --> No especificado');
        else
            console.log(`Destino --> ${this.destino}`);
        
        console.log(`Fecha --> ${this.fecha}`);
        console.log(`Num. Noches --> ${this.noches}`);
        console.log(`Num. Habitaciones --> ${this.numHabitaciones}`);
        console.log(`Num. Adultos --> ${this.numAdultos}`);
        console.log(`Num. Niños --> ${this.numNinos}`);
        console.log('------------');
    }
}