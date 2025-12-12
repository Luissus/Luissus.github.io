// Función para cerrar el anuncio
function cerrar(elemento) {
  const anuncio = elemento.parentElement;

  anuncio.classList.remove('mostrar');

  setTimeout(() => {
    anuncio.remove();

    // 🔥 eliminar el iframe desde dentro
    if (window.parent) {
      const iframe = window.parent.document.getElementById("ifAnuncio");
      if (iframe) iframe.remove();
    }

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