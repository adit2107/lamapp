const cipherresult = document.getElementById("results").innerHTML;

var bytes  = CryptoJS.AES.decrypt(cipherresult, 'poi212');
var result = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

var editparams = {
	values: true,
	freetext: true,
	allowEmpty: false,
	verticalNavigation: "hybrid"
}

var rowindices = [];

var table = new Tabulator("#table", {
	//load row data from array
	layout: "fitData",
	// responsiveLayout: "collapse", //hide columns that dont fit on the table
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
	dataLoaded:function(data){
		var visiblecols = Object.keys(data[0]);
		visiblecols.forEach(item => {
			table.showColumn(item);
		})


	},
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
	columns: [
		{
			formatter: "rowSelection",
			align: "center",
			headerSort: false
		},
		{
			title: "#",
			field: "serial"
		},
		{
			title: "Mall Name",
			field: "mallname",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Google Address",
			columns: [{
					title: "Town",
					field: "address_town",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "City",
					field: "address_city",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "State",
					field: "address_state",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "Country",
					field: "address_country",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				}
			]
		},
		{
			title: "Mall Website",
			field: "website",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Cluster (Geography)",
			field: "cluster",
			editor: "select",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Headquarters",
			field: "hq",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Country Zone",
			field: "hq_country",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Store",
			columns: [{
					title: "Common Name",
					field: "store_common_name",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "Full Name",
					field: "store_full_name",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				}
			]
		},
		{
			title: "Brand - Single/Multi",
			field: "brand",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Category",
			columns: [{
					title: "1",
					field: "category_1",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "2",
					field: "category_2",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "3",
					field: "category_3",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "4",
					field: "category_4",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				}, {
					title: "5",
					field: "category_5",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				}
			]
		},
		{
			title: "Brand Website",
			field: "brand_website",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "HQ Address",
			columns: [{
					title: "Town",
					field: "brandhq_address_town",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "City",
					field: "brandhq_address_city",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "State",
					field: "brandhq_address_state",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				},
				{
					title: "Country",
					field: "brandhq_address_country",
					editor: "autocomplete",
					editorParams: editparams,
					visible: false
				}
			]
		},
		{
			title: "Floor",
			field: "floor",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Distribution",
			field: "distribution",
			editor: "autocomplete",
			editorParams: editparams,
			visible: false
		},
		{
			title: "Area (SQ.FT in Mil)",
			field: "area",
			editor: "input",
			validator: "float",
			visible: false
		}
	]
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
				address_town: '',
				address_city: '',
				address_state: '',
				address_country: '',
				website: '',
				cluster: '',
				hq: '',
				hq_country: '',
				store_common_name: '',
				store_full_name: '',
				brand: '',
				category_1: '',
				category_2: '',
				category_3: '',
				category_4: '',
				category_5: '',
				brand_website: '',
				brandhq_address_town: '',
				brandhq_address_city: '',
				brandhq_address_state: '',
				brandhq_address_country: '',
				floor: '',
				distribution: '',
				area: ''
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
	document.getElementById("insertrowbtn").addEventListener("click", function () {
		addEmptyRow();
		$('.toast').toast({
			delay: 3000
		});
		$('#successinserttoast').toast('show');
	});
	
	// Download CSV
	document.getElementById("download-csv").addEventListener("click", function () {
		table.download("csv", "POIData.csv");
	});

	// filter modal
	var filterdata = {
		'selectcols': [],
		'wherecols': []
	}
	
	// Filter modal
	document.getElementById("filterbtn").addEventListener("click", function () {

		$('#filterModal').modal({
			show: true,
			keyboard: true,
			focus: true,
			handleUpdate: true
		});

		// Select picker options
	var selectcolopts = [];

	var selectcolsrc = table.getColumns(true);

	selectcolsrc.slice(2, ).forEach((item) => {
		console.log(selectcolsrc.indexOf(item));
		console.log(item.getDefinition());

		if(selectcolsrc.indexOf(item) == 3 || 8 || 10 || 12){
			console.log(item.getDefinition().columns)
			
		}

		var option = "<option>" + item.getDefinition().title +"</option>";
		selectcolopts.push(option);
	});
	$('.selectpick').html(selectcolopts);
	$('.selectpick').selectpicker('refresh');
	
	});

	document.getElementById("modal-close").addEventListener("click", function () {
		$('.selectpick').selectpicker('destroy');
	});
	
});

