
enum DIR {
  top,
  left,
  right,
  bottom,
}

const convertDirToString = (dir: DIR) => {
  switch(dir){
    case DIR.bottom:
      return 'bottom'
    case DIR.top:
      return 'top'
    case DIR.right:
      return 'right'
    case DIR.left:
      return 'left'
    return 'Unknown'
  }
}

const directions = [
  [1, 0],
  [0, 1],
  [0, -1],
  [-1, 0],
]

const LetterIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const NumberIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26']

const createAllLinesFromCell = (col: number, row: number) => {
  const firstLetter = LetterIndex[row]
  const secondLetter = LetterIndex[row+1]

  const firstNumber = NumberIndex[col]
  const secondNumber = NumberIndex[col+1]

  const topLine = `${firstLetter+firstNumber},${firstLetter}${secondNumber}`
  const rightLine = `${firstLetter+secondNumber},${secondLetter}${secondNumber}`
  const bottomLine = `${secondLetter+firstNumber},${secondLetter}${secondNumber}`
  const leftLine = `${firstLetter+firstNumber},${secondLetter}${firstNumber}`
  return [topLine, rightLine, bottomLine, leftLine]
}

const getLine = (lines: Record<string, boolean | number>, H: number, W: number): string => {
  const grid: number[][] = []
  new Array(H).fill(0).forEach((_, index) => {
    grid.push(new Array(W).fill(0))
  })


  let availableLines = Object.keys(lines).filter(
    (key) => lines[key]
  );

  for(let row = 0; row < H; row++){
    for(let col = 0; col < W; col++){
      let count = 0
      createAllLinesFromCell(col, row).forEach((line) => {
        if(lines[line] === false){
          count++
        }
      })
      grid[row][col] = 4-count
    }
  }

  const dfsDirections = [
    [0, 1],
    [1, 0],
  ]
  const dfs = (col: number, row: number, count: number[], _grid: number[][][]) => {

    if(col === W || row == H) return

    if(grid[row][col] > 2){
      return
    }
    if(grid[row][col] === 2){
      count[0]++
      grid[row][col] = -2
      _grid[row][col] = count
    }

    for(let i = 0; i < dfsDirections.length; i++){
      const dir = dfsDirections[i]
      dfs(col+dir[0], row+dir[1], count, _grid)
    }
  }

  const convertCellAndDirToLine = (cell: number[], dir: DIR) => {
    const row = cell[1]
    const col = cell[0]
    const firstLetter = LetterIndex[row]
    const secondLetter = LetterIndex[row+1]

    const firstNumber = NumberIndex[col]
    const secondNumber = NumberIndex[col+1]

    const topLine = `${firstLetter+firstNumber},${firstLetter}${secondNumber}`
    const rightLine = `${firstLetter+secondNumber},${secondLetter}${secondNumber}`
    const bottomLine = `${secondLetter+firstNumber},${secondLetter}${secondNumber}`
    const leftLine = `${firstLetter+firstNumber},${secondLetter}${firstNumber}`

    switch(dir){
      case DIR.left:
        return leftLine
      case DIR.right:
        return rightLine
      case DIR.top:
        return topLine
      case DIR.bottom:
        return bottomLine
    }
  }

  const getDirFromCellAndLine = (cell: number[], line: string) => {
    const dirLines = [DIR.top, DIR.right, DIR.bottom, DIR.left].map((dir) => convertCellAndDirToLine(cell, dir))
    switch (line) {
      case dirLines[0]:
        return DIR.top;
      case dirLines[1]:
        return DIR.right;
      case dirLines[2]:
        return DIR.bottom;
      case dirLines[3]:
        return DIR.left;
    }
    return DIR.top
  }

  const getOpenCellLines = (col, row) => {
    return createAllLinesFromCell(col, row).filter((line) => !!availableLines.find((aLine) => line === aLine))
  }

  const getOpenCellIndexFromCellOpenWalls = (col, row): number[][] => {
    const openCellLines = getOpenCellLines(col, row)
    const openDirs = openCellLines.map((line) => getDirFromCellAndLine([col, row], line))
    return openDirs.map((dir) => {
      switch (dir){
        case DIR.top:
          return [col, row-1]
        case DIR.bottom:
          return [col, row+1]
        case DIR.left:
          return [col-1, row]
        case DIR.right:
          return [col+1, row]
      }
      return [col, row]
    })
  }

  const search = (nextCellsToCheck: number[][], count: number[], _grid: number[][][],) => {
    while(nextCellsToCheck.length){
      const [col, row] = nextCellsToCheck.pop()

      if(col === W || row == H || col < 0 || row < 0) continue

      if(grid[row][col] > 2){
        continue
      }
      if(grid[row][col] === 2){
        count[0]++
        grid[row][col] = -2
        _grid[row][col] = count

        const openCells = getOpenCellIndexFromCellOpenWalls(col, row)
        openCells.forEach((cell) => nextCellsToCheck.push(cell))
      }
    }
  }

  const grid2: number[][][] = []
  new Array(H).fill(0).forEach((_, index) => {
    grid2.push(new Array(W))
  })

  for(let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      const counter = [0]
      search([[col, row]], counter, grid2)
    }
  }

  const indexesOfAllOnes: number[][] = []
  for(let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      if(grid[row][col] === 1){
        indexesOfAllOnes.push([col, row])
      }
    }
  }

  const indexesOfAllTwos: number[][] = []
  for(let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      if(grid[row][col] === -2){
        indexesOfAllTwos.push([col, row])
      }
    }
  }

  const getDir = (dir: number[]): DIR => {
    if(dir[0] == directions[0][0] && dir[1] == directions[0][1]){
      return DIR.right
    }
    if(dir[0] == directions[1][0] && dir[1] == directions[1][1]){
      return DIR.bottom
    }
    if(dir[0] == directions[2][0] && dir[1] == directions[2][1]){
      return DIR.top
    }
    if(dir[0] == directions[3][0] && dir[1] == directions[3][1]){
      return DIR.left
    }
    return DIR.top
  }

  let max = {val: -1, dir: getDir(directions[0]), originCell: [0,0]}
  indexesOfAllOnes.forEach((indexes) => {
    const col = indexes[0]
    const row = indexes[1]

    const openLine = createAllLinesFromCell(col, row).filter((line) => lines[line] === true)[0]

    const openDir = getDirFromCellAndLine([col, row], openLine)

    let dir
    switch (openDir) {
      case DIR.right:
        dir = directions[0];
        break;
      case DIR.bottom:
        dir = directions[1];
        break;
      case DIR.top:
        dir = directions[2];
        break;
      case DIR.left:
        dir = directions[3];
        break;
    }

    const nextCol = col + dir[0]
    const nextRow = row + dir[1]

    if(nextRow > -1 && nextCol > -1 && nextRow < H && nextCol < W){
      const val = grid2[nextRow][nextCol]
      if(val){
        if(val[0] > max.val){
          max = {val: val[0], dir: getDir(dir), originCell: [col, row]}
        }
      }
    }

    if(max.val === -1){
      max = {val: 0, dir: getDir(dir), originCell: [col, row]}
    }
  })

  let line = availableLines[0]
  if(max.val > -1){
    line = convertCellAndDirToLine(max.originCell, max.dir)
  }else if(indexesOfAllOnes.length){

    const first = indexesOfAllOnes[0]
    const cellLines = createAllLinesFromCell(first[0], first[1])
    const usedLines = new Set(Object.keys(lines).filter(
      (key) => !lines[key]
    ));
    return cellLines.filter((line) => !usedLines.has(line))[0]
  }else{
    const linesToAvoid = indexesOfAllTwos.reduce<Set<string>>((accum, cell) => {
      const lines = createAllLinesFromCell(cell[0], cell[1])
      lines.forEach((line) => {
        accum.add(line)
      })
      return accum
    }, new Set<string>())
    const availLines = availableLines.filter((line) => !linesToAvoid.has(line))
    const randomIndex = Math.floor(Math.random() * availLines.length)
    line = availLines[randomIndex]
    if(!line){
      let min = {val: Number.MAX_VALUE, cell: [0,0]}
      for(let row = 0; row < H; row++){
        for(let col = 0; col < W; col++){
          if(grid2[row][col] && grid2[row][col][0] < min.val){
            min = {val: grid2[row][col][0], cell: [col, row]}
          }
        }
      }
      if(min.val !== Number.MAX_VALUE){
        line = getOpenCellLines(min.cell[0], min.cell[1])[0]
      }
    }
  }
  return line
}
