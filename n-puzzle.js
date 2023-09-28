//  Proyecto 1 - N-Puzzle Game
//  Samuel Valverde Arguedas & Erick Kauffmann Porcar
//  Instituto Tecnológico de Costa Rica, sede Cartago
//  Análisis de Algoritmos - GR 03
//  II Semestre, 2023

function crearMatriz(dimen)
{
    var puzzle = new Array();
    var cont = 1;
    for (var i = 0; i < dimen; i++)
    {
      var fila = new Array();
      puzzle.push(fila);
      for (var j = 0; j < dimen; j++)
      {
    	fila.push(cont);
        cont += 1;
      }
    }
    puzzle[dimen-1][dimen-1] = 0;
    return puzzle;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function desordenarMatriz(puzzle, numMovimientosRandom)
{
    for(var k = 0; k < numMovimientosRandom; k++)
    {
        mover = getRandomInt(4) + 1;
        var posX = -1;
        var posY = -1;
        var dimen = puzzle.length;
        for (var i = 0; i < dimen; i++) {

            for (var j = 0; j < dimen; j++) 
            {
                if (puzzle[i][j] == 0) 
                {
                    posY = i;
                    posX = j;
                    break;
                }
            }
            if (posY != -1 && posX != -1) 
            {
                break;
            }
        }
        if (posY != -1 && posX != -1) 
        {
            if (mover == 1) 
            {//izquierda
                if (posX > 0) 
                {
                    puzzle[posY][posX] = puzzle[posY][posX-1]
                    puzzle[posY][posX-1] = 0;
                } 
            }
            if (mover == 2) 
            {//arriba
                if (posY > 0) 
                {
                    puzzle[posY][posX] = puzzle[posY-1][posX];
                    puzzle[posY-1][posX] = 0;
                } 
            }
            if (mover == 3) 
            {//derecha
                if (posX < dimen-1) 
                {
                    puzzle[posY][posX] = puzzle[posY][posX+1];
                    puzzle[posY][posX+1] = 0;
                } 
            }
            if (mover == 4) 
            {//abajo
                if (posY < dimen-1 ) 
                {
                    puzzle[posY][posX] = puzzle[posY+1][posX];
                    puzzle[posY+1][posX] = 0;
                } 
            }
        }
    }
}

function dibujarPuzzle(puzzle, path, cantidadMovimientos) {
    var strHtml = "<table>";
    var estilo = "";
    var dimen = puzzle.length;
    for (var i = 0; i < dimen; i++)
    {
      strHtml += "<tr>";
      var fila = puzzle[i];
      for (var j = 0; j < dimen; j++)
      {
	if (fila[j] == 0) 
	{
    	  estilo = "color_red";
	}
	else {
    	  estilo = "color_blue";
	}
	strHtml += "<td class='cell_puzzle " + estilo + "' id='cel_" + i + "_" + j + "'>";
	if (fila[j] != 0) 
	{
    	  strHtml += "" + fila[j];
	}

      	strHtml += "</td>";
      }
      strHtml += "</tr>";
    }
    strHtml += "</table>";
    var divPuzzle=$("#divPuzzle");
    //divPuzzle.innerHTML = strHtml;
    divPuzzle.html(strHtml);
    var numeroMovimientos = $('#PuzzleCantidadMovimientos');
    numeroMovimientos.html(cantidadMovimientos);
    var infoPuzzle = $("#PuzzleInfo");
    infoPuzzle.html(path + " ");
}

//Class puzzle
//#############################################################################################

class PuzzleInfo {
	constructor(estado, nivel, costo, valorHeuristico, puzzlePadre, path) {
		this.estado = new Array();
		for (var fila = 0; fila < estado.length; fila++) {
			this.estado.push(new Array());
			for (var col = 0; col < estado.length; col++) {
				this.estado[fila].push(0);
			}
		}
		//this.estado = [[0,0,0],[0,0,0],[0,0,0]];
		for (var fila = 0; fila < estado.length; fila++) {
			for (var col = 0; col < estado.length; col++) {
				this.estado[fila][col] = estado[fila][col];
			}
		}
		this.nivel = nivel;
		this.costo = costo;
		this.valorHeuristico = valorHeuristico;
		this.puzzlePadre = puzzlePadre;
		this.path = new Array();
		for (var i = 0; i < path.length; i++) {
			this.path.push(path[i]);
		}
	}


	clonarPuzzle() {
		var newPuzzle = new PuzzleInfo(this.estado, this.nivel, this.costo, 0, this, this.path );
		return newPuzzle;
	}

	ManhattanDistance(estadoMeta)
	{
		var distance = 0;
		for (var fila = 0; fila < estadoMeta.length; fila++)
		{
			for (var col = 0; col < estadoMeta.length; col++)
			{
				var value = this.estado[fila][col];
				if (value != 0)
				{
					var found = false;
					for (var filaG = 0; filaG < estadoMeta.length; filaG++)
					{
						for (var colG = 0; colG < estadoMeta.length; colG++)
						{
							if (estadoMeta[filaG][colG] == value)
							{
								distance += Math.abs(fila - filaG) + Math.abs(col - colG);
								found = true;
								break;
							}
						}
						if (found) {
							break;
						}
					}
				}
			}
		}
		return distance;
	}


	F() {
		return this.costo + this.valorHeuristico;
	}
	
	esIgual(estado) {
		var igual = true;
		for (var fila = 0; fila < estado.length; fila++)
		{
			for (var col = 0; col < estado.length; col++)
			{
				if (this.estado[fila][col] != estado[fila][col]) {
					igual = false;
					break;
				}
			}
			if (!igual) {
				break;
			}
		}
		return igual;
	}
	
	existePreviamente(newpuzzle) {
		var result = false;
		var puzzle = newpuzzle.puzzlePadre;
		while (puzzle != null) {
			if (puzzle.esIgual(newpuzzle.estado)) {
				result = true;
				break;
			}
			puzzle = puzzle.puzzlePadre;
		}
		return result;
	}

	buscarPosicion0() {
		var result = [-1,-1];
		for (var fila = 0; fila < this.estado.length; fila++) {
			for (var col = 0; col < this.estado.length; col++) {
				if (this.estado[fila][col] == 0) {
					result = [fila, col];
				}
			}
		}
		return result;
	}

	obtenerSiguientesPuzzles(meta) {
		var posicion0 = this.buscarPosicion0();
		var buscarF = posicion0[0];
		var buscarC = posicion0[1];
		var nuevosPuzzles = new Array();
		if (buscarF > -1 && buscarC > -1) {
			if (buscarF > 0) {
				//intercambiarlo con el de arriba
				var newPuzzle = this.clonarPuzzle();
				newPuzzle.estado[buscarF][buscarC] = newPuzzle.estado[buscarF-1][buscarC];
				newPuzzle.estado[buscarF-1][buscarC] = 0;
				newPuzzle.nivel += 1;
				if (!this.existePreviamente(newPuzzle)) {
					newPuzzle.costo += 1;
					newPuzzle.valorHeuristico = newPuzzle.ManhattanDistance(meta);
					newPuzzle.path.push("arriba");
					nuevosPuzzles.push(newPuzzle);
				}
			}
			if (buscarC > 0) {
				//intercambiarlo con el de a la izquierda
				var newPuzzle = this.clonarPuzzle();
				newPuzzle.estado[buscarF][buscarC] = newPuzzle.estado[buscarF][buscarC-1];
				newPuzzle.estado[buscarF][buscarC-1] = 0;
				newPuzzle.nivel += 1;
				if (!this.existePreviamente(newPuzzle)) {
					newPuzzle.costo += 1;
					newPuzzle.valorHeuristico = newPuzzle.ManhattanDistance(meta);
					newPuzzle.path.push("izquierda");
					nuevosPuzzles.push(newPuzzle);
				}
			}
			if (buscarC < this.estado.length-1) {
				//intercambiarlo con el de a la derecha
				var newPuzzle = this.clonarPuzzle();
				newPuzzle.estado[buscarF][buscarC] = newPuzzle.estado[buscarF][buscarC+1];
				newPuzzle.estado[buscarF][buscarC+1] = 0;
				newPuzzle.nivel += 1;
				if (!this.existePreviamente(newPuzzle)) {
					newPuzzle.costo += 1;
					newPuzzle.valorHeuristico = newPuzzle.ManhattanDistance(meta);
					newPuzzle.path.push("derecha");
					nuevosPuzzles.push(newPuzzle);
				}
			}
			if (buscarF < this.estado.length-1) {
				//intercambiarlo con el de a la abajo
				var newPuzzle = this.clonarPuzzle();
				newPuzzle.estado[buscarF][buscarC] = newPuzzle.estado[buscarF+1][buscarC];
				newPuzzle.estado[buscarF+1][buscarC] = 0;
				newPuzzle.nivel += 1;
				if (!this.existePreviamente(newPuzzle)) {
					newPuzzle.costo += 1;
					newPuzzle.valorHeuristico = newPuzzle.ManhattanDistance(meta);
					newPuzzle.path.push("abajo");
					nuevosPuzzles.push(newPuzzle);
				}
			}
		}
		return nuevosPuzzles;
	}

	
}


//###############################################################################################




/***********************  INTERFAZ  ****************************/

function displaySolucion(solucion) {
	var puzzle = solucion;
    if(puzzle != null)
    {
        while (puzzle != null) {
            solucionCompleta.push(puzzle);
            puzzle = puzzle.puzzlePadre;
        }
        displayAllPuzzle();
    }
    else
    {
        elem = $("#PuzzleFinish");
		//elem.innerHTML = " FIN";
        elem.html('FIN: no se encontró solución');
    }
}

function displayAllPuzzle() {
	var puzzle = solucionCompleta.pop();
	var elem;
	
	if (puzzle != null) {
		dibujarPuzzle(puzzle.estado, puzzle.path, puzzle.costo);
		setTimeout(displayAllPuzzle, delay);
	}
	else {
		elem = $("#PuzzleFinish");
		//elem.innerHTML = " FIN";
        elem.html('FIN');
	}
}

/************************************************************/

//SOLUCION BACKTRACKING ############################################################################################

function ordenarPorF(puzzleLst) {
	var newPuzzleLst = new Array();
	var tmpLst = new Array();
	
	for (var i = 0;i < puzzleLst.length; i++) {
		tmpLst.push(puzzleLst[i]);
	}
	while (tmpLst.length > 0) {
		var posMin = -1;
		for(var i = 0; i < tmpLst.length; i++) {
			if (posMin == -1 || (tmpLst[i].F() < tmpLst[posMin].F()) ) {
				posMin = i;
			}
		}
		newPuzzleLst.push(tmpLst[posMin]);
		tmpLst.splice(posMin,1);
	}
	return newPuzzleLst;
}

function solucionarPuzzleBacktracking(puzzle, metaPuzzle, maxNivel) {
	if (puzzle.nivel < maxNivel) {
		if (puzzle.esIgual(metaPuzzle)) {
			return puzzle;
		}		
		else {
			var nuevosPuzzles = puzzle.obtenerSiguientesPuzzles(metaPuzzle);
			
			nuevosPuzzles = ordenarPorF(nuevosPuzzles);		
			
			for (var i = 0; i < nuevosPuzzles.length; i++) {
				var soluc = solucionarPuzzleBacktracking(nuevosPuzzles[i], metaPuzzle, maxNivel);
				if (soluc != null) {
					return soluc;
					break;
				}
			}
			return null;
		}
	}
	else {
		return null;
	}
}

function solucionarMejorPuzzleBacktracking(puzzle, metaPuzzle, maxNivel) {
	if (puzzle.nivel < maxNivel) {
		if (puzzle.esIgual(metaPuzzle)) {
			return puzzle;
		}		
		else {
			var nuevosPuzzles = puzzle.obtenerSiguientesPuzzles(metaPuzzle);
			
			//nuevosPuzzles = ordenarPorF(nuevosPuzzles);		
			
            var listaSoluciones = new Array();
			for (var i = 0; i < nuevosPuzzles.length; i++) {
				var soluc = solucionarMejorPuzzleBacktracking(nuevosPuzzles[i], metaPuzzle, maxNivel);
				if (soluc != null) {
                    listaSoluciones.push(soluc);
				}
			}
            var mejorSolucion = null;
            for(var j = 0; j < listaSoluciones.length; j++)
            {
                if(mejorSolucion != null)
                {
                    if(listaSoluciones[j].nivel < mejorSolucion.nivel)
                    {
                        mejorSolucion = listaSoluciones[j];
                    }
                }
                else
                {
                    mejorSolucion = listaSoluciones[j];
                }
            }
			return mejorSolucion;
		}
	}
	else {
		return null;
	}
}



//SOLUCION A*#################################################################################################

function solucionarPuzzleAEstrella(puzzle, meta) {
	var solucion = null;
	var listaPuzzles = new Array();
	var puzzleActual;
	var puzzlesProcesados = new Array();

	listaPuzzles.push(puzzle);
	
	while (listaPuzzles.length > 0)
	{
		puzzleActual = listaPuzzles[0];
		if (puzzleActual.esIgual(meta)) {
			solucion = puzzleActual;
			break;
		}
		
		listaPuzzles.splice(0,1);
        puzzlesProcesados.push(puzzleActual);
		
		var nuevosPuzzles = puzzleActual.obtenerSiguientesPuzzles(meta);
		for (var i = 0; i < nuevosPuzzles.length; i++) {
            var procesado = false;
            for(var j = 0; j < puzzlesProcesados.length; j++)
            {
                if(nuevosPuzzles[i].esIgual(puzzlesProcesados[j].estado))
                {
                    procesado = true;
                    break;
                }
            }
            if(!procesado)
            {
			    insertarOrdenado(listaPuzzles, nuevosPuzzles[i]);
            }
		}		
	}
	
	return solucion;
}


function insertarOrdenado(listaPuzzles, puzzle) {
	var i = 0;
	while (i < listaPuzzles.length && listaPuzzles[i].F() < puzzle.F()) {
		i += 1;
	}
	if (i >= listaPuzzles.length) {
		listaPuzzles.push(puzzle);
	}
	else {
		listaPuzzles.splice(i, 0, puzzle);
	}
}


//################################################################################################################


var delay = 1000;
//var numMovimientosRandom = 30;
var solucionCompleta;

//var maxNivel = 25;
//var dimension = 3;

function startPuzzle(maxNivel, dimension, desorden)
{
    var puzzleInicial = crearMatriz(dimension);
    desordenarMatriz(puzzleInicial, desorden);
    var metaPuzzle = crearMatriz(dimension);

    var puzzle = new PuzzleInfo(puzzleInicial, 0, 0, 0, null, []);

    dibujarPuzzle(puzzleInicial, puzzle.path, puzzle.costo);

    puzzle.valorHeuristico = puzzle.ManhattanDistance(metaPuzzle);

    setTimeout(function(){
        if(maxNivel != null)
        {
            //var solucion = solucionarPuzzleBacktracking(puzzle, metaPuzzle, maxNivel);
            var solucion = solucionarMejorPuzzleBacktracking(puzzle, metaPuzzle, maxNivel);
        }
        else
        {
            var solucion = solucionarPuzzleAEstrella(puzzle, metaPuzzle);
        }
        solucionCompleta = new Array();
        displaySolucion(solucion); 
    }, 2000);
    
}



$('#btnStartB').click(function(){
    var MaxNivel = $('#txtMaxNivel').val();
    var Dimension = $('#txtDimension').val();
    var Desorden = $('#txtMovimientosDesordenar').val();
    $('#PuzzleFinish').html('');
    $('#InfoAlgoritmo').html('EJECUTANDO CON BACKTRACKING');
    startPuzzle(MaxNivel, Dimension, Desorden);
})

$('#btnStartA').click(function(){
    var Dimension = $('#txtDimension').val();
    var Desorden = $('#txtMovimientosDesordenar').val();
    $('#PuzzleFinish').html('');
    $('#InfoAlgoritmo').html('EJECUTANDO CON A*');
    startPuzzle(null, Dimension, Desorden);
})
