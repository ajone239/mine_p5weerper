const width = 600
const height = 600
const size = 15

let grid

function setup() {
  createCanvas(width, height)

  grid = new Grid(size, width, height)
}

function draw() {
  background(0);

  grid.show()
}

class Grid {
  constructor(size, width, height) {
    this.square_size = size
    this.width_in_squares = int(width / size)
    this.height_in_squares = int(height / size)

    this.grid = new Array(this.width_in_squares)

    for (let i = 0; i < this.width_in_squares; i++) {
      this.grid[i] = new Array(this.height_in_squares)
    }
  }

  show() {
    stroke(100)
    fill(50)

    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let x = i * this.width_in_squares
        let y = j * this.height_in_squares
        rect(x, y, this.width_in_squares, this.height_in_squares)
      }
    }
  }
}
