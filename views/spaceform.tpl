% if section == 'head':

	<title>SpaceForm</title>
	<link href="/blog.css" rel="stylesheet"/>

% elif section == 'content':
  	<div id="title">
		<h2>Spaceform</h2>
		<a id="github-link" href="https://github.com/svolpe43/magnes"><img src="/github.png" alt="Github link" height="40px"/></a></p>
	</div>
    <div id="blog" class="no-indent">
    	<div class="center-text"><h4>Magnetically hovering Earth model.</h4></div>
    	<img src="/spaceform/img/full_front.jpg" alt="night-distribution" width="80%">
    	<p>
    	I always wanted to be able to see a live model of the Solar System. I wanted to create a physical model but not with little sticks holding up the planets like traditional orreries. To get the real feel of a ball floating in emptiness I thought it would be cool to create a model by hovering the planets with magnets while still being able to control their rotation and position. Then you could let the user choose the date and time or have a live mode where it will stay synced to the current position of the planets.
    	</p>

    	<hr>
    	<h2>How It's Made</h2>

    	<h3>First attempt at hovering.</h3>
    	<p>
		I first read that there was no such thing as stable levitation with permanent magnets but I wanted to see for myself. I bought some Neodymium magnets and 3D printed a ball and sadle that the magnets can press into. I soon knew what an unstable system felt like. Now I'm pretty convinced Earnshaw's Law is true, you can't levitate stuff with only stationary permanent magnets.
		</p>

		<img src="/spaceform/img/perm_hover2.jpg" alt="night-distribution" width="50%">

		<h3>Electromagnets are the way to go.</h3>
		<p>
		So then I looked into magnetic levitation with electromagnets and I found a small company called Zeltom in Michigan that made a unique system for educational purposes. All of the code was open to view and learn from. I figured I could learn a lot about what it takes to levitate a permanent magnet so I bought one.
		</p>

		<p>It has an impressive hover height but it's not very stable.</p>
		<img src="/spaceform/img/zeltom.jpg" alt="night-distribution" width="80%">

		<p>
		I played with this system for a while and learned about how the levitation works. Zeltom engineers were extremely helpful and willing to teach. But after looking around I found that I could buy a very stable and compact system from Amazon for $40. That was pretty good since I thought it would take me months to get my own levitation system going. So I bought one of those and moved on to the electronics.
		</p>
		<p>Amazon one had a lower hover height but it was very stable.</p>
		<img src="/spaceform/img/amazon.jpg" alt="night-distribution" width="75%">

		<h3>Figuring our how to rotate a hovering planet with magnets.</h3>
		<p>
		My vision was to be able to control the axis and rotation of the planets while moving them around the Sun. For the Earth, the axis is actually pretty constant at 23.5 degrees but respect to the Sun it is a rotation at 1 rev/year. That means in order to show the Earth's axis I need to rotate the tilted hovering body.
		</p>

		<img src="/spaceform/img/axis.jpg" alt="night-distribution" width="75%">

		I eventually figured out out how to rotate the hovering body after going through a number of different designs. By putting a small permanent magnet on the rotating body and then rotating another small permanent magnet of the opposite polarity at the bottom the hovering body will spin to whatever degree I want. If the magnets are small enough it doesn't effect the hovering forces at all.

		<img src="/spaceform/img/rotation.jpg" alt="night-distribution" width="75%">

		<h3>Building the circuitry.</h3>
		<p>
		After making a small list of components I would need, I began getting a small circuit together and some code to control all of the components. I used a PIC24FJ64GA002 with some C code to control 2 stepper motors, a small OLED screen, a potentiometer and rotary encoder to choose settings, a few LEDs and 2 sensor inputs.
		</p>
		<img src="/spaceform/img/circuit_diagram.png" alt="night-distribution" width="75%">

		<p>
		And then eventually got all of this working on a breadboard.
		</p>
		<img src="/spaceform/img/finished_circuit.jpg" alt="night-distribution" width="50%">
		<p>
		But there was just to much for the breadboard and it was very hard to move it without connections coming loose and I was also excited to get a custom circuit board printed. I used Eagle to create a small PCB design about the size of an Arduino with 2 built in stepper drivers. I had a lot of fun trying to route the board with only 2 layers and making it as compact as possible.
		</p>
		<img src="/spaceform/img/board_diagram.png" alt="night-distribution" width="50%">
		<p>
		Then I got it printed by OSH Park and it turned out completely awesome.

		<img src="/spaceform/img/pic7.jpg" alt="night-distribution" width="75%">
		<img src="/spaceform/img/pic8.jpg" alt="night-distribution" width="75%">

		<h3>Reflow Soldering</h3>

		<p>
		In order to make the board as compact as possible I used a lot of surface mount components and I needed to install them by hand. I purchased a pattern from OSH Patterns so that I reflow the SMD components.
		</p>

		<p>First I taped the PCB down so that it cannot slide.</p>
		<img src="/spaceform/img/smd_placing_1.jpg" alt="night-distribution" width="75%">
		<p>Then I taped the pattern over the board so all of the SMD pads lined up with the holes on the pattern.</p>
		<img src="/spaceform/img/smd_placing_2.jpg" alt="night-distribution" width="75%">
		<p>Then I spread paste on the pattern in one even swipe with a Chipotle gift card.</p>
		<img src="/spaceform/img/smd_placing_3.jpg" alt="night-distribution" width="75%">
		<p>This puts an even layer of solder paste on all of the SMD pads.</p>
		<img src="/spaceform/img/smd_placing_4.jpg" alt="night-distribution" width="75%">
		<p>Then using a book of SMD parts I carefully placed all of the SMD components onto the board. Where they need to be</p>
		<img src="/spaceform/img/smd_placing_5.jpg" alt="night-distribution" width="75%">

		<p>
		I needed about 1.5 &deg;C per second in order to not overheat the board but I really wasn't at much risk of ruining the board because there weren't any chips on it yet. But I practiced a few times with the stove so I can get the dial just right so that the cast iron pan heated at the right speed. 
		</p>
		<img src="/spaceform/img/heating_gun.jpg" alt="night-distribution" width="30%">
		<p>
		I dropped the board in and sure enough at about 250&deg;C all the paste melted and it looked absolutely beautiful. I hand soldering the rest of the through hole components and it was ready for testing.
		</p>
		<img src="/spaceform/img/pic6.jpg" alt="night-distribution" width="75%">
		<img src="/spaceform/img/pic3.jpg" alt="night-distribution" width="75%">
		<img src="/spaceform/img/pic4.jpg" alt="night-distribution" width="75%">
		<p>
		After some testing the board worked perfectly. Both regulators with over 20 SMD components were stable at 5V and 3V and I was able to program the PIC chip with my built in connector.
		</p>
		<h3>Designing the structure.</h3>
		<p>
		I needed a place to mount the stepper motors and a method of rotating the magnets. I first designed some gears and printed them on a 3D printer but I quickly realized that with plastic gears I would never get the quiet smooth rotation I needed. My friend, Matt Ezzi, told me to go with pullies and I never looked back.
		</p>
		<p>
		I was lucky enough to be hooked up with some roller bearings from IKO for a pully. Then I printed some parts that the bearing can press into and rest on.
		<img src="/spaceform/img/pic13.jpg" alt="night-distribution" width="75%">
		<img src="/spaceform/img/pic14.jpg" alt="night-distribution" width="75%">

		<p>
		I bought some belts from McMaster Carr and printed some adjustable stepper mounts and it is as smooth as butter!
		</p>
		<img src="/spaceform/img/pic15.jpg" alt="night-distribution" width="75%">

		<p>
		Then I needed a little control panel. So I designed an printed a small face plate with mounting points for the OLED screen and the knobs.
		</p>
		<img src="/spaceform/img/pic12.jpg" alt="night-distribution" width="75%">

		<p>After a few trips to Home Depot I got a board to place all my parts on. After staining it to make it look nice, mounting all the parts with lots of hot glue and running all the wires it started to look neater.</p>
		<img src="/spaceform/img/full_back.jpg" alt="night-distribution" width="75%">

		<p>So now you can set the time and it will move the Earth to the correct position to represent that time. It also has a live mode where it will stay synced to the current rotation of Earth. Lots of room for improvement but I'm happy with the progress.</p>
		<img src="/spaceform/img/full_front.jpg" alt="night-distribution" width="75%">
		
    </div>
% end
