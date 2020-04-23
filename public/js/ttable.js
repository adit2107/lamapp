const result = document.getElementById("results").innerHTML;

spandata = document.getElementById("results");
spandata.remove();

var editparams = {
values: true,
freetext: true,
allowEmpty: false,
verticalNavigation:"hybrid"
}

var rowindices = [];

var table = new Tabulator("#table", {
	//load row data from array
	layout: "fitColumns", //fit columns to width of table
	responsiveLayout: "hide", //hide columns that dont fit on the table
	tooltips: false, //show tool tips on cells
	addRowPos: "top", //when adding a new row, add it to the top of the table
	pagination: "local", //paginate the data
	paginationSize: 20, //allow 10 rows per page of data    
	resizableRows: true, //allow row order to be changed
	movableRows: true,
	initialSort: [ //set the initial sort order of the data
		{
			column: "name",
			dir: "asc"
		},
	],
	index: "serial",
	cellEdited: function (cell) {

		const updatedcelldata = {
			oldValue: cell.getOldValue(),
			newValue: cell.getValue(),
			cellId: cell.getRow().getData().serial,
			columnName: cell.getColumn().getField()
		}

		updateData(updatedcelldata);
	},
	rowSelected: function (row) {
		//row - row component for the selected row
		// const selectedRows = table.getSelectedRows();
		const selRowIndex = row.getIndex();
		rowindices.push(selRowIndex);

	},
	rowDeselected: function (row) {
		let rowDeIndex = row.getIndex();
		rowindices = rowindices.filter(item => item !== rowDeIndex);

	},
	validationFailed: function (cell, value, validators) {
		$('.toast').toast({
			delay: 2000
		});
		$('#validfailtoast').toast('show');

	},
	columns: [ //define the table columns
		{
			formatter: "rowSelection",
			align: "center",
			headerSort: false,
			width: 50
		},
		{
			title: "#",
			field: "serial",
			width: 50,
			headerFilter: "input"
		},
		{
			title: "Mall Name",
			field: "mallname",
			headerFilter: "input",
			editor: "autocomplete",
			editorParams: editparams
		},
		{
			title: "Store",
			field: "stores",
			headerFilter: "input",
			editor: "autocomplete",
			editorParams: editparams
		},
		{
			title: "Floor",
			field: "floor",
			editor: "select",
			headerFilter: "input",
			editorParams: {
				values: ["First", "Second"]
			}
		},
		{
			title: "Category",
			field: "category",
			headerFilter: "input",
			editor: "autocomplete",
			editorParams: editparams
		},
		{
			title: "Distribution",
			width: 130,
			field: "distribution",
			headerFilter: "input",
			editor: "autocomplete",
			editorParams: editparams
		},
		{
			title: "Area",
			width: 150,
			validator: "float",
			field: "area",
			headerFilter: "input",
			editor: true
		},
		{
			title: "Circle",
			width: 150,
			field: "circle",
			headerFilter: "input",
			editor: "autocomplete",
			editorParams: editparams
		},
		{
			title: "Address",
			field: "address",
			headerFilter: "input",
			variableHeight: true,
			editor: "textarea"
		}
	],
});

table.setData(result);

table.redraw(true);

// Update cells
function updateData(celldata) {

	fetch('/list', {
			method: 'PUT',
			body: JSON.stringify(celldata),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.text())
		.then(response => console.log('Success:', JSON.stringify(response)))
		.catch(error => console.error('Error:', error));
}

// Delete cells
function deleteRow(rowindices) {
	fetch('/list', {
			method: 'DELETE',
			body: JSON.stringify(rowindices),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.text())
		.then(response => {

			table.deleteRow(rowindices);
			rowindices.splice(0, rowindices.length);
			table.redraw(true);
		})
		.catch(error => console.error('Error:', error));
}
// Add empty row
function addEmptyRow() {
	fetch('/list', {
			method: 'POST',
			body: '',
			headers: {}
		}).then(res => res.json())
		.then(response => {
			table.addRow({
				serial: response.insertId,
				mallname: '',
				stores: '',
				floor: '',
				category: '',
				distribution: '',
				area: '',
				circle: '',
				address: ''
			}, true);
			table.redraw(true);
		})
		.catch(error => console.error('Error:', error));
}

$(document).ready(function () {
	document.getElementById("deleterowbtn").addEventListener("click", function () {
		if (Array.isArray(rowindices) && rowindices.length) {
			deleteRow(rowindices);

			$('.toast').toast({
				delay: 2000
			});
			$('#successdeletetoast').toast('show');

		} else {
			$('.toast').toast({
				delay: 2000
			});
			$('#errdeletetoast').toast('show');
		}
	});
});

document.getElementById("insertrowbtn").addEventListener("click", function () {
	addEmptyRow();
	$('.toast').toast({
		delay: 3000
	});
	$('#successinserttoast').toast('show');
});

// Download CSV
document.getElementById("download-csv").addEventListener("click", function(){
    table.download("csv", "POIData.csv");
});