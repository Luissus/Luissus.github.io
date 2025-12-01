let btnPosicion = document.getElementById('btnPosicion');

btnPosicion.addEventListener('click', posicionAleatoria);


// mapa del nombre de las posiciones y la ruta de la imagen
let mapPosiciones = new Map([
['bajoELSol', 'imgPosiciones/bajoELSol.png'],
['bajoLaDucha', 'imgPosiciones/bajoLaDucha.png'],
['combustionEspontanea', 'imgPosiciones/combustionEspontanea.png'],
['despegueInminente', 'imgPosiciones/despegueInminente.png'],
['elAbsoluto', 'imgPosiciones/elAbsoluto.png'],
['elAsientoTravieso', 'imgPosiciones/elAsientoTravieso.png'],
['elCantoDelPajaro', 'imgPosiciones/elCantoDelPajaro.png'],
['elEscorpion', 'imgPosiciones/elEscorpion.png'],
['elExeso', 'imgPosiciones/elExeso.png'],
['elParaisoPerdido', 'imgPosiciones/elParaisoPerdido.png'],
['elPequeñoPuente', 'imgPosiciones/elPequeñoPuente.png'],
['elSaltoDelAngel', 'imgPosiciones/elSaltoDelAngel.png'],
['elViajeHaciaElOro', 'imgPosiciones/elViajeHaciaElOro.png'],
['enLasEscaleras', 'imgPosiciones/enLasEscaleras.png'],
['fascinanteLujuria', 'imgPosiciones/fascinanteLujuria.png'],
['flanDeCarameloInvertido', 'imgPosiciones/flanDeCarameloInvertido.png'],
['HastaTuEstrellaOEnNuestrosSueños', 'imgPosiciones/HastaTuEstrellaOEnNuestrosSueños.png'],
['improvisacionDeliciosa', 'imgPosiciones/improvisacionDeliciosa.png'],
['karma', 'imgPosiciones/karma.png'],
['laBallesta', 'imgPosiciones/laBallesta.png'],
['laBellaDesvanecida', 'imgPosiciones/laBellaDesvanecida.png'],
['laBohemia', 'imgPosiciones/laBohemia.png'],
['laCancionDelAmor', 'imgPosiciones/laCancionDelAmor.png'],
['laCantandeDeOpera', 'imgPosiciones/laCantandeDeOpera.png'],
['laCarreta', 'imgPosiciones/laCarreta.png'],
['laEclosionDeLaRosa', 'imgPosiciones/laEclosionDeLaRosa.png'],
['laEscuadra', 'imgPosiciones/laEscuadra.png'],
['laProa', 'imgPosiciones/laProa.png'],
['laSerpiente', 'imgPosiciones/laSerpiente.png'],
['lasManosQueVagan', 'imgPosiciones/lasManosQueVagan.png'],
['lasTijeras', 'imgPosiciones/lasTijeras.png'],
['laZambullida', 'imgPosiciones/laZambullida.png'],
['leccionDeAmor', 'imgPosiciones/leccionDeAmor.png'],
['meEncantaElOlorDeTuCabello', 'imgPosiciones/meEncantaElOlorDeTuCabello.png'],
['mujerSexEjecutiva', 'imgPosiciones/mujerSexEjecutiva.png'],
['NorteSur', 'imgPosiciones/NorteSur.png'],
['nuncaSinTi', 'imgPosiciones/nuncaSinTi.png'],
['poesiaACuatroManos', 'imgPosiciones/poesiaACuatroManos.png'],
['preparadosListosYa', 'imgPosiciones/preparadosListosYa.png'],
['unaMiradaEsSuficiente', 'imgPosiciones/unaMiradaEsSuficiente.png'],
['voluptuosidad', 'imgPosiciones/voluptuosidad.png'],
]);

function posicionAleatoria(){

    let imagenPosicion = document.getElementById('imagenPosicion');
    let clavesArray = [...mapPosiciones.keys()]; // guarda el nombre de las posiciones en un array
    let indice = Math.floor(Math.random() * clavesArray.length); // esocoje un nombre de posicion aleatoriamente

    //muestra el nombre que genera la funcion mostrarNombre()
    document.getElementById('nombrePosicion').textContent = mostrarNombre(clavesArray[indice]);    


    imagenPosicion.src = mapPosiciones.get(clavesArray[indice]); //Muestra la imagen de la posicion que salio aleatoriamente
}

function mostrarNombre(nombrePosicion){

    nombrePosicion = nombrePosicion.charAt(0).toUpperCase() + nombrePosicion.slice(1); //pone la primera letra en mayuscula
    nombrePosicion  = nombrePosicion.replace(/([A-Z])/g, ' $1'); // añade un espacio antes de cada mayuscula 
    return nombrePosicion;


}
