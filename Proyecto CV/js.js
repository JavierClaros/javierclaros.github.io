function mostrarEstudios() {
    var estudios = document.getElementById("estudios");
    var boton = document.getElementById("boton-estudios");
    if (estudios != null) {
      if (estudios.style.display == "none") {
        estudios.style.display = "block";
        boton.textContent = "Ocultar contenido";
      } else {
        estudios.style.display = "none";
        boton.textContent = "Mostrar contenido";
      }
    }
  }
  
    
    
    
    