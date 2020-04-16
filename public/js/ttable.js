const result = document.getElementById("results").innerHTML;

var table = new Tabulator("#table", {
	          //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:false,            //show tool tips on cells
	addRowPos:"top",          //when adding a new row, add it to the top of the table
	pagination:"local",       //paginate the data
	paginationSize:10,         //allow 7 rows per page of data    
	resizableRows:true,       //allow row order to be changed
	initialSort:[             //set the initial sort order of the data
		{column:"name", dir:"asc"},
	],
    columns:[                 //define the table columns
        {title:"#", field:"serial", widthShrink:1},
		{title:"Mall Name", field:"mallname", editor:"input"},
		{title:"Store", field:"stores", editor:true},
		{title:"Floor", field:"floor", editor:"select", editorParams:{values:["First", "Second"]}},
		{title:"Category", field:"category", editor:true},
		{title:"Distribution", field:"distribution", editor:true},
		{title:"Area", field:"area", editor:true},
		{title:"Circle", field:"circle", editor:true},
		{title:"Address", field:"address", editor:true}
	],
});

console.log(result);

table.setData(result);

table.redraw(true);

// function getData(){
// 	fetch('http://localhost:3030/list', {
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	})
// 	.then((res) => res.text())
// 	.then((data) => {
// 		console.log(data);
// 		});
// }

