var editor; // use a global for the submit and return data rendering in the examples
 
$(document).ready(function() {
    editor = new $.fn.dataTable.Editor( {
        ajax: "/insert",
        table: "#table",
        fields: [ {
                label: "Mall Name:",
                name: "mallname"
            }, {
                label: "Store List:",
                name: "stores"
            }, {
                label: "Floor:",
                name: "floor"
            }, {
                label: "Category:",
                name: "category"
            }, {
                label: "Distribution:",
                name: "dist"
            }, {
                label: "Area in Sq.Ft:",
                name: "area",
                type: "number"
            }, {
                label: "Circle:",
                name: "circle"
            }, {
                label: "Address:",
                name: "address"
            }
        ]
    } );
 
    // Activate an inline edit on click of a table cell
    $('#table').on( 'click', 'tbody td:not(:first-child)', function (e) {
        editor.inline( this );
    } );
 
    $('#table').DataTable( {
        dom: "Bfrtip",
        ajax: "../php/staff.php",
        order: [[ 1, 'asc' ]],
        columns: [
            {
                data: null,
                defaultContent: '',
                className: 'select-checkbox',
                orderable: false
            },
            { data: "first_name" },
            { data: "last_name" },
            { data: "position" },
            { data: "office" },
            { data: "start_date" },
            { data: "salary", render: $.fn.dataTable.render.number( ',', '.', 0, '$' ) }
        ],
        select: {
            style:    'os',
            selector: 'td:first-child'
        },
        buttons: [
            { extend: "create", editor: editor },
            { extend: "edit",   editor: editor },
            { extend: "remove", editor: editor }
        ]
    } );
} );