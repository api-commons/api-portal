// Purposely keeping this verbose, and expanded, until I figure out best patterns for config and extensability

$config_group_count = 0;
$config_count = 0;

	 	
// The Master 
$MasterConfig = "";

function ConfigShowMe($row)
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
	
function ConfigViewEdit()
	{
	if(document.getElementById("jsonConfigViewer").style.display=='')
		{
		document.getElementById("jsonConfigViewer").style.display='none';
		document.getElementById("jsonConfigEditor").style.display='';
		document.getElementById("questionsViewer").style.display='none';
		}	
	else
		{
		document.getElementById("jsonConfigViewer").style.display='';
		document.getElementById("jsonConfigEditor").style.display='none';	
		document.getElementById("questionsViewer").style.display='none';	
		}
	}
	
function ConfigQuestions()
	{
	if(document.getElementById("questionsViewer").style.display=='')
		{
		document.getElementById("questionsViewer").style.display='none';
		document.getElementById("jsonConfigViewer").style.display='none';
		document.getElementById("jsonConfigEditor").style.display='';
		}	
	else
		{
		document.getElementById("questionsViewer").style.display='';
		document.getElementById("jsonConfigViewer").style.display='none';
		document.getElementById("jsonConfigEditor").style.display='none';			
		}
	}
	
function saveConfigFile()
	{

	$ConfigJSON = JSON.stringify($MasterConfig, null, 4);		

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
			
			if($path=='api-config.json')
				{						
						
			    repo.writemanual('master', 'api-config.json', $ConfigJSON, 'Saving config.json', $sha, function(err) { 
			    	
			    	document.getElementById("alertarea").innerHTML = 'api-config.json file has been saved';
			    	
			    	});									
				}
			});
		}); 	

	}		
	
function addConfigGroup()
	{
		
	$config_group_key = document.getElementById('add-config-group-name').value;

	$configGroupArray = [];	  
	$configGroupArray[$config_group_key] = {};	  

 	$.extend($MasterConfig, $configGroupArray);

	rebuildConfigEditor($MasterConfig);
	
	document.getElementById("alertarea").innerHTML = 'config group has been added';			
		
	}	
	
function getAddConfigGroup()
	{	

	html = '<tr id="add-config-group" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add Config Group</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>group:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-config-group-name" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';      

    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="add-config-group-button" id="add-config-group-button" value="Add" onclick="addConfigGroup();" /></td>';
    html = html + '</tr>'     
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}	
	
function deleteConfigGroup($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$config_group_count = $idArray[2];

	$FullArray = $MasterConfig; 
	$FullArrayCount =  Object.keys($FullArray).length;

	$MasterConfig = {};
	$thisCount = 0;
 	$.each($FullArray, function(paramKey, paramValue) {
 		
 		$thisKey = paramKey;
 		$thisValue = paramValue;
 		
 		if($thisCount != $config_group_count)
 			{

			$configGroupObject = [];	  
			$configGroupObject[$thisKey] = $thisValue;

		 	$.extend($MasterConfig, $configGroupObject);
	
			}
		
		$thisCount++;
		
		if($thisCount == $FullArrayCount)
			{
				
			$viewer = JSON.stringify($MasterConfig, null, 4);
	
			document.getElementById('jsonConfigViewerDetails').innerHTML = $viewer; 	
 	
 			rebuildConfigEditor($MasterConfig);
 			 			
			}
		
 		});
 		
 	document.getElementById("alertarea").innerHTML = 'config group has been deleted';		
 	
	}		
	
// Localize Templating, making as editable as possible	
function getConfigGroup($config_group_name,$config_group_count)
	{		
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + $config_group_name + '</strong>';
	
	html = html + '<a href="#" onclick="deleteConfigGroup(this); return false;" id="delete-config-' + $config_group_count + '-icon" title="Delete Config Group"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-delete-circle.png" width="35" align="right"  /></a>';
			
	html = html + '<a href="#" onclick="ConfigShowMe(this); return false;" id="add-config-' + $config_group_count + '-icon" title="Add Config"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';
	
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html;   				
	}	
	
function addThisConfig($config)
	{

	$ThisGroup = $config.id;
	console.log($ThisGroup);
	$config_group_count = $config.name;

	$config_key = document.getElementById('add-config-' + $config_group_count + '-key').value;
	$config_value = document.getElementById('add-config-' + $config_group_count + '-value').value;

	console.log($config_key + ' - ' + $config_value);

	$configArray = [];	  
	$configArray[$config_key] = $config_value;

 	$.extend($MasterConfig[$ThisGroup], $configArray);

	rebuildConfigEditor($MasterConfig);
	
	document.getElementById("alertarea").innerHTML = 'config has been added';	
	
	}		
	
function getAddConfig($configGroupKey,$config_group_count)
	{	

	html = '<tr id="add-config-' + $config_group_count + '" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add Config in ' + $configGroupKey + '</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>key:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-config-' + $config_group_count + '-key" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';      
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>value:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-config-' + $config_group_count + '-value" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="' + $config_group_count + '" id="' + $configGroupKey + '" value="Add This Property" onclick="addThisConfig(this);" /></td>';
    html = html + '</tr>'     
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}		
	
function getConfig($configGroupKey,$config_key,$config_value,$config_group_count,$config_count)
	{	

	html = '<tr id="edit-header"><td align="center" colspan="2" style="font-size: 12px;">';

    html = html + '<table border="0" width="95%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="" width="15%"><strong>' + $config_key + ':</strong></td>';
    html = html + '<td align="left" style="">'
    
    html = html + $config_value;
     
    html = html + '<a href="#" onclick="deleteConfig(this);" id="delete-' + $configGroupKey + '-' + $config_group_count + '-' + $config_count + '-icon" title="Delete Property"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-delete-circle.png" width="20" align="right"  /></a>';                     
     
    html = html + '<a href="#" onclick="ConfigShowMe(this); return false;" id="edit-' + $configGroupKey + '-' + $config_group_count + '-' + $config_count + '-icon" title="Edit Property"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="20" align="right"  /></a>';
      
    html = html + '</td>';
    html = html + '</tr>';

    html = html + '</table>';
    
    html = html + '</td></tr>'; 	
	
	return html; 			
	}	
	
function deleteConfig($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$configGroupKey = $idArray[1];

	$config_group_count = $idArray[2];
	$config_count = $idArray[3];

	$FullArray = $MasterConfig[$configGroupKey]; 
	$FullArrayCount =  Object.keys($FullArray).length;
	
	$checkArray = Array.isArray($MasterConfig[$configGroupKey]);

	$MasterConfig[$configGroupKey] = {};
	$thisCount = 0;
 	$.each($FullArray, function(paramKey, paramValue) {
 		
 		$thisKey = paramKey;
 		$thisValue = paramValue;
 		
 		if($thisCount != $config_count)
 			{

			$configObject = [];	  
			$configObject[$thisKey] = $thisValue;

		 	$.extend($MasterConfig[$configGroupKey], $configObject);
	
			}
		
		$thisCount++;
		
		if($thisCount == $FullArrayCount)
			{
				
			$viewer = JSON.stringify($MasterConfig, null, 4);
	
			document.getElementById('jsonConfigViewerDetails').innerHTML = $viewer; 	
 	
 			rebuildConfigEditor($MasterConfig);
 			
 			document.getElementById("alertarea").innerHTML = 'config has been deleted';	
 			 			
			}
		
 		});
 	
	}	
	
function saveConfig($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$configGroupKey = $idArray[1];
	$config_group_count = $idArray[2];
	$config_count = $idArray[3];
	$config_key = $idArray[4];
	
	$config_value = document.getElementById('config-' + $configGroupKey + '-' + $config_count + '-value').value;

 	$MasterConfig[$configGroupKey][$config_key] = $config_value;
 		
 	rebuildConfigEditor($MasterConfig);
 	
 	document.getElementById("alertarea").innerHTML = 'config has been saved';	
 	
	}	
	
function getEditConfig($configGroupKey,$config_key,$config_value,$config_group_count,$config_count)
	{		

	html = '<tr id="edit-' + $configGroupKey + '-' + $config_group_count + '-' + $config_count + '" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Edit Config</strong>';
    html = html + '<table border="0" width="90%">';  
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>' + $config_key + ':</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="config-' + $configGroupKey + '-' + $config_count + '-value" value="' + $config_value + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" id="config-' + $configGroupKey + '-' + $config_group_count + '-' + $config_count + '-' + $config_key + '-value-button" name="ConfigSave-' + $config_group_count + '-' + $config_count + '-button" value="Save Changes" onclick="saveConfig(this);" /></td>';
    html = html + '</tr>'    
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}	
	
function loadConfigEditor()
    {
    	
    console.log("loading config editor...");

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

			// Pull in api-config
			if($path=='api-config.json')
				{							
			    repo.manualread('master', $url, $sha, function(err, data) {
			    	
			    	$APIConfig = JSON.parse(data);
			    	
			    	$MasterConfig = $APIConfig;
	
					buildConfigEditor($APIConfig);
		    				    	
			    	});							
				}

			});							
		});		  
         	  	
    } 	
    
function loadConfig()
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

			// Pull in api-config
			if($path=='api-config.json')
				{	
											
			    repo.manualread('master', $url, $sha, function(err, data) {
			    	
			    	$setConfig = JSON.parse(data);
			    	
					$.each($setConfig, function(keysGroupKey, $values) { 										
						
						$apiconfig[keysGroupKey] = {};
						
						$.each($values, function(keysKey, keysValue) { 

							$apiconfig[keysGroupKey][keysKey] = keysValue;
								
							});						
																		
						});
	    								    				    	
			    	});							
				}

			});							
		});	
   	  	
    }     
    
function rebuildConfigEditor($ConfigArray)
    {
    	
	$apicount = 0;  
	$propertycount = 0;    	

	document.getElementById("jsonConfigEditor").innerHTML = '';
	
	document.getElementById("jsonConfigEditor").innerHTML = '<table cellpadding="3" cellspacing="2" border="0" width="95%" id="jsonConfigEditorTable" style="margin-left: 15px;"></table>';

	// Pull From our Master Store
 	buildConfigEditor($ConfigArray);
		
	}
	
function buildConfigEditor($APIConfig)
	{
		    	
	$MasterConfig = $APIConfig;
	
	$viewer = JSON.stringify($APIConfig, null, 4);
	
	document.getElementById('jsonConfigViewerDetails').innerHTML = $viewer;

	$HTML = getAddConfigGroup();
	$('#jsonConfigEditorTable').append($HTML);    	

	$.each($APIConfig, function(configGroupKey, $values) { 

		$HTML = getConfigGroup(configGroupKey,$config_group_count);			
		$('#jsonConfigEditorTable').append($HTML);    						
						
		$HTML = getAddConfig(configGroupKey,$config_group_count)			
		$('#jsonConfigEditorTable').append($HTML);    																										
						
		$.each($values, function(configKey, configValue) { 

			$HTML = getConfig(configGroupKey,configKey,configValue,$config_group_count,$config_count);		
			$('#jsonConfigEditorTable').append($HTML);   	
			
			$HTML = getEditConfig(configGroupKey,configKey,configValue,$config_group_count,$config_count)		
			$('#jsonConfigEditorTable').append($HTML);   							
			
			getEditConfig(configKey,configValue,$config_group_count,$config_count)						
				
			$config_count++;	
				
			});						
			
			$config_group_count++;	
			$config_count = 0;
												
		});													    	
	
	
	}
