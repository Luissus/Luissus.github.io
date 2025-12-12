
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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// Inicia sesión automáticamente al cargar la página
firebase.auth().signInWithEmailAndPassword("comentarios@gmail.com", "comentariosNoja2026")
  .then(userCredential => {
    console.log("Usuario comentarios autenticado");
  })
  .catch(error => {
    console.error("Error al iniciar sesión:", error);
  });

//#region Comentarios

//#region Enviar comentario

// Referencias a inputs y botón
const nombreApellidosComentarioInput = document.getElementById("nombreApellidosComentario");
const emailComentarioInput = document.getElementById("emailComentario");
const textoComentarioInput = document.getElementById("textoComentario");
const btnAgregarComentario = document.getElementById("btnAgregarComentario");

// Evento click para enviar comentario
btnAgregarComentario.addEventListener("click", () => {
  const nombreApellidosComentario = nombreApellidosComentarioInput.value.trim();
  const emailComentario = emailComentarioInput.value.trim();
  const textoComentario = textoComentarioInput.value.trim();

  if (!nombreApellidosComentario || !emailComentario || !textoComentario) {
    alert("Rellene todos los campos");
    return;
  }
    const filtro = filtroVocabulario(textoComentario);
  if(filtro != false){
    alert("Esta proibido el uso de lenguaje malsonante:" +  ' "' + filtro + '"');
    return;
  }

  enviarComentario(nombreApellidosComentario, emailComentario, textoComentario);
});

// Función para enviar comentario
async function enviarComentario(nombreApellidosComentario, emailComentario, textoComentario) {
  try {
    await db.collection("comentarios").add({
      nombreApellidosComentario: nombreApellidosComentario,
      emailComentario: emailComentario,
      textoComentario: textoComentario,
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Comentario enviado correctamente");
  } catch (error) {
    console.error(error);
    alert("Error al enviar comentario");
  }
}

//#endregion

//#region Filtro vocabulario

const malasPalabras = [
  "mierda",
  "joder",
  "puta",
  "gilipollas",
  "coño",
  "cabron",
  "idiota",
  "imbecil",
  "tonto",
  "estupido",
  "pendejo",
  "maldito",
  "chinga",
  "chingado",
  "hijo de puta",
  "bastardo",
  "zorra",
  "cerdo",
  "tarado",
  "gilipollas",
  "puto",
  "cojones",
  "maricon",
  "culero",
  "cabrón"
];

function filtroVocabulario(texto) {
  const textoMinusculas = texto.toLowerCase();
  for (const palabra of malasPalabras) {
    if (textoMinusculas.includes(palabra)) {
      return palabra; // devuelve la palabra encontrada
    }
  }
  return false; 
}
//#endregion

//#region Mostrar Comentarios

async function mostrarComentarios() {
  const contenedor = document.getElementById("contenedorComentarios");
  contenedor.innerHTML = ""; // Limpiar

  try {
    const snapshot = await db.collection("comentarios")
      .orderBy("fecha", "desc")
      .get();

    if (snapshot.empty) {
      contenedor.innerHTML = "<p>No hay comentarios todavía.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      const fecha = data.fecha ? data.fecha.toDate() : null;
      const fechaFormateada = fecha
        ? fecha.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : "Sin fecha";

      // Crear la tarjeta
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("comentario-card");

      tarjeta.innerHTML = `
        <div class="comentario-header">
          <span class="comentario-nombre">${data.nombreApellidosComentario}</span>
          <span class="comentario-fecha">${fechaFormateada}</span>
        </div>

        <div class="comentario-texto">
          ${data.textoComentario}
        </div>
      `;

      contenedor.appendChild(tarjeta);
    });

  } catch (error) {
    console.error(error);
    alert("Error al cargar comentarios.");
  }
}

//#endregion

//#region Mostrar Comentarios solo si se ve desde administrador
  document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    if (params.get("ver") === "1") {
      mostrarComentarios();  
      document.querySelector(".right-box").style.display = "block";
    }

  });
//#endregion

//#endregion


//#region Menu desplegable
/*
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
*/

// Segundo nivel: abrir formulario de cada opción
document.querySelectorAll('.menu-btn').forEach(btn => {
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