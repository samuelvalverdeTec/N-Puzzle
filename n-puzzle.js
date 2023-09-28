//  Proyecto 1 - N-Puzzle Game
//  Samuel Valverde Arguedas & Erick Kauffmann Porcar
//  Instituto Tecnológico de Costa Rica, sede Cartago
//  Análisis de Algoritmos - GR 03
//  II Semestre, 2023

function createBoard(n) {
    var result = []
    for(var i = 0; i < n; i++) {
        result.push(new Array(n).fill(0))
    }
    return result
}

var board = createBoard(5)
console.log(board)