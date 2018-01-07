% if section == 'head':

	<title>Game of Life</title>
	<script src="/gol/jquery.cookie.js"></script>
	<script src="/gol/life.js"></script>
	<script src="/gol/patmake.js"></script>
	<link href="/gol/life.css" rel="stylesheet"/>

% elif section == 'content':
	<div id="title">
		<h2>The Game of Life</h2>
		<p>View the code on <a href="https://github.com/svolpe43/GameOfLife">Github</a>.<br>
		Based on <a href="http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conways Game of Life</a>.</p>
	</div>
	<div id="content">
		<div id="settings">
			<p>Rules of the Game</p>
			<ul>
				<li>Any live cell with fewer than two live neighbours dies, as if caused by under-population.</li>
				<li>Any live cell with two or three live neighbours lives on to the next generation.</li>
				<li>Any live cell with more than three live neighbours dies, as if by overcrowding.</li>
				<li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
			</ul><hr>
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
			<button class="btn" onclick="update()">Update</button>
			<hr>	
			<p>Speed</p>
			<input id="delta" type="range"  min="-1000" max="-1" value="-150" onchange="showDelta(this.value)"/>
			<span id="slow">Slow</span><span id="deltaval">100 ms</span><span id="fast">Fast</span><br><br>
			<hr>
			<p>Randomize Density</p>
			<input id="density" type="range"  min="1" max="100" value="20" onchange="showDensity(this.value)"/>
			<span id="densityval">20%</span><br><br>
			<hr>
		</div>
		<div id="canvas-div">
			<p>Draw on the board with your mouse to create your own patterns!</p>
			<canvas id="discanvas" width="628" height="628"></canvas>
			<div id="controls">
				<button class="btn" id="start" onclick="start()">Start</button>
				<button class="btn" id="stop" onclick="stop()">Stop</button>
				<button class="btn" id="start" onclick="start()">Resume</button>
			</div>
			<div id="board-set">
				<button class="btn" onclick="setRandom()">Randomize</button>
				<button class="btn" onclick="reset()">Clear</button>
				<button class="btn" onclick="save()">Save</button>
				<button class="btn" onclick="getDefaultPatterns()">Get Default Patterns</button>
			</div>
		</div>
		<div id="patterns-div">
			<h4>Your Patterns</h4>
			<ul id="patterns">
			</ul>
		</div>
	</div>
% end
