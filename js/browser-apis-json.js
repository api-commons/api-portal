// Purposely keeping this verbose, and expanded, until I figure out best patterns for config and extensability

$apicount = 0;  
$propertycount = 0;

$includecount = 0;
	 	
// The Master 
$MasterAPISJSON = "";

$apipropertyoptions = "";

function APIJSONBrowserShowMe($row)
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
	
function APISJSONQuestions()
	{
	if(document.getElementById("questionsViewer").style.display=='')
		{
		document.getElementById("questionsViewer").style.display='none';
		document.getElementById("jsonViewer").style.display='none';
		document.getElementById("jsonBrowser").style.display='';
		}	
	else
		{
		$viewer = JSON.stringify($MasterSwagger, null, 4);
		document.getElementById("jsonViewerDetails").value = $viewer;		

		document.getElementById("questionsViewer").style.display='';
		document.getElementById("jsonViewer").style.display='none';
		document.getElementById("jsonBrowser").style.display='none';			
		}
	}	

// Header

function APIJSONBrowserAPIJSONBrowserSaveAPIs()
	{
	$apisJSONName = document.getElementById("apisjsonName").value;
	$apisJSONDescription = document.getElementById("apisjsonDescription").value;
	$apisJSONImage = document.getElementById("apisjsonImage").value;
	$apisJSONUrl = document.getElementById("apisjsonUrl").value;

 	$MasterAPISJSON['name'] = $apisJSONName;
 	$MasterAPISJSON['description'] = $apisJSONDescription;
 	$MasterAPISJSON['image'] = $apisJSONImage;
 	$MasterAPISJSON['url'] = $apisJSONUrl;

 	$html = APIJSONBrowserGetHeaderCell($apisJSONName,$apisJSONDescription,$apisJSONUrl,$apisJSONImage);
 	document.getElementById("apisjsonHeaderCell").innerHTML = $html;	
	}

// Localize Templating, making as editable as possible	
function APIJSONBrowserGetHeaderCell(name,description,url,image,apijsonurl)
	{		
	html = "";
	
    html = html + '<a href="' + url + '" title="' + name + '"><img src="' + image + '" width="175" align="left" style="padding: 15px;" /></a>';    
    html = html + '<a href="' + url + '" style="color: #000; font-size: 22px; text-decoration: none;" title="' + name + '"><strong>' + name + '</strong></a>';
    html = html + '  (<a href="' + url + '" style="color: #000; font-size: 18px;" title="' + name + '">apis.json</a>)';
    html = html + '<br />' + description;  	
	
	return html; 			
	}

// Localize Templating, making as editable as possible	
function APIJSONBrowserGetHeader(name,description,url,image,apijsonurl)
	{		
    html = '<tr>';
    html = html + '<td align="left" valign="top" colspan="2" id="apisjsonHeaderCell">';
    html = html + '<a href="' + url + '" title="' + name + '"><img src="' + image + '" width="100" align="left" style="padding: 15px;" /></a>';
    
    html = html + '<a href="' + url + '" style="color: #000; font-size: 22px; text-decoration: none;" title="' + name + '"><strong>' + name + '</strong></a>';
    html = html + '  (<a href="' + url + '" style="color: #000; font-size: 18px;" title="' + name + '">apis.json</a>)';
    
    html = html + '<br />' + description;
    html = html + '</td>';
    html = html + '</tr>';   	
	
	return html; 			
	}
	
// Filler		

function APIJSONBrowserGetAPITitle(title,$apicount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + title + '</strong>';
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}				
	
// API Level	
	
function APIJSONBrowserGetAPIListingCell(name,description,image,url,$apicount)
	{	
		
	$thisslug = name.toLowerCase();	
	$thisslug = $thisslug.replace(" ", "-");			

	$html = "";
    $html = $html + '<span style="font-size:20px;">';
    $html = $html + '<a href="' + url + '" style="color: #000; font-size: 18px; text-decoration: none;" title="' + name + '"><strong>' + name + '</strong></a> - ' + description;
	$html = $html + '</span>';
    	
	return $html; 			
	}		
	
function APIJSONBrowserGetAPIListing(name,description,image,url,$apicount)
	{	
		
	$thisslug = name.toLowerCase();	
	$thisslug = $thisslug.replace(" ", "-");			

    html = '<tr style="">';
    html = html + '<td align="left" style="padding-left: 50px; padding-top: 5px; padding-bottom: 5px;" colspan="2" id="api-cell-' + $apicount + '">';
    
    html = html + '<span style="font-size:20px;">';
    html = html + '<a href="' + url + '" style="color: #000; font-size: 18px; text-decoration: none;" title="' + name + '"><strong>' + name + '</strong></a> - ' + description;;
    html = html + '</span>';
    
    html = html + '</td>';
    html = html + '</tr>';
    	
	return html; 			
	}		
	
// Properties	
	
	
function APIJSONBrowserPropertyListingCell1($thistype,$thisurl,$apicount,$propertycount)
	{		
		
	$thistype = $thistype.toLowerCase();
	$thisslug = $thistype.replace(" ", "-");

	$thishtml = "";
    $thishtml = $thishtml + '<a href="' + $thisurl + '" title="' + $thistype + '"><img style="padding: 5px;" src="https://s3.amazonaws.com/kinlane-productions/building-blocks/' + $thistype + '.png" width="50" align="right" " /></a>';
    	
	return $thishtml; 			
	}	
		
function APIJSONBrowserPropertyListingCell2($thistype,$thisurl,$apicount,$propertycount)
	{		
		
	$thistype = $thistype.toLowerCase();
	$thisslug = $thistype.replace(" ", "-");

	$thishtml = "";
    $thishtml = $thishtml + '<a href="' + $thisurl + '" style="color: #000; font-size: 16px; text-decoration: none;" title="' + $thistype + '"><strong>' + $thistype + '</strong></a>';
    	
	return $thishtml; 			
	}	
	
function APIJSONBrowserPropertyListing($apiName,$thistype,$thisurl,$apicount,$propertycount)
	{		
		
	$thistype = $thistype.toLowerCase();
	$thisslug = $thistype.replace(" ", "-");
	
    html = '<tr>';
    html = html + '<td width="10%" align="right" id="api-' + $apicount + '-property-' + $propertycount + '-1" style="border: 0px solid #000;">';
    
    html = html + '<a href="' + $thisurl + '" title="' + $thistype + '" target="_blank"><img style="padding: 5px;" src="https://s3.amazonaws.com/kinlane-productions/building-blocks/' + $thistype + '.png" width="50" align="right" " /></a>';
    
    html = html + '</td>';
    html = html + '<td align="left" id="api-' + $apicount + '-property-' + $propertycount + '-2" width="50%" valign="middle" style="border: 0px solid #000; vertical-align: middle; padding-left: 10px;">';
    
    html = html + '<a href="' + $thisurl + '" style="color: #000; font-size: 18px;" title="' + $thistype + '" target="_blank"><strong>' + $thistype + '</strong></a>';
    
    if($thistype=='swagger')
    	{
    	html = html + '  (<a href="editor-swagger-json.html?url=' + $thisurl + '&oAuth_Token=' + $oAuth_Token + '">edit</a>)';      		
    	html = html + '  (<a href="swagger.html?oAuth_Token=' + $oAuth_Token + '">UI</a>)';
    	}
    
    html = html + '</td>';
    html = html + '</tr>';
    	
	return html; 			
	}	
		
// Include Level	
	
function APIJSONBrowserGetIncludeTitle(title,$includecount)
	{
	html = '<tr>';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;">';
	html = html + '<span style="font-size:20px;">';
	html = html + '<strong>' + title + '</strong>';
	html = html + '</span>';
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}	
	
function APIJSONBrowserGetIncludeSpacer()
	{
	html = '<tr style="">';
	html = html + '<td colspan="2" style="padding-top: 5px; padding-bottom: 5px;"> ';
	html = html + '</td>';
	html = html + '</tr>';
	return html; 			
	}		
	
function APIJSONBrowserGetIncludeListingCell($includeName,$includeUrl,$includecount)
	{	
		
	$thisslug = name.toLowerCase();	
	$thisslug = $thisslug.replace(" ", "-");			

	$html = "";
    $html = $html + '<span style="font-size:20px;">';
    $html = $html + '<a href="' + url + '" style="color: #000; font-size: 18px; text-decoration: none;" title="' + name + '"><strong>' + name + '</strong></a> - ' + description;
    $html = $html + '</span>';
    	
	return $html; 			
	}		
	
function APIJSONBrowserGetIncludeListing($includeName,$includeRootUrl,$includeUrl,$includecount)
	{	
		
	$thisslug = $includeName.toLowerCase();	
	$thisslug = $thisslug.replace(" ", "-");	
	
	if($oAuth_Token!=''){ $includeUrl = $includeUrl + '?oAuth_Token=' + $oAuth_Token; }			

    html = '<tr style="background-color:#FFF;">';
    
    html = html + '<td align="left" style="padding-left: 50px; padding-top: 5px; padding-bottom: 5px;" colspan="2" id="include-cell-' + $includecount + '">';
    
    html = html + '<span style="font-size:16px;">';
    html = html + '<a href="' + $includeUrl + '" style="color: #000; font-size: 18px; text-decoration: none;" title="' + $includeName + '"><strong>' + $includeName + '</strong></a>';
    html = html + ' (<a href="' + $includeUrl + '" style="color: #000; font-size: 18px; text-decoration: none;" title="' + $includeName + '">site</a>)';
    html = html + ' (<a href="' + $includeRootUrl + '" style="color: #000; font-size: 18px; text-decoration: none;" title="' + $includeName + '">apis.json</a>)';       
    html = html + '</span>';
    
    html = html + '</td>';
    
    html = html + '</tr>';
    	
	return html; 			
	}		

function loadAPIsJSONBrowser($apisjsonURL)
    {

	var jqxhr = $.getJSON($apisjsonURL, function(apisJSON) { 													

		// Set our Master Store
		$MasterAPISJSON = apisJSON;

		buildAPIsJSONBrowser(apisJSON);

	});	

	// Set another completion function for the request above
	jqxhr.complete(function() {
		
	  	document.getElementById("jsonBrowser").style.display=''; 
	  	                 
        });		  
         	  	
    } 

function buildAPIsJSONBrowser(apisJSON)

	{
	$apisJSONName = apisJSON['name'];

 	$apisJSONDesc = apisJSON['description'];
 	$apisJSONLogo = apisJSON['image'];
 	$apisJSONURL = apisJSON['url'];
 	
 	// Header	 	
    $html = APIJSONBrowserGetHeader($apisJSONName,$apisJSONDesc,$apisJSONURL,$apisJSONLogo,$apisJSONURL);
    $('#jsonBrowserHeaderTable').append($html);      
            
    apisJSONTags = apisJSON['tags'];            
    apisJSONAPIs = apisJSON['apis'];
    apisJSONIncludes = apisJSON['include'];
    apisJSONMaintainers = apisJSON['maintainers'];	
    
    howmanyapis = apisJSONAPIs.length;
		
    $.each(apisJSONAPIs, function(apiKey, apiVal) { 

     	 $apiName = apiVal['name']; 
     	 $apiDesc = apiVal['description'];
     	 $apiImage = apiVal['image']; 
     	 $apiHumanURL = apiVal['humanURL']; 
     	 $apiBaseURL = apiVal['baseURL'];               	                         	 
		 $apiTags = apiVal['tags'];			 	 
		 
         //$html = APIJSONBrowserGetAPIListing($apiName,$apiDesc,$apiImage,$apiHumanURL,$apicount)
         //$('#jsonBrowserTable').append($html); 	

		 $apiProperties = apiVal['properties'];
		 $.each($apiProperties, function(propertyKey, propertyVal) { 

		 	$propertyType = propertyVal['type'];
		 	$propertyURL = propertyVal['url'];					 				 			 							 		 					 	
		 				 	
			//$Property = APIJSONBrowserPropertyListing($apiName,$propertyType,$propertyURL,$apicount,$propertycount); 			
			//$('#jsonBrowserTable').append($Property);
			console.log($propertyType);
	        if($propertyType == "X-blog")
	        	{
	        	console.log("blog:" + document.getElementById($propertyType + "-row"));
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("communication").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-blog-rss-feed")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("communication").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-code")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("onboarding").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-portal")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("communication").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-documentation")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("integration").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-getting-started")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("onboarding").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-authentication")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("onboarding").style.display = '';		
	        		}	        		
	        	}	        	
	        if($propertyType == "X-faq")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("onboarding").style.display = '';		
	        		}	        		
	        	}	        	
	        if($propertyType == "X-pricing")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("integration").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-privacy-policy")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("legal").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-rate-limits-page")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("integration").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-support")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("support").style.display = '';		
	        		}	        		
	        	}	        	
	        if($propertyType == "X-roadmap")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("updates").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-issues")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("updates").style.display = '';		
	        		}	        		
	        	}	 
	        if($propertyType == "X-change-log")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("updates").style.display = '';		
	        		}	        		
	        	}	        	       	
	        if($propertyType == "X-status-dashboard")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("updates").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-terms-of-service")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("legal").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-twitter")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("communication").style.display = '';		
	        		}	        		
	        	}
	        if($propertyType == "X-github")
	        	{
	        	if(document.getElementById($propertyType + "-row"))	
	        		{
	        		document.getElementById($propertyType + "-row").style.display = '';
	        		document.getElementById($propertyType + "-url").href=$propertyURL;
	        		document.getElementById($propertyType + "-img-url").href=$propertyURL;
	        		document.getElementById("communication").style.display = '';		
	        		}	        		
	        	}	        	
	        	
	        		 				 			 							 		 					 			 	
		 	$propertycount++;
		 	
		 	}); 				 	                                           
        				 					 				 	 				 					 											
		 $apiContact = apiVal['contact'];
		 $apicount++;										
	});
	
    howmanyincludes = apisJSONIncludes.length;

    if(howmanyincludes>0)
    	{	
	
	 	//$html = APIJSONBrowserGetIncludeSpacer();
	 	//$('#jsonBrowserTable').append($html);   	 
			
	 	//$html = APIJSONBrowserGetIncludeTitle('Includes');
	 	//$('#jsonBrowserTable').append($html);
	 	   	 		
		}
		
     $.each(apisJSONIncludes, function(apiKey, apiVal) { 

     	 $includeName = apiVal['name']; 
     	 $includeRootUrl = apiVal['url'];	 
     	 
     	 $includeUrl = $includeRootUrl.replace("apis.json","");	 
		 
         $html = APIJSONBrowserGetIncludeListing($includeName,$includeRootUrl,$includeUrl,$apicount)
         $('#jsonBrowserIncludeTable').append($html); 	          

		 $includecount++;										
	});	
	
		
	}
