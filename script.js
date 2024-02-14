$(document).ready(function () {

    var tablero = $('#tablero');
    var inicio = $('#inicio');
    var meta = $('#meta');
    var prohibida = $('#prohibida');

    var inicioSelec = false;
    var metaSelec = false;
    var prohibidaSelec = false;
    

    var nodoIni = null;
    
    var nodoMeta = null;
    
    $('#aplicar').on('click', (event) => {
        pintar_tablero($('#num_filas').val(), $('#num_columnas').val(), tablero);
    });

    inicio.on('click', function(){
        if(!inicioSelec){
            meta.prop('disabled', true)
            prohibida.prop('disabled', true)
            inicioSelec = true;
            inicio.removeClass('opacity-50')
        }
        else{
            meta.prop('disabled', false)
            prohibida.prop('disabled', false)
            inicioSelec = false;
            inicio.addClass('opacity-50')
        }
    })

    meta.on('click', function(){
        if(!metaSelec){
            inicio.prop('disabled', true)
            prohibida.prop('disabled', true)
            metaSelec = true;
            meta.removeClass('opacity-50')
        }
        else{
            inicio.prop('disabled', false)
            prohibida.prop('disabled', false)
            metaSelec = false;
            meta.addClass('opacity-50')
        }
    })

    prohibida.on('click', function(){
        if(!prohibidaSelec){
            inicio.prop('disabled', true)
            meta.prop('disabled', true)
            prohibidaSelec = true
            prohibida.removeClass('opacity-50')
            

        }
        else{
            inicio.prop('disabled', false)
            meta.prop('disabled', false)
            prohibidaSelec = false
            prohibida.addClass('opacity-50')

        

        }
    })


    $('table').on('click', 'td', function() {
        // Código para el inicio
        if (inicioSelec && !nodoIni){
            
            $(this).addClass('bg-primary')
            nodoIni = {
                x: $(this).attr('x'),
                y: $(this).attr('y'),
                g: 0
            };

            console.log(nodoIni)
            
        }
        else if( $(this).hasClass('bg-primary') && nodoIni){
            nodoIni=null
            $(this).removeClass('bg-primary')
            console.log(nodoIni)
        }

        // Código para la meta
        if (metaSelec && !nodoMeta){
            inicio.attr('disabled')
            prohibida.attr('disabled')
            $(this).addClass('bg-success')
            nodoMeta = {
                x: $(this).attr('x'),
                y: $(this).attr('y')
            };

            console.log(nodoMeta)
            
        }
        else if( $(this).hasClass('bg-success') && nodoMeta){
            nodoMeta=null
            $(this).removeClass('bg-success')
            console.log(nodoMeta)
        }

        // Codigo para las prohibidas
        if (prohibidaSelec){
    
            $(this).toggleClass('bg-danger')            
        }
    })
});

function pintar_tablero(filas, columnas, tablero) {
    tablero.empty()
    for (let f = 0; f < filas; f++) {
        var tr = $('<tr>');
        for (let c = 0; c < columnas; c++) {
            tr.append($('<td>').attr('x', c).attr('y', filas - f - 1));
        }
        tablero.append(tr);
    }
}
