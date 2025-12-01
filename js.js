
//Crea las variables que recoje los botones
let botonCifrarCesar = document.getElementById('funcionCifrarCesar');
let botonDescifrarCesar = document.getElementById('funcionDescifrarCesar');

let botonCifrarMorse = document.getElementById('funcionCifrarMorse');
let botonDescifrarMorse = document.getElementById('funcionDescifrarMorse');


//Cuando pulsas los botones llama a las funciones
botonCifrarCesar.addEventListener('click', cifradoCesar);
botonDescifrarCesar.addEventListener('click', descifradoCesar);

botonCifrarMorse.addEventListener('click', cifradoMorse);
botonDescifrarMorse.addEventListener('click', descifradoMorse);


 
function cifradoCesar(){
    //Variables para el texto
    let textoCifrar = document.getElementById('textoCifrarCesar');
    let resultadoCifrado = document.getElementById('resultadoCifradoCesar');

    let arrayCifrar = textoCifrar.value.split(''); // lo convierte en un array   
    let textoCiFrado = '';

    arrayCifrar.forEach(letra => { //un bucle que cifra cada letra. (la variable letra que se le pasa corresponde a cada letra separada dentro del array)
        let codigoLetra;
        
        //ese if diferencia entre mayusculas, minusculas y lo que no son letras
        if(letra >= 'A' && letra <= 'Z'){ 
            codigoLetra = ((letra.charCodeAt(0) -65 + 3) % 26) + 65; //sirve para mayusculas controla que no se pase del alfabeto
        } else if(letra >= 'a' && letra <= 'z'){
            codigoLetra = ((letra.charCodeAt(0) -97 + 3) % 26) + 97;//sirve para minusculas controla que no se pase del alfabeto
        } else{
            textoCiFrado += letra; 
        }

        textoCiFrado += String.fromCharCode(codigoLetra); // añade la letra cifrada al texto que se mostrara
        
        });

        resultadoCifrado.value = textoCiFrado; // muestra el texto en la pagina
    }
    

    

function descifradoCesar(){
    //Variables para el texto
    let textoDescifrar = document.getElementById('textoDescifrarCesar');
    let resultadoDescifrado = document.getElementById('resultadoDescifradoCesar');

    let arrayDescifrar = textoDescifrar.value.split(''); // lo convierte en un array
    let textoDescifrado = '';

    arrayDescifrar.forEach(letra=>{ //un bucle que descifra cada letra. (la variable letra que se le pasa corresponde a cada letra separada dentro del array)
        let codigoLetra;
        
        //ese if diferencia entre mayusculas, minusculas y lo que no son letras
        if(/[A-Z]/.test(letra)){ 
            codigoLetra = ((letra.charCodeAt(0) -65 - 3 + 26) % 26) + 65; //sirve para mayusculas controla que no se pase del alfabeto
        } else if(/[a-z]/.test(letra)){
            codigoLetra = ((letra.charCodeAt(0) -97 - 3 + 26) % 26) + 97;//sirve para minusculas controla que no se pase del alfabeto
        } else{
            textoDescifrado += letra; 
            return;
        }

        textoDescifrado += String.fromCharCode(codigoLetra); // añade la letra cifrada al texto que se mostrara
    })
    

    resultadoDescifrado.value = textoDescifrado; // muestra el texto en la pagina
    
}

let morseMap = new Map([ // Mapa para el cifrado morse
    ["A", ".-"],
    ["B", "-..."],
    ["C", "-.-."],
    ["D", "-.."],
    ["E", "."],
    ["F", "..-."],
    ["G", "--."],
    ["H", "...."],
    ["I", ".."],
    ["J", ".---"],
    ["K", "-.-"],
    ["L", ".-.."],
    ["M", "--"],
    ["N", "-."],
    ["O", "---"],
    ["P", ".--."],
    ["Q", "--.-"],
    ["R", ".-."],
    ["S", "..."],
    ["T", "-"],
    ["U", "..-"],
    ["V", "...-"],
    ["W", ".--"],
    ["X", "-..-"],
    ["Y", "-.--"],
    ["Z", "--.."],
    ["0", "-----"],
    ["1", ".----"],
    ["2", "..---"],
    ["3", "...--"],
    ["4", "....-"],
    ["5", "....."],
    ["6", "-...."],
    ["7", "--..."],
    ["8", "---.."],
    ["9", "----."],
    [" ", "/"]   // separador de palabras
]);


function cifradoMorse(){

    let textoCifrar = document.getElementById('textoCifrarMorse');
    let resultadoCifrado = document.getElementById('resultadoCifradoMorse');

    let arrayCifrar = textoCifrar.value.toUpperCase().split(''); // separo el texto en un array con todas las letras en mayusculas
    let textoCiFrado = '';


    arrayCifrar.map((letra)=>{ // rrecore el array comparando cada letra
        textoCiFrado += morseMap.get(letra) + ' '; // coge cada letra y suma al resultado la letra en morse 
    });

    resultadoCifrado.value = textoCiFrado;


}


function descifradoMorse(){

    let textoDescifrar = document.getElementById('textoDescifrarMorse');
    let resultadoDescifrado = document.getElementById('resultadoDescifradoMorse');

    let arrayDescifrar = textoDescifrar.value.split(' '); 
    let invertMorseMap = new Map();
    let textoDescifrado = '';

    //invierte el mapa del morse para descifrarlo
    morseMap.forEach((codigo, letra)=>{
        invertMorseMap.set(codigo, letra);
    });

    arrayDescifrar.map((codigoMorse) => {
        if(codigoMorse === "") return; // controla que si hay un espacio vacio en el array no salga undefined
        textoDescifrado += invertMorseMap.get(codigoMorse);
    })

    resultadoDescifrado.value = textoDescifrado;

}