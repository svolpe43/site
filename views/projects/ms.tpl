% if section == 'head':

	<title>Mine Sweeper</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="/ms/ms.js"></script>
	<link href="/ms/ms.css" rel="stylesheet"/>

% elif section == 'content':
	<div id="title">
		<h2>Mine Sweeper</h2>
		<p>View the code on <a href="https://github.com/svolpe43/minesweeperJS">Github</a>.<br>
		Based on <a href="http://en.wikipedia.org/wiki/Minesweeper_%28video_game%29">the Windows Mine Sweeper.</a></p>
	</div>
	<div id="content">
		<div id="settings">
			<p>Rules of the Game</p>
			<ul>
				<li>Click on a tile to expose it.</li>
				<li>If you expose a bomb it will blow up and you lose.</li>
				<li>Determine if a tile is a bomb and flag it as a bomb.</li>
				<li>Once you flag all of the bombs the game is over.</li>
			</ul><hr>
		</div>
		<div id="canvas-div">
			<span id="bombcount"></span><p>Use the space bar to flag and unflag mines.</p>
			<canvas id="discanvas" width="628" height="628"></canvas>
			<div id="controls">
				<button class="btn" id="start" onclick="reset(1)">Easy</button>
				<button class="btn" id="start" onclick="reset(2)">Medium</button>
				<button class="btn" id="start" onclick="reset(3)">Hard</button>
			</div>
		</div>
	</div>
% end
