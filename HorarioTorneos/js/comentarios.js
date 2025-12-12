
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