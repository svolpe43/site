% if section == 'head':

	<title>SpaceX DV Map</title>
	<script src="/space_data.js"></script>
	<script src="/deltav.js"></script>
	<link href="/deltav.css" rel="stylesheet"/>

% elif section == 'content':
	<div id="settings">
		<h2>Delta V</h2>
		<p>View the code on <a href="https://github.com/svolpe43/deltav">Github</a>.</p>
		<hr>
		<img class="rocket-pic" src="/falcon-9.png" alt="Falcon 9" height="100" style="margin-top: 50px;" onclick="render('falcon_9');">
		<img class="rocket-pic" src="/falcon-heavy.png" alt="Falcon 9" height="100" style="margin-top: 50px;" onclick="render('falcon_heavy');">
		<img class="rocket-pic" src="/bfr.png" alt="Falcon 9" height="150" onclick="render('bfr');">
		<hr>
		<div id="rocket-config"></div>
	</div>
	<div id="canvas-div">
		<h4>Delta V: <span id="deltav">0</span></h4>
		<canvas id="discanvas" width="650" height="650"></canvas>
	</div>
% end
