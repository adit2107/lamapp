import retColValues from './getColValues.js'
import selectedopts from './selectedopts.js'

const cipherresult = document.getElementById("results").innerHTML;
document.getElementById("results").remove();

var bytes = CryptoJS.AES.decrypt(cipherresult, 'poi212');
var result = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

var editparams = {
  values: true,
  freetext: true,
  allowEmpty: false,
  verticalNavigation: "hybrid",
};

var rowindices = [];

var table = new Tabulator("#table", {
	layout: "fitData",
	// persistence:{
	// 	columns: true
	// },
	// persistenceMode: "cookie",
	addRowPos: "top",
	pagination: "local",
	paginationSize: 10,
	paginationSizeSelector:[5, 10, 15, 20, 25],
	resizableRows: true,
	movableRows: true,
	initialSort: [{
		column: "name",
		dir: "asc"
	}, ],
	index: "serial",
	dataLoaded: function (data) {
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
	columns: [{
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

table.setData(result).then(() => {
	// console.log(table.getColumnLayout());
	
	
})
.catch((err) => {
console.log("err", err);
});

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
				serial: response.insertId
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

	// reset modal
	document.getElementById("resettablebtn").addEventListener("click", function () {
		$('#resetModal').modal({
			show: true,
			keyboard: true,
			focus: true,
			handleUpdate: true
		});
	});

	document.getElementById("resetmodalbtn").addEventListener("click", function () {
		$('#resetModal').modal({
			show: false
		});
	});

	// Filter modal

	document.getElementById("filterbtn").addEventListener("click", function () {

		$('#filterModal').modal({
			show: true,
			keyboard: false,
			backdrop: 'static',
			focus: true,
			handleUpdate: true
		});

		// Select picker options

		var selectcolopts = '';

		var selectedcolvals = '';

		var selectcolsrc = table.getColumns(true).slice(2, );

		function getelems(selectcolsrc) {

			for (let [index, item] of selectcolsrc.entries()) {
				let parenttitle = item.getDefinition().title;
				if (index == 1 || index == 6 || index == 8 || index == 10) {
					selectcolopts += `<optgroup label="${parenttitle}">`;
					getopts(parenttitle, item);
					selectcolopts += "</optgroup>";
				} else {
					var option = "<option>" + parenttitle + "</option>";
					selectcolopts += option;
				}
			}
		}

		function getopts(parenttitle, item) {
			var optgs = item.getDefinition().columns;
			for (var itemtitle of optgs) {
				selectcolopts += "<option>" + parenttitle + " - " + itemtitle.title + "</option>";
			}

		}

		getelems(selectcolsrc);

		// Column 2 Dropdown
		$('#selectcols2').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
			var selectedD = $(this).find('option').eq(clickedIndex).text();

			retColValues(selectedD, newValue, selectedopts, selectedcolvals);
		});

		// Column 1 Dropdown
		$('#selectcols1').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
			var selected = $(this).find('option').eq(clickedIndex).text();

			if(newValue){
				selectedopts.col1.push(selected);
				
			} else {
				selectedopts.col1 = selectedopts.col1.filter(item => item !== selected);
				
			}
		});

		// Column 3 Dropdown
		$('#colsvalues').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
			var selected = $(this).find('option').eq(clickedIndex).text();
			
			// if(newValue){

			// 	for(var item in selectedopts.col2){
				

			// 	// [...document.getElementsByClassName(item)].forEach(
			// 	// 	(element, index, array) => {
					
			// 	// 	}
			// 	// );
				
				
				
			// 	}

				
				
			// } else {
				
			// 	// for(var item in selectedopts.col2){
                
			// 	// 	[...document.getElementsByClassName(item)].forEach(
			// 	// 		(element, index, array) => {
							
			// 	// 		}
			// 	// 	);
					
			// 	// 	}
				
			// }
		});

		$('#selectcols1').html(selectcolopts);
		$('#selectcols1').selectpicker('refresh');

		$('#selectcols2').html(selectcolopts);
		$('#selectcols2').selectpicker('refresh');

		$("#colsvalues").selectpicker();
	});

	document.getElementById("filtertablebtn").addEventListener("click", function () {

	

		for (var colname in selectedopts["col2"]){
			//console.log(colname);

			var sel = document.querySelectorAll(`a.${colname}.selected > .text`);
           // console.log("sel", sel)
		
			for (var vals of sel.values()){
				
				selectedopts["col2"][colname].push(vals.innerText);
			}
		}


		fetch('/list', {
				method: 'POST',
				body: JSON.stringify(selectedopts),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => res.text())
			.then(response => {
				//console.log('Success:', JSON.stringify(response));
				window.location='/list/filter';
			})
			.catch(error => console.error('Error:', error));
					
		selectedopts.col1.splice(0, );
		selectedopts["col2"] = {};
		$("#colsvalues").html('').selectpicker('refresh');
		$('.selectpick').selectpicker('destroy');
	});

	document.getElementById("modal-close").addEventListener("click", function () {
		
		selectedopts.col1.splice(0, );
		selectedopts["col2"] = {};
		$("#colsvalues").html('').selectpicker('refresh');
		$('.selectpick').selectpicker('destroy');
	});
});
