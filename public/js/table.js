$(document).ready(function() {

    $('#table thead tr').clone(true).appendTo( '#table thead' );
    $('#table thead tr:eq(1) th').each( function (i) {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search" />' );
 
        $( 'input', this ).on( 'keyup change', function () {
            if ( table.column(i).search() !== this.value ) {
                table
                    .column(i)
                    .search( this.value )
                    .draw();
            }
        } );
    } );
 
    var table = $('#table').DataTable( {
        orderCellsTop: true,
        fixedHeader: true
    } );
    
} );