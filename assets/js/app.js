/***
 * 2C c(rubs
 * 2D diamonds
 * 2H hearts
 * 2S spades
 */

( () => {
    'use strict'
    const divField = document.querySelector( '.field' );

    const headerAlert = document.querySelector( '.header' ),
        btnAskNewGame = document.querySelector( '#btn-newGame' ),
        btnAskForCard = document.querySelector( '#btn-askCard' ),
        btnAskStop = document.querySelector( '#btn-stop' ),
        btn2Players = document.querySelector( '#btn-2Players' ),
        btn3Players = document.querySelector( '#btn-3Players' ),
        btn4Players = document.querySelector( '#btn-4Players' );

    let deck = [],
        typeCards = [ 'C', 'D', 'H', 'S' ],
        specials = [ 'A', 'J', 'Q', 'K' ],
        playersPoints = [],
        playerTurn = 0;

    //Events
    const initApp = () => {
        document.addEventListener( 'DOMContentLoaded', () => {

            initDeck();
            createFields();
            btn2Players.addEventListener( 'click', () => {
                cleanFields();
                initDeck( 3 );
                createFields( 2 );
            } );
            btn3Players.addEventListener( 'click', () => {
                cleanFields();
                initDeck( 4 );
                createFields( 3 );
            } );
            btn4Players.addEventListener( 'click', () => {
                cleanFields();
                initDeck( 5 )
                createFields( 4 );
            } );

        } );
    };
    initApp();

    const cleanFields = () => {
        while ( divField.firstChild ) {
            divField.removeChild( divField.firstChild )
        }
    }

    btnAskNewGame.addEventListener( 'click', () => {
        btn2Players.disabled = false;
        btn3Players.disabled = false;
        btn4Players.disabled = false;

        btnAskForCard.disabled = false;
        btnAskStop.disabled = false;
        // printCardHTML( askForCard() );
        cleanHTML();
        cleanFields();
        createFields();
    } );

    btnAskForCard.addEventListener( 'click', () => {
        console.log( playersPoints );
        btn2Players.disabled = true;
        btn3Players.disabled = true;
        btn4Players.disabled = true;

        let whosNext = giveTurn();

        // printCardHTML( askForCard() );
        printCardHTML( askForCard(), whosNext );
        // printCardHTML( 'AD' );
    } );

    btnAskStop.addEventListener( 'click', () => {

        btnAskForCard.disabled = true;
        btnAskStop.disabled = true;
        turnCPU( playersPoints[ 0 ] );

    } );

    const giveTurn = () => {
        console.log( 'Turno giveTurn', playerTurn );

        validateTurn( playerTurn );

        return playerTurn >= playersPoints.length - 1 ? playerTurn = 0
            : playerTurn >= 0 ? playerTurn++ : playerTurn;

    };
    const validateTurn = ( turn ) => {
        console.log( { turn } );
        const cardField = document.querySelectorAll( '.cardField > h1' );
        console.log( cardField[ ( playersPoints.length - 2 ) ] );
        cardField[ turn ].style.color = 'yellow';
        if ( turn > 0 ) {
            cardField[ ( turn - 1 ) ].style.color = 'white';
        }
        if ( turn === 0 ) {
            cardField[ ( playersPoints.length - 2 ) ].style.color = 'white';
        }

    };

    //Creando un nuevo deck
    const initDeck = ( numberOfPlayers = 2 ) => {

        deck = crearDeck();
        playersPoints = []
        for ( let i = 0; i < numberOfPlayers; i++ ) {
            playersPoints.push( 0 );
        };
        console.log( playersPoints );

    }

    const createFields = ( numberOfPlayers = 1 ) => {

        for ( let i = 0; i < numberOfPlayers; i++ ) {

            const field = document.createElement( 'DIV' );
            field.classList.add( 'row', 'container-fluid' );
            field.innerHTML = `
                <div class="col cardField">
                    <h1>Player ${ i + 1 }: <small id="playerScore">0</small></h1>
                    <div id="player-cards" class="divCards">
    
                    </div>
                </div>
            `;
            divField.appendChild( field );
        }
        const fieldCpu = document.createElement( 'DIV' );
        fieldCpu.classList.add( 'row', 'container-fluid' );
        fieldCpu.innerHTML = `
            <div class="col cardField">
                <h1>CPU: <small id="cpuScore">0</small></h1>
                <div id="cpu-cards" class="divCards">

                </div>
            </div>
        `;
        divField.appendChild( fieldCpu );

    };

    const crearDeck = () => {

        for ( let i = 2; i <= 10; i++ ) {
            for ( const typeCard of typeCards ) {
                deck.push( i + typeCard );
            }
        }
        for ( const typeCard of typeCards ) {
            for ( const special of specials ) {
                deck.push( special + typeCard )
            }
        }

        return _.shuffle( deck );
    };

    //Tomando una carta
    const askForCard = () => {

        if ( deck.length === 0 ) {
            throw 'There are no more cards'
        }
        return deck.pop();
    };

    //retornando el valor de la carta tomada en askforcard()
    const cardValue = ( card ) => {
        //Podria usar una expresion regular
        const value = card.substring( 0, ( card.length - 1 ) );
        return ( !isNaN( value ) ) ? value * 1
            : ( value === 'A' ) ? validateAValue( value ) : 10;

    };

    //Agregando opcion al player para decidir valor de A puede ser 11 o 1
    const validateAValue = ( value = 1 ) => {
        value = confirm( 'Value for A: 11 -> confirm or 1 -> cancel' ) ? 11 : 1;
        return value;
    };



    //Imprimiendo cartas en el lado del jugador
    const printCardHTML = ( card, turn ) => {

        if ( playerTurn === playersPoints.length - 1 ) {
            playerTurn = 0;
        }
        console.log( { turn } );
        const playerScore = document.querySelectorAll( 'small' );
        playersPoints[ turn ] += cardValue( card );
        // playerPoints += 21;
        validatePlayerPoints( playersPoints[ turn ], turn );

        playerScore[ turn ].textContent = playersPoints[ turn ];

        printPlayerCards( card, turn );

    };


    const printPlayerCards = ( card, turn ) => {
        const divPlayerCards = document.querySelectorAll( '.divCards' );
        const playerCard = document.createElement( 'img' );

        playerCard.classList.add( 'carta' );
        playerCard.src = `assets/img/${ card }.png`;


        divPlayerCards[ turn ].appendChild( playerCard );
    }

    const validatePlayerPoints = ( points, turn ) => {
        if ( points > 21 ) {

            btnAskForCard.disabled = true;
            btnAskStop.disabled = true;
            turnCPU( points, turn );
        } else if ( points === 21 ) {

            btnAskForCard.disabled = true;
            btnAskStop.disabled = true;
            turnCPU( points, turn );
        }
    }

    const addPointsPlayers = ( card, turn ) => {
        const playerScore = document.querySelectorAll( 'small' );
        playersPoints[ turn ] += cardValue( card );
        playerScore[ turn ].textContent = playersPoints[ turn ];
        return playersPoints[ turn ]
    };


    //CPU turn
    const printCpuCards = ( card, turn ) => {
        const divPlayerCards = document.querySelectorAll( '.divCards' );
        const cpuCard = document.createElement( 'img' );
        cpuCard.classList.add( 'carta' );
        cpuCard.src = `assets/img/${ card }.png`;
        console.log( { turn } );
        divPlayerCards[ turn ].appendChild( cpuCard );

    }
    const turnCPU = ( minimumPoints, turn ) => {
        let cpuPoints = 0;
        do {
            let card = askForCard();

            cpuPoints = addPointsPlayers( card, ( playersPoints.length - 1 ) );

            printCpuCards( card, ( playersPoints.length - 1 ) );

        } while ( ( cpuPoints < minimumPoints ) && ( minimumPoints <= 21 ) );
        validateResults( cpuPoints, minimumPoints, turn );
    };





    const printAlert = ( message, type = '' ) => {
        const alert = document.createElement( 'p' );
        if ( type == 'error' ) {
            alert.classList.add( 'p-4', 'bg-danger', 'text-center', 'text-light' );
            alert.textContent = message;
        } else if ( type === 'tie' ) {
            alert.classList.add( 'p-4', 'bg-warning', 'text-center', 'text-light' );
            alert.textContent = message;
        } else {
            alert.classList.add( 'p-4', 'bg-success', 'text-center', 'text-light' );
            alert.textContent = message;
        }
        setTimeout( () => {
            alert.remove();
        }, 3000 );
        return headerAlert.appendChild( alert );
    };

    const cleanHTML = () => {
        const playerScore = document.querySelectorAll( 'small' );
        const divPlayerCards = document.querySelectorAll( '.divCards' );

        playerScore.forEach( elem => elem.textContent = 0 )

        initDeck();

        for ( const i in divPlayerCards ) {

            while ( divPlayerCards[ i ].firstChild ) {
                divPlayerCards[ i ].removeChild( divPlayerCards[ i ].firstChild );
            }
            while ( divPlayerCards[ i ].firstChild ) {
                divPlayerCards[ i ].removeChild( divPlayerCards[ i ].firstChild );
            }
        }
    }

    const validateResults = ( cpuPoints, minimumPoints, turn ) => {

        if ( minimumPoints === 21 && cpuPoints === 21 ) {
            return printAlert( `Is a tie!!!`, 'tie' );
        }
        if ( minimumPoints > 21 ) {
            return printAlert( `Player ${ turn + 1 } You loose!!!`, 'error' );
        }
        if ( cpuPoints === 21 ) {
            return printAlert( `Player ${ turn + 1 } You loose!!!`, 'error' );
        }

        if ( cpuPoints > minimumPoints && cpuPoints < 21 ) {
            return printAlert( `Player ${ turn + 1 } You loose!!!`, 'error' );
        }

        if ( minimumPoints === cpuPoints ) {
            return printAlert( `Player ${ turn + 1 } You loose!!!`, 'error' );
        }
        if ( minimumPoints === cpuPoints ) {
            return printAlert( `Player ${ turn + 1 } You loose!!!`, 'error' );
        }
        if ( cpuPoints > 21 ) {
            return printAlert( `Player ${ turn + 1 } You win!!!` );
        }
        if ( minimumPoints < 21 && cpuPoints > 21 ) {
            return printAlert( `Player ${ turn + 1 } You win!!!` );
        }


    }
} )();
