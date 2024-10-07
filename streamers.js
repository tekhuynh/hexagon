function make_2d_grid(cols, rows) {
    let grid = new Array(cols).fill(null).map(() => {
        return new Array(rows).fill(0);
    });
    return grid;
}

let grid
const cols = 100;
const rows = 100;
const zoom = 50

function setup() {
    grid = make_2d_grid(cols, rows)
    grid = grid.map((cols) => {
        return cols.map(() => {
            return floor(random(2));
        });
    });
    createCanvas(400, 400);
}

function draw() {
    background(0);
    let height = zoom * sqrt(3) / 2;
    let offset = zoom / 2;
    grid.forEach((col, i) => {
        height = height * -1;
        col.forEach((cell, j) => {
            let x = i*zoom;
            let y = j*zoom;
            let left = x*zoom - offset;
            let right = x*zoom + offset;
            let bot = y + height;

            if (cell == 1) {
                fill(255);
                triangle(left, bot, right, bot, x, y);
            }
        });
    });
}
