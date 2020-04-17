const result = document.getElementById("results").innerHTML;

var table = new Tabulator("#table", {
	          //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:false,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
	pagination:"local",       //paginate the data
	paginationSize:20,         //allow 7 rows per page of data    
	resizableRows:true,       //allow row order to be changed
	initialSort:[             //set the initial sort order of the data
		{column:"name", dir:"asc"},
	],
	cellEdited: function(cell){
		// console.log(cell.getValue());
		// console.log(cell.getOldValue());
		// console.log(cell.getRow().getData().serial);
		// console.log(cell.getColumn().getField());
		
		const updatedcelldata = {
			oldValue: cell.getOldValue(),
			newValue: cell.getValue(),
			cellId: cell.getRow().getData().serial,
			columnName: cell.getColumn().getField()
		}
		
		updateData(updatedcelldata);
	},
    columns:[                 //define the table columns
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

table.setData(result);

table.redraw(true);

// UPDATE cell

function updateData(celldata){
	fetch('/list', {
		method: 'PUT', // or 'PUT'
		body: JSON.stringify(celldata), // data can be `string` or {object}!
		headers:{
	  	'Content-Type': 'application/json'
		}
  }).then(res => res.text())
  .then(response => console.log('Success:', JSON.stringify(response)))
  .catch(error => console.error('Error:', error));
}
