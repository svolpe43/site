
/*
	Handles Google Drive API
		- creating the file
		- updating the file
		- authenticating
*/

var CLIENT_ID = '956219262966-69sfdogiac30ro3hp3878akts4i6q52o.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';
var API_KEY = 'AIzaSyB5LWVvCuXTwWmOZQZTY_cKczUFWjZ13zs';

const SAVE_INTERVAL = 5000;

const boundary = '-------314159265358979323846';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";

const file_name = "arc.txt";

// some error responses
const corrupt_error = "Your 'arc.txt' file in Google Drive is corrupt. Delete it or rename it to continue";
const multiple_error = "There are more than one 'arc.txt' files in Google Drive! Arc needs to use that name. Delete or rename them to continue.";
const api_error = "This app has encountered an error retrieving the note from Google Drive."

var authed = false;
var file = null;
var changes = false;
var lastSaveDate = 0;

function checkAuth(callback){
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(function () {
		if(gapi.auth2.getAuthInstance().isSignedIn.get()){
			update_signin_status(true, callback);
		}else{

			$("#start").show();

			// listen for sign-in state changes.
			gapi.auth2.getAuthInstance().isSignedIn.listen(function(is_signed_in){
				update_signin_status(is_signed_in, callback)
			});

			// handle the initial sign-in state.
			update_signin_status(gapi.auth2.getAuthInstance().isSignedIn.get());

			// sign in
			gapi.auth2.getAuthInstance().signIn({prompt: 'consent'});
		}
	});
}

function update_signin_status(isSignedIn, callback) {
	if (isSignedIn) {
		console.log('signed in');
		request_grive_file();

		if(callback)
			callback();
	} else {
		console.log('not signed in');
	}
}

function request_grive_file(){
	//var request = gapi.client.drive.files.list();
	var request = gapi.client.request({
	        'path': '/drive/v2/files',
	        'method': 'GET',
	        'params': {
	        	'maxResults': '1',
	        	'q': 'title="arc.txt" AND trashed=false'
	    	}
	});

	// had to put populate() inside every catch instead of the end
	// if it was at the end it would get there before the file was fully downloaded
  	request.execute(function(response){

		if(response.error || !response.items){
			var error = (response.error.message) ? response.error.message : api_error;
			alert_error(error);
			return;
		}

		// we found one 'arc.txt' file
		if(response.items.length == 1){
			// catch corrupt json
			try{
				// set the file now cause we don't have scope onces its parcable
				file = response.items[0];
				download_file(response.items[0], function(response){
					// catching undefined response error
					if(typeof response === 'undefined'){
						alert_error("Trouble downloading the Google Drive file.");
					}else{
						page = JSON.parse(response);
						populate();
						setInterval(save_grive_file, SAVE_INTERVAL);
					}
				});
			}catch(e){
				alert_error(corrupt_error);
			}
		// more then one 'arc.txt' file found
		}else if(response.items.length > 1){
			alert(multiple_error);
			page = example_page;
			populate();
		}else{
			// create the file and initiate a blank page
			add_grive_file();
			page = example_page;
			populate();
			setInterval(save_grive_file, SAVE_INTERVAL);
		}
	});
}

function alert_error(error){
	alert(error);
	page = example_page;
	populate();
}

function download_file(file, callback) {
  if (file.downloadUrl) {
		var accessToken = gapi.auth.getToken().access_token;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file.downloadUrl);
		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		xhr.onload = function() {
			callback(xhr.responseText);
		};
		xhr.onerror = function() {
			callback(null);
		};
		xhr.send();
  } else {
  		callback(null);
  }
}

function save_grive_file() {

	// request parameters
	if(file == null){
		checkAuth();
		return;
	}

	if(!changes){
		return;
	}
	changes = false;

	var file_parts = [JSON.stringify(page)];
	var blob = new Blob(file_parts, {type : 'text/plain'});
	blob.name = file_name;

	var fileId = file.id;
	var fileMetadata = file;

	var reader = new FileReader();
	reader.readAsBinaryString(blob);

	reader.onload = function(e) {
		var contentType = blob.type || 'application/octet-stream';
		// Updating the metadata is optional and you can instead use the value from drive.files.get.
		var base64Data = btoa(reader.result);

		var multipartRequestBody =
		delimiter +
		'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(fileMetadata) +
		delimiter +
		'Content-Type: ' + contentType + '\r\n' +
		'Content-Transfer-Encoding: base64\r\n' +
		'\r\n' +
		base64Data +
		close_delim;

		var request = gapi.client.request({
			'path': '/upload/drive/v2/files/' + fileId,
			'method': 'PUT',
			'params': {'uploadType': 'multipart', 'alt': 'json'},
			'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
			'body': multipartRequestBody
		});

		request.execute(function(result){
			lastSaveDate = new Date();
			setSaveText();
		});
	}
}

function add_grive_file() {

	var file_parts = [JSON.stringify(page)];
	var blob = new Blob(file_parts, {type : 'text/plain'});
	blob.name = file_name;

	var reader = new FileReader();
	reader.readAsBinaryString(blob);

	reader.onload = function(e) {

		// Set up params for Google Drive Rrequest body
		var contentType = blob.type || 'application/octet-stream';
		var metadata = {
			'title': blob.name,
			'mimeType': contentType
		};
		var base64Data = btoa(reader.result);

		// set up the Google Drive request body
		var multipartRequestBody =
			delimiter +
			'Content-Type: application/json\r\n\r\n' +
			JSON.stringify(metadata) +
			delimiter +
			'Content-Type: ' + contentType + '\r\n' +
			'Content-Transfer-Encoding: base64\r\n' +
			'\r\n' +
			base64Data +
			close_delim;

		// create the Google Drive request body
		var request = gapi.client.request({
			'path': '/upload/drive/v2/files',
			'method': 'POST',
			'params': {'uploadType': 'multipart'},
			'headers': {'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'},
			'body': multipartRequestBody
		});

		// execute the request
		request.execute(function(response){
			console.log(response);
			file = response;
		});
	}
}
