

var select_start = -1;
var select_end = -1;

var select_key_down = false;
var mouse_down = false;
var binded = false;

// TODO
// - mouse bindings not working
// - do the mass indent and unindent

function bind_mouse(){
	$(document).on("mousedown", mouse_down);
	$(document).on("mouseup", mouse_up);
}

function mouse_down(event){
	select_start = getLineIndex(event);
	mouse_down = true;
}

function mouse_up(event){
	mouse_down = false;
}

function mouse_move(event){
	if(mouse_down){
		select_end = getLineIndex(event);
		update_selection();
	}
}

function getLineIndex(event){
	if(typeof event === 'undefined')
		return;
	return Math.floor((event.pageY - note_div[0].offsetTop - $(document).scrollTop()) / LINE_HEIGHT);
}

function select_key_up(e){
	var key = e.keyCode || e.which;
	if(key == 49){
		select_key_down = false;
		$(document).unbind('mousedown');
		$(document).unbind('mouseup');	}
}

function user_input(e){
	var key = e.keyCode || e.which;

	// make sure to count changes
	changes = true;

	// ctrl hot keys
	if (e.ctrlKey || e.metaKey) {
		switch (key){
			// s - force save the doc
			case 83:
				e.preventDefault();
				save_grive_file();
				break;
			// a - jump to begining of line
			case 65:
				e.preventDefault();
				setCaretPosition(focus[0], 0);
				break;
			// e - jump to the end of the line
			case 69:
				e.preventDefault();
				setCaretPosition(focus[0], focus.val().length);
				break;
			// d - setting line to done
			case 68:
				e.preventDefault();
				setDone(getFocusId());
				break;
			// p - inserts the formatted time at the cursor
			case 80:
				e.preventDefault();
				insertTime();
				break;
			// up arrow
			case 38:
				e.preventDefault();
				nextAtCurDepth("up");
				break;
			// down arrow
			case 40:
				e.preventDefault();
				nextAtCurDepth("down");
				break;
			// delete
			case 8:
				e.preventDefault();
				history_delete_line(getFocusId());
				delete_line();
				break;
			// u - collapses the node
			case 85:
				e.preventDefault();
				toggleCollapse(getFocusId());
				break;
        }

		// ctrl - z
		if(key == 90){
			// ctr - shift - z redo
			if(e.shiftKey){
				//e.preventDefault();
				//redo();
			// ctr - z - undo
			}else{
				//e.preventDefault();
				//undo();
			}
		}
	}else{

	    // non-ctrl hot keys
		switch(key){
			// up arrow
			case 38:
				e.preventDefault();
				next("up");
				return;
			// down arrow
			case 40:
				e.preventDefault();
				next("down");
				return;
			// tab key
			case 9:
				e.preventDefault();
				indent("indent");
				return;
			// grave accent
			case 192:
				e.preventDefault();
				indent("unindent");
				return;
			// enter
			case 13:
				e.preventDefault();
				history_add_line(getFocusId());
				add_line();
				return;
			// r - dragging for multiple selection
			case 9999:
				e.preventDefault();
				bind_mouse();
				return;
		}
    }
}