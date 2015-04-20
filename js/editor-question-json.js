// Purposely keeping this verbose, and expanded, until I figure out best patterns for question and extensability

$question_count = 0;

// The Master 
$MasterQuestion = "";

function QuestionShowMe($row)
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
	
function QuestionViewEdit()
	{
	if(document.getElementById("jsonQuestionViewer").style.display=='')
		{
		document.getElementById("jsonQuestionViewer").style.display='none';
		document.getElementById("jsonQuestionEditor").style.display='';
		document.getElementById("questionViewer").style.display='none';
		}	
	else
		{
		document.getElementById("jsonQuestionViewer").style.display='';
		document.getElementById("jsonQuestionEditor").style.display='none';	
		document.getElementById("questionViewer").style.display='none';	
		}
	}
	
function QuestionQuestion()
	{
	if(document.getElementById("questionViewer").style.display=='')
		{
		document.getElementById("questionViewer").style.display='none';
		document.getElementById("jsonQuestionViewer").style.display='none';
		document.getElementById("jsonQuestionEditor").style.display='';
		}	
	else
		{
		document.getElementById("questionViewer").style.display='';
		document.getElementById("jsonQuestionViewer").style.display='none';
		document.getElementById("jsonQuestionEditor").style.display='none';			
		}
	}
	
function QuestionSave()
	{

	$QuestionJSON = JSON.stringify($MasterQuestion, null, 4);		

	// Save The File
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
			
			if($path=='api-questions.json')
				{							
			    repo.writemanual('gh-pages', 'api-questions.json', $QuestionJSON, 'Saving api-questions.json', $sha, function(err) { 
			    	
			    	//document.getElementById("alertarea").innerHTML = 'api-questions.json file has been saved';
			    	console.log("saved api-questions.json!");
			    	
			    	});									
				}
			});
		}); 	

	}	
	
	
function addThisQuestion($question)
	{

	$question_question = document.getElementById('add-question-question').value;
	$question_answer = document.getElementById('add-question-answer').value;

	console.log($question_question + ' - ' + $question_answer);

	$questionArray = {};	  	  
	$questionArray['question'] = $question_question;
	$questionArray['answer'] = $question_answer;
	$questionArray['host'] = '';
	$questionArray['baseUrl'] = '';
	$questionArray['path'] = '';
	$questionArray['method'] = '';

 	$MasterQuestion.push($questionArray);

	$viewer = JSON.stringify($MasterQuestion, null, 4);	
	document.getElementById('jsonQuestionViewerDetails').innerHTML = $viewer; 	
 	
	rebuildQuestionEditor($MasterQuestion);
	
	}		
	
function getAddQuestion()
	{	

	html = '<tr id="add-question" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Add Question</strong>';
    html = html + '<table border="0" width="90%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Question:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-question-question" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';      
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>Answer:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="add-question-answer" value="" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" name="add-question" id="add-question" value="Add This Property" onclick="addThisQuestion(this);" /></td>';
    html = html + '</tr>'     
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}		
	
function getQuestion($question_question,$question_answer,$question_host,$question_baseurl,$question_path,$question_method,$question_count)
	{	

	html = '<tr id="edit-header"><td align="center" colspan="2" style="font-size: 14px;">';

    html = html + '<table border="0" width="100%">';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="" width="70%"><strong>' + $question_question + '</strong>  (' + $question_host + $question_baseurl + $question_path +  ' ' + $question_method + '):</td>';
    html = html + '<td align="left" style="" width="20%">  ';
    
    html = html + $question_answer;
     
    html = html + '</td>'; 
    html = html + '<td align="center" width="10%">';
      
    html = html + '<a href="#" onclick="deleteQuestion(this);" id="delete-question-' + $question_count + '-icon" title="Delete Property"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-delete-circle.png" width="30" align="right"  /></a>';                          
    html = html + '<a href="#" onclick="QuestionShowMe(this); return false;" id="edit-question-' + $question_count + '-icon" title="Edit Property"><img src="https://s3.amazonaws.com/kinlane-productions/bw-icons/bw-edit-circle.png" width="30" align="right"  /></a>';
      
    html = html + '</td>';
    html = html + '</tr>';

    html = html + '</table>';
    
    html = html + '</td></tr>'; 	
	
	return html; 			
	}	
	
function deleteQuestion($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$question_count = $idArray[2];
	
	$FullArray = $MasterQuestion;
	$FullArrayCount =  Object.keys($FullArray).length;
	
	$checkArray = Array.isArray($MasterQuestion[$question_count]);

	$MasterQuestion = [];
	$thisCount = 0;
 	$.each($FullArray, function(paramKey, paramValue) {
 		
 		$thisKey = paramKey;
 		$thisValue = paramValue;
 		
 		if($thisCount != $question_count)
 			{

			$questionObject = [];	  
			$questionObject[$thisKey] = $thisValue;

		 	$.extend($MasterQuestion, $questionObject);
	
			}
		
		$thisCount++;
		
		if($thisCount == $FullArrayCount)
			{
				
			$viewer = JSON.stringify($MasterQuestion, null, 4);
	
			document.getElementById('jsonQuestionViewerDetails').innerHTML = $viewer; 	
 	
 			rebuildQuestionEditor($MasterQuestion);
 			
 			//document.getElementById("alertarea").innerHTML = 'question has been deleted';	
 			 			
			}
		
 		});
 	
	}	
	
function saveQuestion($button)
	{
		
	$id = $button.id;
	var $idArray = $id.split('-');	
	
	$question_count = $idArray[1];
	
	$question_question = document.getElementById('question-' + $question_count + '-question').value;
	$question_answer = document.getElementById('question-' + $question_count + '-answer').value;
	$question_host = document.getElementById('question-' + $question_count + '-host').value;
	$question_baseUrl = document.getElementById('question-' + $question_count + '-baseUrl').value;
	$question_path = document.getElementById('question-' + $question_count + '-path').value;
	$question_method = document.getElementById('question-' + $question_count + '-method').value;

 	$MasterQuestion[$question_count]['question'] = $question_question;
 	$MasterQuestion[$question_count]['answer'] = $question_answer;
 	$MasterQuestion[$question_count]['host'] = $question_host;
 	$MasterQuestion[$question_count]['baseUrl'] = $question_baseUrl;
 	$MasterQuestion[$question_count]['path'] = $question_path;
 	$MasterQuestion[$question_count]['method'] = $question_method;
 		
 	rebuildQuestionEditor($MasterQuestion);
 	
 	//document.getElementById("alertarea").innerHTML = 'question has been saved';	
 	
	}	
	
function getEditQuestion($question_question,$question_answer,$question_host,$question_baseurl,$question_path,$question_method,$question_count)
	{		

	html = '<tr id="edit-question-' + $question_count + '" style="display: none;"><td align="center" colspan="2" style="font-size: 12px; background-color:#CCC;">';

	html = html + '<strong>Edit Question</strong>';
    html = html + '<table border="0" width="90%">';  
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>question:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="question-' + $question_count + '-question" value="' + $question_question + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>answer:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="question-' + $question_count + '-answer" value="' + $question_answer + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'; 
    
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>host:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="question-' + $question_count + '-host" value="' + $question_host + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'; 
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>baseUrl:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="question-' + $question_count + '-baseUrl" value="' + $question_baseurl + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>'; 
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>path:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="question-' + $question_count + '-path" value="' + $question_path + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';   
    
    html = html + '<tr>';
    html = html + '<td align="right" style="background-color:#FFF;"><strong>method:</strong></td>';
    html = html + '<td align="left" style="background-color:#FFF;"><input type="text" id="question-' + $question_count + '-method" value="' + $question_method + '" style="width: 100%; height: 100%; border: 0px solid #FFF;" /></td>';
    html = html + '</tr>';                
    
    html = html + '<tr>';
    html = html + '<td align="center" style="background-color:#FFF;" colspan="2"><input type="button" id="question-' + $question_count + '-value-button" name="QuestionSave-' + $question_count + '-button" value="Save Changes" onclick="saveQuestion(this);" /></td>';
    html = html + '</tr>'    
    
    html = html + '</table>';
    
    html = html + '<br /></td></tr>'; 
    	
	return html; 			
	}	
	
function loadQuestionEditor()
    {

    $.getJSON("api-questions.json", function( data ) {
		    	

		buildQuestionEditor(data);		
									
		});		  
         	  	
    } 	
    
function rebuildQuestionEditor($QuestionArray)
    {
    	
	$apicount = 0;  
	$propertycount = 0;    	

	document.getElementById("jsonQuestionEditor").innerHTML = '';
	
	document.getElementById("jsonQuestionEditor").innerHTML = '<table cellpadding="3" cellspacing="2" border="0" width="95%" id="jsonQuestionEditorTable" style="margin-left: 15px;"></table>';

	// Pull From our Master Store
 	buildQuestionEditor($QuestionArray);
		
	}
	
function buildQuestionEditor($APIQuestion)
	{

	$viewer = JSON.stringify($APIQuestion, null, 4);	
	document.getElementById('jsonQuestionViewerDetails').innerHTML = $viewer;

	$MasterQuestion = JSON.parse($viewer);

	$HTML = getAddQuestion();
	$('#jsonQuestionEditorTable').append($HTML);    	

	$.each($APIQuestion, function($key, $value) { 																										

		$question_question = $value['question'];
		$question_answer = $value['answer'];
		
		$question_host = $value['host'];
		$question_baseurl = $value['baseUrl'];
		$question_path = $value['path'];
		$question_method = $value['method'];			

		$HTML = getQuestion($question_question,$question_answer,$question_host,$question_baseurl,$question_path,$question_method,$question_count);
		$('#jsonQuestionEditorTable').append($HTML);    	

		$HTML = getEditQuestion($question_question,$question_answer,$question_host,$question_baseurl,$question_path,$question_method,$question_count);
		$('#jsonQuestionEditorTable').append($HTML); 

		$question_count++;	
			
		});																		    		
	
	}
