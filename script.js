var nodoIni = null;
var nodoMeta = null;
$(document).ready(function () {

    var tablero = $('#tablero');
    var inicio = $('#inicio');
    var meta = $('#meta');
    var prohibida = $('#prohibida');
    var limpiar = $('#limpiar');


    var inicioSelec = false;
    var metaSelec = false;
    var prohibidaSelec = false;

    $('#aplicar').on('click', (event) => {
        pintar_tablero($('#num_filas').val(), $('#num_columnas').val(), tablero);
    });

    inicio.on('click', function () {
        if (!inicioSelec) {
            meta.prop('disabled', true)
            prohibida.prop('disabled', true)
            inicioSelec = true;
            inicio.removeClass('opacity-50')
        }
        else {
            meta.prop('disabled', false)
            prohibida.prop('disabled', false)
            inicioSelec = false;
            inicio.addClass('opacity-50')
        }
    })

    meta.on('click', function () {
        if (!metaSelec) {
            inicio.prop('disabled', true)
            prohibida.prop('disabled', true)
            metaSelec = true;
            meta.removeClass('opacity-50')
        }
        else {
            inicio.prop('disabled', false)
            prohibida.prop('disabled', false)
            metaSelec = false;
            meta.addClass('opacity-50')
        }
    })

    prohibida.on('click', function () {
        if (!prohibidaSelec) {
            inicio.prop('disabled', true)
            meta.prop('disabled', true)
            prohibidaSelec = true
            prohibida.removeClass('opacity-50')


        }
        else {
            inicio.prop('disabled', false)
            meta.prop('disabled', false)
            prohibidaSelec = false
            prohibida.addClass('opacity-50')



        }
    })

    limpiar.on('click', function () {
        tablero.empty()
        inicioSelec = false;
        metaSelec = false;
        prohibidaSelec = false;
        nodoIni = null;
        nodoMeta = null;
    })

    $('table').on('click', 'td', function () {
        // Código para el inicio
        if (inicioSelec && !nodoIni) {
            console.log("Poniendo inicio")
            $(this).addClass('bg-primary').addClass('start')
            nodoIni = {
                x: parseInt($(this).attr('y')),
                y: parseInt($(this).attr('x')),
                g: 0
            };


        }
        else if ($(this).hasClass('bg-primary') && nodoIni) {
            nodoIni = null
            $(this).removeClass('bg-primary').removeClass('start')
        }

        // Código para la meta
        if (metaSelec && !nodoMeta) {
            inicio.attr('disabled')
            prohibida.attr('disabled')
            $(this).addClass('bg-success').addClass('end')
            nodoMeta = {
                x: parseInt($(this).attr('y')),
                y: parseInt($(this).attr('x'))
            };

            console.log(nodoMeta)

        }
        else if ($(this).hasClass('bg-success') && nodoMeta) {
            nodoMeta = null
            $(this).removeClass('bg-success').removeClass('end')
            console.log(nodoMeta)
        }

        // Codigo para las prohibidas
        if (prohibidaSelec) {

            $(this).toggleClass('bg-danger').toggleClass('obstacle')
        }
    })


});

$('#calcular').on('click', function () {
    algoritmoAEstrella(nodoIni, nodoMeta)
});

function pintar_tablero(filas, columnas, tablero) {
    tablero.empty()
    for (let f = 0; f < filas; f++) {
        var tr = $('<tr>');
        for (let c = 0; c < columnas; c++) {
            coord = f + "," + (c)
            tr.append($('<td>').attr('x', c).attr('y', f).addClass(coord).removeClass('bg-primary'));
        }
        tablero.append(tr);
    }
}

function algoritmoAEstrella(nodoIni, nodoMeta) {
    if (nodoIni !== null && nodoMeta !== null) {
        console.log('calculando')
        var abierta = [];
        var cerrada = [];

        // EL primer nodo abierto es el nodoIni
        abierta.push(nodoIni)
        var matrix = getMatrix();
        var encontrada = false
        var error = false;

        do {
            if (abierta.length === 0) {
                error = true
                alert("No hay camino posible")
            }
            else {

                // Saco el primero de abierta porque siempre va a ser el menor 
                var nodoActual = abierta.pop()
                cerrada.push(nodoActual)

                // Empiezo a evaluar ese nodo
                if (nodoActual.status === 'end') {
                    console.log('Final encontrado')
                    encontrada = true
                    // Pinto el camino, que no lo se hasta que he llegado al final, pero lo tengo en cerrada
                    console.log(cerrada)


                    var end = false;
                    var search = nodoActual;
                    while (!end) {

                        if (search.parent === undefined) {
                            end = true;
                        } else if (search.parent.status !== 'start') {

                            var celda = $('td[x="' + search.parent.y + '"][y="' + search.parent.x + '"]');
                            if (!celda.attr('class').includes('start')) {
                                celda.addClass('bg-secondary')
                            }
                            search = search.parent;



                        }
                    }

                    /*
                    cerrada.forEach(node => {
                        clase_coord = "." + node.x + "," + node.y
                        console.log(clase_coord)
                        
                        var celda = $('td[x="' + node.x + '"][y="' + node.y + '"]');
                        celda.addClass('bg-secondary')
                    });*/


                } else {
                    // Si no he llegado al final, exploro sus adyacentes
                    var ady = neighbour(matrix, nodoActual)

                    for (var i = 0; i < ady.length; i++) {
                        var neig = ady[i]
                        // g -> coste de desplazamiento acumulado: ese + tofdo lo que ha hecho antes
                        // h -> distancia a la meta (pitágoras)
                        // f -> g + h

                        if (!abierta.includes(neig) && !cerrada.includes(neig) && neig.status != 'start') {
                            neig.parent = nodoActual;
                            neig.h = euclidean(neig, nodoMeta);
                            neig.g = Number(calculateG(neig, neig.parent.g));
                            // f(x) = g(x) + h(x)
                            neig.f = neig.g + neig.h;
                            abierta.push(neig);
                        } /*else if (abierta.includes(neig) && !cerrada.includes(neig) && neig.status != "start") {
                            var newG = calculateG(neig, neig.parent.g);
                            var newH = euclidean(neig, nodoMeta);
                            var newF = newG + newH;
                            if (newF < neig.f) {
                                neig.f = newF;
                                neig.h = newH;
                                neig.g = newG;
                                neig.parent = currentNode;
                            }
                        }*/
                    }

                    /* Como de abierta tengo que sacar el de menor f, los ordeno para que el primero sea
                    el que tenga menor f y sacarlo como una cola*/
                    abierta.sort(function (obj1, obj2) {
                        // first f(x) less than the previous
                        return obj1.g - obj2.g;
                    });
                    abierta.reverse();
                }
            }

        } while (!encontrada && !error)

    } else {
        alert("Introduce un inicio y un final")
    }
}

function getMatrix() {

    let numRows = $("tr").length
    let numColumns = ($($("tr")[0]).children("td").length)
    let matrix = [];

    for (var i = 0; i < numRows; i++) {
        matrix[i] = [];
        for (var j = 0; j < numColumns; j++) {
            if ($($($("tr")[i]).children("td")[j]).hasClass("start")) {

                matrix[i][j] = {
                    status: "start",
                    x: i,
                    y: j,
                    parent: null,
                    f: 0,
                    g: 0,
                    h: 0
                }
                //startNodeMatrix.x = i;
                //startNodeMatrix.y = j;
            } else if ($($($("tr")[i]).children("td")[j]).hasClass("end")) {
                matrix[i][j] = {
                    status: "end",
                    x: i,
                    y: j,
                    parent: null,
                    f: 0,
                    g: 0,
                    h: 0
                }
                //endNodeMatrix.x = i;
                //endNodeMatrix.y = j;
            } else if ($($($("tr")[i]).children("td")[j]).hasClass("obstacle")) {
                matrix[i][j] = {
                    status: "obstacle",
                    x: i,
                    y: j,
                    parent: null,
                    f: 0,
                    g: 0,
                    h: 0
                }
            } else {
                matrix[i][j] = {
                    status: "free",
                    x: i,
                    y: j,
                    parent: null,
                    f: 0,
                    g: 0,
                    h: 0
                }
            }
        }
    }
    return matrix;
}


// Dada mi matriz y un nodo devuelve sus vecinos
function neighbour(matrix, node) {

    var ady = [];

    var x = parseInt(node.x);
    var y = parseInt(node.y);

    // West
    if (matrix[x - 1] && matrix[x - 1][y]) {
        if (matrix[x - 1][y].status != "obstacle") {
            ady.push(matrix[x - 1][y]);
        }
    }

    // East
    if (matrix[x + 1] && matrix[x + 1][y]) {
        if (matrix[x + 1][y].status != "obstacle") {
            ady.push(matrix[x + 1][y]);
        }
    }

    // North
    if (matrix[x] && matrix[x][y - 1]) {
        if (matrix[x][y - 1].status != "obstacle") {
            ady.push(matrix[x][y - 1]);
        }
    }

    // South
    if (matrix[x] && matrix[x][y + 1]) {
        if (matrix[x][y + 1].status != "obstacle") {
            ady.push(matrix[x][y + 1]);
        }
    }

    // Northwest
    if (matrix[x - 1] && matrix[x - 1][y - 1]) {
        if (matrix[x - 1][y - 1].status != "obstacle") {
            ady.push(matrix[x - 1][y - 1]);
            ady[ady.length - 1].isDiagonal = true;
        }
    }

    // Northheast
    if (matrix[x + 1] && matrix[x + 1][y - 1]) {
        if (matrix[x + 1][y - 1].status != "obstacle") {
            ady.push(matrix[x + 1][y - 1]);
            ady[ady.length - 1].isDiagonal = true;
        }
    }

    // Southwest
    if (matrix[x - 1] && matrix[x - 1][y + 1]) {
        if (matrix[x - 1][y + 1].status != "obstacle") {
            ady.push(matrix[x - 1][y + 1]);
            ady[ady.length - 1].isDiagonal = true;
        }
    }

    // Southeast
    if (matrix[x + 1] && matrix[x + 1][y + 1]) {
        if (matrix[x + 1][y + 1].status != "obstacle") {
            ady.push(matrix[x + 1][y + 1]);
            ady[ady.length - 1].isDiagonal = true;
        }
    }

    // --------------------------------

    return ady;

}

// 
function calculateG(node, lastG) {
    return node.isDiagonal ? lastG + Math.sqrt(2) : lastG + 1;
}

function euclidean(pos0, endNodeMatrix) {
    var d1 = Math.pow((endNodeMatrix.x - pos0.x), 2);
    var d2 = Math.pow((endNodeMatrix.y - pos0.y), 2);
    return Math.sqrt(d1 + d2);
}