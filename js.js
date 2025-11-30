let textoCifrar = document.getElementById('textoCifrar');
let botonCifrar = document.getElementById('funcionCifrar');
let resultado = document.getElementById('resultado');

botonCifrar.addEventListener('click', cifrar);
 
function cifrar(){
    let arrayCifrar = textoCifrar.value.split('');
    let textoCiFrado = '';

    arrayCifrar.map(function(letra){
        if(letra.match(/[^A-Za-z]/)){
            textoCiFrado += letra;
            return letra;
       }
        let codigoLetra = letra.charCodeAt() + 3;
        textoCiFrado += String.fromCharCode(codigoLetra);
    })

    resultado.value = textoCiFrado;
    
}