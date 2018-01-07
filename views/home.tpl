
% if section == 'head':
	<link href="home.css" rel="stylesheet"/>
% elif section == 'content':

	<div id="image">
		<img src="main.jpg" alt="Landing Page" height="30%" width="100%">
		<h3>Shawn Volpe</h3>
		<h4>Software / Electronics / Space</h4>
	</div>

	<div id="tile-container">
		<a href="/limbo">
			<div class="tile">
				<img class="tile-image" src="travel.jpg" alt="Landing Page">
				<h2>Travel</h2>
				<p>How I lived 60 days on the road with my team.</p>
			</div>
		</a>
		<a href="/picman">
			<div class="tile">
				<img class="tile-image" src="picman.jpg" alt="Landing Page">
				<h2>Pic-man</h2>
				<p>A PIC microcontroller developement board complete with libraries for various electronics.</p>
			</div>
		</a>
		<a href="/cfsh">
			<div class="tile">
				<img class="tile-image" src="cfsh.png" alt="Landing Page">
				<h2>Cfsh</h2>
				<p>A Bash like shell that allows you to traverse and manipulate any structure of AWS resources.</p>
			</div>
		</a>
		<a href="/projects">
			<div class="tile">
				<img class="tile-image" src="projects.png" alt="Landing Page">
				<h2>Projects</h2>
				<p>And many more...</p>
			</div>
		</a>
	</div>
% end
