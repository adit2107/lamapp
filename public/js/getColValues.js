import selectedopts from './selectedopts.js'

function retColValues (colname, newclick, selectedopts, selectedcolvals) {

	switch (colname) {
		case 'Mall Name':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Google Address - Town':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Google Address - City':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Google Address - State':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Google Address - Country':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Mall Website':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Cluster (Geography)':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Headquarters':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Country Zone':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Store - Common Name':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Brand - Single/Multi':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Category - 1':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Category - 2':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Category - 3':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Category - 4':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Category - 5':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Brand Website':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'HQ Address - Town':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'HQ Address - City':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'HQ Address - State':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'HQ Address - Country':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Floor':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Distribution':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
		case 'Area (SQ.FT in Mil)':
			columnVals(colname, newclick, selectedopts, selectedcolvals);
			break;
	}
}

function columnVals(colname, newclick, selectedopts, selectedcolvals) {

	let uarr = [];

	if(newclick){
		// selectedopts["col2"][colname] = [];
		fetch('/search', {
			method: 'POST',
			body: JSON.stringify({
				colname
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
		.then(response => {
			
			let coldbname = response.column;
			selectedopts["col2"][coldbname] = [];
			for (var col of response.results) {	
				uarr.push(col[coldbname]);
			}
			
			selectedcolvals += `<optgroup label="${colname}">`
			var resuarr = [...new Set(uarr)];
            
				for (var vval of resuarr) {
				
					selectedcolvals += `<option class="${coldbname}">${vval}</option>`;
				}
			
			$('#colsvalues').append(selectedcolvals);
			var elements = document.getElementsByClassName(colname);
			for (var i =0; i< elements.length; i++){
				if( elements[i].textContent.trim() === '' )
				elements[i].parentNode.removeChild(elements[i]);
			}
			$('#colsvalues').selectpicker('refresh');

		})
		.catch(error => console.error('Error:', error));
		
	}

	if(!newclick){
			// if(selectedopts.col2.hasOwnProperty(colname)){
			// 	$("#colsvalues").children().remove(`optgroup[label="${colname}"]`);
			// 	$('#colsvalues').selectpicker('refresh');
			// 	delete selectedopts.col2[colname];
	
			// }

			fetch('/search', {
				method: 'POST',
				body: JSON.stringify({
					colname
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => res.json())
			.then(response => {
				
				let coldbname = response.column;
				$("#colsvalues").children().remove(`optgroup[label="${colname}"]`);
				$('#colsvalues').selectpicker('refresh');
				delete selectedopts.col2[coldbname];
				
	
			})
			.catch(error => console.error('Error:', error));
		
		}
}

export default retColValues;