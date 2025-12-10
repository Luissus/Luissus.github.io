// Función para cerrar el anuncio
function cerrar(elemento) {
  const anuncio = elemento.parentElement;
  anuncio.classList.remove('mostrar'); // anima hacia abajo
  setTimeout(() => {
    anuncio.style.display = 'none'; // lo oculta después de la animación
  }, 500);
}

// Mostrar solo el div que pasamos en la URL
const params = new URLSearchParams(window.location.search);
const divId = params.get('div');

if (divId) {
  const target = document.getElementById(divId);
  if (target) {
    target.style.display = 'flex';   // se muestra el div
    setTimeout(() => {
      target.classList.add('mostrar'); // activa la animación
    }, 50); // pequeño delay para que la transición funcione
  }
}