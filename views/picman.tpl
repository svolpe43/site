
% if section == 'head':
  <link href="picman.css" rel="stylesheet"/>
% elif section == 'content':

    <div id="top">
        <h1>Pic-man</h1>
        <p>Pic-man is a development board powered by a 16 bit PIC microprocessor.</p>
        <div id="big-image">
            <img src="/projects/spaceform/img/picman.jpg" width="100%">
        </div>
        <div id="features">
            <h2>Features</h2>
            <ul class="list-group">
                <li class="list-group-item">16 MIPS, 32 Mhz, 8K RAM</li>
                <li class="list-group-item">14 IO pins</li>
                <li class="list-group-item">6 Analog IO pins</li>
                <li class="list-group-item">8 IO pins that can be used at 3V or 5V logic</li>
                <li class="list-group-item">OLED/LED Screen Output with Library</li>
                <li class="list-group-item">Control up to 4 DC motors or 2 stepper motors</li>
                <li class="list-group-item">PicKit 3 connector</li>
                <li class="list-group-item">Has libraries for various electronic devices</li>
            </ul>
        </div>
    </div>

    <hr>

    <div id="steps">

        <div class="section-title">
            <h2>How It's Built</h2>
        </div>

        <div class="tile">
            <h4>1. Schematics</h4>
            <img class="tile-image" src="/projects/spaceform/img/circuit_diagram.png" alt="Step 2">
        </div>
        <div class="tile">
            <h4>2. Routing</h4>
            <img class="tile-image" src="/projects/spaceform/img/board_diagram.png" alt="Step 3">
        </div>
        <div class="tile">
            <h4>3. Printing</h4>
            <img class="tile-image" src="/projects/spaceform/img//pic7.jpg" alt="Step 3">
        </div>
        <div class="tile">
            <h4>4. Soldering</h4>
            <img class="tile-image" src="/projects/spaceform/img//pic6.jpg" alt="Step 4">
        </div>
    </div>

    <hr>

    <div id="libraries">

        <div class="section-title">
            <h2>Libraries</h2><a id="github-link" href="https://github.com/svolpe43/magnes"><img src="github.png" alt="Github link" height="40" width="40"></a>
            <p>All the libraries can be found on Github. I use MPLabX and the PicKit3 programmer.</p>
        </div>

        <div class="lib">
            <h3>OLED/LED Screen</h3>
            <p>This library can be used to power a 2 row OLED screen. The board comes with a 5x2 connector that can hook up to common screens bought from Adafruit or Sparkfun.</p>
            <div class="lib-functions">
                <p><strong>Functions</strong></p>
                <ul class="list-group">
                    <li class="list-group-item"><p>init_oled( )</p></li>
                    <li class="list-group-item"><p>set_cursor( int col, int row )</p></li>
                    <li class="list-group-item"><p>print( char* text )</p></li>
                    <li class="list-group-item"><p>clear( )</p></li>
                    <li class="list-group-item"><p>home( )</p></li>
                </ul>
            </div>
        </div>

        <div class="lib">
            <h3>Stepper Motors</h3>
            <p>This library can be used to control stepper motors in full stepping mode or half stepping.</p>
            <div class="lib-functions">
                <p><strong>Functions</strong></p>
                <ul class="list-group">
                    <li class="list-group-item"><p>init_stepper( )</p></li>
                    <li class="list-group-item"><p>move_deg( float degrees, float degree )</p></li>
                    <li class="list-group-item"><p>set_rpm( float rpm )</p></li>
                    <li class="list-group-item"><p>stop( )</p></li>
                </ul>
            </div>
        </div>

        <div class="lib">
            <h3>Rotary Encoder</h3>
            <p>This library can be used to handle input from a stadard rotary encoder with a button. It has 3 digital inputs, 2 for the rotary encoder and 1 for the button.</p>
            <div class="lib-functions">
                <p><strong>Functions</strong></p>
                <ul class="list-group">
                    <li class="list-group-item"><p>init_rot( )</p></li>
                    <li class="list-group-item"><p>unsigned char get_rot_value( );</p></li>
                    <li class="list-group-item"><p>unsigned char get_rot_but_value( )</p></li>
                </ul>
            </div>
        </div>

        <div class="lib">
            <h3>Analog Input</h3>
            <p>This library can be used to handle analog inputs. It is commonly used for Potentiometer inputs.</p>
            <div class="lib-functions">
                <p><strong>Functions</strong></p>
                <ul class="list-group">
                    <li class="list-group-item"><p>init_ad( )</p></li>
                    <li class="list-group-item"><p>int get_ad_value( )</p></li>
                    <li class="list-group-item"><p>unsigned char get_rot_but_value( )</p></li>
                </ul>
            </div>
        </div>

        <div class="lib">
            <h3>Pulse Width Modulation</h3>
            <p>This library uses the output capture feature of the PIC and can be used to output a PWM signal on a IO pin.</p>
            <div class="lib-functions">
                <p><strong>Functions</strong></p>
                <ul class="list-group">
                    <li class="list-group-item"><p>update_pwm( int duty_index )</p></li>
                </ul>
            </div>
        </div>

        <hr>
        <div class="picman-footer">
            <div class="section-title">
                <h3>All libraries working in unison.</h3>
                <img src="/projects/spaceform/img/full_back.jpg" alt="Picman in unison" height="400px">
            </div>
        </div>
    </div>
% end
