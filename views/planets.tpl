<!DOCTYPE html>
<html>
<head>
	<title>Delta V</title>
	<link rel="shortcut icon" type="image/ico" href="../favicon.png" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="space_data.js"></script>
	<script src="planets.js"></script>
	<link href="planets.css" rel="stylesheet"/>
	<link href="banner.css" rel="stylesheet"/>
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
		<div id="canvas-div">
			<h3>Planets API</h3>
			<h5 onclick="start();">Start</h5>
			<h5 onclick="resume();">Resume</h5>
			<h5 onclick="stop();">Stop</h5>
			<h5 onclick="reset();">Reset</h5>
			<div id="canvas-div">
			<canvas id="discanvas" width="700" height="700"></canvas>
		</div>
		<div id="info">
			<h3>Planets API</h3>
			<p>This is a quick demo of what's possible with the planets API. The planets API is a small python server that when
				given a state of bodies in space it returns the new state of the bodies after computing
				the sum of all the forces acting on each object in the 2D field.</p>

			<p>The input must have the 3 values for each body.<p>
				<ul>
					<li><p><strong>Mass</strong> The mass of the object in kg.</p></li>
					<li><p><strong>Velocity (x, y)</strong> - The velocity of the body in m/s.</p></li>
					<li><p><strong>Position (x, y)</strong> - The position of the body in a 2d plane in astronomical units (AU).</p></li>
				</ul>
			<hr>
			<h4>Example Input</h4>
			<pre>
{
	'sun': {
		'px': 0,
		'py': 0,
		'vx': 0,
		'vy': 0
	},
	'earth': {
		'px': -1 * AU,
		'py': 0,
		'vx': 0,
		'vy': 29.783 * 1000
	},
	'venus': {
		'px': 0.723 * AU,
		'py': 0,
		'vx': 0,
		'vy': -35.02 * 1000
	}
}
			</pre>
			<hr>
			<h4>How it Works</h4>
			<p>The server is a pure brute force approach with a complexity of O(n<sup>2</sup>). The server loops through all of the objects performing the following steps.</p>
			<ol>
				<li><p>Calculate the force of gravity of each object on the current object.</p><pre>F = G * M1 * M2 / D^2</pre></li>
				<li><p>Split the force vector into the x and y direction using the computed angle.</p><pre>
Theta = atan(dy/dx)
Fx = F * cos(Theta)
Fy = F * sin(Theta)
				</pre></li>
				<li><p>Compute the new velocity of the object.</p><pre>
Vx = Fx / M * Seconds
Vy = Fy / M * Seconds
				</pre></li>
				<li><p>Compute the new position of the object.</p><pre>
Px = Vx * Seconds
Py = Vy * Seconds
				</pre></li>
				<li>Then returns the new state.</p>
			</ol>
		</div>
	</div>
</body>
</html>
