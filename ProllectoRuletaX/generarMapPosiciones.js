//Todo este scrip sirve para generar el mapa a partir de las imagenes en la carpeta imgPosiciones


const fs = require('fs');
const path = require('path');

const carpeta = path.join(__dirname, 'imgPosiciones');
const archivos = fs.readdirSync(carpeta);

let mapPosiciones = new Map();

archivos.forEach(nombreArchivo => {
    let clave = nombreArchivo.split(".")[0]; // quita la extensión
    mapPosiciones.set(clave, "/imgPosiciones/" + nombreArchivo);
});

// Mostrar el Map como código listo para copiar
console.log('let mapPosiciones = new Map([');
mapPosiciones.forEach((valor, clave) => {
    console.log(`['${clave}', '${valor}'],`);
});
console.log(']);');