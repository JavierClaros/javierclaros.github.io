// assets/js/juego.js
// Lógica del juego Color Frenzy

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const levelElement = document.getElementById('level');
    const targetColorElement = document.getElementById('target-color');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scoresList = document.getElementById('scores-list');
    
    // Variables del juego
    let score = 0;
    let timeLeft = 60;
    let level = 1;
    let gameActive = false;
    let timerInterval;
    let circleInterval;
    let targetColor = '';
    
    // Colores disponibles (adaptados a la paleta de PromptPro)
    const colors = [
        { name: 'ROJO', value: '#ff0000' },      // Rojo principal de PromptPro
        { name: 'BLANCO', value: '#ffffff' },    // Blanco
        { name: 'NEGRO', value: '#000000' },     // Negro
        { name: 'GRIS', value: '#666666' },      // Gris
        { name: 'AZUL', value: '#2196F3' },      // Azul para contraste
        { name: 'VERDE', value: '#4CAF50' }      // Verde para contraste
    ];
    
    // Cargar mejores puntuaciones desde localStorage
    let highScores = JSON.parse(localStorage.getItem('promptProHighScores')) || [];
    updateHighScores();
    
    // Actualizar la lista de mejores puntuaciones
    function updateHighScores() {
        scoresList.innerHTML = '';
        highScores.sort((a, b) => b - a).slice(0, 5).forEach((score, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${index + 1}. ${score} puntos</span>`;
            scoresList.appendChild(li);
        });
    }
    
    // Función para iniciar el juego
    function startGame() {
        if (gameActive) return;
        
        // Reiniciar variables
        score = 0;
        timeLeft = 60;
        level = 1;
        gameActive = true;
        
        // Actualizar la interfaz
        scoreElement.textContent = score;
        timerElement.textContent = timeLeft;
        levelElement.textContent = level;
        timerElement.style.color = '';
        startBtn.style.display = 'none';
        resetBtn.style.display = 'flex';
        
        // Limpiar el tablero
        gameBoard.innerHTML = '';
        
        // Establecer color objetivo inicial
        setNewTargetColor();
        
        // Iniciar temporizador
        timerInterval = setInterval(updateTimer, 1000);
        
        // Iniciar generación de círculos
        startCircleGeneration();
    }
    
    // Función para actualizar el temporizador
    function updateTimer() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        } else if (timeLeft <= 10) {
            timerElement.style.color = '#ff0000';
        }
        
        // Aumentar nivel cada 15 segundos
        if (timeLeft % 15 === 0 && timeLeft < 60) {
            levelUp();
        }
    }
    
    // Función para subir de nivel
    function levelUp() {
        level++;
        levelElement.textContent = level;
        
        // Aumentar la velocidad de generación de círculos
        clearInterval(circleInterval);
        startCircleGeneration();
    }
    
    // Función para establecer un nuevo color objetivo
    function setNewTargetColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        targetColor = colors[randomIndex];
        targetColorElement.textContent = targetColor.name;
        targetColorElement.style.color = targetColor.value;
    }
    
    // Función para iniciar la generación de círculos
    function startCircleGeneration() {
        // La velocidad disminuye con el nivel (más círculos por segundo)
        const speed = Math.max(500, 1000 - (level * 100));
        
        circleInterval = setInterval(() => {
            if (!gameActive) return;
            createCircle();
        }, speed);
    }
    
    // Función para crear un círculo
    function createCircle() {
        const circle = document.createElement('div');
        circle.className = 'circle fade-in';
        
        // Tamaño aleatorio (entre 40 y 80px)
        const size = Math.floor(Math.random() * 40) + 40;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        
        // Posición aleatoria dentro del tablero
        const maxX = gameBoard.offsetWidth - size;
        const maxY = gameBoard.offsetHeight - size;
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        
        // Color aleatorio
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];
        circle.style.backgroundColor = color.value;
        circle.dataset.color = color.name;
        
        // Añadir borde para colores claros
        if (color.name === 'BLANCO' || color.name === 'GRIS') {
            circle.style.border = '2px solid #333';
        }
        
        // Tiempo de vida del círculo (disminuye con el nivel)
        const lifeTime = Math.max(1500, 3000 - (level * 200));
        
        // Agregar al tablero
        gameBoard.appendChild(circle);
        
        // Evento de clic
        circle.addEventListener('click', handleCircleClick);
        
        // Eliminar después del tiempo de vida
        setTimeout(() => {
            if (circle.parentNode) {
                circle.remove();
            }
        }, lifeTime);
    }
    
    // Función para manejar el clic en un círculo
    function handleCircleClick(e) {
        if (!gameActive) return;
        
        const circle = e.target;
        const circleColor = circle.dataset.color;
        
        if (circleColor === targetColor.name) {
            // Acierto
            score += level * 10; // Más puntos en niveles más altos
            scoreElement.textContent = score;
            
            // Efectos visuales
            createParticles(circle);
            circle.style.transform = 'scale(1.5)';
            circle.style.opacity = '0';
            
            // Nuevo color objetivo después de un acierto
            setTimeout(setNewTargetColor, 300);
        } else {
            // Error - penalización
            score = Math.max(0, score - 5);
            scoreElement.textContent = score;
            
            // Efecto de error
            circle.style.border = '3px solid #ff0000';
            setTimeout(() => {
                circle.style.border = circleColor === 'BLANCO' || circleColor === 'GRIS' ? '2px solid #333' : 'none';
            }, 200);
        }
        
        // Eliminar círculo después del clic
        setTimeout(() => {
            if (circle.parentNode) {
                circle.remove();
            }
        }, 300);
    }
    
    // Función para crear partículas de efecto
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const boardRect = gameBoard.getBoundingClientRect();
        const centerX = rect.left - boardRect.left + rect.width / 2;
        const centerY = rect.top - boardRect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = element.style.backgroundColor;
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            gameBoard.appendChild(particle);
            
            // Animación de partícula
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            let x = centerX;
            let y = centerY;
            let opacity = 1;
            
            const animateParticle = () => {
                x += vx;
                y += vy;
                opacity -= 0.02;
                
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateParticle);
        }
    }
    
    // Función para terminar el juego
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        clearInterval(circleInterval);
        
        // Limpiar el tablero
        gameBoard.innerHTML = '';
        
        // Guardar puntuación si es alta
        if (score > 0 && (highScores.length < 5 || score > Math.min(...highScores))) {
            highScores.push(score);
            highScores.sort((a, b) => b - a);
            if (highScores.length > 5) {
                highScores = highScores.slice(0, 5);
            }
            localStorage.setItem('promptProHighScores', JSON.stringify(highScores));
            updateHighScores();
        }
        
        // Mostrar mensaje de fin de juego
        const message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        message.style.padding = '2rem';
        message.style.borderRadius = '1rem';
        message.style.textAlign = 'center';
        message.style.zIndex = '10';
        message.style.border = '2px solid #ff0000';
        message.innerHTML = `
            <h3 style="color: #ff0000; margin-bottom: 1rem;">¡Juego Terminado!</h3>
            <p style="margin-bottom: 1.5rem;">Tu puntuación: <strong style="color: #ff0000;">${score}</strong></p>
            <button class="button button--flex" id="play-again">
                Jugar de Nuevo
                <i class="ri-refresh-fill button__icon"></i>
            </button>
        `;
        
        gameBoard.appendChild(message);
        
        document.getElementById('play-again').addEventListener('click', () => {
            message.remove();
            startGame();
        });
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', () => {
        if (gameActive) {
            endGame();
        }
        startGame();
    });
    
    // Inicialización
    setNewTargetColor();
});
