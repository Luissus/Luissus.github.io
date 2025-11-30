//Variables para cifrar
let textoCifrar = document.getElementById('textoCifrar');
let botonCifrar = document.getElementById('funcionCifrar');
let resultadoCifrado = document.getElementById('resultadoCifrado');

//Variables para Descifrar
let textoDescifrar = document.getElementById('textoDescifrar');
let botonDescifrar = document.getElementById('funcionDescifrar');
let resultadoDescifrado = document.getElementById('resultadoDescifrado');


//Cuando pulsas los botones llama a las funciones
botonCifrar.addEventListener('click', cifrar);
botonDescifrar.addEventListener('click', descifrar);


 
function cifrar(){
    let arrayCifrar = textoCifrar.value.split('');
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
    

    

function descifrar(){
    let arrayDescifrar = textoDescifrar.value.split('');
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