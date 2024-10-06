
function make_2d_grid(cols, rows) { }

function setup() { }

function draw() { }

const cols = 200;
const rows = 100;
const scale = 60;
let offset;
let height;
let grid

function make_2d_grid(cols, rows) {
    let grid = new Array(cols).fill(null).map(() => {
        return new Array(rows).fill(0);
    });
    return grid;
}
function setup() {

    height = sqrt(3) / 2;
    offset = 1 / 2;
    grid = make_2d_grid(cols, rows)
    grid = grid.map((cols) => {
        return cols.map(() => {
            return floor(random(2));
        });
    });
    createCanvas(scale*offset * cols, scale*rows * height);
    noLoop();
}


function* calculate_offsets(rows, cols, scale, height, width, v_offset = height, h_offset = width, parity = false) {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {

            // parity is set to 0 if argument is not passed
            let h_parity = (parity * (i+1)) % 2;
            let v_parity = (parity * (j+1)) % 2;

            // reverse the height for alternate shapes going rightwards
            let h_sign = (h_parity ? -1 : 1);
            let v_bool = (v_parity ? 0 : 1);

            // start from mid height of the shape and then go up or down
            // the vertical offset is dependent on the horizontal parity
            let v_top = j * v_offset - height / 2 + h_sign*height / 2;
            let v_bot = j * v_offset - height / 2 - h_sign*height / 2;

            // h_offset is spread and v_bool is for parity
            // the horizontal offset is dependent on the vertical parity
            let h_mid = i * h_offset + v_bool * width / 2;

            // these are relative to the center
            let h_left = h_mid - width / 2;
            let h_right = h_mid + width / 2;

            yield {
                i: i,
                j: j,
                h_mid: scale * h_mid,
                h_left: scale * h_left,
                h_right: scale * h_right,
                v_top: scale * v_top,
                v_bot: scale * v_bot
            };
        }
    }
}


function draw() {
    background(0);

    calculate_offsets(rows, cols, scale, height, 1, height, offset, true).forEach(({
        i,
        j,
        h_mid,
        h_left,
        h_right,
        v_top,
        v_bot
    }) => {
        if (grid[i][j] == 1) {
            fill(100*(!(j%2))+100);
            triangle(h_left, v_bot, h_right, v_bot, h_mid, v_top);
        }
    }
    )
}

