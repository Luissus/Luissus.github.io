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






//#region Login admiistrador

// Login administrador
const btnLogin = document.getElementById("btnLoginAdmin");

btnLogin.addEventListener("click", async () => {
  const email = prompt("Ingresa tu email de administrador:");
  const password = prompt("Ingresa tu contraseña:");
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    alert("Login exitoso");
    //Redirije a la pagina fuciones de administrador
     window.location.href = "/html/funcionesAdministradores.html";
  } catch (error) {
    alert("Error de login: " + error.message);
  }
});

//#endregion