<?php
	
	// we are saving the file
	if ($_SERVER["REQUEST_METHOD"] == "POST"){
		if(isset($_POST["json"])){
			$json = $_POST["json"];
			file_put_contents("note.txt", $json);
			print json_encode("saved" + $json);
		}else{
			print json_encode("Post input is corrupt.");
		}

	// we are downloading the file
	}else{
		 print file_get_contents("note.txt");
	}
?>
