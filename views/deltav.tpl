<!DOCTYPE html>
<html>
<head>
	<title>Delta V</title>
	<link rel="shortcut icon" type="image/ico" href="../favicon.png" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="space_data.js"></script>
	<script src="deltav.js"></script>
	<link href="banner.css" rel="stylesheet"/>
	<link href="deltav.css" rel="stylesheet"/>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">
</head>

<body>
	<div id="banner-container">
      <div id="banner">
        <a href="http://shawnvolpe.com"><h4>Shawn Volpe</h4></a>
        <nav>
          <a href="/limbo">Limbo</a>
          <a href="/spaceform">Spaceform</a>
          <a href="/planets">Planets</a>
          <a href="/cfsh">Cfsh</a>
          <a href="/deltav">DeltaV</a>
          <a href="/astar">A*</a>
          <a href="/arc">Arc</a>
          <a href="/gol">Game of Life</a>
          <a href="/ms">Mine Sweeper</a>
        </nav>
      </div>
    </div>
	<div id="wrapper">
		<div id="settings">
			<h2>Delta V</h2>
			<p>View the code on <a href="https://github.com/svolpe43/deltav">Github</a>.</p>
			<hr>
			<img class="rocket-pic" src="falcon-9.png" alt="Falcon 9" height="100" style="margin-top: 50px;" onclick="render('falcon_9');">
			<img class="rocket-pic" src="falcon-heavy.png" alt="Falcon 9" height="100" style="margin-top: 50px;" onclick="render('falcon_heavy');">
			<img class="rocket-pic" src="bfr.png" alt="Falcon 9" height="150" onclick="render('bfr');">
			<hr>
			<div id="rocket-config"></div>
		</div>
		<div id="canvas-div">
			<h4>Delta V: <span id="deltav">0</span></h4>
			<canvas id="discanvas" width="650" height="650"></canvas>
		</div>
	</div>
</body>
</html>


