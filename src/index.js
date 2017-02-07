import data from "./data";
import Field from "./Field";
import WavePathFinder from "./WavePathFinder";

let field;
let pathfinder;
let startPoint, finishPoint;
let prompt, status;

const SELECT_START = 0;
const SELECT_FINISH = 1;
const DRAWING_PATH = 2;
let state = SELECT_START;

document.addEventListener("DOMContentLoaded", () => {
  field = new Field(data);
  document.getElementById("root").appendChild(field.getRootElem());
  field.addClickCallback(cellClicked);

  pathfinder = new WavePathFinder(data);

  prompt = document.querySelector(".prompt");
  status = document.querySelector(".status");
});

function cellClicked(x, y) {
  if (!pathfinder.isWalkable(x, y))
    return;

  if (state === SELECT_START) {
    selectStart(x, y);
  }
  else if (state === SELECT_FINISH) {
    selectFinish(x, y);
  }
}

function selectStart(x, y) {
  state = SELECT_FINISH; 
  pathfinder.clear();
  field.clear();
  startPoint = {x: x, y: y};
  field.selectCell(x, y);
  finishPoint = null;

  prompt.textContent = "Выберите клеточку финиша.";
  status.textContent = `Старт: (${x}, ${y}). Финиш: не выбрано.`;
}

function selectFinish(x, y) {
  if (startPoint.x === x && startPoint.y === y)
    return;

  state = DRAWING_PATH;
  finishPoint = {x: x, y: y};
  field.selectCell(x, y);
  let path = pathfinder.getPath(startPoint.x, startPoint.y, finishPoint.x, finishPoint.y);
  
  if (path.length > 0) {
    field.drawPath(path, endPathDrawing);
    prompt.textContent = "Построение пути. Кликните по полю, чтоб ускорить построение.";
    status.textContent = `Старт: (${startPoint.x}, ${startPoint.y}). Финиш: (${x}, ${y}). Длина пути: ${path.length}.`;    
  }
  else {
    endPathDrawing();
    status.textContent = `Старт: (${startPoint.x}, ${startPoint.y}). Финиш: (${x}, ${y}). Путь не существует.`;
  } 
}

function endPathDrawing() {
  state = SELECT_START;
  prompt.textContent = "Выберите 2 пустые клеточки для нахождения пути между ними.";
}