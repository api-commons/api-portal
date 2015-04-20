// Purposely keeping this verbose, and expanded, until I figure out best patterns for config and extensability

$Swag = "";

$apicount = 0;  
$propertycount = 0;

$includecount = 1;
	 	
$MasterAPISJSON = "";

$apipropertyoptions = "";

$APIsJSONSwaggerUI = Array();
	
function deploySwaggerMaster($swaggerURL,$itemcount)
  	{		

  	  $swaggerContainer = "swagger-ui-container-" + $itemcount;	
  		
	  $html = '<div class="swagger-section">';
	  $html = $html + '<div id="' + $swaggerContainer + '" class="swagger-ui-wrap"></div>';
	  $html = $html + '</div><p><br /></p>';

	  $('#master-swagger-section').append($html);  

	  $APIsJSONSwaggerUI[$itemcount] = new SwaggerUi({
	  	
	    url: $swaggerURL,
	    dom_id: $swaggerContainer,
	    validatorUrl: null,
	    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
	    onComplete: function(swaggerApi, swaggerUi){
	
	      $('pre code').each(function(i, e) {
	        hljs.highlightBlock(e)
	      });
	      
	    },
	    onFailure: function(data) {
	      log("Unable to Load SwaggerUI");
	    },
	    docExpansion: "list",
	    sorter : "alpha"
	  });
	
	  $APIsJSONSwaggerUI[$itemcount].load();	

  }

function loadMasterSwaggerFromAPIsJSON($apisjsonURL)
    {

	var jqxhr = $.getJSON($apisjsonURL, function(apisJSON) { 													

		buildMasterSwaggerFromAPIsJSON(apisJSON);

	});	

	// Set another completion function for the request above
	jqxhr.complete(function() {
		
	  	//document.getElementById("jsonNavigator").style.display=''; 
	  	                 
        });		  
         	  	
    } 
    
function loadSwaggerFromAPIsJSON($apisjsonURL,$itemcount)
    {

	console.log("processing..." + $apisjsonURL + " (" + $itemcount + ")");

	var jqxhr = $.getJSON($apisjsonURL, function(apisJSON) { 													


		buildSwaggerFromAPIsJSON(apisJSON,$itemcount);

	});	

	jqxhr.complete(function() {
              
        });		  
         	  	
    }     

function buildMasterSwaggerFromAPIsJSON(apisJSON)
	{

	$apisJSONName = apisJSON['name'];

 	$apisJSONDesc = apisJSON['description'];
 	$apisJSONLogo = apisJSON['image'];
 	$apisJSONURL = apisJSON['url'];
 	  
    apisJSONTags = apisJSON['tags'];            
    apisJSONAPIs = apisJSON['apis'];
    apisJSONIncludes = apisJSON['include'];
    apisJSONMaintainers = apisJSON['maintainers'];	
    
    howmanyapis = apisJSONAPIs.length;	
    howmanyincludes = apisJSONIncludes.length;
    
     $.each(apisJSONIncludes, function(apiKey, apiVal) { 

     	 $includeName = apiVal['name']; 
     	 $includeRootUrl = apiVal['url'];	      	 

		 if($includecount < 35)
		 	{	 		
		 	loadSwaggerFromAPIsJSON($includeRootUrl,$includecount);
		 	}		 		 
 
		 $includecount++;										
	});	

	}
	
function buildSwaggerFromAPIsJSON(apisJSON,$itemcount)
	{

	$apisJSONName = apisJSON['name'];

 	$apisJSONDesc = apisJSON['description'];
 	$apisJSONLogo = apisJSON['image'];
 	$apisJSONURL = apisJSON['url'];
 	  
    apisJSONTags = apisJSON['tags'];            
    apisJSONAPIs = apisJSON['apis'];
    
     $.each(apisJSONAPIs, function(apiKey, apiVal) { 

     	 $apiName = apiVal['name']; 
     	 $apiDesc = apiVal['description'];
     	 $apiImage = apiVal['image']; 
     	 $apiHumanURL = apiVal['humanURL']; 
     	 $apiBaseURL = apiVal['baseURL'];               	                         	 
		 $apiTags = apiVal['tags'];			 	 
		 
		 $apiProperties = apiVal['properties'];
		 $.each($apiProperties, function(propertyKey, propertyVal) { 

		 	$propertyType = propertyVal['type'];
		 	$propertyURL = propertyVal['url'];					 				 			 							 		 					 	
		 	;
		    if($propertyType=='swagger'||$propertyType=='Swagger')
		    	{
		    	deploySwaggerMaster($propertyURL,$itemcount);
		    	}	 	
	
		 	$propertycount++;
		 	
		 	}); 				 	                                           
        				 					 				 	 				 					 											
		 $apiContact = apiVal['contact'];
		 $apicount++;										
	});
		
	}	
