const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resolution = 20;  // Tamaño de cada celda en píxeles
canvas.width = 800;
canvas.height = 600;
const rows = Math.floor(canvas.height / resolution);
const cols = Math.floor(canvas.width / resolution);

function createGrid() {
    return new Array(rows).fill(null)
        .map(() => new Array(cols).fill(0));
}

let grid = createGrid();
let running = false;
let interval;
const speed = 200;  // Velocidad de actualización en milisegundos

function drawGridLines() {
    ctx.strokeStyle = '#aaa';  // Color de las líneas de la cuadrícula (gris claro)
    ctx.lineWidth = 1;
    
    // Dibujar líneas verticales
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * resolution, 0);
        ctx.lineTo(i * resolution, canvas.height);
        ctx.stroke();
    }

    // Dibujar líneas horizontales
    for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * resolution);
        ctx.lineTo(canvas.width, j * resolution);
        ctx.stroke();
    }
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#808080';  // Fondo gris
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            ctx.beginPath();
            ctx.arc(
                col * resolution + resolution / 2,
                row * resolution + resolution / 2,
                resolution / 2.5,  // Radio del círculo
                0, Math.PI * 2
            );
            ctx.fillStyle = cell ? '#48C9B0' : '#808080';  // Células menta, fondo gris
            ctx.fill();
        }
    }

    drawGridLines();  // Dibujar las líneas encima de las células
}

function nextGeneration(grid) {
    const nextGen = grid.map(arr => [...arr]);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            const cell = grid[row][col];
            if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGen[row][col] = 0;
            } else if (cell === 0 && neighbors === 3) {
                nextGen[row][col] = 1;
            }
        }
    }
    return nextGen;
}

function countNeighbors(grid, row, col) {
    const deltas = [-1, 0, 1];
    let count = 0;
    deltas.forEach(dx => {
        deltas.forEach(dy => {
            if (!(dx === 0 && dy === 0)) {
                const newRow = row + dx;
                const newCol = col + dy;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    count += grid[newRow][newCol];
                }
            }
        });
    });
    return count;
}

canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetX / resolution);
    const row = Math.floor(e.offsetY / resolution);
    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid(grid);
});

// Botón para iniciar la simulación
document.getElementById('startBtn').addEventListener('click', () => {
    if (!running) {
        running = true;
        interval = setInterval(() => {
            grid = nextGeneration(grid);
            drawGrid(grid);
        }, speed);
    }
});

// Botón para pausar la simulación
document.getElementById('pauseBtn').addEventListener('click', () => {
    running = false;
    clearInterval(interval);
});

// Botón para limpiar el canvas
document.getElementById('clearBtn').addEventListener('click', () => {
    grid = createGrid();  // Reinicia la cuadrícula a su estado vacío
    drawGrid(grid);  // Redibuja la cuadrícula vacía
});

drawGrid(grid);  // Dibuja la cuadrícula inicial vacía
