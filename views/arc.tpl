<!DOCTYPE html>
<html>
	<head>
		<title>Arc</title>
		<meta charset="UTF-8">

		<link rel="shortcut icon" type="image/ico" href="favicon.png" />
		
		<link href="arc/arc.css" rel="stylesheet"/>
		<link href="banner.css" rel="stylesheet"/>
		<link href="footer.css" rel="stylesheet"/>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">

		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

		<script type="text/javascript" src="https://apis.google.com/js/client.js"></script>
		<script src="arc/arc.js"></script>
		<script src="arc/drive.js"></script>
		<script src="arc/caret.js"></script>
		<script src="arc/input.js"></script>
		<script src="arc/utils.js"></script>
		<script src="arc/undo.js"></script>
		<script src="arc/data.js"></script>
	</head>
	<body>
		% include('banner.tpl')
		<div id="wrapper">
			<div id="container">
				<div id="top">
					<h2>Arc</h2>
					<div id="message"></div>
					<div id="start" style="display: none">
						<p>Arc uses Google Drive to save your note. The note will automatically save just like a Google Doc. No need to hit save. When clicking start you will be asked to sign into Google. The app will then create a arc.txt file in Google Drive and where the note is stored.</p>
						<h4 onclick="start()">Start</h4>
					</div>
				</div>
				<div id="hotkeys"></div>
				<div id="wrappers">
					<div id="note"></div>
				</div>
				<div id="footer"></div>
			</div>
		</div>
	</body>
</html>
