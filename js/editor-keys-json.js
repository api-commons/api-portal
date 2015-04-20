// Purposely keeping this verbose, and expanded, until I figure out best patterns for keys and extensability

$keys_group_count = 0;
$keys_count = 0;

	 	
// The Master 
$MasterKeys = "";

function KeysShowMe($row)
	{
	$thisrow = $row.id;			
	$thisslug = $thisrow.replace("-icon","");

	$thisrow = document.getElementById($thisslug).style.display;

	if($thisrow=='none')
		{
		document.getElementById($thisslug).style.display = '';	
		}
	else
		{
		document.getElementById($thisslug).style.display = 'none';	
		}			
	}	
	
function KeysViewEdit()
	{
	if(document.getElementById("jsonKeysViewer").style.display=='')
		{
		document.getElementById("jsonKeysViewer").style.display='none';
		document.getElementById("jsonKeysEditor").style.display='';
		document.getElementById("questionsViewer").style.display='none';
		}	
	else
		{
		document.getElementById("jsonKeysViewer").style.display='';
		document.getElementById("jsonKeysEditor").style.display='none';	
		document.getElementById("questionsViewer").style.display='none';	
		}
	}
	
function KeysQuestions()
	{
	if(document.getElementById("questionsViewer").style.display=='')
		{
		document.getElementById("questionsViewer").style.display='none';
		document.getElementById("jsonKeysViewer").style.display='none';
		document.getElementById("jsonKeysEditor").style.display='';
		}	
	else
		{
		document.getElementById("questionsViewer").style.display='';
		document.getElementById("jsonKeysViewer").style.display='none';
		document.getElementById("jsonKeysEditor").style.display='none';			
		}
	}
	
function saveKeysFile()
	{

	$KeysJSON = JSON.stringify($MasterKeys, null, 4);		

	// Save The File
    var github = new Github({
        token: $oAuth_Token,
        auth: "oauth"
            });
        
	var repo = github.getRepo($org,$repo);  	

	repo.getTree('master', function(err, tree) {
		
		// This is a workaround hack to get sha, as the github.js getSha doesn't seem to be working and I couldn't fix.
		// I'm looping through the tree to get sha, and then manually passing it to updates, and deletes
		
		$.each(tree, function(treeKey, treeValue) {
			
			$path = treeValue['path'];
			$sha = treeValue['sha'];
			
			if($path=='api-keys.json')
				{						
						
			    repo.writemanual('master', 'api-keys.json', $KeysJSON, 'Saving keys.json', $sha, function(err) { 
			    	
			    	document.getElementById("alertarea").innerHTML = 'api-keys.json file has been saved';
			    	
			    	});									
				}
			});
		}); 	

	}		
	
function addKeysGroup()
	{
		
	$keys_group_key = document.getElementById('add-keys-group-name').value;

	$keysGroupArray = [];	  
	$keysGroupArray[$keys_group_key] = {};	  

 	$.extend($MasterKeys, $keysGroupArray);

	rebuildKeysEditor($MasterKeys);
	
	document.getElementById("alertarea").innerHTML = 'keys group has been added';			
		
	}	
	
function getAddKeysGroup()
	{	

	html = '<tr id="add-keys-group" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add Keys Group</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>group:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-keys-group-name" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';      

    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="add-keys-group-button" id="add-keys-group-button" value="Add" onclick="addKeysGroup();" /></td>';
    html = html + '</tr>'     
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}	
	
function deleteKeysGroup($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$keys_group_count = $idArray[2];

	$FullArray = $MasterKeys; 
	$FullArrayCount =  Object.keys($FullArray).length;

	$MasterKeys = {};
	$thisCount = 0;
 	$.each($FullArray, function(paramKey, paramValue) {
 		
 		$thisKey = paramKey;
 		$thisValue = paramValue;
 		
 		if($thisCount != $keys_group_count)
 			{

			$keysGroupObject = [];	  
			$keysGroupObject[$thisKey] = $thisValue;

		 	$.extend($MasterKeys, $keysGroupObject);
	
			}
		
		$thisCount++;
		
		if($thisCount == $FullArrayCount)
			{
				
			$viewer = JSON.stringify($MasterKeys, null, 4);
	
			document.getElementById('jsonKeysViewerDetails').innerHTML = $viewer; 	
 	
 			rebuildKeysEditor($MasterKeys);
 			 			
			}
		
 		});
 		
 	document.getElementById("alertarea").innerHTML = 'keys group has been deleted';		
 	
	}		
	
// Localize Templating, making as editable as possible	
function getKeysGroup($keys_group_name,$keys_group_count)
	{		
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + $keys_group_name + '</strong>';
	
	html = html + '<a href="#" onclick="deleteKeysGroup(this); return false;" id="delete-keys-' + $keys_group_count + '-icon" title="Delete Keys Group"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-delete-circle.png" width="35" align="right"  /></a>';
			
	html = html + '<a href="#" onclick="KeysShowMe(this); return false;" id="add-keys-' + $keys_group_count + '-icon" title="Add Keys"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';
	
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html;   				
	}	
	
function addThisKeys($keys)
	{

	$ThisGroup = $keys.id;

	$keys_group_count = $keys.name;

	$keys_key = document.getElementById('add-keys-' + $keys_group_count + '-key').value;
	$keys_value = document.getElementById('add-keys-' + $keys_group_count + '-value').value;

	$keysArray = [];	  
	$keysArray[$keys_key] = $keys_value;

 	$.extend($MasterKeys[$ThisGroup], $keysArray);

	rebuildKeysEditor($MasterKeys);
	
	document.getElementById("alertarea").innerHTML = 'keys has been added';	
	
	}		
	
function getAddKeys($keysGroupKey,$keys_group_count)
	{	

	html = '<tr id="add-keys-' + $keys_group_count + '" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add Keys in ' + $keysGroupKey + '</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>key:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-keys-' + $keys_group_count + '-key" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';      
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>value:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-keys-' + $keys_group_count + '-value" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="' + $keys_group_count + '" id="' + $keysGroupKey + '" value="Add This Property" onclick="addThisKeys(this);" /></td>';
    html = html + '</tr>'     
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}		
	
function getKeys($keysGroupKey,$keys_key,$keys_value,$keys_group_count,$keys_count)
	{	

	html = '<tr id="edit-header"><td align="center" colspan="2" style="font-size: 12px;">';

    html = html + '<table border="0" width="95%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="" width="15%"><strong>' + $keys_key + ':</strong></td>';
    html = html + '<td align="left" style="">'
    
    html = html + $keys_value;
     
    html = html + '<a href="#" onclick="deleteKeys(this);" id="delete-' + $keysGroupKey + '-' + $keys_group_count + '-' + $keys_count + '-icon" title="Delete Property"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-delete-circle.png" width="20" align="right"  /></a>';                     
     
    html = html + '<a href="#" onclick="KeysShowMe(this); return false;" id="edit-' + $keysGroupKey + '-' + $keys_group_count + '-' + $keys_count + '-icon" title="Edit Property"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="20" align="right"  /></a>';
      
    html = html + '</td>';
    html = html + '</tr>';

    html = html + '</table>';
    
    html = html + '</td></tr>'; 	
	
	return html; 			
	}	
	
function deleteKeys($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$keysGroupKey = $idArray[1];

	$keys_group_count = $idArray[2];
	$keys_count = $idArray[3];

	$FullArray = $MasterKeys[$keysGroupKey]; 
	$FullArrayCount =  Object.keys($FullArray).length;
	
	$checkArray = Array.isArray($MasterKeys[$keysGroupKey]);

	$MasterKeys[$keysGroupKey] = {};
	$thisCount = 0;
 	$.each($FullArray, function(paramKey, paramValue) {
 		
 		$thisKey = paramKey;
 		$thisValue = paramValue;
 		
 		if($thisCount != $keys_count)
 			{

			$keysObject = [];	  
			$keysObject[$thisKey] = $thisValue;

		 	$.extend($MasterKeys[$keysGroupKey], $keysObject);
	
			}
		
		$thisCount++;
		
		if($thisCount == $FullArrayCount)
			{
				
			$viewer = JSON.stringify($MasterKeys, null, 4);
	
			document.getElementById('jsonKeysViewerDetails').innerHTML = $viewer; 	
 	
 			rebuildKeysEditor($MasterKeys);
 			
 			document.getElementById("alertarea").innerHTML = 'keys has been deleted';	
 			 			
			}
		
 		});
 	
	}	
	
function saveKeys($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$keysGroupKey = $idArray[1];
	$keys_group_count = $idArray[2];
	$keys_count = $idArray[3];
	$keys_key = $idArray[4];
	
	$keys_value = document.getElementById('keys-' + $keysGroupKey + '-' + $keys_count + '-value').value;

 	$MasterKeys[$keysGroupKey][$keys_key] = $keys_value;
 		
 	rebuildKeysEditor($MasterKeys);
 	
 	document.getElementById("alertarea").innerHTML = 'keys has been saved';	
 	
	}	
	
function getEditKeys($keysGroupKey,$keys_key,$keys_value,$keys_group_count,$keys_count)
	{		

	html = '<tr id="edit-' + $keysGroupKey + '-' + $keys_group_count + '-' + $keys_count + '" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Edit Keys</strong>';
    html = html + '<table border="0" width="90%">';  
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>' + $keys_key + ':</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="keys-' + $keysGroupKey + '-' + $keys_count + '-value" value="' + $keys_value + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" id="keys-' + $keysGroupKey + '-' + $keys_group_count + '-' + $keys_count + '-' + $keys_key + '-value-button" name="KeysSave-' + $keys_group_count + '-' + $keys_count + '-button" value="Save Changes" onclick="saveKeys(this);" /></td>';
    html = html + '</tr>'    
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}	
	
function loadKeysEditor()
    {
 
    var github = new Github({
        token: $oAuth_Token,
        auth: "oauth"
            });
        
	var repo = github.getRepo($org,$repo); 		
		
	// go through master branch
	repo.getTree('master', function(err, tree) {
		$.each(tree, function(treeKey, treeValue) {
							
			// not sure why I have to do through the tree, but it is only way that works				
			$path = treeValue['path'];
			$url = treeValue['url'];
			$sha = treeValue['sha'];

			// Pull in api-keys
			if($path=='api-keys.json')
				{							
			    repo.manualread('master', $url, $sha, function(err, data) {
			    	
			    	$APIKeys = JSON.parse(data);
			    	
			    	$MasterKeys = $APIKeys;
	
					buildKeysEditor($APIKeys);
		    				    	
			    	});							
				}

			});							
		});		  
         	  	
    } 	
    
function loadKeys()
    {
    	
    var github = new Github({
        token: $oAuth_Token,
        auth: "oauth"
            });
        
	var repo = github.getRepo($org,$repo); 		
		
	// go through master branch
	repo.getTree('master', function(err, tree) {
		$.each(tree, function(treeKey, treeValue) {
							
			// not sure why I have to do through the tree, but it is only way that works				
			$path = treeValue['path'];
			$url = treeValue['url'];
			$sha = treeValue['sha'];

			// Pull in api-keys
			if($path=='api-keys.json')
				{							
			    repo.manualread('master', $url, $sha, function(err, data) {
			    	
			    	$setConfig = JSON.parse(data);
			    	
					$.each($setConfig, function(keysGroupKey, $values) { 										

						//console.log(keysGroupKey);

						$apikeys[keysGroupKey] = {};

						$.each($values, function(keysKey, keysValue) { 

							$apikeys[keysGroupKey][keysKey] = keysValue;
								
							});						
																		
						});							
	    				    	
			    	});							
				}

			});							
		});	
   	  	
    } 	    
    
function rebuildKeysEditor($KeysArray)
    {
    	
	$apicount = 0;  
	$propertycount = 0;    	

	document.getElementById("jsonKeysEditor").innerHTML = '';
	
	document.getElementById("jsonKeysEditor").innerHTML = '<table cellpadding="3" cellspacing="2" border="0" width="95%" id="jsonKeysEditorTable" style="margin-left: 15px;"></table>';

	// Pull From our Master Store
 	buildKeysEditor($KeysArray);
		
	}
	
function buildKeysEditor($APIKeys)
	{
			    	    	
	$MasterKeys = $APIKeys;
	
	$viewer = JSON.stringify($APIKeys, null, 4);
	
	document.getElementById('jsonKeysViewerDetails').innerHTML = $viewer;

	$HTML = getAddKeysGroup();
	$('#jsonKeysEditorTable').append($HTML);    	

	$.each($APIKeys, function(keysGroupKey, $values) { 

		$HTML = getKeysGroup(keysGroupKey,$keys_group_count);			
		$('#jsonKeysEditorTable').append($HTML);    						
						
		$HTML = getAddKeys(keysGroupKey,$keys_group_count)			
		$('#jsonKeysEditorTable').append($HTML);    																										
						
		$.each($values, function(keysKey, keysValue) { 

			$HTML = getKeys(keysGroupKey,keysKey,keysValue,$keys_group_count,$keys_count);		
			$('#jsonKeysEditorTable').append($HTML);   	
			
			$HTML = getEditKeys(keysGroupKey,keysKey,keysValue,$keys_group_count,$keys_count)		
			$('#jsonKeysEditorTable').append($HTML);   							
			
			getEditKeys(keysKey,keysValue,$keys_group_count,$keys_count)						
				
			$keys_count++;	
				
			});						
			
			$keys_group_count++;	
			$keys_count = 0;
												
		});													    	
	
	
	}
