
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

const lista = document.getElementById("lista");
const btnLogin = document.getElementById("btnLogin");
const adminForm = document.getElementById("adminForm");
const btnAgregar = document.getElementById("btnAgregar");


//#region Actualizar la pagina cada 10 mituos

// Cada 10 minutos (10 * 60 * 1000 ms)
const intervaloRecarga = 10 * 60 * 1000;

setInterval(() => {
    console.log("Recargando la página automáticamente cada 10 minutos...");
    location.reload();
}, intervaloRecarga);

//#endregion

//#region Mostrar partidos

  // Función para mostrar resultados
  async function mostrarPartidos() {
    const tablaBody = document.getElementById("tablaBody");
    tablaBody.innerHTML = ""; // Limpiar tabla

    try {
      const snapshot = await db.collection("resultados").get();

      if (snapshot.empty) {
        tablaBody.innerHTML = "<tr><td colspan='4'>No hay resultados</td></tr>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement("tr");

        // Cada campo en su celda
        const nombreEquipoLocal = document.createElement("td");
        nombreEquipoLocal.textContent = data.nombreEquipoLocal || "";

        const nombreEquipoVisitante = document.createElement("td");
        nombreEquipoVisitante.textContent = data.nombreEquipoVisitante || "";

        const hora = document.createElement("td");
        hora.textContent = data.hora ? data.hora.toDate().toLocaleTimeString() : "";

        const golesEquipoLocal = document.createElement("td");
        golesEquipoLocal.textContent = data.golesEquipoLocal || "";

        const golesEquipoVisitante = document.createElement("td");
        golesEquipoVisitante.textContent = data.golesEquipoVisitante || "";

        row.appendChild(nombreEquipoLocal);
        row.appendChild(nombreEquipoVisitante);
        row.appendChild(hora);
        row.appendChild(golesEquipoLocal);
        row.appendChild(golesEquipoVisitante);

        tablaBody.appendChild(row);
      });

    } catch (error) {
      alert("Error al cargar resultados: " + error.message);
    }
  }

//#endregion


//#region Mostrar clasificaciones

    // Función para mostrar clasificaciones
  async function mostrarClasificacion() {
    const tablaBody = document.getElementById("tablaClasificacionesBody");
    tablaBody.innerHTML = ""; // Limpiar tabla

    try {
      //const snapshot = await db.collection("equipos").get();
      // 🔥 Ordenar por puntuación descendente directamente desde Firestore
      const snapshot = await db.collection("equipos")
        .orderBy("puntuacion", "desc")
        .get();

      if (snapshot.empty) {
        tablaBody.innerHTML = "<tr><td colspan='4'>No hay resultados</td></tr>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement("tr");

        // Cada campo en su celda
        const nombreEquipo = document.createElement("td");
        nombreEquipo.textContent = data.nombreEquipo || "";

        const categoria = document.createElement("td");
        categoria.textContent = data.categoria || "";

        const puntuacion = document.createElement("td");
        puntuacion.textContent = data.puntuacion || "";


        row.appendChild(nombreEquipo);
        row.appendChild(categoria);
        row.appendChild(puntuacion);

        tablaBody.appendChild(row);
      });

    } catch (error) {
      alert("Error al cargar resultados: " + error.message);
    }
  }

//#endregion

// Mostrar resultados al cargar
mostrarPartidos();
mostrarClasificacion();




