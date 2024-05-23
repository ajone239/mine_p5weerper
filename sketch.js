const width = 600
const height = 600
const size = 30

let grid

function setup() {
  createCanvas(width, height)

  grid = new Grid(size, width, height)
}

function draw() {
  background(0);

  grid.show()
}

function mousePressed() {
  let x = floor(mouseX / size)
  let y = floor(mouseY / size)

  grid.grid[x][y].hidden = false
}

class Grid {
  constructor(size, width, height) {
    this.square_size = size
    this.width_in_squares = int(width / size)
    this.height_in_squares = int(height / size)

    this.grid = new Array(this.width_in_squares)

    for (let i = 0; i < this.width_in_squares; i++) {
      this.grid[i] = new Array(this.height_in_squares)
      for (let j = 0; j < this.height_in_squares; j++) {
        this.grid[i][j] = new Square()
      }
    }
  }

  show() {
    stroke(100)

    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let x = i * this.square_size
        let y = j * this.square_size

        let square = this.grid[i][j]

        if (square.hidden) {
          fill(0, 50, 0)
        } else {
          fill(200)
        }

        rect(x, y, this.square_size, this.square_size)
      }
    }
  }
}

class Square {
  constructor() {
    this.hidden = true
  }
}
