// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASRjO1vBWxL9Wl8xTCy4vwalD-J6bK_JU",
  authDomain: "horariotorneos.firebaseapp.com",
  projectId: "horariotorneos",
  storageBucket: "horariotorneos.firebasestorage.app",
  messagingSenderId: "17191817644",
  appId: "1:17191817644:web:9ea6f2f6b2add623752a09",
  measurementId: "G-NWWY31TRGC"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const btnLogin = document.getElementById("btnLogin");
const btnAgregar = document.getElementById("btnAgregar");
const btnNuevaCategoria = document.getElementById("btnNuevaCategoria");



//#region Login admiistrador

// Login administrador
btnLogin.addEventListener("click", async () => {
  const email = prompt("Ingresa tu email de administrador:");
  const password = prompt("Ingresa tu contraseña:");
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    alert("Login exitoso");
    adminForm.style.display = "block"; // Mostrar formulario para admins
  } catch (error) {
    alert("Error de login: " + error.message);
  }
});

//#endregion



//#region Agregar partido

//Boton agregar partido
//Coge los valores de los input
const nombreEquipoLocalInput = document.getElementById("nombreEquipoLocal");
const nombreEquipoVisitanteInput = document.getElementById("nombreEquipoVisitante");
const golesEquipoLocalInput = document.getElementById("golesEquipoLocal");
const golesEquipoVisitanteInput = document.getElementById("golesEquipoVisitante");
const horaInput = document.getElementById("hora");

//Combina la hora que se da por el html con el dia actual para que firebase lo reconozca
    const hoy = new Date();  // Fecha actual completa
    // Separar horas y minutos del input
    const [h, m] = horaInput.value.split(":");
    // Crear un Date combinando la fecha actual con la hora del input
    const fechaConHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      parseInt(h),
      parseInt(m)
    );

btnAgregar.addEventListener("click", () => {
  const nombreEquipoLocal = nombreEquipoLocalInput.value.trim();
  const nombreEquipoVisitante = nombreEquipoVisitanteInput.value.trim();
  const hora = fechaConHora;
  const golesEquipoLocal = golesEquipoLocalInput.value.trim();
  const golesEquipoVisitante = golesEquipoVisitanteInput.value.trim();


  if (!nombreEquipoLocal || !nombreEquipoVisitante || !hora || !golesEquipoLocal || !golesEquipoVisitante) {
    alert("Rellena todos los campos");
    return;
  }

  agregarPartido(nombreEquipoLocal, nombreEquipoVisitante, hora, golesEquipoLocal, golesEquipoVisitante);

  // Limpiar inputs
  nombreEquipoLocalInput = "";
  nombreEquipoVisitanteInput = "";
  horaInput = "";
  golesEquipoLocalInput = "";
  golesEquipoVisitanteInput = "";
});



/**
 * Agrega un partido a Firestore
 * @param {string} nombreEquipoLocal 
 * @param {string} nombreEquipoVisitante
 * @param {timestap} hora
 * @param {number} golesEquipoLocal
 * @param {number} golesEquipoVisitante
 */
async function agregarPartido(nombreEquipoLocal, nombreEquipoVisitante, hora, golesEquipoLocal, golesEquipoVisitante) {
  try {
    await db.collection("resultados").add({
      nombreEquipoLocal: nombreEquipoLocal,
      nombreEquipoVisitante: nombreEquipoVisitante,
      hora: hora,
      golesEquipoLocal: golesEquipoLocal,
      golesEquipoVisitante: golesEquipoVisitante
    });
    alert("Partido agregado correctamente");
    // Esto alomejor ya no es necesario  mostrarResultados(); // Actualiza la tabla
  } catch (error) {
    alert("Error al agregar partido: " + error.message);
  }
}
//#endregion



//#region Categorias

//#region Agregar categoria

//Boton Nueva Categoria
//Coge los valores de los input
const nuevaCategoriaIput = document.getElementById("categoriaEquipo");

btnNuevaCategoria.addEventListener("click", () =>{
    const nuevaCategoria = nuevaCategoriaIput.value.trim();

    if(!nuevaCategoria){
        alert("Rellena todos los campos");
        return;
    }
    agregarCategoria(nuevaCategoria);

    //Limpia los input
    nuevaCategoriaIput = "";
});

//Agrega Categoria
/**
 * @param {string} nuevaCategoria 
 */

async function agregarCategoria(nuevaCategoria) {
    try {
    await db.collection("categorias").add({
      categoria: nuevaCategoria
    });
    alert("Categoria agregada correctamente");
  } catch (error) {
    alert("Error al agregar categoria: " + error.message);
  }
}
//#endregion

//#region Eliminar categoria

//Boton eliminar Categoria
//Coge el valor del input
const selectCategoriasEliminar = document.getElementById("selectCategoriasElimiar")
const btnEliminarCategoria = document.getElementById("btnEliminarCategoria");

btnEliminarCategoria.addEventListener("click", () => {
    //Envia el id de la categoria
    eliminarCategoria(selectCategoriasEli.value);

    //Limpia el select de categorias
    selectCategoriasEliminar.innerHTML = '<option value="">--Selecciona una categoría--</option>';
});


//ELimina la categoria de firebase
/**
 * @param {string} categoriaEliminar 
 */
async function eliminarCategoria(categoriaEliminar) {
    try {
    await db.collection("categorias").doc(categoriaEliminar).delete();
    alert("Categoria eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar la categoria:", error);
  }
}
//#endregion

//#region Mostrar Categorias

//De momento selectCategoria se crea en eliminarCategoria
async function mostrarCategorias(selectCategorias) {
  selectCategorias.innerHTML = '<option value="">--Selecciona una categoría--</option>'; // Limpiar y poner opción por defecto
    
  try {
    const snapshot = await db.collection("categorias").get();

    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;      // Guardamos el ID del documento
      option.textContent = data.categoria; // Mostramos el nombre de la categoría
      selectCategorias.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

// Cargar categorías al inicio
mostrarCategorias(selectCategoriasEliminar);
//#endregion

//#endregion



//#region Equipos 


//#region Agregar equipo


//#endregion


//#endregion
