const miModulo = (()=>{
    // hacemos mas seguro nuestro codigo.
    'use strict';


    let deck = [];  // varible para modificar (Baraja)
      // varibale para consumir
    //funcion que me crea la baraja
    // let puntosJugador = 0,
    //     puntosComputadora = 0;
    let puntosJugadores = [];

    const tipos = ['C','D','H','S'], 
          especiales = ['A','J','Q','K'];

    // referencias HTML
    const btnPedir = document.querySelector( '#btnPedir' ),
          btnNuevo = document.querySelector( '#btnNuevo' ),
          btnDetener = document.querySelector( '#btnDetener' );
    // const jugador1 = document.querySelector( 'small' ); // mi solucion
          
    const divCartasJugador = document.querySelectorAll('.tablero'),
          marcador = document.querySelectorAll( 'small' );

    console.log( {divCartasJugador} );

    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck()

        puntosJugadores = [];

        for( let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        };

        console.log( {puntosJugadores} );
        marcador.forEach( (elem) => elem.innerText = 0 );
        divCartasJugador.forEach( (elem) => elem.innerHTML = '' );
        btnPedir.disabled = false;
        btnDetener.disabled = false;

    };
    
    const crearDeck = () => {

        deck = [];
        for( let i = 2; i <= 10; i++ ){
            for ( const tipo of tipos ) {
                deck.push( i + tipo );
            };
        };

        for ( const tipo of tipos ) {
            for ( const especial of especiales ) {
                deck.push( especial + tipo );
            };
        };

        return _.shuffle( deck ); // revolver la baraja

    };

    // Funcion que me permite tomar una carta
    const pedirCarta = () => {

        if( deck.length === 0 ){
            throw 'No hay cartas en la baraja';
            // crearDeck();
        }
        // extraigo el ultimo elemento del deck
        return deck.pop(); // retorno la carta extraida

    };

    // Tomar el valor de las cartas
    const valorCarta = ( carta ) => {
        const valor = carta.substring( 0,carta.length - 1 ); // Extraer todo lo que este antes del ultimo caracter.
        return  ( isNaN(valor) ) ? 
                ( valor === 'A' ) ? 11 : 10 
                : valor * 1; //   agregar puntaje dependiendo.
    };

    // puntosJugadores[0], hace referencia al jugador y puntosJugadores[1] = computadora

    const acomularPuntos = ( carta,turno ) => {

        puntosJugadores[turno] += valorCarta( carta );
        marcador[turno].innerText = puntosJugadores[turno]; 
        
        return puntosJugadores[turno];
    };

    const crearCarta = ( carta,turno ) => {

        const nuevaCarta = document.createElement( 'img' );
        nuevaCarta.src = `assets/cartas/${ carta }.png`;
        nuevaCarta.classList.add( 'carta' );
        divCartasJugador[turno].append( nuevaCarta );

    };

    const determinarVictoria = ( puntosmin,puntosComputadora ) => {
        setTimeout(function() { 
            if( puntosComputadora === puntosmin ){
                alert( 'Nadie gana' )
            } else if ( puntosmin > 21 ){
                alert( 'Gana computadora' );
            } else if ( puntosComputadora > 21 ){
                alert( 'Gana el jugador' );
            } else {
                alert( 'Gana computadora' );
            }
        }, 80)
    };

    // Logica computadora
    const turnoComputadora = ( puntosmin ) => {
        // Crear una carta en la mesa de la computadora
        let puntosComputadora = 0;

        do{
            const carta = pedirCarta();
            puntosComputadora = acomularPuntos( carta, puntosJugadores.length - 1 );
            //Creamos las cartas
            crearCarta( carta,divCartasJugador.length - 1 );
            
            // Como el codigo anterior se ejecuta al menos una vez, ya tendriamos una 
            // Con cualquier carta que saque la computadora ya gana

        } while ( ( puntosComputadora < puntosmin ) && ( puntosmin <= 21) )
        // mientras puntos de la computadora son menores a los puntosmin y los puntos min deben ser menores de 21
        // Mensaje de victoria, se coloca el settimeout para que los alerts aparezcan despues del juego.
        determinarVictoria( puntosmin,puntosComputadora );
    };
    // Eventos 
    btnPedir.addEventListener('click', () => {
        let puntosJugador = 0 
        const carta = pedirCarta();
        console.log( {puntosJugador} );
        //Sumar valor de la carta a puntos jugador y agregandolo para modificar el marcador
        puntosJugador = acomularPuntos( carta, 0 );
        console.log( divCartasJugador );
        crearCarta( carta,0 );
        // Logica por si se supera de los 21 o es igual a los 21
        if( puntosJugador > 21 ){
            console.warn( 'Perdedor' )
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }else if( puntosJugador === 21 ){
            console.warn( 'Hiciste 21!' )
            btnPedir.disabled = true
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }
    });

    btnDetener.addEventListener(  'click', ()=>{
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora( puntosJugadores[0] );
    });

    // Boton nuevo, mi version de boton.
    btnNuevo.addEventListener('click', () => {
        //resetea la baraja
        inicializarJuego();

    });

    // Aqui quiero mi funcion publica sea conocida como nuevoJuego
    return{
        nuevoJuego: inicializarJuego,
    };
})();

