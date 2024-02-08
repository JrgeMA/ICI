$(document).ready(function () {

    var tablero = $('#tablero');
    $('#aplicar').on('click', (event) => {
        pintar_tablero($('#num_filas').val(), $('#num_columnas').val(), tablero);
    });

});

function pintar_tablero(filas, columnas, tablero) {
    for (let f = 0; f < filas; f++) {
        var tr = $('<tr>');
        for (let c = 0; c < columnas; c++) {
            tr.append($('<td>'));
        }
        tablero.append(tr);
    }
}
