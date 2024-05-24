const width = 600
const height = 600
const size = 30
const bomb_count = 50

let grid
let game_over

function setup() {
  createCanvas(width, height)

  grid = new Grid(size, width, height)
  grid.make_bombs()
  grid.count_all_bombs()

  game_over = false
}

function draw() {
  background(0);
  grid.show()
  grid.unhide_connected_zeroes()

  let won = grid.has_won()

  if (game_over || won) {
    message = won ? "Winner!" : "Game Over!"
    stroke(0)
    fill(255)
    textSize(50)
    textAlign(CENTER);
    text(message, width / 2, height / 2)
    noLoop()
  }
}

function mousePressed() {
  if (game_over) {
    return
  }

  let x = floor(mouseX / size)
  let y = floor(mouseY / size)

  let square = grid.grid[x][y]

  if (mouseButton === RIGHT && square.hidden) {
    square.flag()
    return
  }

  if (square.flagged) {
    return
  }

  square.unhide()

  if (square.is_bomb) {
    game_over = true
    grid.unhide_all_bombs()
  }
}

function keyPressed() {
  if (key == ' ') {
    game_over = false
    setup()
    loop()
  }
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
    stroke(50)

    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let x = i * this.square_size
        let y = j * this.square_size

        let square = this.grid[i][j]
        square.show(x, y, this.square_size)
      }
    }
  }

  make_bombs() {
    for (let i = 0; i < bomb_count; i++) {
      let x = int(floor(random(this.width_in_squares)))
      let y = int(floor(random(this.height_in_squares)))

      let square = this.grid[x][y]
      square.make_bomb()
    }
  }

  has_won() {
    let won = true
    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let square = this.grid[i][j]

        won &= square.is_bomb || !square.hidden
      }
    }
    return won
  }

  count_all_bombs() {
    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let square = this.grid[i][j]

        if (square.is_bomb) {
          continue
        }
        let count = this.count_surrounding_bombs(i, j)
        square.bombs_near = count
      }
    }
  }

  count_surrounding_bombs(i, j) {
    let count = 0
    for (let k = -1; k <= 1; k++) {
      for (let l = -1; l <= 1; l++) {
        if (k == 0 && l == 0) {
          continue;
        }
        let x = i + k
        let y = j + l

        if (!this.is_in_bounds(x, y)) {
          continue;
        }
        if (this.grid[x][y].is_bomb) {
          count++
        }
      }
    }
    return count
  }

  unhide_connected_zeroes() {
    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let square = this.grid[i][j]

        if (square.hidden || square.bombs_near > 0) {
          continue;
        }

        this.unhide_neighbors(i, j)
      }
    }
  }

  unhide_neighbors(i, j) {
    for (let k = -1; k <= 1; k++) {
      for (let l = -1; l <= 1; l++) {
        if (k == 0 && l == 0) {
          continue;
        }
        let x = i + k
        let y = j + l

        if (!this.is_in_bounds(x, y)) {
          continue;
        }

        let neighbor = this.grid[x][y]

        if (
          (
            neighbor.bombs_near == 0 ||
            neighbor.bombs_near == 1
          ) &&
          !neighbor.is_bomb &&
          !neighbor.flagged
        ) {
          neighbor.unhide()
        }
      }
    }
  }

  unhide_all_bombs() {
    for (let i = 0; i < this.width_in_squares; i++) {
      for (let j = 0; j < this.height_in_squares; j++) {
        let square = this.grid[i][j]

        if (square.is_bomb) {
          square.hidden = false
        }
      }
    }
  }

  is_in_bounds(x, y) {
    return x >= 0 &&
      y >= 0 &&
      x < this.width_in_squares &&
      y < this.height_in_squares
  }
}

class Square {
  constructor() {
    this.hidden = true
    this.flagged = false
    this.is_bomb = false
    this.bombs_near = 0
  }

  unhide() {
    this.hidden = false
  }

  flag() {
    this.flagged ^= true
  }

  make_bomb() {
    this.is_bomb = true
  }

  show(x, y, square_size) {
    fill(100)
    rect(x, y, square_size, square_size)

    if (this.flagged) {
      fill(0, 200, 50)
      rect(x, y, square_size, square_size)
      return
    }

    if (this.hidden) {
      return
    }

    fill(200)
    rect(x, y, square_size, square_size)

    if (this.is_bomb) {
      fill(200, 0, 50)
      ellipse(
        x + (size / 2),
        y + (size / 2),
        square_size
      )
      return
    }

    fill(0)
    text(
      `${this.bombs_near}`,
      x + (size / 2),
      y + (size / 2)
    )
  }
}
