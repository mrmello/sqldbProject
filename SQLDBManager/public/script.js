function onClickCreateTable(){

document.getElementById('middleEdit').style.display = 'none';
document.getElementById('middleCreate').style.display = 'block';

}

function onClickEditTable(){

document.getElementById('middleCreate').style.display = 'none';
document.getElementById('middleEdit').style.display = 'block';

}

function populateListBoxes(){

				$.post('/existingTables' ,function(data){
				
						var x = document.getElementById("createListBox");
						var y = document.getElementById("editListBox");
						
						x.innerHTML = "";
						y.innerHTML = "";
						
						var dataObj = JSON.parse(JSON.stringify(data));
						
												
						for (var key in data) {
							var item = data[key];
							
							  for (var key2 in item) {
								var item2 = item[key2];
								
								for (var key3 in item[key2]) {
						  
								 	var option1 = document.createElement("option");
									var option2 = document.createElement("option");
									option1.text = item2[key3];	
									option2.text = item2[key3];
									x.add(option1);
									y.add(option2); 				
								  
								  }
								
								
							  }
						}

				});
				
	}

function onClickDescribeTable(){

	document.getElementById("dataDescTableDiv").style.display= "block";
	
	var selectBox = document.getElementById("createListBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	
	$.post('/retrieveDescription', {tablename: selectedValue} ,function(data){
		
		var data = JSON.parse(JSON.stringify(data));
		
		var table_str= '<table id= "descriptiveDataTable" class="CSSTable"><tr>';
		
		var alreadyInserted = false;
		
		for (var key in data) {
			
				var item = data[key];
				
			  for (var key2 in item) {
			  
				var item2 = item[key2];
				
						if(!alreadyInserted){
						
						for (var key3 in item[key2]) {
								 
							table_str += '<td>'+key3+'</td>';	
								  
								  }
								  
								  
						alreadyInserted = true;
								  
						}
						
						table_str += "<tr>";
						
						for (var key3 in item[key2]) {
						
							table_str += '<td><p>'+item2[key3]+'</td>';
							
						}
						
						table_str += "</tr>";
						
				}				
		}
		
		document.getElementById("dataDescTableDiv").innerHTML = table_str;
				
	});	

}

function onClickDelete(element,row,column,header,table){

	var entry = [];
	
	var titles = header.split(",");
	
	for(var i =0; i < column; i++)
	entry[entry.length] = document.getElementById("input"+row+"-"+i).value;
	
	var query = "DELETE FROM "+table+" WHERE ";
	
	for(var i =0; i < entry.length; i++){
	
		 if(i>0)
		 query+="AND ";
		 
		 query+=titles[i]+" = '"+entry[i]+"' ";
	 }	
	

	$.post('/submitQuery', {query: query} ,function(data){

		onClickTable_2();
		
	});
}
	
function saveChanges(row,column,header,table){
	
	var entry = [];
	var titles = header.split(",");
		
	for(var i = 0; i < titles.length-1 ; i++)
	entry[entry.length] = document.getElementById("input"+row+"-"+i).value;
	
	var query = "UPDATE "+table+" SET "+titles[column]+" = '"+ entry[column] +"' WHERE ";
	
	for(var i =0; i < entry.length; i++){
	
			if(i != column){
				 if(i>0)	
				 query+="AND ";
				 
				 query+=titles[i]+" = '"+entry[i]+"' ";
			 }
	 }	
	
	 $.post('/submitQuery', {query: query} ,function(data){
		
		onClickTable_2();
		
	});

}

function onClickInsert(row,column,header,table){

	var entry = [];
	var titles = header.split(",");
	
	for(var i =0; i < column; i++)
	entry[entry.length] = document.getElementById("input"+row+"-"+i).value;
	
	var query = "INSERT INTO "+table+" (";
	
	var entered = false;
	
	for(var i =0; i < entry.length; i++){
	
			if(entry[i] !== ''){
			
				 if(entered)				 
				 query+=", ";
				 
				 query+=titles[i];
				 entered = true;
			 }
	 }

	 query += ") VALUES (";
	 
	 entered = false;
	 
	 for(var i =0; i < entry.length; i++){
	
			if(entry[i] !== ""){
				 if(entered)	
				 query+=", ";
				 
				 query+="'"+entry[i]+"'";
				 entered = true;
			 }
	 }	
	 
	 query += ");";
	 
	$.post('/submitQuery', {query: query} ,function(data){
		
		if(data !== "Query Successful")
		 alert(data);
		
		onClickTable_2();
		
	});
	
}

function onClickTable_1(){

	document.getElementById("dataDescTableDiv").style.display = "none";
	document.getElementById("dataDescTableDiv").innerHTML = "";
	
	
	}

function onClickTable_2(){	
	
	var selectBox = document.getElementById("editListBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;	
	
	$.post('/retrieveTable', {option: selectedValue} ,function(data){
		
		selectResult(data,selectedValue,true);			
				
	});

}

function onClickSubmitButton(){

	var queryInput = document.getElementById("queryInput").value;
	
	var selectStatement = false;
	
	var postMethod = '/submitQuery';
	
	if(queryInput.toUpperCase().indexOf("SELECT") > -1)
		postMethod = '/submitQueryWithResults';

	
	$.post(postMethod, {query: queryInput} ,function(data){
	
		populateListBoxes();
		
		if(typeof data == "object"){
						
			onClickEditTable();	
			selectResult(data,"",false);
			
			}
			else if(typeof data == "string")
				alert(data);		
		
	});
	
}

function selectResult(data, selectedValue, editable){

	var disabled="";

	if(!editable)
	 disabled="disabled";
		
	
	var data = JSON.parse(JSON.stringify(data));
		var row = 1;
		var column = 0;
		var header = ""; 
		var table_str= '<table id= "dataTable" class="CSSTable"><tr>';			
		
		var alreadyInserted = false;

		var table = "'"+selectedValue+"'";
		
		 for (var key in data) {
			  var item = data[key];
			  for (var key2 in item) {
				var item2 = item[key2];
				
				column = 0;
				
					if(!alreadyInserted){
						
						header += "'";
						
						  for (var key3 in item[key2]) {
						  
						  table_str += '<td>'+key3+'</td>';						
							header += key3+",";
						  }
						  
						  header += "'";
						  
						  if(editable)
						  table_str+='<td></td>';
						  
						  table_str+='</tr>';
					  
					}
					
					alreadyInserted = true;
					  
					   table_str += '<tr>';
					   
					   for (var key3 in item[key2]) {
						
						table_str += '<td><input id="input'+row+'-'+column+'" onchange="saveChanges('+row+','+column+','+header+','+table+')" type="text" value="'+item2[key3]+'" '+disabled+'></td>';
					    column++;  
					  }
					  
					  if(editable)
					  table_str += '<td><button onclick="onClickDelete(this.parentNode.parentNode,'+row+','+column+','+header+','+table+')" type="button">Delete</button></td>';
					  
					  table_str += '</tr>';
					  row++;
			  }			  
			   
			}
			
			if(!alreadyInserted){
			
				$.post('/retrieveDescription', {tablename: selectedValue} ,function(data){
				
				var next = true;
				header = "'";
				for (var key in data) {
							var item = data[key];
							
							  for (var key2 in item) {
								var item2 = item[key2];
							
								for (var key3 in item[key2]) {
						  
									if(next){
									table_str += '<td>'+item2[key3]+'</td>';
									header += item2[key3]+",";
									column++;
									next = false;
									}else next=true;
									
								  }
								
								
							  }
				}
						
						header += "'";
						
						table_str+='<td></td></tr>';
						
						table_str +=  '<tr>';
			
						for(var i=0; i < column ; i++)
						table_str += '<td><input id="input'+row+'-'+i+'" type="text" value="" '+disabled+'></td>';
					
				
						table_str +=  '<td><button type="button" onclick="onClickInsert('+row+','+column+','+header+','+table+')">Insert</button></td></tr>';
						row++;
						
						
						document.getElementById("dataTableDiv").innerHTML = table_str;
															
				});			
			}
			
			if(alreadyInserted && editable){
			table_str +=  '<tr>';
			
			
			for(var i=0; i < column ; i++)
			table_str += '<td><input id="input'+row+'-'+i+'" type="text" value=""></td>';
		
			
			table_str +=  '<td><button type="button" onclick="onClickInsert('+row+','+column+','+header+','+table+')">Insert</button></td>';
			
			table_str += '</tr>';
			
			row++;			
			
			}
			
			if(alreadyInserted)
			document.getElementById("dataTableDiv").innerHTML = table_str;


}



	


