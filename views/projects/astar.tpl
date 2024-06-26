% if section == 'head':

	<title>A* Algorithm</title>
	<script src="/projects/astar/framework.js"></script>
	<script src="/projects/astar/astar.js"></script>
	<link href="/projects/astar/astar.css" rel="stylesheet"/>

% elif section == 'content':
	<div id="title">
		<h2>The Astar Algorithm</h2>
		<p>View the code on <a href="https://github.com/svolpe43/AstarJS">Github</a>.<br>
		Based on the famous search algorithm <a href="http://en.wikipedia.org/wiki/A*_search_algorithm">Astar</a>.</p>
	</div>
	<div id="settings">
		<hr>
		<h3>Settings</h3>
		<p>Number of Cells</p>
		<select class="styled-select" id="dim">
			<option value="20">900</option>
			<option value="30">400</option>
			<option value="15">1600</option>
			<option value="10">3600</option>
			<option value="5">14400</option>
			<option value="2">90000</option>
		</select>
		<button class="btn" onclick="updateNow()">Update</button>
		<hr>
		<button class="btn" onclick="setUserPickingStart()">Set Start Position</button>
		<button class="btn" onclick="setUserPickingStop()">Set Stop Position</button>
		<hr>
		<p>Speed</p>
		<input id="delta" type="range"  min="-500" max="-0" value="0" onchange="showDeltaNow(this.value)"/>
		<span id="slow">Slow</span><span id="deltaval">40 ms</span><span id="fast">Fast</span><br><br>
		<hr>
		<p>Randomize Density</p>
		<input id="density" type="range"  min="1" max="100" value="20" onchange="showDensityNow(this.value)"/>
		<span id="densityval">20%</span><br><br>
		<hr>
		<p>Allow Diagonals</p>
		<input id="diagonal-switch" type="checkbox" name="diagonals">
	</div>
	<div id="canvas-div">
		<p>Draw on the board with your mouse to create your own patterns!</p>
		<canvas id="discanvas" width="628" height="628"></canvas>
		<div id="controls">
			<button class="btn" id="start" onclick="startnow()">Start</button>
			<button class="btn" id="stop" onclick="stop()">Stop</button>
			<button class="btn" id="start" onclick="startnow()">Resume</button>
		</div>
		<div id="board-set">
			<button class="btn" onclick="setRandom()">Randomize</button>
			<button class="btn" onclick="reset()">Clear</button>
		</div>
	</div>
% end
