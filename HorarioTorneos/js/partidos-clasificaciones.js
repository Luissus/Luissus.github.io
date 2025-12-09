
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

  async function mostrarPartidos() {
  const tablaBody = document.getElementById("tablaBody");
  tablaBody.innerHTML = "";

  try {
    const snapshot = await db.collection("resultados")
      .orderBy("hora", "desc")
      .get();

    if (snapshot.empty) {
      tablaBody.innerHTML = "<tr><td colspan='7'>No hay resultados</td></tr>";
      return;
    }

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const row = document.createElement("tr");

      const nombreEquipoLocal = document.createElement("td");
      nombreEquipoLocal.textContent = data.nombreEquipoLocal || "";

      const nombreEquipoVisitante = document.createElement("td");
      nombreEquipoVisitante.textContent = data.nombreEquipoVisitante || "";

      // ⚡ Categoria tomada directamente de resultados
      const categoriaTd = document.createElement("td");
      categoriaTd.textContent = data.categoria || "Sin categoría";

      const diaPartido = document.createElement("td");
      diaPartido.textContent = data.hora ? data.hora.toDate().toLocaleDateString("es-ES") : "";

      const hora = document.createElement("td");
      hora.textContent = data.hora ? data.hora.toDate().toLocaleTimeString() : "";

      const golesEquipoLocal = document.createElement("td");
      golesEquipoLocal.textContent = data.golesEquipoLocal || "";

      const golesEquipoVisitante = document.createElement("td");
      golesEquipoVisitante.textContent = data.golesEquipoVisitante || "";

      row.appendChild(nombreEquipoLocal);
      row.appendChild(nombreEquipoVisitante);
      row.appendChild(categoriaTd);
      row.appendChild(diaPartido);
      row.appendChild(hora);
      row.appendChild(golesEquipoLocal);
      row.appendChild(golesEquipoVisitante);

      tablaBody.appendChild(row);
    }

  } catch (error) {
    alert("Error al cargar resultados: " + error.message);
  }
}

//#endregion

/*
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
*/

//#region Mostrar clasificaciones por categorias

async function mostrarClasificacion() {
  const contenedor = document.getElementById("contenedorClasificaciones");
  contenedor.innerHTML = ""; // Limpiar contenedor

  try {
    const snapshot = await db.collection("equipos")
      .orderBy("puntuacion", "desc")
      .get();

    if (snapshot.empty) {
      contenedor.innerHTML = "<p>No hay resultados</p>";
      return;
    }

    // Agrupar equipos por categoría
    const categorias = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const cat = data.categoria || "Sin categoría";
      if (!categorias[cat]) categorias[cat] = [];
      categorias[cat].push(data);
    });

    // Por cada categoría crear tabla
    for (const cat in categorias) {
      const equipos = categorias[cat];

      // Crear título de categoría
      const titulo = document.createElement("h3");
      titulo.textContent = cat;
      contenedor.appendChild(titulo);

      // Crear tabla
      const tabla = document.createElement("table");
      tabla.classList.add("tabla-clasificacion");

      // Encabezado
      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
          <th>Equipo</th>
          <th>Categoria</th>
          <th>Puntuacion</th>
        </tr>
      `;
      tabla.appendChild(thead);

      // Cuerpo
      const tbody = document.createElement("tbody");
      equipos.forEach(equipo => {
        const row = document.createElement("tr");

        const nombreTd = document.createElement("td");
        nombreTd.textContent = equipo.nombreEquipo || "";
        const categoriaTd = document.createElement("td");
        categoriaTd.textContent = equipo.categoria || "";
        const puntuacionTd = document.createElement("td");
        puntuacionTd.textContent = equipo.puntuacion || "";

        row.appendChild(nombreTd);
        row.appendChild(categoriaTd);
        row.appendChild(puntuacionTd);
        tbody.appendChild(row);
      });

      tabla.appendChild(tbody);
      contenedor.appendChild(tabla);
    }

  } catch (error) {
    alert("Error al cargar resultados: " + error.message);
  }
}

//#endregion
// Mostrar resultados al cargar
mostrarPartidos();
mostrarClasificacion();




