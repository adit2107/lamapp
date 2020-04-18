const result = document.getElementById("results").innerHTML;

var rowindices = [];

var table = new Tabulator("#table", {
	          //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:false,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
	pagination:"local",       //paginate the data
	paginationSize:10,         //allow 10 rows per page of data    
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
	
		console.log("Array Sel status: " + rowindices);
		},
	rowDeselected:function(row){
			let rowDeIndex = row.getIndex();
			console.log("Dselected index value" + rowDeIndex);
			rowindices = rowindices.filter(item => item !== rowDeIndex);
			console.log("Array Del status: " + rowindices);

		},
	columns:[                 //define the table columns
		{rowHandle:true, formatter:"handle", headerSort:false, frozen:true, width:30, minWidth:30},
		{formatter:"rowSelection", align:"center", headerSort:false, width:50},
        {title:"#", field:"serial", width:50, headerFilter:"input"},
		{title:"Mall Name", field:"mallname", headerFilter:"input", editor:"input"},
		{title:"Store", field:"stores", headerFilter:"input", editor:true},
		{title:"Floor", field:"floor", editor:"select", headerFilter:"input", editorParams:{values:["First", "Second"]}},
		{title:"Category", field:"category",headerFilter:"input", editor:true},
		{title:"Distribution", field:"distribution", width:150, headerFilter:"input", editor:true},
		{title:"Area", field:"area", headerFilter:"input", editor:true},
		{title:"Circle", field:"circle", headerFilter:"input", editor:true},
		{title:"Address", field:"address",headerFilter:"input", editor:true}
	],
});

console.log("Refreshed table in ttable " + result);
table.setData(result);

table.redraw(true);

//********************************************



//********************************************* */

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
  .then(response => console.log('Success:', JSON.stringify(response)))
  .catch(error => console.error('Error:', error));
}
// Add empty row
function addEmptyRow(){
	fetch('/list', {
		method: 'POST', 
		body: '', 
		headers:{
		}
  }).then(res => res.text())
  .then(response => console.log('Success:', JSON.stringify(response)))
  .catch(error => console.error('Error:', error));
}

document.getElementById("deleterowbtn").addEventListener("click", function(){
	deleteRow(rowindices);
	table.deleteRow(rowindices);
});

document.getElementById("insertrowbtn").addEventListener("click", function(){
	table.addRow({}, true);
	addEmptyRow();
});