
export default class Field {
  constructor(data) {
    this.rows = data.length;
    this.cols = data[0].length;
    this.cells = [];
    this.table = this.createTable(data);
    this.table.addEventListener("click", this.clickHandler.bind(this));
    this.clickCallback = null;
    this.selectedCells = [];
    this.pathCells = [];
    this.isDrawing = false;
  }

  createTable(data) {
    let table = document.createElement("table");
    table.className = "field";

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var y = 0; y < this.rows; ++y) {
      this.cells.push([]);
      let row = document.createElement("tr");
      tbody.appendChild(row);
      for (var x = 0; x < this.cols; ++x) {
        var cell = document.createElement("td");
        cell.className = data[y][x] ? "cell cell-wall" : "cell";
        row.appendChild(cell);
        this.cells[y].push(cell);
      }
    }

    this.blockingOverlay = document.createElement("tbody");
    this.blockingOverlay.className = "blocking-input-overlay";
    this.blockingOverlay.style.display = "none";
    table.appendChild(this.blockingOverlay);

    return table;
  }

  getRootElem() {
    return this.table;
  }

  addClickCallback(callback) {
    this.clickCallback = callback;
  }

  clickHandler(e) {
    if (this.isDrawing) {
      this.drawInterval = 0;
      return;
    }

    if (e.target.tagName !== "TD") 
      return;   

    const cellCoords = this.getCoords(e.target);
    if (this.clickCallback)
      this.clickCallback(cellCoords.x, cellCoords.y);
  }

  getCoords(cell) {
    return {x: cell.cellIndex, y: cell.parentElement.rowIndex};
  }

  clear() {
    this.selectedCells.forEach((cell) => cell.className = "cell");
    this.selectedCells = [];

    this.pathCells.forEach((cell) => cell.className = "cell");
    this.pathCells = [];
  }

  selectCell(x, y) {
    this.cells[y][x].classList.add("cell-selected");
    this.selectedCells.push(this.cells[y][x]);
  } 

  drawPath(path, callback) {
    path.forEach((node) => {
      let cell = this.cells[node.y][node.x];
      cell.classList.add("cell-path");
      this.pathCells.push(cell);     
    });

    this.isDrawing = true;
    this.drawInterval = 200;
    this.drawIndex = 0;
    this.drawCallback = callback;
    this.blockingOverlay.style.display = "";
    this.drawPathArrows();
  }

  drawPathArrows() {
    if (this.drawIndex === this.pathCells.length - 1) {
      this.drawFinishArrow(this.drawIndex);
    }
    else if (this.drawIndex === 0) {
      this.drawStartArrow();
    }
    else {
      this.drawIntermediateArrow(this.drawIndex);
    }

    this.drawIndex++;

    if (this.drawIndex === this.pathCells.length) {
      this.isDrawing = false;
      this.blockingOverlay.style.display = "none";
      this.drawCallback();
    }
    else {
      setTimeout(this.drawPathArrows.bind(this), this.drawInterval);
    }
  }

  drawStartArrow() {
    const first = this.getCoords(this.pathCells[0]);
    const second = this.getCoords(this.pathCells[1]);

    if (first.x === second.x) {
      this.pathCells[0].classList.add((first.y > second.y) ? "arrow-top" : "arrow-bottom");
    }
    else {
      this.pathCells[0].classList.add((first.x > second.x) ? "arrow-left" : "arrow-right");
    }
  }

  drawIntermediateArrow(i) {
    const cur = this.getCoords(this.pathCells[i]);
    const prev = this.getCoords(this.pathCells[i-1]);
    const next = this.getCoords(this.pathCells[i+1]);

    if (cur.x === prev.x && cur.x === next.x) {
      this.pathCells[i].classList.add((cur.y < prev.y) ? "arrow-top" : "arrow-bottom");
    }
    else if (cur.y === prev.y && cur.y === next.y) {
      this.pathCells[i].classList.add((cur.x < prev.x) ? "arrow-left" : "arrow-right");
    }
    else if (cur.x === prev.x) {
      if (cur.y < prev.y) {
        this.pathCells[i].classList.add((cur.x < next.x) ? "arrow-top-right" : "arrow-top-left");
      }
      else {
        this.pathCells[i].classList.add((cur.x < next.x) ? "arrow-bottom-right" : "arrow-bottom-left");
      }
    }
    else if (cur.y === prev.y) {
      if (cur.x > prev.x) {
        this.pathCells[i].classList.add((cur.y > next.y) ? "arrow-right-top" : "arrow-right-bottom");
      }
      else {
        this.pathCells[i].classList.add((cur.y > next.y) ? "arrow-left-top" : "arrow-left-bottom");
      }
    }
  }

  drawFinishArrow(i) {
    this.pathCells[i].classList.add("finish");
  }
}