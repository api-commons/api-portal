

function deployCodeMaster($codeLibraryURL,$apiName,$includecount)
  	{		
  		
	//console.log("processing..." + $codeLibraryURL);	

	var jqxhr = $.getJSON($codeLibraryURL, function(apiCodeLibrary) {
		
		$html = '<tr>';					
		$html = $html + '<td width="20"></td>';					
		$html = $html + '<td style="padding-top: 0px; padding-bottom: 0px;">';				 													

	     $.each(apiCodeLibrary['libraries'], function(libraryKey, libraryVal) { 
	
			//console.log(libraryVal);
	
	     	 $iconurl = libraryVal['icon-url']; 
	     	 $zipurl = libraryVal['zip-url'];	      	 		 								
	     	 		
		 	 $html = $html + '<a href="' + $zipurl + '"><img src="' + $iconurl + '" width="90" style="display: inline; padding: 5px 8px 5px 5px;" /></a>';																											 	
		 		
			});	
			
		$html = $html + '</td>';																	
		$html = $html + '</tr>';						
		$('#code-page-api-' + $includecount).append($html); 			
		
		});	

	jqxhr.complete(function() {
              
        });		           	  	
    }   		
    
function loadCodeFromAPIsJSON($apisjsonURL,$master,$includecount)
    {

	//console.log("processing..." + $apisjsonURL);

	var jqxhr = $.getJSON($apisjsonURL, function($apisJSON) { 													


		buildCodeFromAPIsJSON($apisJSON,$master,$includecount);

	});	

	jqxhr.complete(function() {
              
        });		  
         	  	
    }     

function buildCodeFromAPIsJSON(apisJSON,$master,$includecount)
	{

	$apisJSONName = apisJSON['name'];
	//console.log("APIs.json Name: " + $apisJSONName); 
 	$apisJSONDesc = apisJSON['description'];
 	$apisJSONLogo = apisJSON['image'];
 	$apisJSONURL = apisJSON['url'];
 	  
    apisJSONTags = apisJSON['tags'];            
    apisJSONAPIs = apisJSON['apis'];
    apisJSONIncludes = apisJSON['include'];
    apisJSONMaintainers = apisJSON['maintainers'];	

     $.each(apisJSONAPIs, function(apiKey, apiVal) { 

     	 $apiName = apiVal['name'];
		  
		 if($apiName!='Master')
		 	{   	 
			$html = '<tr>';
			$html = $html + '<td colspan="2" style="padding-top: 3px; padding-bottom: 9px;">';				
			$html = $html + '<span style="font-size:20px;">';
			$html = $html + '<strong>' + $apiName + '</strong>';
			$html = $html + '</span>';				
			$html = $html + '</td>';
			$html = $html + '</tr>';	
			$html = $html + '<tr>';
			$html = $html + '<td colspan="2" style="padding-top: 0px; padding-bottom: 0px;">';	
			$html = $html + '<table align="center" style="padding-left: 25px;" id="code-page-api-' + $includecount + '" width="95%"></table>';						
			$html = $html + '</td>';
			$html = $html + '</tr>';
											
			$('#code-page').append($html);      	 
			}
			
     	 $apiDesc = apiVal['description'];
     	 $apiImage = apiVal['image']; 
     	 $apiHumanURL = apiVal['humanURL']; 
     	 $apiBaseURL = apiVal['baseURL'];               	                         	 
		 $apiTags = apiVal['tags'];			 	 
		 
		 $apiProperties = apiVal['properties'];
		 $.each($apiProperties, function(propertyKey, propertyVal) { 

	 	 	$propertyType = propertyVal['type'];
	 	 	$propertyURL = propertyVal['url'];					 				 			 							 		 					 	

			//console.log($propertyURL);

		    if($propertyType=='x-api-code-libraries')
		    	{
		    	deployCodeMaster($propertyURL,$apiName,$includecount);
		    	}	 	

			}); 				 	                                           										
		}); 
 
    if($master==0)
    	{
    	 $includecount = 1;	
	     $.each(apisJSONIncludes, function(apiKey, apiVal) { 
	
	     	 $includeName = apiVal['name']; 
	     	 $includeRootUrl = apiVal['url'];	      	 
	 		
			 loadCodeFromAPIsJSON($includeRootUrl,1,$includecount);				 		 
	 
			 $includecount++;										
		  });	
		}
	}
