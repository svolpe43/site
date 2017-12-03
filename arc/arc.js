
/* arc */
const INDENT_MAX = 15;
const LINE_HEIGHT = 20;

var note_div;
var message_div;
var page;
var focus;
var history;

// wait for window so the auth doesn't fail
$(window).load(function(){
	checkAuth();
	init();
})

function Liner(text, depth){
	this.stuff = text;
	this.depth = depth;
	this.done = false;
	this.collapsed = false;
}

function init(){
	//jquery objects
	note_div = $("#note");
	$(document).on("keydown", user_input);
	$(document).on("keyup", select_key_up);
	$(document).on("mousemove", mouse_move);
	message_div = $("#message");

	add_hotkey_html();

	setInterval(setSaveText, 1000 * 5);	// every 5 seconds
}

function indent(direction){

	// if selected_start and selected_end != -1
	// indent all of the lines in the range

	var index = getFocusId();
	var remove_class = "indent-" + page[index].depth;
	var change = false;

	if(direction == "indent" && page[index].depth < INDENT_MAX){
		page[index].depth++;
		change = true;
	}else if(direction == "unindent" && page[index].depth > 0){
		page[index].depth--;
		change = true;
	}

	if(change){
		var add_class = "indent-" + page[index].depth;
		$("#" + index).switchClass(remove_class, add_class, 100, "easeInOutQuint");
	}
}

function setSaveText(){
	if(lastSaveDate == 0)
		return;

	var current = new Date();
	var diff = current - lastSaveDate;

	var hours = diff / (1000 * 60 * 60);
	var left = diff % (1000 * 60 * 60);

	var minutes = left / (1000 * 60);
	left = left % (1000 * 60);

	var seconds = left / 1000;

	var hourstext = (hours > 1) ? Math.floor(hours) + " hours " : "";
	var minutestext = (minutes > 1) ? Math.floor(minutes) + " minutes " : "";
	var secondstext = Math.floor(seconds) + " seconds ";
	var text = "Last saved " + hourstext + minutestext + secondstext + "ago.";
	message(text);
}

function populate(){
	if(!page)
		return;

	note_div.empty();

	for(var i = 0; i < page.length; i++){
		var line = "<input type='text' class='indent-" + page[i].depth;
		if(page[i].done)
			line += " done";
		line += "' id='" + i + "' value='" + page[i].stuff + "'>";
		note_div.append(line);
	}
	note_div.children().each(function(index){
		var line = $(this);
		line.focus(function(){ focus = line;});
		line.bind('input propertychange', update);
		line.attr('maxlength', 150);
	});
}

function update(){
	page[getFocusId()].stuff = $(this).val();
}

function add_line(){
	var index = getFocusId();

	// create new line and adjust current line
	var start = getCaretPosition(focus[0]);
	var end = page[index].stuff.length;
	var new_text = page[index].stuff.substring(start, end);
	var line = new Liner(new_text, page[index].depth);

	// remove left text on current line
	page[index].stuff = page[index].stuff.substring(0, start);

	index++;
	page.splice(index, 0, line);

	populate();

	//reset focus
	focus = $("#" + index);
	focus.focus();
}

function delete_line(){
	var index = getFocusId();

	var start = getCaretPosition(focus[0]);
	var end = page[index].stuff.length;
	var new_text = page[index].stuff.substring(start, end);

	// remove line and set index to above line
	page.splice(index, 1);
	index--;

	//update above line with new text
	var new_car_pos = page[index].stuff.length;
	page[index].stuff += new_text;

	populate();
	
	// reset focus
	focus = $("#" + index);
	setCaretPosition(focus[0], new_car_pos);
}

function getFocusId(){
	if(typeof focus === "undefined")
		return -1;

	return focus.attr("id");
}

function setDone(index){
	var value = (page[index].done) ? false : true;
	page[index].done = value;
	var depth = page[index].depth;
	index++;
	while(depth < page[index].depth || index == page.length){
		console.log(index);
		page[index].done = value;
		index++;
	}
	populate();
}

function insertTime(){
	var caret_pos = getCaretPosition(focus[0]);
	var date = formatDate(new Date());
	focus.val(focus.val().insert(caret_pos, date));
}

// collapses the node - index - the index of the node in page object
function toggleCollapse(index){
	if(index == -1)
		return;

	var depth = page[index].depth;
	page[index].collapsed = !page[index].collapsed;
	var truth = page[index].collapsed;
	index++;
	while(depth < page[index].depth){
		var element = $("#" + index);
		if(!truth){
			element.hide();
		}else{
			element.show();
		}
		index++;
	}
}

function update_selection(){
	var index = 0;
	note_div.children().each(function(){
		if(index > select_start && index < select_end){
			$(this).addClass("selected");
		}else{
			$(this).removeClass("selected");
		}
		index++;
	});
}

function nextAtCurDepth(direction){
	console.log("next cur");
	var index = getFocusId();
	var depth = page[index].depth;

	if(direction == "up")
		index--;
	else
		index++;

	while(depth < page[index].depth){
		console.log(index, depth);
		if(direction == "up")
			index--;
		else
			index++;
	}
	focus = $("#" + index);
	focus.focus();
}

function next(direction){
	console.log("next");
	var index = getFocusId();
	if(direction == "left")
		index--;
	else
		index++;
	focus = $("#" + index);
	focus.focus();
}

function message(message){
	message_div.empty();
	message_div.append("<p>" + message + "</p>");
}

// adjusts the max length if input to prevent scrolling and dynamic width
function adjust_maxlength(width, text){
	var max_width = note_div.width() - focus.css('left').replace(/[^-\d\.]/g, '') - 300;

	// Needs mad testing
	// - TODO reset all of the onclick and stuff like that
	// - Make sure the max_width is always very close, somehow
	//console.log("Current width: " + width + " Maxwidth: " + max_width);
	if(width >= max_width){
		//console.log("replacing maxlength from: " + focus.attr('maxLength') + "With: " + text.length);
		focus.attr('maxlength', width.length);
		var prev = focus.prev();
		focus.remove();
		prev.after(focus);
	}
}

function getInputWidth() {
	// get the text and sanitize it
	var text = focus.val().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

	// create a span and add the text
	var tmp = document.createElement("span");
	tmp.innerHTML = text;

	// get width by adding the span to body
	document.body.appendChild(tmp);
	var width = tmp.getBoundingClientRect().width;
	document.body.removeChild(tmp);

	adjust_maxlength(width, text);
}

function add_hotkey_html(){
	var html = "<h4>Hotkeys</h4><ul>";
	for(var index in hotkeys){
		html += "<li>";
		html += "<span class='key'>" + hotkeys[index].key;
		html += "</span><span class='action'>" + hotkeys[index].action + "</span>";
		html += "</li>";
	}

	html += "</ul>";
	document.getElementById("hotkeys").innerHTML = html;
}


