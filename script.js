const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.getElementById('moveLeft').addEventListener('click', () => moveGrid('left'));
document.getElementById('moveRight').addEventListener('click', () => moveGrid('right'));
document.getElementById('moveUp').addEventListener('click', () => moveGrid('up'));
document.getElementById('moveDown').addEventListener('click', () => moveGrid('down'));

const resolution = 40; // Tamaño de cada celda en píxeles
canvas.width = 1080;
canvas.height = 560;

const rows = Math.floor(canvas.height / resolution);
const cols = Math.floor(canvas.width / resolution);

function createGrid() {
    const grid = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(0);
        }
        grid.push(row);
    }
    return grid;
}

let grid = createGrid();
let running = false;
let interval;
const speed = 50; // Velocidad de actualización en milisegundos

function drawGridLines() {
    ctx.strokeStyle = '#480a32'; // Color de las líneas de la cuadrícula
    ctx.lineWidth = 1;

    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * resolution, 0);
        ctx.lineTo(i * resolution, canvas.height);
        ctx.stroke();
    }

    for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * resolution);
        ctx.lineTo(canvas.width, j * resolution);
        ctx.stroke();
    }
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#086375'; // Fondo del canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            ctx.beginPath();
            ctx.arc(
                col * resolution + resolution / 2,
                row * resolution + resolution / 2,
                resolution / 2.5,
                0, Math.PI * 2
            );
            ctx.fillStyle = cell ? '#affc41' : '#086375'; // Células vivas, células muertas
            ctx.fill();
        }
    }

    drawGridLines();
}

function nextGeneration(grid) {
    const nextGen = [];
    for (let row = 0; row < rows; row++) {
        const newRow = [];
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            const cell = grid[row][col];

            if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                newRow.push(0); // Muere por soledad o sobrepoblación
            } else if (cell === 0 && neighbors === 3) {
                newRow.push(1); // Nace una nueva célula
            } else {
                newRow.push(cell); // Permanece igual
            }
        }
        nextGen.push(newRow);
    }
    return nextGen;
}

function countNeighbors(grid, row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            count += grid[newRow][newCol];
        }
    });

    return count;
}

canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetX / resolution);
    const row = Math.floor(e.offsetY / resolution);
    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid(grid);
});

const startPauseBtn = document.getElementById('startPauseBtn');
startPauseBtn.addEventListener('click', () => {
    if (running) {
        running = false;
        clearInterval(interval);
        startPauseBtn.textContent = 'Iniciar';
    } else {
        running = true;
        interval = setInterval(() => {
            grid = nextGeneration(grid);
            drawGrid(grid);
        }, speed);
        startPauseBtn.textContent = 'Pausar';
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    grid = createGrid();
    drawGrid(grid);
    if (running) {
        running = false;
        clearInterval(interval);
        startPauseBtn.textContent = 'Iniciar';
    }
});


function moveGrid(direction) {
    const newGrid = createGrid();

    if (direction === 'left' && !celulaEsquinaIz()) {
        for (let row = 0; row < rows; row++) {
            for (let col = 1; col < cols; col++) {
                newGrid[row][col - 1] = grid[row][col];
            }
        }
    }
    else if (direction === 'right' && !celulaEsquinaDer()) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols - 1; col++) {
                newGrid[row][col + 1] = grid[row][col];
            }
        }
    }
    else if (direction === 'up' && !celulaPrimeraCol()) {
        for (let row = 1; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                newGrid[row - 1][col] = grid[row][col];
            }
        }
    }
    else if (direction === 'down' && !celulaUltimaCol()) {
        for (let row = 0; row < rows - 1; row++) {
            for (let col = 0; col < cols; col++) {
                newGrid[row + 1][col] = grid[row][col];
            }
        }
    } else {

        return;
    }

    grid = newGrid
    drawGrid(grid);
}


function celulaEsquinaIz() {
    for (let row = 0; row < rows; row++) {
        if (grid[row][0] === 1) {
            return true;
        }
    }
    return false;
}

function celulaEsquinaDer() {
    for (let row = 0; row < rows; row++) {
        if (grid[row][cols - 1] === 1) {
            return true;
        }
    }
    return false;
}

function celulaPrimeraCol() {
    for (let col = 0; col < cols; col++) {
        if (grid[0][col] === 1) {
            return true;
        }
    }
    return false;
}

function celulaUltimaCol() {
    for (let col = 0; col < cols; col++) {
        if (grid[rows - 1][col] === 1) {
            return true;
        }
    }
    return false;
}



drawGrid(grid);