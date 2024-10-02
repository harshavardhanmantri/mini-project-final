var mouseDiv = document.getElementById("values");
const svgCanvas = document.getElementById("svgCanvas");
var coords = [];
var z = 0;
var edges = [];

function drawLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  svgCanvas.appendChild(line);
}
function createAdjacencyList(edges) {
  let adjacencyList = {};

  edges.forEach((edge) => {
    const [vertex1, vertex2] = edge;

    if (!adjacencyList[vertex1]) {
      adjacencyList[vertex1] = [];
    }
    if (!adjacencyList[vertex2]) {
      adjacencyList[vertex2] = [];
    }

    adjacencyList[vertex1].push(vertex2);
    adjacencyList[vertex2].push(vertex1);
  });

  console.log(adjacencyList);
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
    var div = document.createElement("div");
    div.innerText = z;
    div.setAttribute("class", "nodes");
    createbutton.style.display = "none";
    cancelbutton.style.display = "none";

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

const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function (e) {
  const userInput1 = inputField1.value;
  const userInput2 = inputField2.value;
  edges.push([userInput1, userInput2]);
  drawLine(
    coords[userInput1].x,
    coords[userInput1].y,
    coords[userInput2].x,
    coords[userInput2].y
  );
});
const createadjl = document.getElementById("createadjlist");

createadjl.addEventListener("click", function () {
  createAdjacencyList(edges);
});
