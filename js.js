function mostrarEstudios() {
  console.log("Función mostrarEstudios() llamada.");
  var estudios = document.getElementById("estudios");
  var boton = document.getElementById("boton-estudios");
  if (estudios != null) {
    var style = window.getComputedStyle(estudios);
    if (style.display === "none") {
      estudios.style.display = "block";
      boton.textContent = "Ocultar contenido";
    } else {
      estudios.style.display = "none";
      boton.textContent = "Mostrar contenido";
    }
  }
}
