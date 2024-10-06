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

const cols = 10;
const rows = 20;
const scale = 50;
let grid;
let offsets;
let queue;

function make_2d_grid(cols, rows, fill = 0) {
    let grid = new Array(cols).fill(null).map(() => {
        return new Array(rows).fill(fill);
    });
    return grid;
}

function* calculate_offsets({ rows, cols, scale, height = 1, width = 1, v_offset = height, h_offset = width, v_shift = 0, h_shift = 0, parity = false, v_start = 0, h_start = 0}) {

    let minx = 1000
    let maxy = -1000
    let miny = 1000
    let maxx = -1000

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {

            // parity is set to 0 if shift argument is not passed
            let h_parity = parity ? i % 2 : 0;
            let v_parity = parity ? j % 2 : 0;

            // d_sign is for odd or even direction to set the orientation of the shapes
            let h_sign = (h_parity ? -1 : 1);
            let v_sign = (v_parity ? -1 : 1);
            // d_bool is for odd or even parity to set the shift of the shapes
            let h_bool = (h_parity ? 1 : 0);
            let v_bool = (v_parity ? 1 : 0);


            // offset is how spread out the shapes are
            let h_mid = width / 2 + i * h_offset
            //h_mid += v_bool * h_shift * width;
            let v_mid = height / 2 + j * v_offset
            //v_mid += h_bool * v_shift * height;

            // the vertical shift is dependent on the horizontal parity

            // the horizontal shift is dependent on the vertical parity

            let h_left = h_mid - h_sign * width / 2;
            let h_right = h_mid + h_sign * width / 2;

            // start from mid height of the shape and then go up or down, left or right
            // these are relative to the center
            let v_top = v_mid - v_sign * height / 2;
            let v_bot = v_mid + v_sign * height / 2;

            minx = Math.min(minx, h_left)
            maxx = Math.max(maxx, h_right)
            miny = Math.min(miny, v_top)
            maxy = Math.max(maxy, v_bot)

            yield {
                i: i,
                j: j,
                index: i + j * cols,
                h_mid: h_start + scale * h_mid,
                h_left: h_start+  scale * h_left,
                h_right: h_start + scale * h_right,
                v_top: v_start + scale * v_top,
                v_bot: v_start + scale * v_bot,
                v_mid: v_start + scale * v_mid,
                minx: h_start + scale * minx,
                maxx: h_start + scale * maxx,
                miny: v_start + scale * miny,
                maxy: v_start + scale * maxy
            };
        }
    }
}

function setup() {

    let three = Math.sqrt(3) / 2;
    offsets = make_2d_grid(cols, rows, null)
    let calculations = calculate_offsets({
        rows: rows,
        cols: cols,
        scale: scale,
        height: three,
        width: 1,
        h_offset: 1/2,
        parity: true,
    });

    for (let o of calculations) {
        offsets[o.i][o.j] = o;
    }

    grid = make_2d_grid(cols, rows)
    midx = Math.floor(cols / 2);
    midy = Math.floor(rows / 2);
    grid[midx][midy] = 1;
    queue = new Queue();
    queue.enqueue(offsets[midx][midy]);
    set_grid_random();
    let last = offsets[cols - 1][rows - 1]
    createCanvas(min(1000, last.maxx - last.minx), min(1000,last.maxy - last.miny));
    noLoop();
}

function set_grid_random() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 1//floor(random(2));
        }
    }
}


function step() {

    if (queue.isEmpty()) {
        return false;
    }

    let current = queue.dequeue();

    console.log(queue.dequeue()); // Output: 1
    queue.printQueue(); // Output: 2 3

}

function draw() {
    background(0);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let o = offsets[i][j];
            if (grid[i][j] == 1) {
                fill(100 * (!(j % 2)) + 100);
                triangle(o.h_left, o.v_bot, o.h_right, o.v_bot, o.h_mid, o.v_top);
                //triangle(o.h_left, o.v_bot, o.h_left, o.v_top, o.h_right, o.v_mid);
                fill(0)
                textSize(7);
                textAlign(CENTER, CENTER);
                text(o.index + ":" +i + "," + j, o.h_mid, o.v_mid);
            }
        }
    }
}

