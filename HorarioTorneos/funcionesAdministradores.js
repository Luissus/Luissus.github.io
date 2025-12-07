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
const selectNombreEquipoLocal = document.getElementById("selectNombreEquipoLocal");
const selectNombreEquipoVisitante = document.getElementById("selectNombreEquipoVisitante");
const golesEquipoLocalInput = document.getElementById("golesEquipoLocal");
const golesEquipoVisitanteInput = document.getElementById("golesEquipoVisitante");
const horaInput = document.getElementById("hora");

//Mostrar los equipos mas adelante cambiara de sitio
mostrarEquipos(selectNombreEquipoLocal);
mostrarEquipos(selectNombreEquipoVisitante);


btnAgregar.addEventListener("click", () => {

  //Combina la hora que se da por el html con el dia actual para que firebase lo reconozca
    const hoy = new Date();  // Fecha actual completa
    // Separar horas y minutos del input
    const [h, m] = horaInput.value.split(":");
    // Crear un Date combinando la fecha actual con la hora del input
    const fechaConHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      parseInt(h, 10),
      parseInt(m, 10)
    );


  const nombreEquipoLocal = selectNombreEquipoLocal.options[selectNombreEquipoLocal.selectedIndex].text;
  const nombreEquipoVisitante = selectNombreEquipoVisitante.options[selectNombreEquipoVisitante.selectedIndex].text;
  const hora = fechaConHora;
  const golesEquipoLocal = golesEquipoLocalInput.value.trim();
  const golesEquipoVisitante = golesEquipoVisitanteInput.value.trim();

  
  if (selectNombreEquipoLocal.value == "" || selectNombreEquipoVisitante.value == "" || !hora || !golesEquipoLocal || !golesEquipoVisitante) {
    alert("Rellena todos los campos");
    return;
  }

  agregarPartido(nombreEquipoLocal, nombreEquipoVisitante, hora, golesEquipoLocal, golesEquipoVisitante);

  // Limpiar inputs
  selectNombreEquipoLocal.innerHTML = '<option value="">--Seleccione un equipo--</option>';
  selectNombreEquipoVisitante.innerHTML = '<option value="">--Seleccione un equipo--</option>';
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
    eliminarCategoria(selectCategoriasEliminar.value);

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

  const nombreEquipoInput = document.getElementById("nombreEquipo");
  const selectCategoriasEquipo = document.getElementById("selectCategoriasEquipo");
  const btnAgregarEquipo = document.getElementById("btnAgregarEquipo");

  //Muestra el select de categorias (mas adelante lo movere de sitio);
  mostrarCategorias(selectCategoriasEquipo);

  btnAgregarEquipo.addEventListener("click", () => {

    const nombreEquipo = nombreEquipoInput.value.trim();
    const categoria = selectCategoriasEquipo.options[selectCategoriasEquipo.selectedIndex].text;
    const puntuacion = 0;
  
    if(!nombreEquipo || !categoria || selectCategoriasEquipo.value == ""){
      alert("Rellene todos los campos");
      return;
    }
    agregarEquipo(nombreEquipo, categoria, puntuacion);

    //Limpiar los input
    nombreEquipoInput = "";
    selectCategoriasEquipo.innerHTML = '<option value="">--Selecciona una categoría--</option>';


  });

  //Agregar equipo
/**
 * @param {string} nombreEquipo
 * @param {string} categoriaEquipo
 * @param {number} putuacion
 */

async function agregarEquipo(nombreEquipo, categoria, puntuacion) {
    try {
    await db.collection("equipos").add({
      nombreEquipo: nombreEquipo,
      categoria: categoria,
      puntuacion: puntuacion
    });
    alert("Equipo agregada correctamente");
  } catch (error) {
    alert("Error al agregar equipo: " + error.message);
  }
}

//#endregion

//#region Eliminar equipo

const selectEquipos = document.getElementById("selectEquipos");
const btnEliminarEquipo = document.getElementById("btnEliminarEquipo");
//Muestra el select de equipos (mas adelante se movera de sitio);
mostrarEquipos(selectEquipos);

btnEliminarEquipo.addEventListener("click", () => {
  const nombreEquipo = selectEquipos.options[selectEquipos.selectedIndex].text;

  if(selectEquipos.value == ""){
    alert("Rellene todos los campos");
    return;
  }
  eliminarEquipo(nombreEquipo);

  //Limpiar los input
  selectEquipos.innerHTML = '<option value="">--Seleccione un equipo--</option>';

});


//Elimina equipo de firebase
async function eliminarEquipo(nombreEquipo) {
  const ref = db.collection("equipos");
  const snap = await ref.where("nombreEquipo", "==", nombreEquipo).get();

  if (snap.empty) {
    alert("No existe un equipo con ese nombre");
    return;
  }

  const id = snap.docs[0].id;  // El primer resultado
  await ref.doc(id).delete();

  alert("Equipo eliminado");
}


//#endregion

//#region Mostrar equipos

async function mostrarEquipos(selectEquipos) {
  selectEquipos.innerHTML = '<option value="">--Selecciona un equipo--</option>'; // Limpiar y poner opción por defecto
    
  try {
    const snapshot = await db.collection("equipos").get();

    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;      // Guardamos el ID del documento
      option.textContent = data.nombreEquipo; // Mostramos el nombre de la categoría
      selectEquipos.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar equipos:", error);
  }
}

//#endregion

//#endregion


