// Purposely keeping this verbose, and expanded, until I figure out best patterns for config and extensability

$pathcount = 0;  
$pathverbcount = 0;
$pathverbpropertycount = 0;
$pathverbresponsecount = 0;
$pathverbtagcount = 0;
$definitioncount = 0;
$definitionpropertycount = 0;
	 	
// The Master 
$MasterSwagger = {};

function SwaggerShowMe($row)
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
	
function SwaggerViewEdit()
	{
	if(document.getElementById("jsonViewer").style.display=='')
		{
		document.getElementById("jsonViewer").style.display='none';
		document.getElementById("swaggerEditor").style.display='';
		document.getElementById("questionsViewer").style.display='none';
		}	
	else
		{
		$viewer = JSON.stringify($MasterSwagger, null, 4);
		document.getElementById("jsonViewerDetails").value = $viewer;		
		
		document.getElementById("jsonViewer").style.display='';
		document.getElementById("swaggerEditor").style.display='none';
		document.getElementById("questionsViewer").style.display='none';		
		}
	}
	
function SwaggerQuestions()
	{
	if(document.getElementById("questionsViewer").style.display=='')
		{
		document.getElementById("questionsViewer").style.display='none';
		document.getElementById("jsonViewer").style.display='none';
		document.getElementById("swaggerEditor").style.display='';
		}	
	else
		{
		$viewer = JSON.stringify($MasterSwagger, null, 4);
		document.getElementById("jsonViewerDetails").value = $viewer;		
		
		document.getElementById("questionsViewer").style.display='';
		document.getElementById("jsonViewer").style.display='none';
		document.getElementById("swaggerEditor").style.display='none';			
		}
	}	

function SwaggerSave()
	{

  	$WriteAPIsJSON = JSON.stringify($MasterSwagger);
    $WriteAPIsJSON = JSON.stringify(JSON.parse($WriteAPIsJSON),null,2); 	

    var github = new Github({
        token: $oAuth_Token,
        auth: "oauth"
            });
        
	var repo = github.getRepo($org,$repo);  	

	repo.getTree('gh-pages', function(err, tree) {
		
		// This is a workaround hack to get sha, as the github.js getSha doesn't seem to be working and I couldn't fix.
		// I'm looping through the tree to get sha, and then manually passing it to updates, and deletes
		
		$.each(tree, function(treeKey, treeValue) {
			
			$path = treeValue['path'];
			$sha = treeValue['sha'];
			//console.log($path);
			if($path=='swagger.json')
				{
				//console.log('writing to: ' + $path);
				//console.log('writing: ' + $WriteAPIsJSON);							
			    repo.writemanual('gh-pages', 'swagger.json', $WriteAPIsJSON, 'Save', $sha, function(err) { });									
				}
			});
		});  	    	
	}

// Header
function SwaggerGetHeader($SwaggerVersion,$SwaggerAPITitle,$SwaggerAPIDesc,$SwaggerAPITOS,$SwaggerAPIVersion,$SwaggerAPIHost,$SwaggerAPIBasePath)
	{		
    html = '<tr>';
    html = html + '<td align="left" valign="top" colspan="2" id="apisjsonHeaderCell">';

	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-header-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="35" align="right"  /></a>';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>Swagger Version:</strong></td>';
    html = html + '<td align="left" id="swagger-header-swagger-version-view">' + $SwaggerVersion + '</td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>Title:</strong></td>';
    html = html + '<td align="left" id="swagger-header-title-view">' + $SwaggerAPITitle + '</td>';
    html = html + '</tr>';   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>Description:</strong></td>';
    html = html + '<td align="left" id="swagger-header-desc-view">' + $SwaggerAPIDesc + '</td>';
    html = html + '</tr>'; 
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>Terms of Service:</strong></td>';
    html = html + '<td align="left" id="swagger-header-tos-view">' + $SwaggerAPITOS + '</td>';
    html = html + '</tr>';    
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>API Version:</strong></td>';
    html = html + '<td align="left" id="swagger-header-api-version-view">' + $SwaggerAPIVersion + '</td>';
    html = html + '</tr>';   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>Host:</strong></td>';
    html = html + '<td align="left" id="swagger-header-host-view">' + $SwaggerAPIHost + '</td>';
    html = html + '</tr>';    
    
    html = html + '<tr>';
    html = html + '<td align="right" width="25%"><strong>Base Path:</strong></td>';
    html = html + '<td align="left" id="swagger-header-basepath-view">' + $SwaggerAPIBasePath + '</td>';
    html = html + '</tr>';                  

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}
	
function SwaggerSaveHeader()
	{
	$swagger_swagger_version = document.getElementById("swagger-header-swagger-version-edit").value;
	$swagger_title = document.getElementById("swagger-header-title-edit").value;
	$swagger_desc = document.getElementById("swagger-header-desc-edit").value;
	$swagger_tos = document.getElementById("swagger-header-tos-edit").value;
	$swagger_api_version = document.getElementById("swagger-header-api-version-edit").value;
	$swagger_host = document.getElementById("swagger-header-host-edit").value;
	$swagger_basepath = document.getElementById("swagger-header-basepath-edit").value;

 	$MasterSwagger['swagger'] = $swagger_swagger_version;
 	$MasterSwagger['info']['title'] = $swagger_title;
 	$MasterSwagger['info']['description'] = $swagger_desc;
 	$MasterSwagger['info']['termsOfService'] = $swagger_tos;
 	$MasterSwagger['info']['version'] = $swagger_api_version;
 	$MasterSwagger['host'] = $swagger_host;
 	$MasterSwagger['schemes'] = $swagger_basepath;

	document.getElementById("swagger-header-swagger-version-view").innerHTML = $swagger_swagger_version;
	document.getElementById("swagger-header-title-view").innerHTML = $swagger_title;
	document.getElementById("swagger-header-desc-view").innerHTML = $swagger_desc;
	document.getElementById("swagger-header-tos-view").innerHTML = $swagger_tos;
	document.getElementById("swagger-header-api-version-view").innerHTML = $swagger_api_version;
	document.getElementById("swagger-header-host-view").innerHTML = $swagger_host;
	document.getElementById("swagger-header-basepath-view").innerHTML = $swagger_basepath;
	}	
	
function SwaggerGetEditHeader($SwaggerVersion,$SwaggerAPITitle,$SwaggerAPIDesc,$SwaggerAPITOS,$SwaggerAPIVersion,$SwaggerAPIHost,$SwaggerAPIBasePath)
	{	
		
	$thisslug = name.toLowerCase();	
	$thisslug = $thisslug.replace(" ", "-");
	//console.log("-api (get) slug: " + $thisslug);				

	html = '<tr id="edit-header" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Edit Swagger Header</strong>';
	html = html + '<form action="" method="get" name="apisjsonHeader">';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;" width="25%"><strong>Swagger Version:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-swagger-version-edit" value="' + $SwaggerVersion + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Title:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-title-edit" value="' + $SwaggerAPITitle + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-desc-edit" value="' + $SwaggerAPIDesc + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Terms of Service:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-tos-edit" value="' + $SwaggerAPITOS + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>API Version:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-api-version-edit" value="' + $SwaggerAPIVersion + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Host:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-host-edit" value="' + $SwaggerAPIHost + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Base Path:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="swagger-header-basepath-edit" value="' + $SwaggerAPIBasePath + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'               
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerSaveSwagger" value="Save Values" onclick="SwaggerSaveHeader();" /></td>';
    html = html + '</tr>'       
        
    html = html + '</table>';
    html = html + '</form>';
    
    html = html + '<br /></td></tr>'; 	
	
	return html; 			
	}		
	
// Filler		

function SwaggerGetPathTitle($pathTitle)
	{
	html = '<tr style="background-color:#CCC;">';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + $pathTitle + '</strong>';
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-path-icon" title="Add a Path"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}	
	
function SwaggerGetAddPath()
	{		
		
	html = '<tr id="add-path" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add Path</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;" width="25%"><strong>Path:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-path-name" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';

    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="addPathButton" value="Add This Path" onclick="SwaggerAddPath();" /></td>';
    html = html + '</tr>'

    html = html + '</table>';
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}	
	
function SwaggerGetPath($path,$pathcount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + $path + '</strong>';
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-path-verb-' + $pathcount + '-icon" title="Add a Verb"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';
	//html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-path-' + $pathcount + '-icon" title="Edit Path"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="35" align="right"  /></a>';
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}					
	
function SwaggerGetPathVerb($SwaggerAPIPathVerb,$pathcount,$pathverbcount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;" align="center">';
	

	html = html + '<table border="0" width="80%" align="center" style="background-color:#CCC;">';
	
    html = html + '<tr>';
    html = html + '<td>';	
	
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + $SwaggerAPIPathVerb + '</strong>';
	html = html + '</span>';
	
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-summary-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="35" align="right"  /></a>';	
		
	
    html = html + '</td>';
    html = html + '</tr>';		
	
	html = html + '</table>';
	
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function SwaggerAddPathVerb()
	{
		
	$path_name = document.getElementById("add-path-name").value;	
		
	var $PathArray = [$path_name];	 

	$MasterSwagger['paths'].push($PathArray);
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}		
	
function SwaggerGetAddPathVerb($pathcount)
	{		
		
	html = '<tr id="add-path-verb-' + $pathcount + '" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add a Verb:</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;" width="45%"><strong>Verb:</strong></td>';
	html = html + '<td align="left" style="background-color:#FFF;"><select id="add-path-verb-' + $pathcount + '"><option value="get">get</option><option value="post">post</option><option value="put">put</option><option value="delete">delete</option></select></td>';        
     html = html + '</tr>';

    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="addPathButton" value="Add" onclick="SwaggerAddPathVerb();" /></td>';
    html = html + '</tr>'

    html = html + '</table>';
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}	
	
function SwaggerGetPathVerbDetail($SwaggerAPIPathVerbSummary,$SwaggerAPIPathVerbDesc,$SwaggerAPIPathVerbOperationId,$pathcount,$pathverbcount)
	{		
    html = '<tr>';
    html = html + '<td align="center" valign="top" colspan="2" id="apisjsonHeaderCell">';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="80%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" width="45%" style="font-size: 14px;"><strong>Summary:</strong></td>';
    html = html + '<td align="left" id="swagger-header-swagger-version-view" style="font-size: 14px;">' + $SwaggerAPIPathVerbSummary + '</td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" width="45%" style="font-size: 14px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" id="swagger-header-title-view" style="font-size: 14px;">' + $SwaggerAPIPathVerbDesc + '</td>';
    html = html + '</tr>';   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="45%" style="font-size: 14px;"><strong>Operation ID:</strong></td>';
    html = html + '<td align="left" id="swagger-header-desc-view" style="font-size: 14px;">' + $SwaggerAPIPathVerbOperationId + '</td>';
    html = html + '</tr>';                

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}		
	
function SwaggerSavePathVerbDetail($pathcount,$pathverbcount)
	{
	
	$path_verb_summary = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-summary-edit').value;	
	$path_verb_desc = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-description-edit').value;	
	$path_verb_operationid = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-operationid-edit').value;	

	$p = 0;
	$v = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) {  
			if($pathcount == $p && $pathverbcount == $v)
				{;
				$MasterSwagger['paths'][key1][key2]['summary'] = $path_verb_summary;
				$MasterSwagger['paths'][key1][key2]['description'] = $path_verb_desc;
				$MasterSwagger['paths'][key1][key2]['operationId'] = $path_verb_operationid;				
				}
			$v++;	
		});	
	 $p++;	
	});
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}		
	
function SwaggerGetEditPathVerbDetail($SwaggerAPIPathVerbSummary,$SwaggerAPIPathVerbDesc,$SwaggerAPIPathVerbOperationId,$pathcount,$pathverbcount)
	{		
			
    html = '<tr id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-summary" style="display: none;">';
    html = html + '<td align="center" valign="top" colspan="2">';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="80%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Edit Details</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="45%" style="font-size: 12px;"><strong>Summary:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-summary-edit" value="' + $SwaggerAPIPathVerbSummary + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="45%" style="font-size: 12px;""><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-description-edit" value="' + $SwaggerAPIPathVerbDesc + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="45%" style="font-size: 12px;"><strong>Operation ID:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-operationid-edit" value="' + $SwaggerAPIPathVerbOperationId + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'               
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerSavePathVerbDetailButton" value="Save" onclick="SwaggerSavePathVerbDetail(' + $pathcount + ',' + $pathverbcount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}		
	
function SwaggerAddPathVerbParameter($pathcount,$pathverbcount)
	{
		
	$parameter_name = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-name-add').value;	
	$parameter_in = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-in-add').value;
	$parameter_desc = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-description-name-add').value;
	$parameter_required = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-required-add').value;
	$parameter_type = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-type-add').value;
	$parameter_format = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-format-add').value;

	$APIPropertyArray = {};	  
	$APIPropertyArray['name'] = $parameter_name;
	$APIPropertyArray['in'] = $parameter_in;
	$APIPropertyArray['description'] = $parameter_desc;	
	$APIPropertyArray['required'] = $parameter_required;	
	$APIPropertyArray['type'] = $parameter_type;
	$APIPropertyArray['format'] = $parameter_format;		

	$p = 0;
	$v = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) { 
			if($pathcount == $p && $pathverbcount == $v)
				{	
				$MasterSwagger['paths'][key1][key2]['parameters'].push($APIPropertyArray);				
				}	
			$v++;	
		});	
	 $p++;	
	});	
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}	
	
function SwaggerGetAddPathVerbParameter($pathcount,$pathverbcount)
	{		
		
	html = '<tr id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter" style="display: none;"><td align="center" colspan="2" style="">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Add Parameter</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Name:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-name-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;""><strong>In:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;font-size: 12px;"><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-in-add" style=""><option value="query">query</option><option value="path">path</option></select></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-description-name-add" style="width: 75%; height: 75px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'      
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Required:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-required-add" style=""><option value="true">true</option><option value="false">false</option></select></td>';
    html = html + '</tr>'   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Type:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-type-add" style=""><option value="string">string</option><option value="integer">integer</option></select></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Format:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-format-add" style=""><option value=""></option><option value="id">id</option><option value="label">label</option></select></td>';
    html = html + '</tr>'                       
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerAddSwaggerPathVerbParameterButton" value="Add" onclick="SwaggerAddPathVerbParameter(' + $pathcount + ',' + $pathverbcount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';;
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}		
	
function SwaggerGetPathVerbParameterTitle($pathcount,$pathverbcount,$pathverbpropertycount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;" align="center">';	

	html = html + '<table border="0" width="70%" align="center" style="background-color:#CCC;">';
	
    html = html + '<tr>';
    html = html + '<td>';	
	
	html = html + '<span style="font-size:16px;">';
	html = html + '<strong>Parameters</strong>';
	html = html + '</span>';
	
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';			
	
    html = html + '</td>';
    html = html + '</tr>';		
	
	html = html + '</table>';
	
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function SwaggerGetPathVerbParameter($parameter_name,$parameter_in,$parameter_desc,$parameter_required,$parameter_type,$parameter_format,$pathcount,$pathverbcount,$pathverbpropertycount)
	{		
    html = '<tr>';
    html = html + '<td align="center" valign="top" colspan="2" id="apisjsonHeaderCell">';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="70%">';
    
    html = html + '<tr>';
    html = html + '<td align="left" colspan="2" id="swagger-header-swagger-version-view" style="font-size: 12px;">';
    html = html + '<strong>' + $parameter_name + '</strong> (' + $parameter_in + ')' + ' (' + $parameter_type + ') - ' + $parameter_desc;
    html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-property-' + $pathverbpropertycount + '-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="20" align="right"  /></a>';			 
    html = html + '</td>';
    html = html + '</tr>';              

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}		
	
function SwaggerEditPathVerbParameter($pathcount,$pathverbcount,$pathverbpropertycount)
	{
	$parameter_name = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-name-edit').value;	
	$parameter_in = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-in-edit').value;	
	$parameter_desc = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-description-edit').value;
	$parameter_required = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-required-edit').value;	
	$parameter_type = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-type-edit').value;		
	$parameter_format = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-format-edit').value;
	
	$path_verb_summary = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-summary-edit').value;	
	$path_verb_desc = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-description-edit').value;	
	$path_verb_operationid = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-operationid-edit').value;	

	$p = 0;
	$v = 0;
	$pp = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) {  
			$.each(val2['parameters'], function(key3, val3) { 
				if($pathcount == $p && $pathverbcount == $v && $pathverbpropertycount == $pp)
					{
					$MasterSwagger['paths'][key1][key2]['parameters'][key3]['name'] = $parameter_name;
					$MasterSwagger['paths'][key1][key2]['parameters'][key3]['in'] = $parameter_in;
					$MasterSwagger['paths'][key1][key2]['parameters'][key3]['description'] = $parameter_desc;
					$MasterSwagger['paths'][key1][key2]['parameters'][key3]['required'] = $parameter_required;
					$MasterSwagger['paths'][key1][key2]['parameters'][key3]['type'] = $parameter_type;
					$MasterSwagger['paths'][key1][key2]['parameters'][key3]['format'] = $parameter_format;				
					}
				 $pp++;
				});	
			$v++;	
		});	
	 $p++;	
	});

	// Need a Rebuild
	rebuildSwaggerditor();

	}	
	
function SwaggerGetEditPathVerbParameter($parameter_name,$parameter_in,$parameter_desc,$parameter_required,$parameter_type,$parameter_format,$pathcount,$pathverbcount,$pathverbpropertycount)
	{		
		
    html = '<tr id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-property-' + $pathverbpropertycount + '" style="display: none;">';
    html = html + '<td align="center" valign="top" colspan="2">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Edit Parameter</strong></td>';
    html = html + '</tr>';    
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Name:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-name-edit" value="' + $parameter_name + '" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'; 
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;""><strong>In:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;font-size: 12px;"><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-in-edit" style=""><option value="' + $parameter_in + '">' + $parameter_in + '</option><option value="query">query</option><option value="path">path</option></select></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-description-edit" value="' + $parameter_desc + '" style="width: 75%; height: 75px; border: 1px solid #000;" /></td>';
    html = html + '</tr>';   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Required:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-required-edit" style=""><option value="' + $parameter_required + '">' + $parameter_required + '</option><option value="true">true</option><option value="false">false</option></select></td>';
    html = html + '</tr>';  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Type:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-type-edit" style=""><option value="' + $parameter_type + '">' + $parameter_type + '</option><option value="string">string</option><option value="integer">integer</option></select></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Format:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><select id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbpropertycount + '-format-edit" style=""><option value="' + $parameter_format + '">' + $parameter_format + '</option><option value=""></option><option value="id">id</option><option value="label">label</option></select></td>';
    html = html + '</tr>';                          
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerEditPathVerbParameterButton" value="Save" onclick="SwaggerEditPathVerbParameter(' + $pathcount + ',' + $pathverbcount + ',' + $pathverbpropertycount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}	
	
	
// Response	
function SwaggerGetPathVerbResponseTitle($pathcount,$pathverbcount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;" align="center">';	

	html = html + '<table border="0" width="70%" align="center" style="background-color:#CCC;">';
	
    html = html + '<tr>';
    html = html + '<td>';	
	
	html = html + '<span style="font-size:16px;">';
	html = html + '<strong>Responses</strong>';
	html = html + '</span>';
	
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-response-icon" title="Edit Swagger Response"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';			
	
    html = html + '</td>';
    html = html + '</tr>';		
	
	html = html + '</table>';
	
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function SwaggerGetPathVerbResponse($response_code,$response_desc,$response_definition,$pathcount,$pathverbcount,$pathverbresponsecount)
	{		
    html = '<tr>';
    html = html + '<td align="center" valign="top" colspan="2" id="apisjsonHeaderCell">';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="70%">';
    
    html = html + '<tr>';
    html = html + '<td align="left" colspan="2" id="swagger-header-swagger-version-view" style="font-size: 12px;">';
    html = html + '<strong>' + $response_code + '</strong> - ' + $response_desc + ' - ' + $response_definition;
    html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-response-' + $pathverbresponsecount + '-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="20" align="right"  /></a>';			 
    html = html + '</td>';
    html = html + '</tr>';              

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}		
	
function SwaggerAddPathVerbResponse($pathcount,$pathverbcount)
	{
		 
	$response_code = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-code-add').value;	
	$response_description = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-description-add').value;
	$response_definition = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-definition-add').value;

	$RefArray = {};	  
	$RefArray['$ref'] = $response_definition

	$SchemaArray = {};	  
	$SchemaArray['type'] = "array";
	$SchemaArray['items'] = $RefArray

	$CodeArray = {};	  
	$CodeArray['description'] = $response_description;
	$CodeArray['schema'] = $SchemaArray;

	$p = 0;
	$v = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) { 
			if($pathcount == $p && $pathverbcount == $v)
				{	
				$MasterSwagger['paths'][key1][key2]['responses'][$response_code] = 	$CodeArray;	
				}	
			$v++;	
		});	
	 $p++;	
	});		
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}

function SwaggerGetAddPathVerbResponse($pathcount,$pathverbcount)
	{		
		
	html = '<tr id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-response" style="display: none;"><td align="center" colspan="2" style="">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Add Parameter</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Code:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-code-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-description-add"  style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>' 
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Definition:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-definition-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'                    
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerAddSwaggerPathVerbResponseButton" value="Add" onclick="SwaggerAddPathVerbResponse(' + $pathcount + ',' + $pathverbcount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';;
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}		
	
function SwaggerEditPathVerbResponse($pathcount,$pathverbcount,$pathverbresponsecount)
	{

	$response_code = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbresponsecount + '-code-edit').value;	
	$response_desc = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbresponsecount + '-description-edit').value;	
	$response_definition = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbresponsecount + '-definition-edit').value;	

	$p = 0;
	$v = 0;
	$pp = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) {  
			$.each(val2['responses'], function(key3, val3) { 
				if($pathcount == $p && $pathverbcount == $v && $pathverbresponsecount == $pp)
					{
					$ref = '$' + 'ref'; 	
					$MasterSwagger['paths'][key1][key2]['responses'][key3]['code'] = $response_code;
					$MasterSwagger['paths'][key1][key2]['responses'][key3]['description'] = $response_desc;
					$MasterSwagger['paths'][key1][key2]['responses'][key3]['schema']['items'][$ref] = $response_definition;		
					}
				 $pp++;
				});	
			$v++;	
		});	
	 $p++;	
	});

	// Need a Rebuild
	rebuildSwaggerditor();

	}	
	
function SwaggerGetEditPathVerbResponse($response_code,$response_desc,$response_definition,$pathcount,$pathverbcount,$pathverbresponsecount)
	{		
		
    html = '<tr id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-response-' + $pathverbresponsecount + '" style="display: none;">';
    html = html + '<td align="center" valign="top" colspan="2">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Edit Response</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Code:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbresponsecount + '-code-edit" value="' + $response_code + '" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'  
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbresponsecount + '-description-edit" value="' + $response_desc + '" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>' 
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Definition:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbresponsecount + '-definition-edit" value="' + $response_definition + '" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'                             
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerEditPathVerbParameterButton" value="Save" onclick="SwaggerEditPathVerbParameter(' + $pathcount + ',' + $pathverbcount + ',' + $pathverbresponsecount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}	
	

// Tags
function SwaggerGetPathVerbTagTitle($pathcount,$pathverbcount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;" align="center">';	

	html = html + '<table border="0" width="70%" align="center" style="background-color:#CCC;">';
	
    html = html + '<tr>';
    html = html + '<td>';	
	
	html = html + '<span style="font-size:16px;">';
	html = html + '<strong>Tags</strong>';
	html = html + '</span>';
	
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag-icon" title="Edit Swagger Tag"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';			
	
    html = html + '</td>';
    html = html + '</tr>';		
	
	html = html + '</table>';
	
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function SwaggerGetPathVerbTag($tag,$pathcount,$pathverbcount,$pathverbtagcount)
	{		
    html = '<tr>';
    html = html + '<td align="center" valign="top" colspan="2" id="apisjsonHeaderCell">';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="70%">';
    
    html = html + '<tr>';
    html = html + '<td align="left" colspan="2" id="swagger-header-swagger-version-view" style="font-size: 12px;">';
    html = html + '<strong>' + $tag + '</strong>';
    html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag-' + $pathverbtagcount + '-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="20" align="right"  /></a>';			 
    html = html + '</td>';
    html = html + '</tr>';              

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}		
	
function SwaggerAddPathVerbTag($pathcount,$pathverbcount)
	{
		 
	$tag = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag-add').value;	

	//$TagArray = [$tag];
	
	$p = 0;
	$v = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) { 
			if($pathcount == $p && $pathverbcount == $v)
				{	
				$MasterSwagger['paths'][key1][key2]['tags'].push($tag);
				}	
			$v++;	
		});	
	 $p++;	
	});		
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}

function SwaggerGetAddPathVerbTag($pathcount,$pathverbcount)
	{		
		
	html = '<tr id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag" style="display: none;"><td align="center" colspan="2" style="">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Add Tag</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Tag:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'                      
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerAddSwaggerPathVerbTagButton" value="Add" onclick="SwaggerAddPathVerbTag(' + $pathcount + ',' + $pathverbcount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';;
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}		
	
function SwaggerEditPathVerbTag($pathcount,$pathverbcount,$pathverbtagcount)
	{

	$tag = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbtagcount + '-tag-edit').value;	

	$p = 0;
	$v = 0;
	$pp = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) {  
			$.each(val2['tags'], function(key3, val3) { 
				if($pathcount == $p && $pathverbcount == $v && $pathverbtagcount == $pp)
					{
					$ref = '$' + 'ref'; 	
					$MasterSwagger['paths'][key1][key2]['tags'][key3] = $tag;	
					}
				 $pp++;
				});	
			$v++;	
		});	
	 $p++;	
	});

	// Need a Rebuild
	rebuildSwaggerditor();

	}	
	
function SwaggerGetEditPathVerbTag($tag,$pathcount,$pathverbcount,$pathverbtagcount)
	{		
		
    html = '<tr id="edit-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag-' + $pathverbtagcount + '" style="display: none;">';
    html = html + '<td align="center" valign="top" colspan="2">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Edit Tag</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Code:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-' + $pathverbtagcount + '-tag-edit" value="' + $tag + '" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'                              
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerEditPathVerbParameterButton" value="Save" onclick="SwaggerEditPathVerbParameter(' + $pathcount + ',' + $pathverbcount + ',' + $pathverbtagcount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}	
	
	
// Definitions
function SwaggerGetDefinitionsTitle()
	{
	html = '<tr style="background-color:#CCC;">';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>Definitions</strong>';
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-definition-icon" title="Add a Path"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html;  					
	}		
	
function SwaggerGetDefinitions($definition,$definitioncount)
	{				
	
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;" align="center">';
	

	html = html + '<table border="0" width="80%" align="center" style="background-color:#CCC;">';
	
    html = html + '<tr>';
    html = html + '<td>';	
	
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + $definition + '</strong>';
	html = html + '</span>';
	
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-definition-' + $definitioncount + '-property-icon" title="Add a Path"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';

    html = html + '</td>';
    html = html + '</tr>';		
	
	html = html + '</table>';
	
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function SwaggerAddDefinition()
	{
		 
	$tag = document.getElementById('swagger-api-path-' + $pathcount + '-verb-' + $pathverbcount + '-tag-add').value;	

	//$TagArray = [$tag];
	
	$p = 0;
	$v = 0;
	$.each($MasterSwagger['paths'], function(key1, val1) {  
		$.each(val1, function(key2, val2) { 
			if($pathcount == $p && $pathverbcount == $v)
				{	
				$MasterSwagger['paths'][key1][key2]['tags'].push($tag);
				}	
			$v++;	
		});	
	 $p++;	
	});		
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}

function SwaggerGetAddDefinition()
	{		
		
	html = '<tr id="add-definition" style="display: none;"><td align="center" colspan="2" style="">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Add Definition</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Definition:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-definition-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'                      
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerAddSwaggerPathVerbTagButton" value="Add" onclick="SwaggerAddDefinition();" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';;
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}		

function SwaggerAddDefinitionProperty($definitioncount)
	{

	$property_name = document.getElementById('swagger-api-definition-' + $definitioncount + '-name-add').value;
	$property_description = document.getElementById('swagger-api-definition-' + $definitioncount + '-description-add').value
	$property_type = document.getElementById('swagger-api-definition-' + $definitioncount + '-type-add').value
	$property_format = document.getElementById('swagger-api-definition-' + $definitioncount + '-format-add').value	

	$PropertyDetailArray = {};	  
	$PropertyDetailArray['description'] = $property_description;
	$PropertyDetailArray['type'] = $property_type;
	$PropertyDetailArray['format'] = $property_format;

	$dc = 0;
	$dpc = 0;
	$.each($MasterSwagger['definitions'], function(key1, val1) {  
		 
		if($definitioncount == $dc)
			{	

			$showme = $MasterSwagger['definitions'][key1]['properties'];

			$MasterSwagger['definitions'][key1]['properties'][$property_name] = $PropertyDetailArray;
			
			}	
			
		 $dc++;	
		});		
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}

function SwaggerGetAddDefinitionProperty($definitioncount)
	{		
		
	html = '<tr id="add-definition-' + $definitioncount + '-property" style="display: none;"><td align="center" colspan="2" style="">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Add Property</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Name:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-definition-' + $definitioncount + '-name-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>' 
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-definition-' + $definitioncount + '-description-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>' 
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Type:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-definition-' + $definitioncount + '-type-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Format:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-definition-' + $definitioncount + '-format-add" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'                                
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerAddSwaggerPathVerbTagButton" value="Add" onclick="SwaggerAddDefinitionProperty(' + $definitioncount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';;
    
    html = html + '<br /></td></tr>';  
    	
	return html; 			
	}

function SwaggerGetDefinitionPropertyTitle($definitioncount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;" align="center">';	

	html = html + '<table border="0" width="70%" align="center" style="background-color:#CCC;">';
	
    html = html + '<tr>';
    html = html + '<td>';	
	
	html = html + '<span style="font-size:16px;">';
	html = html + '<strong>Parameters</strong>';
	html = html + '</span>';
	
	html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="add-path-' + $pathcount + '-verb-' + $pathverbcount + '-parameter-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-add-circle.png" width="35" align="right"  /></a>';			
	
    html = html + '</td>';
    html = html + '</tr>';		
	
	html = html + '</table>';
	
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function SwaggerGetDefinitionProperty($property_name,$property_description,$property_type,$property_format,$definitioncount,$definitionpropertycount)
	{		
    html = '<tr>';
    html = html + '<td align="center" valign="top" colspan="2" id="apisjsonHeaderCell">';

    html = html + '<table cellpadding="3" cellspacing="2" border="0" width="70%">';
    
    html = html + '<tr>';
    html = html + '<td align="left" colspan="2" id="swagger-header-swagger-version-view" style="font-size: 12px;">';
    html = html + '<strong>' + $property_name + '</strong> (' + $property_type + ') - ' + $property_description;
    html = html + '<a href="#" onclick="SwaggerShowMe(this); return false;" id="edit-definition-' + $definitioncount + '-' + $definitionpropertycount + '-icon" title="Edit Swagger Header"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="20" align="right"  /></a>';			 
    html = html + '</td>';
    html = html + '</tr>';              

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}	
	
function SwaggerEditDefinitionProperty($definitioncount,$definitionpropertycount)
	{

	$property_name = document.getElementById('swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-name-edit').value;
	$property_description = document.getElementById('swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-description-edit').value;	
	$property_type = document.getElementById('swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-type-edit').value;		
	$property_format = document.getElementById('swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-format-edit').value;

	$dc = 0;
	$dpc = 0;
	$.each($MasterSwagger['definitions'], function(key1, val1) {		
		$.each(val1['properties'], function(key2, val2) {   
			//console.log($definitioncount + ' == ' + $dc + ' && ' + $definitionpropertycount + ' == ' + $dpc);
			if($definitioncount == $dc && $definitionpropertycount == $dpc)
				{	
				$MasterSwagger['definitions'][key1]['properties'][$property_name]['description'] = $property_description;
				$MasterSwagger['definitions'][key1]['properties'][$property_name]['type'] = $property_type;
				$MasterSwagger['definitions'][key1]['properties'][$property_name]['format'] = $property_format;				
				}	
			 $dpc++;	
			});			
		 $dc++;	
		 $dpc = 0;
		});	

	// Need a Rebuild
	rebuildSwaggerditor();

	}	
	
function SwaggerGetEditDefinitionProperty($property_name,$property_description,$property_type,$property_format,$definitioncount,$definitionpropertycount)
	{		

    html = '<tr id="edit-definition-' + $definitioncount + '-' + $definitionpropertycount + '" style="display: none;">';
    html = html + '<td align="center" valign="top" colspan="2">';

    html = html + '<table cellpadding="1" cellspacing="1" border="0" width="70%" style="border: 1px solid #000;padding-top5px;">';
    
    html = html + '<tr>';
    html = html + '<td align="center" colspan="2" style="font-size: 12px;"><strong>Edit Property</strong></td>';
    html = html + '</tr>'     
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Name:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF; font-size: 12px;"><input type="text" id="swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-name-edit" value="' + $property_name + '" style="width: 75%; height: 25px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'  
        
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;"><strong>Description:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"font-size: 12px;><input type="text" id="swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-description-edit" value="' + $property_description + '" style="width: 75%; height: 75px; border: 1px solid #000;" /></td>';
    html = html + '</tr>'        
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;""><strong>Type:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;font-size: 12px;"><select id="swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-type-edit" style=""><option value="' + $property_type + '">' + $property_type + '</option><option value="string">string</option><option value="integer">integer</option></select></td>';
    html = html + '</tr>'   
    
    html = html + '<tr>';
    html = html + '<td align="right" width="35%" style="font-size: 12px;""><strong>Format:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;font-size: 12px;"><select id="swagger-api-definition-' + $definitioncount + '-property-' + $definitionpropertycount + '-format-edit" style=""><option value="' + $property_format + '">' + $property_format + '</option><option value=""></option><option value="id">id</option><option value="label">label</option></select></td>';
    html = html + '</tr>'                          
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="SwaggerEditDefinitionPropertyButton" value="Save" onclick="SwaggerEditDefinitionProperty(' + $definitioncount + ',' + $definitionpropertycount + ');" /></td>';
    html = html + '</tr>'                

    html = html + '</table>';

    html = html + '</td>';
    html = html + '</tr>';  

	return html; 			
	}	

function SwaggerSavePath($pathcount)
	{
		
	$path_name = document.getElementById("edit-path-' + $pathcount + '").value;	
		
	var $PathArray = [$path_name];	 

	$MasterSwagger['paths'].push($PathArray);
	
	// Need a Rebuild
	rebuildSwaggerditor();

	}		
	

function loadSwaggerditor()
    {

    $apisjsonURL = '/' + $repo + '/swagger.json';

	var jqxhr = $.getJSON($apisjsonURL, function(Swagger) { 													

		// Set our Master Store
		$MasterSwagger = Swagger;

		$viewer = JSON.stringify(Swagger, null, 4);
		document.getElementById("jsonViewerDetails").value = $viewer;

		buildSwaggerEditor(Swagger);
	     	 		 	
	});	

	// Set another completion function for the request above
	jqxhr.complete(function() {
		
	  	document.getElementById("swaggerEditor").style.display=''; 
	  	                 
        });		  
         	  	
    } 
    
function rebuildSwaggerditor()
    {
    	
	document.getElementById("swaggerEditor").innerHTML = '';
	
	document.getElementById("swaggerEditor").innerHTML = '<table cellpadding="3" cellspacing="2" border="0" width="95%" id="swaggerEditorTable" style="margin-left: 15px;"></table>';
    	
    	
	buildSwaggerEditor($MasterSwagger);	
		
	}
	
function buildSwaggerEditor(Swagger)
	{
 	$SwaggerVersion = Swagger['swagger'];	 	
 	$SwaggerAPITitle = Swagger['info']['title'];

 	$SwaggerAPIDesc = Swagger['info']['description'];
 	$SwaggerAPITOS = Swagger['info']['termsOfService'];
 	$SwaggerAPIVersion = Swagger['info']['version'];
 	
 	$SwaggerAPIHost = Swagger['host'];
 	$SwaggerAPIBasePath = Swagger['basePath'];
 	
	$html = SwaggerGetHeader($SwaggerVersion,$SwaggerAPITitle,$SwaggerAPIDesc,$SwaggerAPITOS,$SwaggerAPIVersion,$SwaggerAPIHost,$SwaggerAPIBasePath);	 	
	$('#swaggerEditorTable').append($html); 
	
	$html = SwaggerGetEditHeader($SwaggerVersion,$SwaggerAPITitle,$SwaggerAPIDesc,$SwaggerAPITOS,$SwaggerAPIVersion,$SwaggerAPIHost,$SwaggerAPIBasePath);	 	
	$('#swaggerEditorTable').append($html);     		 	
 	
 	$SwaggerAPISchemes = Swagger['schemes'];
 	$SwaggerAPIProduces = Swagger['produces'];
 	
 	$SwaggerAPIPaths = Swagger['paths'];
 	$SwaggerAPIDefinitions = Swagger['definitions'];
 		 	
    $pathTitle = "Paths";
	$html = SwaggerGetPathTitle($pathTitle);
	$('#swaggerEditorTable').append($html); 
	    	
	$html = SwaggerGetAddPath();
	$('#swaggerEditorTable').append($html);     	

 	// Paths
 	$.each($SwaggerAPIPaths, function(pathKey, pathValue) { 

 	 	$SwaggerAPIPathName = pathKey;

		$html = SwaggerGetPath($SwaggerAPIPathName,$pathcount);
		$('#swaggerEditorTable').append($html);  
		
		$html = SwaggerGetAddPathVerb($pathcount);
		$('#swaggerEditorTable').append($html);       		    		  	 	
 	 	
	 	// Verbs
     	$.each(pathValue, function(verbKey, verbValue) { 

     	 	$SwaggerAPIPathVerb = verbKey;	
	     	 	
 			$html = SwaggerGetPathVerb($SwaggerAPIPathVerb,$pathcount,$pathverbcount);
    		$('#swaggerEditorTable').append($html); 	     	 	     	 	
	     	 	
			$SwaggerAPIPathVerbSummary = verbValue['summary'];
			$SwaggerAPIPathVerbDesc = verbValue['description'];	     	 	
			$SwaggerAPIPathVerbOperationId = verbValue['operationId'];
			
			$html = SwaggerGetPathVerbDetail($SwaggerAPIPathVerbSummary,$SwaggerAPIPathVerbDesc,$SwaggerAPIPathVerbOperationId,$pathcount,$pathverbcount);
			$('#swaggerEditorTable').append($html); 
							
			$html = SwaggerGetEditPathVerbDetail($SwaggerAPIPathVerbSummary,$SwaggerAPIPathVerbDesc,$SwaggerAPIPathVerbOperationId,$pathcount,$pathverbcount);
			$('#swaggerEditorTable').append($html);					     	 	
				     	 					
			$SwaggerAPIPathVerbParameters = verbValue['parameters'];				
			$SwaggerAPIPathVerbResponses = verbValue['responses'];					
			$SwaggerAPIPathVerbTags = verbValue['tags'];	
 		     
			$html = SwaggerGetPathVerbParameterTitle($pathcount,$pathverbcount);
			$('#swaggerEditorTable').append($html);	 
			
			$html = SwaggerGetAddPathVerbParameter($pathcount,$pathverbcount);
			$('#swaggerEditorTable').append($html);					
     	 	
		 	// Parameters
	     	$.each($SwaggerAPIPathVerbParameters, function(parameterKey, parameterValue) { 	     	 		     	 	
	     		
        		$parameter_name = parameterValue['name'];
        		$parameter_in = parameterValue['in']; 
        		$parameter_desc = parameterValue['description']; 
        		$parameter_required = parameterValue['required'];
        		$parameter_type = parameterValue['type'];
        		$parameter_format = parameterValue['format'];           	 		
     	 		//console.log("format: " + $parameter_format);
     	 		
				$html = SwaggerGetPathVerbParameter($parameter_name,$parameter_in,$parameter_desc,$parameter_required,$parameter_type,$parameter_format,$pathcount,$pathverbcount,$pathverbpropertycount);
				$('#swaggerEditorTable').append($html); 
								
				$html = SwaggerGetEditPathVerbParameter($parameter_name,$parameter_in,$parameter_desc,$parameter_required,$parameter_type,$parameter_format,$pathcount,$pathverbcount,$pathverbpropertycount);
				$('#swaggerEditorTable').append($html);	  	 
	 
	 			$pathverbpropertycount++;
	 
	 			});
	 			
			$html = SwaggerGetPathVerbResponseTitle($pathcount,$pathverbcount)
			$('#swaggerEditorTable').append($html);  
			
			$html = SwaggerGetAddPathVerbResponse($pathcount,$pathverbcount);
			$('#swaggerEditorTable').append($html);					  	 			
	 			
		 	// Responses
	     	$.each($SwaggerAPIPathVerbResponses, function(responseKey, responseValue) { 	     	 		     	 	
	     	 		     	 
	     	 	$response_code = responseKey;	 
	     	 	$response_desc = responseValue['description'];    	
	     	 	$ref = '$' + 'ref'; 
	     	 	$response_definition = responseValue['schema']['items'][$ref];

				$html = SwaggerGetPathVerbResponse($response_code,$response_desc,$response_definition,$pathcount,$pathverbcount,$pathverbresponsecount);
				$('#swaggerEditorTable').append($html); 
								
				$html = SwaggerGetEditPathVerbResponse($response_code,$response_desc,$response_definition,$pathcount,$pathverbcount,$pathverbresponsecount);
				$('#swaggerEditorTable').append($html);	     	 		 	 
	 
	 			$pathverbresponsecount++;
	 
	 			});    
	 			
			$html = SwaggerGetPathVerbTagTitle($pathcount,$pathverbcount)
			$('#swaggerEditorTable').append($html);  
			
			$html = SwaggerGetAddPathVerbTag($pathcount,$pathverbcount);
			$('#swaggerEditorTable').append($html);	    	 			
	 			
		 	// Tags
	     	$.each($SwaggerAPIPathVerbTags, function(tagKey, $tag) { 	     	 		     	 		 
 
				$html = SwaggerGetPathVerbTag($tag,$pathcount,$pathverbcount,$pathverbtagcount);
				$('#swaggerEditorTable').append($html); 
								
				$html = SwaggerGetEditPathVerbTag($tag,$pathcount,$pathverbcount,$pathverbtagcount);
				$('#swaggerEditorTable').append($html);	     	 		 	 
	 
	 			$pathverbtagcount++;			     			    	 				 		    	 			    	 

	 			});       	 				 			
	 		
	 		$pathverbcount++;
	 			
 	 		}); 
 	 		
 	 	$pathcount++;	
 	 		    	 
 	 	});
 	 	
	$html = SwaggerGetDefinitionsTitle()
	$('#swaggerEditorTable').append($html);  
	
	$html = SwaggerGetAddDefinition();
	$('#swaggerEditorTable').append($html);	     	 		
 	 	
 	// Definitions
 	$.each($SwaggerAPIDefinitions, function(definitionKey, definitionValue) {      	 	

		$definitionpropertycount = 0;

		$html =  SwaggerGetDefinitions(definitionKey,$definitioncount);
		$('#swaggerEditorTable').append($html);	
		
		$html =  SwaggerGetAddDefinitionProperty($definitioncount);
		$('#swaggerEditorTable').append($html);				

	 	// Definition Properties
     	$.each(definitionValue['properties'], function(definitionProperyKey, definitionPropertyValue) {      	 	

			if(definitionPropertyValue['description'])
				{
      			$definition_property_desc = definitionPropertyValue['description'];
      			}
      		else
      			{
      			$definition_property_desc = "";	
      			}
      		$definition_property_type = definitionPropertyValue['type'];
      		$definition_property_format = definitionPropertyValue['format'];		

			$html = SwaggerGetDefinitionProperty(definitionProperyKey,$definition_property_desc,$definition_property_type,$definition_property_format,$definitioncount,$definitionpropertycount);
			$('#swaggerEditorTable').append($html);	
			
			$html = SwaggerGetEditDefinitionProperty(definitionProperyKey,$definition_property_desc,$definition_property_type,$definition_property_format,$definitioncount,$definitionpropertycount);
			$('#swaggerEditorTable').append($html);							

			$definitionpropertycount++;
			
			});	 
			
		$definitioncount++;			

		});	
	}
