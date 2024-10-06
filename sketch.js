/**
 * Creates a 2D grid with the specified number of columns and rows.
 * 
 * @param {number} cols - The number of columns in the grid.
 * @param {number} rows - The number of rows in the grid.
 * @returns {Array<Array<number>>} A 2D array representing the grid.
 */
function make_2d_grid(cols, rows) {}

/**
 * p5.js setup function to initialize the canvas and grid.
 */
function setup() {}

/**
 * Draws the grid of shapes on the canvas.
 * 
 * @param {Array<Array<number>>} grid - The 2D grid array representing the item states.
 * @param {number} height - The height of each between each row.
 * @param {boolean} parity - Enable parity value for the grid.
 * @param {number} offset - The horizontal offset for each alternate row.
 * 
 */
function draw_grid(height, offset, grid) {}

/**
 * p5.js draw function to render the grid on the canvas.
 */
function draw() {}
let grid
const cols = 200;
const rows = 100;
const zoom = 10
let offset
let height;

function make_2d_grid(cols, rows) {
    let grid = new Array(cols).fill(null).map(() => {
        return new Array(rows).fill(0);
    });
    return grid;
}
function setup() {
    
    height = zoom * sqrt(3) / 2;
    offset = zoom / 2;
    grid = make_2d_grid(cols, rows)
    grid = grid.map((cols) => {
        return cols.map(() => {
            return floor(random(2));
        });
    });
    createCanvas(offset * cols,rows * height);
    noLoop();
}


function draw_grid(grid, scale, height, width, draw_shape, v_offset = height, h_offset = width, parity = false) {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {

            // parity is set to 0 if argument is not passed
            let h_parity = (parity * i) % 2;
            let v_parity = (parity * j) % 2;
            
            // reverse the height for alternate shapes going rightwards
            let current_height = (v_parity ? -1 : 1) * height;

            // shift horizontal offset for alternate shapes going downwards
            let current_offset = (h_parity ? -1 : 1) * h_offset;

            // h_offset is spread and current_offset is for parity
            let h_mid = i * h_offset + current_offset;

            // these are relative to the center
            let h_left = x - width / 2;
            let h_right = x + width / 2;

            // start from mid height of the shape and then go up or down
            let v_top = j * v_offset + height / 2 + current_height / 2;
            let v_bot = y * v_offset + height / 2 - current_height / 2;

            // call the draw_shape function with the calculated values
            draw_shape(grid[i][j], h_mid, h_left, h_right, v_top, v_bot);
        }
    }
}


function draw() {
    background(0);

        for (let j = 0; j < rows; j++) {  // Corrected to increment j
            rowparity = (j % 2);
            for (let i = 0; i < cols; i++) {  // Corrected to increment i
                let colparity = (i % 2);
                let currheight = height / 2 + colparity * -1 * height;
                let curroffset = offset * rowparity;
                let x = i * offset + curroffset;
                let y = j * height + height / 2 + currheight;
                let left = x - offset;
                let right = x + offset;
                let bot = y + - 2 * currheight;

                if (grid[i][j] == 1) {
                    fill(255);
                    triangle(left, bot, right, bot, x, y);
                }
            }
        }
        update = false;
    }

