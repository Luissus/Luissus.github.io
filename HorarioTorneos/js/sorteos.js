
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
  async function mostrarSorteos() {
    const tablaBody = document.getElementById("tablaSorteos");
    tablaBody.innerHTML = ""; // Limpiar tabla

    try {
      const snapshot = await db.collection("sorteos").get();

      if (snapshot.empty) {
        tablaBody.innerHTML = "<tr><td colspan='4'>No hay sorteos</td></tr>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const row = document.createElement("tr");

        // Cada campo en su celda
        const nombreSorteo = document.createElement("td");
        nombreSorteo.textContent = data.nombreSorteo || "";

        const diaSorteo = document.createElement("td");
        diaSorteo.textContent = data.fechaHoraSorteo ? data.fechaHoraSorteo.toDate().toLocaleDateString("es-ES") : "";

        const horaSorteo = document.createElement("td");
        horaSorteo.textContent = data.fechaHoraSorteo ? data.fechaHoraSorteo.toDate().toLocaleTimeString() : "";

        const numeroGanador = document.createElement("td");
        numeroGanador.textContent = data.numeroGanador || "";


        row.appendChild(nombreSorteo);
        row.appendChild(diaSorteo);
        row.appendChild(horaSorteo);
        row.appendChild(numeroGanador);

        tablaBody.appendChild(row);
      });

    } catch (error) {
      alert("Error al cargar sorteos: " + error.message);
    }
  }

//#endregion

//Muestra los sorteos
mostrarSorteos();