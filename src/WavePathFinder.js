
class Node {
  constructor(x, y, visited, isWalkable, prevNode) {
    this.x = x;
    this.y = y;
    this.visited = visited;
    this.isWalkable = isWalkable;
    this.prevNode = prevNode;
  }
}

export default class WavePathFinder {
  constructor(data) {
    this.rows = data.length;
    this.cols = data[0].length;
    this.nodes = this.createNodes(data);
    this.checkList = [];
  }

  createNodes(data) {
    let nodes = [];
    for (let y = 0; y < this.rows; ++y) {
      nodes.push([]);
      for (let x = 0; x < this.cols; ++x) {
        nodes[y].push(new Node(x, y, false, data[y][x] === 0, null));
      }
    }

    return nodes;
  }

  clear() {
    for (let y = 0; y < this.rows; ++y) {
      for (let x = 0; x < this.cols; ++x) {
        this.nodes[y][x].visited = false;
        this.nodes[y][x].prevNode = null;
      }
    }

    this.checkList = [];
  }

  getPath(curX, curY, finishX, finishY) {
    if (curX === finishX && curY === finishY) {
      return this.constructPath(this.nodes[curY][curX]);
    }
    
    this.nodes[curY][curX].visited = true;
    this.checkNeighbours(curX, curY);

    if (this.checkList.length > 0) {
      let node = this.checkList.shift();
      return this.getPath(node.x, node.y, finishX, finishY);
    }
    else {
      return [];
    }
  }

  checkNeighbours(x, y) {
    if (this.canBeAddedToCheckList(x - 1, y))
      this.addNeighbourToCheckList(x - 1, y, this.nodes[y][x]);

    if (this.canBeAddedToCheckList(x + 1, y))
      this.addNeighbourToCheckList(x + 1, y, this.nodes[y][x]);

    if (this.canBeAddedToCheckList(x, y - 1))
      this.addNeighbourToCheckList(x, y - 1, this.nodes[y][x]);

    if (this.canBeAddedToCheckList(x, y + 1))
      this.addNeighbourToCheckList(x, y + 1, this.nodes[y][x]);
  }

  addNeighbourToCheckList(x, y, prevNode) {
    this.nodes[y][x].prevNode = prevNode;
    this.checkList.push(this.nodes[y][x]);
  }

  canBeAddedToCheckList(x, y) {
    return ( 
      this.isInField(x, y) &&
      !this.nodes[y][x].visited &&
      this.nodes[y][x].isWalkable
    );
  }

  isInField(x, y) {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows;
  }

  isWalkable(x, y) {
    return this.nodes[y][x].isWalkable;
  }

  constructPath(node) {
    let path = [];
    do {
      path.push({x: node.x, y: node.y});
      node = node.prevNode;
    }
    while (node !== null);

    path.reverse();
    return path;  
  }
}