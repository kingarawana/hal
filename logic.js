var DIR;
(function (DIR) {
    DIR[DIR["top"] = 0] = "top";
    DIR[DIR["left"] = 1] = "left";
    DIR[DIR["right"] = 2] = "right";
    DIR[DIR["bottom"] = 3] = "bottom";
})(DIR || (DIR = {}));
var convertDirToString = function (dir) {
    switch (dir) {
        case DIR.bottom:
            return 'bottom';
        case DIR.top:
            return 'top';
        case DIR.right:
            return 'right';
        case DIR.left:
            return 'left';
            return 'Unknown';
    }
};
var directions = [
    [1, 0],
    [0, 1],
    [0, -1],
    [-1, 0],
];
var LetterIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var NumberIndex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];
var createAllLinesFromCell = function (col, row) {
    var firstLetter = LetterIndex[row];
    var secondLetter = LetterIndex[row + 1];
    var firstNumber = NumberIndex[col];
    var secondNumber = NumberIndex[col + 1];
    var topLine = "".concat(firstLetter + firstNumber, ",").concat(firstLetter).concat(secondNumber);
    var rightLine = "".concat(firstLetter + secondNumber, ",").concat(secondLetter).concat(secondNumber);
    var bottomLine = "".concat(secondLetter + firstNumber, ",").concat(secondLetter).concat(secondNumber);
    var leftLine = "".concat(firstLetter + firstNumber, ",").concat(secondLetter).concat(firstNumber);
    return [topLine, rightLine, bottomLine, leftLine];
};
var getLine = function (lines, H, W) {
    var grid = [];
    new Array(H).fill(0).forEach(function (_, index) {
        grid.push(new Array(W).fill(0));
    });
    var availableLines = Object.keys(lines).filter(function (key) { return lines[key]; });
    for (var row = 0; row < H; row++) {
        var _loop_1 = function (col) {
            var count = 0;
            createAllLinesFromCell(col, row).forEach(function (line) {
                if (lines[line] === false) {
                    count++;
                }
            });
            grid[row][col] = 4 - count;
        };
        for (var col = 0; col < W; col++) {
            _loop_1(col);
        }
    }
    var dfsDirections = [
        [0, 1],
        [1, 0],
    ];
    var dfs = function (col, row, count, _grid) {
        if (col === W || row == H)
            return;
        if (grid[row][col] > 2) {
            return;
        }
        if (grid[row][col] === 2) {
            count[0]++;
            grid[row][col] = -2;
            _grid[row][col] = count;
        }
        for (var i = 0; i < dfsDirections.length; i++) {
            var dir = dfsDirections[i];
            dfs(col + dir[0], row + dir[1], count, _grid);
        }
    };
    var convertCellAndDirToLine = function (cell, dir) {
        var row = cell[1];
        var col = cell[0];
        var firstLetter = LetterIndex[row];
        var secondLetter = LetterIndex[row + 1];
        var firstNumber = NumberIndex[col];
        var secondNumber = NumberIndex[col + 1];
        var topLine = "".concat(firstLetter + firstNumber, ",").concat(firstLetter).concat(secondNumber);
        var rightLine = "".concat(firstLetter + secondNumber, ",").concat(secondLetter).concat(secondNumber);
        var bottomLine = "".concat(secondLetter + firstNumber, ",").concat(secondLetter).concat(secondNumber);
        var leftLine = "".concat(firstLetter + firstNumber, ",").concat(secondLetter).concat(firstNumber);
        switch (dir) {
            case DIR.left:
                return leftLine;
            case DIR.right:
                return rightLine;
            case DIR.top:
                return topLine;
            case DIR.bottom:
                return bottomLine;
        }
    };
    var getDirFromCellAndLine = function (cell, line) {
        var dirLines = [DIR.top, DIR.right, DIR.bottom, DIR.left].map(function (dir) { return convertCellAndDirToLine(cell, dir); });
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
        return DIR.top;
    };
    var getOpenCellLines = function (col, row) {
        return createAllLinesFromCell(col, row).filter(function (line) { return !!availableLines.find(function (aLine) { return line === aLine; }); });
    };
    var getOpenCellIndexFromCellOpenWalls = function (col, row) {
        var openCellLines = getOpenCellLines(col, row);
        var openDirs = openCellLines.map(function (line) { return getDirFromCellAndLine([col, row], line); });
        return openDirs.map(function (dir) {
            switch (dir) {
                case DIR.top:
                    return [col, row - 1];
                case DIR.bottom:
                    return [col, row + 1];
                case DIR.left:
                    return [col - 1, row];
                case DIR.right:
                    return [col + 1, row];
            }
            return [col, row];
        });
    };
    var search = function (nextCellsToCheck, count, _grid) {
        while (nextCellsToCheck.length) {
            var _a = nextCellsToCheck.pop(), col = _a[0], row = _a[1];
            if (col === W || row == H || col < 0 || row < 0)
                continue;
            if (grid[row][col] > 2) {
                continue;
            }
            if (grid[row][col] === 2) {
                count[0]++;
                grid[row][col] = -2;
                _grid[row][col] = count;
                var openCells = getOpenCellIndexFromCellOpenWalls(col, row);
                openCells.forEach(function (cell) { return nextCellsToCheck.push(cell); });
            }
        }
    };
    var grid2 = [];
    new Array(H).fill(0).forEach(function (_, index) {
        grid2.push(new Array(W));
    });
    for (var row = 0; row < H; row++) {
        for (var col = 0; col < W; col++) {
            var counter = [0];
            search([[col, row]], counter, grid2);
        }
    }
    var indexesOfAllOnes = [];
    for (var row = 0; row < H; row++) {
        for (var col = 0; col < W; col++) {
            if (grid[row][col] === 1) {
                indexesOfAllOnes.push([col, row]);
            }
        }
    }
    var indexesOfAllTwos = [];
    for (var row = 0; row < H; row++) {
        for (var col = 0; col < W; col++) {
            if (grid[row][col] === -2) {
                indexesOfAllTwos.push([col, row]);
            }
        }
    }
    var getDir = function (dir) {
        if (dir[0] == directions[0][0] && dir[1] == directions[0][1]) {
            return DIR.right;
        }
        if (dir[0] == directions[1][0] && dir[1] == directions[1][1]) {
            return DIR.bottom;
        }
        if (dir[0] == directions[2][0] && dir[1] == directions[2][1]) {
            return DIR.top;
        }
        if (dir[0] == directions[3][0] && dir[1] == directions[3][1]) {
            return DIR.left;
        }
        return DIR.top;
    };
    var max = { val: -1, dir: getDir(directions[0]), originCell: [0, 0] };
    indexesOfAllOnes.forEach(function (indexes) {
        var col = indexes[0];
        var row = indexes[1];
        var openLine = createAllLinesFromCell(col, row).filter(function (line) { return lines[line] === true; })[0];
        var openDir = getDirFromCellAndLine([col, row], openLine);
        var dir;
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
        var nextCol = col + dir[0];
        var nextRow = row + dir[1];
        if (nextRow > -1 && nextCol > -1 && nextRow < H && nextCol < W) {
            var val = grid2[nextRow][nextCol];
            if (val) {
                if (val[0] > max.val) {
                    max = { val: val[0], dir: getDir(dir), originCell: [col, row] };
                }
            }
        }
        if (max.val === -1) {
            max = { val: 0, dir: getDir(dir), originCell: [col, row] };
        }
    });
    var line = availableLines[0];
    if (max.val > -1) {
        line = convertCellAndDirToLine(max.originCell, max.dir);
    }
    else if (indexesOfAllOnes.length) {
        var first = indexesOfAllOnes[0];
        var cellLines = createAllLinesFromCell(first[0], first[1]);
        var usedLines_1 = new Set(Object.keys(lines).filter(function (key) { return !lines[key]; }));
        return cellLines.filter(function (line) { return !usedLines_1.has(line); })[0];
    }
    else {
        var linesToAvoid_1 = indexesOfAllTwos.reduce(function (accum, cell) {
            var lines = createAllLinesFromCell(cell[0], cell[1]);
            lines.forEach(function (line) {
                accum.add(line);
            });
            return accum;
        }, new Set());
        var availLines = availableLines.filter(function (line) { return !linesToAvoid_1.has(line); });
        var randomIndex = Math.floor(Math.random() * availLines.length);
        line = availLines[randomIndex];
        if (!line) {
            var min = { val: Number.MAX_VALUE, cell: [0, 0] };
            for (var row = 0; row < H; row++) {
                for (var col = 0; col < W; col++) {
                    if (grid2[row][col] && grid2[row][col][0] < min.val) {
                        min = { val: grid2[row][col][0], cell: [col, row] };
                    }
                }
            }
            if (min.val !== Number.MAX_VALUE) {
                line = getOpenCellLines(min.cell[0], min.cell[1])[0];
            }
        }
    }
    return line;
};
