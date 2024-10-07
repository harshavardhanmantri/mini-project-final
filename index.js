var mouseDiv = document.getElementById("values");
const svgCanvas = document.getElementById("svgCanvas");
var coords = [];
var paths = new Set();
var z = 0;
var edges = [];
var exits = [];
var colors = ["red", "blue"];
var div;
function drawLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "grey");
  line.setAttribute("stroke-width", "2");
  svgCanvas.appendChild(line);
}

function drawline(x1, y1, x2, y2, color) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  console.log(color);
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", "2");
  svgCanvas.appendChild(line);
}
function createAdjacencyList(edges) {
  const adjList = {};

  edges.forEach((edge) => {
    const [node1, node2, distance] = edge;

    // Add the edge to the adjacency list for node1
    if (!adjList[node1]) {
      adjList[node1] = [];
    }
    adjList[node1].push([node2, distance]);

    // Add the edge to the adjacency list for node2 (since it's undirected)
    if (!adjList[node2]) {
      adjList[node2] = [];
    }
    adjList[node2].push([node1, distance]);
  });

  return adjList;
}
mouseDiv.addEventListener("dblclick", function (e) {
  var createbutton = document.createElement("button");
  var cancelbutton = document.createElement("button");

  createbutton.setAttribute("class", "ansdiv");
  cancelbutton.setAttribute("class", "cancelbutton");

  mouseDiv.append(createbutton);
  mouseDiv.append(cancelbutton);
  var x = e.clientX;
  var y = e.clientY;
  createbutton.innerText = "create";
  createbutton.style.left = x + "px";
  createbutton.style.top = y + "px";
  createbutton.style.display = "block";
  cancelbutton.innerText = "cancel";
  cancelbutton.style.left = x + 70 + "px";
  cancelbutton.style.top = y + "px";
  cancelbutton.style.display = "block";
  createbutton.addEventListener("click", function (e) {
    div = document.createElement("div");
    div.innerText = z;
    div.setAttribute("class", "nodes");
    createbutton.style.display = "none";
    cancelbutton.style.display = "none";
    div.setAttribute("id", `${z}`);
    console.log(div);
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.display = "block";
    coords.push({ z, x, y });
    console.log(coords[z]);
    z = z + 1;
    mouseDiv.append(div);
    // if (z > 1) {
    //   for (let i = 0; i < z; i += 1) {
    //     for (let j = 0; j < z; j += 1) {
    //       drawLine(coords[i].x, coords[i].y, coords[j].x, coords[j].y);
    //     }
    //   }
    // }
  });
  cancelbutton.addEventListener("click", function (e) {
    createbutton.style.display = "none";
    cancelbutton.style.display = "none";
  });
});

const inputField1 = document.getElementById("userInput1");
const inputField2 = document.getElementById("userInput2");
const inputField3 = document.getElementById("userInput3");

const submitButton = document.getElementById("submitButton");
const exitsubmitButton = document.getElementById("submitButton1");

submitButton.addEventListener("click", function (e) {
  const userInput1 = inputField1.value;
  const userInput2 = inputField2.value;
  const distance = Math.sqrt(
    (coords[userInput2].x - coords[userInput1].x) *
      (coords[userInput2].x - coords[userInput1].x) +
      (coords[userInput2].y - coords[userInput1].y) *
        (coords[userInput2].y - coords[userInput1].y)
  );
  edges.push([userInput1, userInput2, distance]);
  drawLine(
    coords[userInput1].x,
    coords[userInput1].y,
    coords[userInput2].x,
    coords[userInput2].y
  );
});

exitsubmitButton.addEventListener("click", function () {
  const userInput3 = inputField3.value;
  const node = document.getElementById(`${userInput3}`);
  node.style.backgroundColor = "green";
  exits.push(userInput3);
  console.log(exits);
});

class Algorithm {
  pq = new MinPriorityQueue();
  distances = []; // [[distance , to]]
  multipleSourceShortestPath(graph, sources) {
    console.log("hi");
    const distances = {};
    const parent = {};
    const pq = new MinPriorityQueue();

    // Initialize distances and parent
    for (const node in graph) {
      distances[node] = Infinity;
      parent[node] = null;
    }

    // Set distance for each source to 0 and add them to the priority queue
    for (const source of sources) {
      distances[source] = 0;
      parent[source] = source;
      pq.enqueue(0, source);
    }

    while (!pq.isEmpty()) {
      const [currDistance, currNode] = pq.dequeue();

      // Explore neighbors
      for (const [neighbor, weight] of graph[currNode]) {
        const newDistance = currDistance + weight;

        // If the new distance is shorter, update distances and parent
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          parent[neighbor] = currNode; // Track the path
          pq.enqueue(newDistance, neighbor);
        }
      }
    }

    return { distances, parent };
  }

  getPathToExit(src, parent) {
    let path = [];
    let curr = src;
    while (parent[curr] != curr) {
      path.push(curr);
      curr = parent[curr];
    }
    path.push(curr); //push the exit node
    return path;
  }
}

class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper function to get the parent index
  parentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Helper function to get the left child index
  leftChildIndex(index) {
    return 2 * index + 1;
  }

  // Helper function to get the right child index
  rightChildIndex(index) {
    return 2 * index + 2;
  }

  // Function to swap two elements in the heap
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  // Function to insert a value into the priority queue (as a pair [priority, value])
  enqueue(priority, value) {
    this.heap.push([priority, value]);
    this.heapifyUp();
  }

  // Function to remove and return the element with the highest priority (smallest first element)
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const root = this.heap[0];
    const lastNode = this.heap.pop(); // Move the last element to the root and pop the last element
    if (this.heap.length > 0) {
      this.heap[0] = lastNode; // If the heap is not empty after popping
      this.heapifyDown();
    }
    return root; // Returns [priority, value]
  }

  // Check if the priority queue is empty
  isEmpty() {
    return this.heap.length === 0;
  }

  // Move the element at the end of the heap to its correct position upwards
  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parent = this.parentIndex(index);
      if (this.heap[index][0] >= this.heap[parent][0]) {
        break; // Correct position found
      }
      this.swap(index, parent);
      index = parent;
    }
  }

  // Move the element at the root to its correct position downwards
  heapifyDown() {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      let left = this.leftChildIndex(index);
      let right = this.rightChildIndex(index);
      let smallest = index;

      if (left < length && this.heap[left][0] < this.heap[smallest][0]) {
        smallest = left;
      }
      if (right < length && this.heap[right][0] < this.heap[smallest][0]) {
        smallest = right;
      }
      if (smallest === index) {
        break; // Correct position found
      }
      this.swap(index, smallest);
      index = smallest;
    }
  }

  // Function to return the size of the queue
  size() {
    return this.heap.length;
  }
}

function exists(i) {
  for (let j = 0; j < exits.length; j++) {
    if (i == exits[j]) {
      return true;
    }
  }
  return false;
}
const createadjl = document.getElementById("createadjlist");

createadjl.addEventListener("click", function () {
  let graph = createAdjacencyList(edges);
  let algo = new Algorithm();
  //here we are assuming 4 and 10 to be exit in real application, user should be able to select the exits
  let { distances, parent } = algo.multipleSourceShortestPath(graph, exits);
  let x = 0;

  for (i in graph) {
    console.log({ i, exits });
    if (!exists(i)) {
      console.log(i);
      let path = algo.getPathToExit(i, parent);
      console.log(path);
      for (let h = 0; h < path.length - 1; h += 1) {
        const node = document.getElementById(`${path[h]}`);
        node.style.backgroundColor = colors[x];
        drawline(
          coords[path[h]].x,
          coords[path[h]].y,
          coords[path[h + 1]].x,
          coords[path[h + 1]].y,
          colors[x]
        );
      }
      x += 1;
    }
  }
});
