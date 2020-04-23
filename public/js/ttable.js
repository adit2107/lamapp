const result = document.getElementById("results").innerHTML;
spandata = document.getElementById("results");
spandata.remove();

var rowindices = [];

var table = new Tabulator("#table", {
	          //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:false,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
	pagination:"local",       //paginate the data
	paginationSize:20,         //allow 10 rows per page of data    
	resizableRows:true,       //allow row order to be changed
	movableRows: true,
	initialSort:[             //set the initial sort order of the data
		{column:"name", dir:"asc"},
	],
	index: "serial",
	cellEdited: function(cell){
		console.log("edited cell");

		const updatedcelldata = {
			oldValue: cell.getOldValue(),
			newValue: cell.getValue(),
			cellId: cell.getRow().getData().serial,
			columnName: cell.getColumn().getField()
		}
		
		updateData(updatedcelldata);
	},
	rowSelected:function(row){
		//row - row component for the selected row
		// const selectedRows = table.getSelectedRows();
		const selRowIndex = row.getIndex();
		rowindices.push(selRowIndex);
		console.log("Inserted into indices arr: " + selRowIndex);
	
		console.log("Row selection status: " + rowindices);
		},
	rowDeselected:function(row){
			let rowDeIndex = row.getIndex();
			console.log("Dselected index value" + rowDeIndex);
			rowindices = rowindices.filter(item => item !== rowDeIndex);
			console.log("Row selection status: " + rowindices);

		},
		validationFailed: function(cell,value, validators){
		$('.toast').toast({delay: 2000});
		$('#validfailtoast').toast('show');
		console.log(cell);
		},
	columns:[                 //define the table columns
		{formatter:"rowSelection", align:"center", headerSort:false, width:50},
    {title:"#", field:"serial", width:50, headerFilter:"input"},
		{title:"Mall Name", field:"mallname", headerFilter:"input", editor:"input"},
		{title:"Store", field:"stores", headerFilter:"input", editor:true},
		{title:"Floor", field:"floor", editor:"select", headerFilter:"input", editorParams:{values:["First", "Second"]}},
		{title:"Category", field:"category",headerFilter:"input", editor:true},
		{title:"Distribution", width:130, field:"distribution", headerFilter:"input", editor:true},
		{title:"Area", width:150, validator:"float", field:"area", headerFilter:"input", editor:true},
		{title:"Circle", width:150, field:"circle", headerFilter:"input", editor:true},
		{title:"Address", field:"address",headerFilter:"input", variableHeight:true, editor:"textarea"}
	],
});

table.setData(result);

table.redraw(true);

// Update cells
function updateData(celldata){
	
	fetch('/list', {
		method: 'PUT', 
		body: JSON.stringify(celldata), 
		headers:{
	  	'Content-Type': 'application/json'
		}
  }).then(res => res.text())
  .then(response => console.log('Success:', JSON.stringify(response)))
  .catch(error => console.error('Error:', error));
}

// Delete cells
function deleteRow(rowindices){
	fetch('/list', {
		method: 'DELETE', 
		body: JSON.stringify(rowindices), 
		headers:{
	  	'Content-Type': 'application/json'
		}
  }).then(res => res.text())
	.then(response => {
		console.log('Success:', JSON.stringify(response));
		console.log("Array contains: " + rowindices);
		table.deleteRow(rowindices);
		rowindices.splice(0, rowindices.length);
		console.log("Array after contains: " + rowindices);
		table.redraw(true);
	})
  .catch(error => console.error('Error:', error));
}
// Add empty row
function addEmptyRow(){
	fetch('/list', {
		method: 'POST', 
		body: '', 
		headers:{
		}
  }).then(res => res.json())
  .then(response => {
		console.log('Success add row:', JSON.stringify(response));
		console.log(response.insertId);
		table.addRow({serial: response.insertId, mallname: '', stores: '', floor: '', category: '', distribution: '', area:'', circle: '', address: ''}, true);
		table.redraw(true);
	})
  .catch(error => console.error('Error:', error));
}

$(document).ready(function(){
	document.getElementById("deleterowbtn").addEventListener("click", function(){
		if(Array.isArray(rowindices) && rowindices.length){
		deleteRow(rowindices);
		
		$('.toast').toast({delay: 2000});
		$('#successdeletetoast').toast('show');
		
		} else {
			console.log("Please select a row.");
			$('.toast').toast({delay: 2000});
			$('#errdeletetoast').toast('show');
		}
	});
});

document.getElementById("insertrowbtn").addEventListener("click", function(){
	addEmptyRow();
	$('.toast').toast({delay: 3000});
	$('#successinserttoast').toast('show');
});