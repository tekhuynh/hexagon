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

export default Queue;