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


firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // Verificar si es admin
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists || !userDoc.data().admin) {
      alert("No tienes permisos de administrador");
      window.location.href = "../html/index.html"; // Redirigir al inicio
    }
  } else {
    // Usuario no logueado
    window.location.href = "../html/index.html"; // Redirigir a login
  }
});


//#region Partidos

//#region Agregar partido

//Boton agregar partido
//Coge los valores de los input
const selectNombreEquipoLocal = document.getElementById("selectNombreEquipoLocal");
const selectNombreEquipoVisitante = document.getElementById("selectNombreEquipoVisitante");
const golesEquipoLocalInput = document.getElementById("golesEquipoLocal");
const golesEquipoVisitanteInput = document.getElementById("golesEquipoVisitante");
const horaInput = document.getElementById("hora");
const btnAgregar = document.getElementById("btnAgregar");

// Mostrar equipos en los selects
mostrarEquipos(selectNombreEquipoLocal);
mostrarEquipos(selectNombreEquipoVisitante);

btnAgregar.addEventListener("click", async () => {
  const nombreEquipoLocal = selectNombreEquipoLocal.selectedOptions[0]?.getAttribute("data-nombre");
  const nombreEquipoVisitante = selectNombreEquipoVisitante.selectedOptions[0]?.getAttribute("data-nombre");
  const categoriaLocal = selectNombreEquipoLocal.selectedOptions[0]?.getAttribute("data-categoria");
  const categoriaVisitante = selectNombreEquipoVisitante.selectedOptions[0]?.getAttribute("data-categoria");

  // Validaciones
  if (!nombreEquipoLocal || !nombreEquipoVisitante) {
    alert("Seleccione ambos equipos");
    return;
  }

  if (categoriaLocal !== categoriaVisitante) {
    alert("Los equipos no pertenecen a la misma categoría");
    return;
  }

  if (!horaInput.value) {
    alert("Seleccione la hora del partido");
    return;
  }

  const [h, m] = horaInput.value.split(":");
  const hoy = new Date();
  const fechaConHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), parseInt(h, 10), parseInt(m, 10));

  const golesLocal = golesEquipoLocalInput.value.trim();
  const golesVisitante = golesEquipoVisitanteInput.value.trim();

  if (!golesLocal || !golesVisitante) {
    alert("Rellena todos los goles");
    return;
  }

  try {
    await agregarPartido(
      nombreEquipoLocal,
      nombreEquipoVisitante,
      fechaConHora,
      golesLocal,
      golesVisitante,
      categoriaLocal
    );

    // Limpiar selects e inputs
    selectNombreEquipoLocal.selectedIndex = 0;
    selectNombreEquipoVisitante.selectedIndex = 0;
    horaInput.value = "";
    golesEquipoLocalInput.value = "";
    golesEquipoVisitanteInput.value = "";

  } catch (error) {
    alert("Error al agregar partido: " + error.message);
  }
});

/**
 * Agrega un partido a Firestore
 */
async function agregarPartido(nombreEquipoLocal, nombreEquipoVisitante, fechaConHora, golesEquipoLocal, golesEquipoVisitante, categoria) {
  await db.collection("resultados").add({
    nombreEquipoLocal,
    nombreEquipoVisitante,
    categoria,
    hora: firebase.firestore.Timestamp.fromDate(fechaConHora),
    golesEquipoLocal,
    golesEquipoVisitante
  });
  alert("Partido agregado correctamente");
}
//#endregion

//#region Mostrar partidos

async function mostrarPartidos(selectPartidos) {
  selectPartidos.innerHTML = '<option value="">--Selecciona un partido--</option>';

  try {
    const snapshot = await db.collection("resultados").get();

    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id; // Guardamos el ID del documento

      // Convertir hora correctamente
      let fechaPartido;
      if (data.hora) {
        fechaPartido = data.hora.toDate ? data.hora.toDate() : new Date(data.hora);
      } else {
        fechaPartido = new Date();
      }

      // Mostrar categoría junto con los equipos y la fecha
      const categoria = data.categoria || "Sin categoría";
      option.textContent = `${data.nombreEquipoLocal} vs ${data.nombreEquipoVisitante} [${categoria}] (${fechaPartido.toLocaleString()})`;

      selectPartidos.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar partidos:", error);
  }
}

//#endregion

//#region Modificar partido

const btnModificarPartido = document.getElementById("btnModificarPartido");
const golesEquipoLocalModificar = document.getElementById("golesEquipoLocalModificar");
const golesEquipoVisitanteModificar = document.getElementById("golesEquipoVisitanteModificar");
const selectPartidos = document.getElementById("selectPartidos"); // Select que contiene los partidos

//Muestra los partidos
mostrarPartidos(selectPartidos);

btnModificarPartido.addEventListener("click", () => {
  const idPartido = selectPartidos.value;
  const golesLocal = parseInt(golesEquipoLocalModificar.value.trim(), 10);
  const golesVisitante = parseInt(golesEquipoVisitanteModificar.value.trim(), 10);

  if (!idPartido || isNaN(golesLocal) || isNaN(golesVisitante)) {
    alert("Rellena todos los campos correctamente");
    return;
  }

  modificarPartido(idPartido, golesLocal, golesVisitante);
});

  /**
 * Modifica los goles de un partido en Firestore
 * @param {string} idPartido - ID del partido
 * @param {number} golesLocal - Goles del equipo local
 * @param {number} golesVisitante - Goles del equipo visitante
 */
async function modificarPartido(idPartido, golesLocal, golesVisitante) {
  try {
    await db.collection("resultados").doc(idPartido).update({
      golesEquipoLocal: golesLocal,
      golesEquipoVisitante: golesVisitante
    });
    alert("Resultado modificado correctamente");
    location.reload();
  } catch (error) {
    alert("Error al modificar el partido: " + error.message);
  }
}

//#endregion

//#region Elimiar Partido

const selectPartidosEliminar = document.getElementById("selectPartidosEliminar");
const btnEliminarPartido = document.getElementById("btnEliminarPartido");

//Muestra los partidos
mostrarPartidos(selectPartidosEliminar);

btnEliminarPartido.addEventListener("click", () => {
  const idPartidoEliminar = selectPartidosEliminar.value;

  if(selectPartidosEliminar.value == ""){
    alert("Rellene todos los campos");
    return;
  }
  eliminarPartido(idPartidoEliminar);
});

//Elimina el partido de firebase
/**
 * @param {string} idPartidoEliminar 
 */
async function eliminarPartido(idPartidoEliminar) {
  try {
    await db.collection("resultados").doc(idPartidoEliminar).delete();
    alert("Partido eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar partido:", error);
  }
}

//#endregion

//#endregion


//#region Categorias

//#region Agregar categoria

//Boton Nueva Categoria
//Coge los valores de los input
const nuevaCategoriaIput = document.getElementById("categoriaEquipo");
const btnNuevaCategoria = document.getElementById("btnNuevaCategoria");

btnNuevaCategoria.addEventListener("click", () =>{
    const nuevaCategoria = nuevaCategoriaIput.value.trim();

    if(!nuevaCategoria){
        alert("Rellena todos los campos");
        return;
    }
    agregarCategoria(nuevaCategoria);

    //Limpia los input
    nuevaCategoriaIput.value = "";
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
    location.reload();
  } catch (error) {
    alert("Error al agregar categoria: " + error.message);
  }
}
//#endregion

//#region Eliminar categoria

//Boton eliminar Categoria
//Coge el valor del input
const selectCategoriasEliminar = document.getElementById("selectCategoriasEliminar")
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
    location.reload();
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
    nombreEquipoInput.value = "";
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
    location.reload();
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
  const nombreEquipo = selectEquipos.selectedOptions[0]?.getAttribute("data-nombre");

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
  location.reload();
}


//#endregion

//#region Mostrar equipos

async function mostrarEquipos(selectElement) {
  const snapshot = await db.collection("equipos").get();
  selectElement.innerHTML = '<option value="">--Seleccione un equipo--</option>';
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement("option");
    option.value = doc.id; // <-- poner el ID del documento
    option.textContent = `${data.nombreEquipo} (${data.categoria})`; // mostrar categoría
    option.setAttribute("data-nombre", data.nombreEquipo);//guarda el nombre
    option.setAttribute("data-categoria", data.categoria); // guardar categoría
    selectElement.appendChild(option);
  });
}

//#endregion

//#region Sumar puntuacion a cada equipo
const selectEquiposSumarPuntos = document.getElementById("selectEquiposSumarPuntos");
const puntuacionSumarEquipoInput = document.getElementById("puntuacionSumarEquipo");
const btnSumarPuntuacionEquipo = document.getElementById("btnSumarPuntuacionEquipo");

//Muestra el select de equipos
mostrarEquipos(selectEquiposSumarPuntos);

btnSumarPuntuacionEquipo.addEventListener("click", () => {
  const puntuacionSumarEquipo = puntuacionSumarEquipoInput.value;
  const idEquipoSumarPuntos = selectEquiposSumarPuntos.value;
  if(selectEquiposSumarPuntos.value == "" || !idEquipoSumarPuntos){
    alert ("Rellene todos los campos");
    return;
  }
  sumarPuntosEquipo(idEquipoSumarPuntos, puntuacionSumarEquipo);

  //Limpiar los inputs
  selectEquiposSumarPuntos.innerHTML = '<option value="">--Selecciona un equipo--</option>';
  puntuacionSumarEquipoInput.value = "";
});

//Suma puntuacion en firebase

/**
 * @param {string} idEquipoSumarPuntos
 * @param {number} puntuacionSumarEquipo
 */
async function sumarPuntosEquipo(idEquipoSumarPuntos, puntuacionSumarEquipo) {
  try {
        await db.collection("equipos").doc(idEquipoSumarPuntos).update({
            puntuacion: firebase.firestore.FieldValue.increment(puntuacionSumarEquipo)
        });
        alert("Puntos sumados correctamente");
        location.reload();
    } catch (err) {
        alert("Error al sumar puntos:", err);
    }
}

//#endregion

//#region Restar puntuacion a cada equipo

const selectEquiposRestarPuntos = document.getElementById("selectEquiposRestarPuntos");
const puntuacionRestarEquipoInput = document.getElementById("puntuacionRestarEquipo");
const btnRestarPuntuacionEquipo = document.getElementById("btnRestarPuntuacionEquipo");

//Muestra el select de equipos
mostrarEquipos(selectEquiposRestarPuntos);

btnRestarPuntuacionEquipo.addEventListener("click", () => {
  const puntuacionRestarEquipo = puntuacionRestarEquipoInput.value.trim();
  const idEquipoRestarPuntos = selectEquiposRestarPuntos.value;

  if(selectEquiposRestarPuntos.value == "" || !idEquipoRestarPuntos){
    alert ("Rellene todos los campos");
    return;
  }
  restarPuntosEquipo(idEquipoRestarPuntos, puntuacionRestarEquipo);

  //Limpiar los inputs
  selectEquiposRestarPuntos.innerHTML = '<option value="">--Selecciona un equipo--</option>';
  puntuacionRestarEquipoInput.value = "";
});

//Suma puntuacion en firebase

/**
 * @param {string} idEquipoRestarPuntos
 * @param {number} puntuacionRestarEquipo
 */
async function restarPuntosEquipo(idEquipoRestarPuntos, puntuacionRestarEquipo) {
  try {
        await db.collection("equipos").doc(idEquipoRestarPuntos).update({
            puntuacion: firebase.firestore.FieldValue.increment(puntuacionRestarEquipo * -1)
        });
        alert("Puntos restados correctamente");
        location.reload();
    } catch (err) {
        alert("Error al restar puntos:", err);
    }
}

//#endregion

//#endregion

//#region Sorteos

//#region Mostrar Sorteos

async function mostrarSorteos(selectSorteos) {
  selectSorteos.innerHTML = '<option value="">--Selecciona un sorteo--</option>';

  try {
    const snapshot = await db.collection("sorteos").get();

    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id; // Guardamos el ID del documento
      option.textContent = data.nombreSorteo;;
      selectSorteos.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar sorteos:", error);
  }
}

//#endregion

//#region Agregar sorteo

  const nombreSorteoAgregarInput = document.getElementById("nombreSorteoAgregar");
  const fechaHoraInputSorteo = document.getElementById("fechaHoraSorteo");
  const btnAgregarSorteo = document.getElementById("btnAgregarSorteo");

  btnAgregarSorteo.addEventListener("click", () => {
    const nombreSorteoAgregar = nombreSorteoAgregarInput.value.trim();
    const fechaHoraSorteo = new Date(fechaHoraInputSorteo.value);

    if(!nombreSorteoAgregar || !fechaHoraSorteo){
      alert("Rellene todos los campos");
      return;
    }
    
    agregarSorteo(nombreSorteoAgregar, fechaHoraSorteo);

    //Limpiar los input
    nombreSorteoAgregarInput.value = "";
    fechaHoraInputSorteo = "";
  });


  /**
 * Agrega un sorteo a Firestore
 * @param {string} nombreSorteo 
 * @param {timestap} fechaHoraSorteo
 */
  async function agregarSorteo(nombreSorteo, fechaHoraSorteo) {
    try {
    await db.collection("sorteos").add({
      nombreSorteo: nombreSorteo,
      fechaHoraSorteo: fechaHoraSorteo,
      numeroGanador: ""
    });
    alert("Sorteo agregado correctamente");
    location.reload();
  } catch (error) {
    alert("Error al agregar sorteo: " + error.message);
  }
  }


//#endregion

//#region Decir numero ganador sorteo

  const selectNumeroGanadorSorteo = document.getElementById("selectNumeroGanadorSorteo");
  const numeroGanadorSorteoInput = document.getElementById("numeroGanadorSorteo");
  const btnNumeroGanadorSorteo = document.getElementById("btnNumeroGanadorSorteo");

  //Muestra los sorteos
  mostrarSorteos(selectNumeroGanadorSorteo);

  btnNumeroGanadorSorteo.addEventListener("click", () => {
    const idSorteo = selectNumeroGanadorSorteo.value;
    const numeroGanador = numeroGanadorSorteoInput.value;

    if(selectNumeroGanadorSorteo.value == "" || !numeroGanador){
      alert("Rellene todos los campos");
      return;
    }

    numeroGanadorSorteo(idSorteo, numeroGanador);

    //limpiar los input
    selectNumeroGanadorSorteo.innerHTML = '<option value="">--Selecciona un sorteo--</option>'
    numeroGanadorSorteoInput.value = "";

  });

  /** Pone el numero ganador en el sorteo en firebase
 * @param {string} idSorteo
 * @param {number} numeroGanador
 */
  async function numeroGanadorSorteo(idSorteo, numeroGanador) {
    try {
        await db.collection("sorteos").doc(idSorteo).update({
            numeroGanador: numeroGanador
        });
        alert("Numero ganador actualicado correctamente");
        location.reload();
    } catch (err) {
        alert("Error al actualizar numero ganador:", err);
    }
  }

//#endregion

//#region Eliminar sorteo

const selectSorteoEliminar = document.getElementById("selectSorteoEliminar");
const btnEliminarSorteo = document.getElementById("btnEliminarSorteo");

//Muestra los sorteos
mostrarSorteos(selectSorteoEliminar);

btnEliminarSorteo.addEventListener("click", () => {
  const idSorteoEliminar = selectSorteoEliminar.value;

  if(selectSorteoEliminar.value == ""){
    alert("Rellene todos los campos ");
    return;
  }
  eliminarSorteo(idSorteoEliminar);

  //Limpiar los input
  selectSorteoEliminar.innerHTML = '<option value="">--Selecciona un sorteo--</option>';
});

 /**
 * Agrega un sorteo a Firestore
 * @param {string} idSorteoEliminar 
 */
  async function eliminarSorteo(idSorteoEliminar) {
    try {
    await db.collection("sorteos").doc(idSorteoEliminar).delete();
    alert("Sorteo eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar sorteo:", error);
  }
  }


//#endregion

//#region Modificar Sorteo

  

//#endregion 

//#endregion

//#region Menu desplegable para opciones

// Primer nivel: abrir sección principal
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const options = btn.nextElementSibling;

        // Abrir o cerrar
        if (options.style.maxHeight && options.style.maxHeight !== "0px") {
            options.style.maxHeight = null;
        } else {
            // Forzar que los hijos se rendericen antes de calcular altura
            requestAnimationFrame(() => {
                const totalHeight = Array.from(options.children)
                    .reduce((sum, child) => sum + child.scrollHeight + 10, 0); // 10px margen
                options.style.maxHeight = totalHeight + "px";
            });
        }
    });
});

// Segundo nivel: abrir formulario de cada opción
document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        if (content.style.maxHeight && content.style.maxHeight !== "0px") {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

//#endregion
