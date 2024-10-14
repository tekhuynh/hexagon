// The algorithm below is an implementation of Dijkstra's algorithm on a triangle grid.
const grid_multiply = 2;
const cols = 79*2   *grid_multiply;
const rows = 79  *grid_multiply;
// const cols = 79   *grid_multiply;
// const rows = 26  *grid_multiply;
const scale = 7;
const iterstart = 2;
const midx = 1;
const midy = 0;
// const midx = Math.floor(cols / 2);
// const midy = Math.floor(rows / 2);
let grid;
let offsets;
let queue;

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.length = 0;
    }

    // Add an element to the end of the queue
    enqueue(value) {
        const newNode = new Node(value);
        if (this.isEmpty()) {
            this.front = this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }
        this.length++;
    }

    // Remove an element from the front of the queue
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        const value = this.front.value;
        this.front = this.front.next;
        this.length--;
        if (this.isEmpty()) {
            this.rear = null;
        }
        return value;
    }

    // Check if the queue is empty
    isEmpty() {
        return this.length === 0;
    }

    // Get the front element of the queue
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.front.value;
    }

    // Get the size of the queue
    size() {
        return this.length;
    }

    // Print the queue elements
    printQueue() {
        let current = this.front;
        let result = [];
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        console.log(result.join(" "));
    }
}


function make_2d_grid(cols, rows, fill = 0) {
    let grid = new Array(cols).fill(null).map(() => {
        return new Array(rows).fill(fill);
    });
    return grid;
}


class Parity {
    constructor({ h_flip = false, v_flip = false, h_shift = 0, v_shift = 0 }) {
        this.h_flip = h_flip;
        this.v_flip = v_flip;
        this.h_shift = h_shift;
        this.v_shift = v_shift;
    }
}

function* calculate_offsets({ rows, cols, scale = 10, height = 1, width = 1, rise = 0, run = 0, v_offset = height, h_offset = width, v_start = 0, h_start = 0, parity = null }) {

    let minx = 1000
    let maxy = -1000
    let miny = 1000
    let maxx = -1000

    let prev

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {

            let pair;

            if (parity != null && i % 2 == 1) {

                pair = { ...prev }
                if (parity.h_flip) {
                    pair.h_left = prev.h_right
                    pair.h_right = prev.h_left
                }
                if (parity.v_flip) {
                    pair.v_top = prev.v_bot
                    pair.v_bot = prev.v_top
                }
                if (parity.h_shift) {
                    pair.h_left += parity.h_shift * scale
                    pair.h_right += parity.h_shift * scale
                    pair.h_mid += parity.h_shift * scale
                }
                if (parity.v_shift) {
                    pair.v_top += parity.v_shift * scale
                    pair.v_bot += parity.v_shift * scale
                    pair.v_mid += parity.v_shift * scale
                }
            } else {

                // offset is how spread out the shapes are
                // start from mid height of the shape and then go up or down, left or right
                // these are relative to the center

                let h_mid = h_start + width / 2 + i * h_offset + run * j
                let h_left = h_mid - width / 2;
                let h_right = h_mid + width / 2;

                let v_mid = v_start + height / 2 + j * v_offset + rise * i
                let v_top = v_mid + height / 2;
                let v_bot = v_mid - height / 2;

                pair = {
                    h_mid: scale * h_mid,
                    h_left: scale * h_left,
                    h_right: scale * h_right,
                    v_top: scale * v_top,
                    v_bot: scale * v_bot,
                    v_mid: scale * v_mid,
                }
                prev = pair
            }

            minx = Math.min(minx, pair.h_left)
            maxx = Math.max(maxx, pair.h_right)
            miny = Math.min(miny, pair.v_top)
            maxy = Math.max(maxy, pair.v_bot)

            pair = {
                ...pair,
                i: i,
                j: j,
                index: i + j * cols,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy
            };

            yield pair
        }

    }
}

function set_grid_random() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 1//floor(random(2));
        }
    }
}

function step(push = true) {

    if (queue.isEmpty()) {
        return false;
    }
    if (iter == 257) {
        return false;
    }

    current_queue = queue
    let neighbors = [];

    while (!current_queue.isEmpty()) {
        let [i, j] = current_queue.dequeue();
        if (push) triangles.push([i, j]);

        grid[i][j] = iter;

        // think of a square grid, and then the neighbors are the 4 sides
        // but in a triangle grid, the neighbors are the 3 sides
        // even goes up, odd goes down
        let parity = i & 1 ? 1 : -1;
        let check = [
            [i - 1, j],
            [i + 1, j],
            [i - parity, j + parity],
        ];
        for (let [i, j] of check) {
            if (i >= 0 && i < cols && j >= 0 && j < rows && grid[i][j] == 0) {
                neighbors.push([i, j]);
            }
        }

    }

    iter++;

    for (let [i, j] of neighbors) {
        grid[i][j] += 1;
    }

    for (let [i, j] of neighbors) {
        if (grid[i][j] > 1) {
            grid[i][j] = iter;
            if (push) gaps.push([i, j]);
            continue;
        }
        if (grid[i][j] == 1) {
            if (push) queue.enqueue([i,j]);
            continue;
        }
        console.log("error");
    }

    return true;
}


let iter = iterstart;
let buffer;
let triangles = [];
let gaps = [];

function setup() {

    let three = Math.sqrt(3) / 2;
    offsets = make_2d_grid(cols, rows, null)
    let calculations = calculate_offsets({
        rows: rows,
        cols: cols,
        scale: scale,
        run: 1 / 2,
        rise: 0,
        height: three,
        width: 1,
        h_offset: 1 / 2,
        h_start: 0,
        v_start: 0,
        parity: new Parity({
            v_flip: true,
            h_shift: 1 / 2
        }),
    });

    for (let o of calculations) {
        offsets[o.i][o.j] = o;
    }

    grid = make_2d_grid(cols, rows)
    grid[midx][midy] = 1;
    queue = new Queue();
    queue.enqueue([midx,midy]);
    let last = offsets[cols - 1][rows - 1]
    canvas = createCanvas(min(10000, last.maxx - last.minx), min(10000, last.maxy - last.miny));
    buffer = createGraphics(min(10000, last.maxx - last.minx), min(10000, last.maxy - last.miny));
    noLoop();
    while(step()) {}
    maxiter = iter;
    opacities = Array.from({ length: maxiter }, (_, i) =>  floor((1- (i+1) / (maxiter)) * 16)*16+16);
    let sigmoid = (x) => 1/(1+Math.exp(-(x)))
    // opacities = Array.from({ length: maxiter }, (_, i) =>  floor(sigmoid(3*(1-(i)/(maxiter)))*256));
    buffer.background(0);
    buffer.noStroke();
    buffer.textSize(6);
    buffer.textAlign(CENTER, CENTER);
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    maxiter = maxiter;
    drawTrianglesToBuffer();
    buffer.fill(255)
    // for (let i = 0; i < cols; i++){
    //     for (let j = 0; j < rows; j++){
    //         if (grid[i][j] == 0) {
    //             let o = offsets[i][j];
    //             buffer.text(grid[i][j], o.h_mid, o.v_mid);
    //         }
    //     }
    // } 
}
let canvas
let maxiter
let opacities
let coefficients
function polynomial(x, coefficients) {
    return coefficients.reduce((acc, c) => (x*acc + c) %256, 0);
}
let mult = 3
let mult_increment = 1000;
let evals;
async function drawTrianglesToBuffer() {

//    buffer.fill(0, 0, 0, 255);
    buffer.fill(0) 
    buffer.rect(0, 0, buffer.width, buffer.height);
//    if (step()== false){
        //grid = make_2d_grid(cols, rows)
        //grid[midx][midy] = 1;
        //queue.enqueue([midx,midy]);
        mult=(mult + mult_increment) % Number.MAX_SAFE_INTEGER;
        //iter = 10;
        coefficients = `${mult}`.split('').map(c => parseInt(c));
        // evals = Array.from({ length: maxiter }, (_, i) =>  floor(polynomial(i+1, coefficients)*7/8+64));
        evals = Array.from({ length: maxiter }, (_, i) =>  floor(polynomial(i, [16,0])));
        //while(step());
//    }
    for ([i, j] of triangles) {

        let o = offsets[i][j];
        //buffer.fill(polynomial(grid[i][j], coefficients))//, floor((1- ( 10 - grid[i][j]) / maxiter) * 255));
        buffer.fill(floor(evals[grid[i][j]-iterstart- (i % 2 == 1 ? 1 : 0)]* opacities[grid[i][j]-iterstart]/(255-55)));
        buffer.triangle(o.h_left, o.v_bot, o.h_right, o.v_bot, o.h_mid, o.v_top);
    }
    for ([i, j] of gaps) {

        let o = offsets[i][j];
        //buffer.fill(polynomial(grid[i][j], coefficients))//, floor((1- ( 10 - grid[i][j]) / maxiter) * 255));
        buffer.fill(floor(evals[grid[i][j]-iterstart- (i % 2 == 1 ? 0 : 0)]*(opacities[grid[i][j]-iterstart]/(255-255/9))));
        buffer.triangle(o.h_left, o.v_bot, o.h_right, o.v_bot, o.h_mid, o.v_top);
        // buffer.fill(0)
        // buffer.text(grid[i][j] - iterstart, o.h_mid, o.v_mid);
    }
    //triangles = [];
    //await sleep(500);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
buffer_offset = 0
function draw() {
    image(buffer, -buffer_offset, 0);

    drawTrianglesToBuffer();

    // fill(255)
    // let o = offsets[midx][midy];
    // text(mult, -buffer_offset+o.h_mid, o.v_mid);
    //saveCanvas(canvas, `${mult}`, 'png');
}
// function draw() {
//     background(0);
//     stroke(0,0,0,0);
//     for (let i = 0; i < cols; i++) {
//         for (let j = 0; j < rows; j++) {
//             let o = offsets[i][j];
//             if (grid[i][j] != 0) {
//                 fill((grid[i][j] *15)%255,floor((iter-grid[i][j])/266*255));
//                 triangle(o.h_left, o.v_bot, o.h_right, o.v_bot, o.h_mid, o.v_top);
//                 // fill(255)
//                 // textSize(7);
//                 // textAlign(CENTER, CENTER);
//                 // text(grid[i][j]+","+i + "," + j, o.h_mid, o.v_mid);
//             }
//         }
//     }
//     step();
//     //console.log(iter);
// }

