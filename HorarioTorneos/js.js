
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

// Función para mostrar lista
async function mostrarResultados() {
  const tablaBody = document.getElementById("tablaBody");
  tablaBody.innerHTML = ""; // Limpiar tabla

  try {
    const snapshot = await db.collection("resultadoPartidos").get();

    if (snapshot.empty) {
      tablaBody.innerHTML = "<tr><td colspan='4'>No hay resultados</td></tr>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");

      // Cada campo en su celda
      const nombre = document.createElement("td");
      nombre.textContent = data.nombre || "";

      const hora = document.createElement("td");
      hora.textContent = data.hora || "";

      const resultado = document.createElement("td");
      resultado.textContent = data.resultado || "";

      const clasificacion = document.createElement("td");
      clasificacion.textContent = data.clasificacion || "";

      row.appendChild(nombre);
      row.appendChild(hora);
      row.appendChild(resultado);
      row.appendChild(clasificacion);

      tablaBody.appendChild(row);
    });

  } catch (error) {
    alert("Error al cargar resultados: " + error.message);
  }
}

// Mostrar resultados al cargar
mostrarResultados();

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

/*// Agregar nuevo campo (solo admin)
btnAgregar.addEventListener("click", async () => {
  const nombre = document.getElementById("campoNombre").value;
  const valor = document.getElementById("campoValor").value;

  if (!nombre || !valor) {
    alert("Rellena ambos campos");
    return;
  }

  try {
    await db.collection("resultadoPartidos").add({
      [nombre]: valor
    });
    alert("Campo agregado");
    document.getElementById("campoNombre").value = "";
    document.getElementById("campoValor").value = "";
    mostrarResultados(); // Actualizar lista
  } catch (error) {
    alert("Error al agregar: " + error.message);
  }
});*/

/**
 * Agrega un partido a Firestore
 * @param {string} nombre - Nombre del partido
 * @param {string} hora - Hora del partido
 * @param {string} resultado - Resultado del partido
 * @param {number} clasificacion
 */
async function agregarPartido(nombre, hora, resultado, clasificacion) {
  try {
    await db.collection("resultadoPartidos").add({
      nombre: nombre,
      hora: hora,
      resultado: resultado,
      clasificacion: clasificacion
    });
    alert("Partido agregado correctamente");
    mostrarResultados(); // Actualiza la tabla
  } catch (error) {
    alert("Error al agregar partido: " + error.message);
  }
}

const nombreInput = document.getElementById("partido");
const horaInput = document.getElementById("hora");
const resultadoInput = document.getElementById("resultado");
let clasificacionInput = document.getElementById("clasificacion");

btnAgregar.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  const hora = horaInput.value.trim();
  const resultado = resultadoInput.value.trim();
  const clasificacion = clasificacionInput.value.trim();

  if (!nombre || !hora || !resultado) {
    alert("Rellena todos los campos");
    return;
  }

  agregarPartido(nombre, hora, resultado, clasificacion);

  // Limpiar inputs
  nombreInput.value = "";
  horaInput.value = "";
  resultadoInput.value = "";
});